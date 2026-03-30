const { query, pool } = require('../config/db');

async function findByServiceId(serviceId) {
  const { rows } = await query(
    'SELECT * FROM tours WHERE service_id = $1 LIMIT 1',
    [serviceId]
  );
  return rows[0] || null;
}

async function createTour({ serviceId, durationHours, maxCapacity, meetingPoint, cancellationPolicy, highlights }) {
  const { rows } = await query(
    `INSERT INTO tours (id, service_id, duration_hours, max_capacity, meeting_point, cancellation_policy, highlights)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [serviceId, durationHours, maxCapacity, meetingPoint || null, cancellationPolicy || null, highlights || null]
  );
  return rows[0];
}

async function replaceItinerary(tourId, itinerary) {
  // Replace-not-append so the partner can submit a corrected itinerary without orphaned steps.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM tour_itineraries WHERE tour_id = $1', [tourId]);

    const placeholders = itinerary.map((_, i) => {
      const b = i * 6;
      return `(gen_random_uuid(), $${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6})`;
    });
    const params = itinerary.flatMap(step => [
      tourId,
      step.stepOrder,
      step.location,
      step.activity,
      step.durationMinutes,
      step.description || null,
    ]);

    const { rows } = await client.query(
      `INSERT INTO tour_itineraries (id, tour_id, step_order, location, activity, duration_minutes, description)
       VALUES ${placeholders.join(', ')}
       RETURNING *`,
      params
    );

    await client.query('COMMIT');
    return rows.sort((a, b) => a.step_order - b.step_order);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getItinerary(tourId) {
  const { rows } = await query(
    'SELECT * FROM tour_itineraries WHERE tour_id = $1 ORDER BY step_order ASC',
    [tourId]
  );
  return rows;
}

async function addSchedules(tourId, schedules) {
  if (schedules.length === 0) return [];

  const placeholders = schedules.map((_, i) => {
    const b = i * 7;
    return `(gen_random_uuid(), $${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, 0, $${b + 6}, $${b + 7}, true)`;
  });
  const params = schedules.flatMap(s => [
    tourId,
    s.tourDate,
    s.startTime,
    s.endTime,
    s.availableSlots,
    s.price,
    s.guideId || null,
  ]);

  const { rows } = await query(
    `INSERT INTO tour_schedules (id, tour_id, tour_date, start_time, end_time, available_slots, booked_slots, price, guide_id, is_active)
     VALUES ${placeholders.join(', ')}
     RETURNING *`,
    params
  );
  return rows;
}

async function getSchedules(tourId, { fromDate = null, activeOnly = false } = {}) {
  const { rows } = await query(
    `SELECT * FROM tour_schedules
     WHERE tour_id = $1
       AND ($2::date IS NULL OR tour_date >= $2::date)
       AND (NOT $3 OR is_active = true)
     ORDER BY tour_date ASC, start_time ASC`,
    [tourId, fromDate, activeOnly]
  );
  return rows;
}

async function findScheduleById(scheduleId) {
  const { rows } = await query(
    'SELECT * FROM tour_schedules WHERE id = $1 LIMIT 1',
    [scheduleId]
  );
  return rows[0] || null;
}

/**
 * Decrement available_slots atomically.
 * Must be called inside a pg transaction when part of a booking flow.
 * Throws if there are not enough slots — callers must catch and ROLLBACK.
 */
async function decrementSlots(scheduleId, count, client) {
  // Accept an optional transaction client so this can be composed into larger transactions.
  const runner = client
    ? (t, p) => client.query(t, p)
    : query;

  const { rows } = await runner(
    `UPDATE tour_schedules
     SET available_slots = available_slots - $1,
         booked_slots    = booked_slots + $1
     WHERE id = $2 AND available_slots >= $1
     RETURNING available_slots`,
    [count, scheduleId]
  );

  if (rows.length === 0) throw new Error('Not enough available slots');
  return rows[0];
}

/** Reverse of decrementSlots — used for cancellation / refund flows. */
async function incrementSlots(scheduleId, count, client) {
  const runner = client
    ? (t, p) => client.query(t, p)
    : query;

  const { rows } = await runner(
    `UPDATE tour_schedules
     SET available_slots = available_slots + $1,
         booked_slots    = GREATEST(booked_slots - $1, 0)
     WHERE id = $2
     RETURNING *`,
    [count, scheduleId]
  );
  return rows[0] || null;
}

module.exports = {
  findByServiceId,
  createTour,
  replaceItinerary,
  getItinerary,
  addSchedules,
  getSchedules,
  findScheduleById,
  decrementSlots,
  incrementSlots,
};
