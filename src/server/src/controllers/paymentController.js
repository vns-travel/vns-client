const paymentService = require('../services/paymentService');
const { success }    = require('../utils/response');

async function handleCallback(req, res, next) {
  try {
    await paymentService.handleCallback(req.params.gateway, req.body);
    // Return minimal 200 — gateway only checks HTTP status
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function initiatePayment(req, res, next) {
  try {
    const data = await paymentService.initiatePayment(req.body.bookingId, req.body.method);
    success(res, data);
  } catch (err) { next(err); }
}

async function initiateRefund(req, res, next) {
  try {
    const data = await paymentService.initiateRefund(req.params.bookingId, req.body.approvedAmount);
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { handleCallback, initiatePayment, initiateRefund };
