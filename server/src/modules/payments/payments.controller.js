// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./payments.service');

async function getByBooking(req, res, next) {
  try {
    const data = await service.getPaymentsByBooking({
      bookingId: req.params.bookingId,
      userId: req.user.id,
      partnerId: req.user.partnerId || null,
      role: req.user.role,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getByBooking };
