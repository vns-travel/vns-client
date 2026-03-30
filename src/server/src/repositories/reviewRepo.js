const { query } = require('../config/db');

async function create(data) {
  const { bookingId, userId, serviceId, rating, comment, imageUrls } = data;
  const { rows } = await query(
    `INSERT INTO reviews (booking_id, user_id, service_id, rating, comment, image_urls)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [bookingId, userId, serviceId, rating, comment || null, imageUrls || []]
  );
  return rows[0];
}

async function findByServiceId(serviceId) {
  const { rows } = await query(
    'SELECT * FROM reviews WHERE service_id = $1 ORDER BY created_at DESC',
    [serviceId]
  );
  return rows;
}

async function findByBookingId(bookingId) {
  const { rows } = await query('SELECT * FROM reviews WHERE booking_id = $1', [bookingId]);
  return rows[0] || null;
}

/** Returns true if this user has a completed booking for this bookingId with no existing review */
async function canReview(userId, bookingId) {
  const { rows } = await query(
    `SELECT b.id FROM bookings b
     LEFT JOIN reviews r ON r.booking_id = b.id
     WHERE b.id = $1 AND b.user_id = $2 AND b.status = 'completed' AND r.id IS NULL`,
    [bookingId, userId]
  );
  return rows.length > 0;
}

module.exports = { create, findByServiceId, findByBookingId, canReview };
