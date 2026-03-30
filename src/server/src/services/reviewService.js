const reviewRepo  = require('../repositories/reviewRepo');
const bookingRepo = require('../repositories/bookingRepo');
const serviceRepo = require('../repositories/serviceRepo');
const { query }   = require('../config/db');

async function createReview(userId, bookingId, payload) {
  const allowed = await reviewRepo.canReview(userId, bookingId);
  if (!allowed) {
    throw Object.assign(
      new Error('You can only review completed bookings with no existing review'),
      { code: 'REVIEW_NOT_ALLOWED', statusCode: 403 }
    );
  }

  const booking = await bookingRepo.findById(bookingId);
  const review  = await reviewRepo.create({
    bookingId,
    userId,
    serviceId:  booking.service_id,
    rating:     payload.rating,
    comment:    payload.comment,
    imageUrls:  payload.imageUrls,
  });

  // Recalculate avg_rating + review_count on the service
  const { rows } = await query(
    'SELECT AVG(rating)::NUMERIC(3,2) AS avg, COUNT(*) AS cnt FROM reviews WHERE service_id = $1',
    [booking.service_id]
  );
  await serviceRepo.updateRatings(booking.service_id, rows[0].avg, parseInt(rows[0].cnt, 10));

  return review;
}

async function getServiceReviews(serviceId) {
  return reviewRepo.findByServiceId(serviceId);
}

module.exports = { createReview, getServiceReviews };
