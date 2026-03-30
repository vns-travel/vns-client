const bookingService = require('../services/bookingService');
const { success }    = require('../utils/response');

async function createBooking(req, res, next) {
  try {
    const data = await bookingService.createBooking(req.user.id, req.body);
    success(res, data, null, 201);
  } catch (err) { next(err); }
}

async function getBooking(req, res, next) {
  try {
    const data = await bookingService.getBooking(req.params.id, req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function cancelBooking(req, res, next) {
  try {
    const data = await bookingService.cancelBooking(req.params.id, req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function getPartnerBookings(req, res, next) {
  try {
    // TODO: replace with partner-scoped query (bookings for partner's services)
    const data = await bookingService.getUserBookings(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function transitionStatus(req, res, next) {
  try {
    const data = await bookingService.transitionStatus(req.params.id, req.body.status, req.user.role);
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { createBooking, getBooking, cancelBooking, getPartnerBookings, transitionStatus };
