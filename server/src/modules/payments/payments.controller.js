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

async function initiate(req, res, next) {
  try {
    const data = await service.initiatePayment({
      bookingId: req.body.bookingId,
      userId: req.user.id,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function payosWebhook(req, res, next) {
  try {
    const data = await service.handlePayosWebhook(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function partnerEarnings(req, res, next) {
  try {
    const data = await service.getPartnerEarnings({
      partnerId: req.user.partnerId,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function platformRevenue(req, res, next) {
  try {
    const data = await service.getPlatformRevenue();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getByBooking, initiate, payosWebhook, partnerEarnings, platformRevenue };
