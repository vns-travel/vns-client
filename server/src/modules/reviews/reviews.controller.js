// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./reviews.service');

async function create(req, res, next) {
  try {
    const data = await service.createReview({
      userId: req.user.id,
      bookingId: req.body.bookingId,
      rating: req.body.rating,
      comment: req.body.comment,
      imageUrls: req.body.imageUrls,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getByService(req, res, next) {
  try {
    const data = await service.getReviewsByService(req.params.serviceId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getByBooking(req, res, next) {
  try {
    const data = await service.getReviewByBooking({
      bookingId: req.params.bookingId,
      userId: req.user.id,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getByService, getByBooking };
