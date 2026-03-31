const { z } = require('zod');
const { validate } = require('../../middleware/validate');
const service = require('./refunds.service');

// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

// Zod schema for the partner process-refund body
const processRefundSchema = z.discriminatedUnion('action', [
  z.object({
    action:         z.literal('approve'),
    approvedAmount: z.number({ required_error: 'approvedAmount bắt buộc khi duyệt' }).positive(),
  }),
  z.object({
    action:          z.literal('reject'),
    rejectionReason: z.string().min(1, 'rejectionReason bắt buộc khi từ chối'),
  }),
]);

// Export the middleware so the router can attach it declaratively
const validateProcessRefund = validate(processRefundSchema);

async function listMyRefunds(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await service.listMyRefunds({
      userId: req.user.id,
      page:   page  ? parseInt(page,  10) : 1,
      limit:  limit ? parseInt(limit, 10) : 20,
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

async function getRefundDetail(req, res, next) {
  try {
    const data = await service.getRefundDetail({
      refundId:  req.params.id,
      userId:    req.user.id,
      role:      req.user.role,
      partnerId: req.user.partnerId || null,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPartnerRefunds(req, res, next) {
  try {
    const { page, limit, status } = req.query;
    const result = await service.listPartnerRefunds({
      partnerId: req.user.partnerId,
      status:    status || null,
      page:      page  ? parseInt(page,  10) : 1,
      limit:     limit ? parseInt(limit, 10) : 20,
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

async function processRefund(req, res, next) {
  try {
    const data = await service.processRefund({
      refundId:        req.params.id,
      partnerId:       req.user.partnerId,
      action:          req.body.action,
      approvedAmount:  req.body.approvedAmount,
      rejectionReason: req.body.rejectionReason,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMyRefunds, getRefundDetail, listPartnerRefunds, processRefund, validateProcessRefund };
