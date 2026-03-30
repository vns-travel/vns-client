const { query } = require('../config/db');

async function findByServiceId(serviceId) {
  const { rows } = await query('SELECT * FROM tours WHERE service_id = $1', [serviceId]);
  return rows[0] || null;
}

async function createTour(data) {
  const { serviceId, durationHours, maxCapacity, meetingPoint, cancellationPolicy, highlights } = data;
  const { rows } = await query(
    `INSERT INTO tours (service_id, duration_hours, max_capacity, meeting_point, cancellation_policy, highlights)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [serviceId, durationHours, maxCapacity, meetingPoint, cancellationPolicy, highlights]
  );
  return rows[0];
}

async function addSchedule(data) {
  const { tourId, tourDate, startTime, endTime, availableSlots, price, guideId } = data;
  const { rows } = await query(
    `INSERT INTO tour_schedules (tour_id, tour_date, start_time, end_time, available_slots, price, guide_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [tourId, tourDate, startTime, endTime, availableSlots, price, guideId || null]
  );
  return rows[0];
}

async function addItinerary(data) {
  const { tourId, stepOrder, location, activity, durationMinutes, description } = data;
  const { rows } = await query(
    `INSERT INTO tour_itineraries (tour_id, step_order, location, activity, duration_minutes, description)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [tourId, stepOrder, location, activity, durationMinutes, description]
  );
  return rows[0];
}

async function findScheduleById(scheduleId) {
  const { rows } = await query('SELECT * FROM tour_schedules WHERE id = $1', [scheduleId]);
  return rows[0] || null;
}

/** Must be called inside a pg transaction client */
async function decrementSlots(scheduleId, count, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { rows } = await db.query(
    `UPDATE tour_schedules
     SET booked_slots = booked_slots + $1, available_slots = available_slots - $1
     WHERE id = $2 AND available_slots >= $1
     RETURNING *`,
    [count, scheduleId]
  );
  return rows[0] || null; // null means not enough slots
}

async function incrementSlots(scheduleId, count, client) {
  const db = client || { query: (t, p) => query(t, p) };
  await db.query(
    `UPDATE tour_schedules
     SET booked_slots = booked_slots - $1, available_slots = available_slots + $1
     WHERE id = $2`,
    [count, scheduleId]
  );
}

module.exports = { findByServiceId, createTour, addSchedule, addItinerary, findScheduleById, decrementSlots, incrementSlots };
