const reviewService = require('../services/reviewService');
const { success }   = require('../utils/response');

async function createReview(req, res, next) {
  try {
    const data = await reviewService.createReview(req.user.id, req.body.bookingId, req.body);
    success(res, data, null, 201);
  } catch (err) { next(err); }
}

async function getServiceReviews(req, res, next) {
  try {
    const data = await reviewService.getServiceReviews(req.params.serviceId);
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { createReview, getServiceReviews };
