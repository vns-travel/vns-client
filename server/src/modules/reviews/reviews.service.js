// All business logic for the reviews domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

/**
 * Create a review for a completed booking.
 *
 * Guards:
 *  - booking must exist and belong to the authenticated user
 *  - booking status must be 'completed' (reviews are unlocked only then)
 *  - one review per booking (UNIQUE constraint + pre-check for a clear error)
 *  - service_id is derived from the booking row, not the request body, to
 *    prevent a malicious caller from attaching a review to the wrong service
 */
async function createReview({ userId, bookingId, rating, comment, imageUrls }) {
  // Fetch booking and verify ownership + status in one query
  const { rows: bookingRows } = await pool.query(
    `SELECT id, user_id, service_id, status FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingRows.length === 0) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const booking = bookingRows[0];

  if (booking.user_id !== userId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  // Only completed bookings may be reviewed
  if (booking.status !== 'completed') {
    const err = new Error('Booking must be completed before leaving a review');
    err.statusCode = 403;
    err.code = 'REVIEW_NOT_UNLOCKED';
    throw err;
  }

  if (!booking.service_id) {
    const err = new Error('Combo bookings cannot be reviewed through this endpoint');
    err.statusCode = 400;
    throw err;
  }

  // Prevent duplicate review (clearer error than a DB unique violation)
  const { rows: existing } = await pool.query(
    `SELECT id FROM reviews WHERE booking_id = $1`,
    [bookingId]
  );
  if (existing.length > 0) {
    const err = new Error('You have already reviewed this booking');
    err.statusCode = 409;
    err.code = 'ALREADY_REVIEWED';
    throw err;
  }

  const { rows } = await pool.query(
    `INSERT INTO reviews (booking_id, user_id, service_id, rating, comment, image_urls)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, booking_id, service_id, rating, comment, image_urls, created_at`,
    [bookingId, userId, booking.service_id, rating, comment || null, imageUrls || null]
  );

  return rows[0];
}

/**
 * Fetch all reviews for a given service, ordered newest first.
 * Also returns the reviewer's display name for the frontend.
 */
async function getReviewsByService(serviceId) {
  const { rows } = await pool.query(
    `SELECT r.id, r.booking_id, r.rating, r.comment, r.image_urls, r.created_at,
            u.full_name AS reviewer_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.service_id = $1
     ORDER BY r.created_at DESC`,
    [serviceId]
  );
  return rows;
}

/**
 * Fetch the review for a specific booking.
 * Only the booking owner may call this.
 */
async function getReviewByBooking({ bookingId, userId }) {
  // Verify the booking belongs to this user before returning the review
  const { rows: bookingRows } = await pool.query(
    `SELECT user_id FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingRows.length === 0) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  if (bookingRows[0].user_id !== userId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const { rows } = await pool.query(
    `SELECT id, booking_id, service_id, rating, comment, image_urls, created_at
     FROM reviews WHERE booking_id = $1`,
    [bookingId]
  );

  // null is a valid response — means the booking has no review yet
  return rows[0] || null;
}

module.exports = { createReview, getReviewsByService, getReviewByBooking };
