const bookingRepo          = require('../repositories/bookingRepo');
const { canTransitionTo }  = require('../utils/bookingGuard');

async function createBooking(userId, payload) {
  // TODO: full booking flow per docs/booking-flows.md:
  //   1. validate voucher (optional)
  //   2. acquire Redis lock
  //   3. check availability inside lock
  //   4. pg transaction: insert booking + detail + payment + decrement availability
  //   5. release lock
  //   6. initiate payment gateway order
  return null;
}

async function getBooking(bookingId, userId) {
  const booking = await bookingRepo.findById(bookingId);
  if (!booking) throw Object.assign(new Error('Booking not found'), { code: 'NOT_FOUND', statusCode: 404 });
  // Only the booking owner or staff can view
  if (booking.user_id !== userId) {
    throw Object.assign(new Error('Forbidden'), { code: 'FORBIDDEN', statusCode: 403 });
  }
  return booking;
}

async function getUserBookings(userId) {
  return bookingRepo.findByUserId(userId);
}

async function cancelBooking(bookingId, userId) {
  const booking = await bookingRepo.findById(bookingId);
  if (!booking) throw Object.assign(new Error('Booking not found'), { code: 'NOT_FOUND', statusCode: 404 });
  if (booking.user_id !== userId) throw Object.assign(new Error('Forbidden'), { code: 'FORBIDDEN', statusCode: 403 });

  canTransitionTo(booking.status, 'cancelled');
  return bookingRepo.updateStatus(bookingId, 'cancelled');
}

async function transitionStatus(bookingId, newStatus, actorRole) {
  const booking = await bookingRepo.findById(bookingId);
  if (!booking) throw Object.assign(new Error('Booking not found'), { code: 'NOT_FOUND', statusCode: 404 });

  canTransitionTo(booking.status, newStatus);
  return bookingRepo.updateStatus(bookingId, newStatus);
}

module.exports = { createBooking, getBooking, getUserBookings, cancelBooking, transitionStatus };
