const { pool } = require('../../config/db');

/**
 * Add a departure schedule to an existing tour.
 * Verifies the calling partner owns the tour's parent service.
 */
async function addSchedule({ partnerId, tourId, tourDate, startTime, endTime, availableSlots, price, guideId, isActive }) {
  // Ownership check: tour → service → partner
  const { rows } = await pool.query(
    `SELECT s.partner_id FROM tours t JOIN services s ON s.id = t.service_id WHERE t.id = $1`,
    [tourId]
  );
  if (!rows.length) {
    const err = new Error('Tour không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const res = await pool.query(
    `INSERT INTO tour_schedules (tour_id, tour_date, start_time, end_time, available_slots, price, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [tourId, tourDate, startTime || null, endTime || null, availableSlots, price, isActive ?? true]
  );
  return { scheduleId: res.rows[0].id };
}

/**
 * Add an itinerary step to an existing tour.
 * Verifies the calling partner owns the tour's parent service.
 */
async function addItinerary({ partnerId, tourId, stepOrder, location, activity, durationMinutes, description }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id FROM tours t JOIN services s ON s.id = t.service_id WHERE t.id = $1`,
    [tourId]
  );
  if (!rows.length) {
    const err = new Error('Tour không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const res = await pool.query(
    `INSERT INTO tour_itineraries (tour_id, step_order, location, activity, duration_minutes, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [tourId, stepOrder, location || null, activity || null, durationMinutes || null, description || null]
  );
  return { itineraryId: res.rows[0].id };
}

module.exports = { addSchedule, addItinerary };
