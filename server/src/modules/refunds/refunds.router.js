const { Router }       = require('express');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const controller       = require('./refunds.controller');

const router = Router();

// IMPORTANT: literal segments (/my, /partner) must be declared before /:id
// so Express does not capture them as the :id parameter.

// GET /api/refunds/my — list the authenticated customer's own refund requests
router.get(
  '/my',
  authenticate,
  requireRoles('customer'),
  controller.listMyRefunds
);

// GET /api/refunds/partner — list refund requests for the partner's services
// Optional query params: status (pending|approved|rejected|processed), page, limit
router.get(
  '/partner',
  authenticate,
  requireRoles('partner'),
  controller.listPartnerRefunds
);

// PATCH /api/refunds/:id/process — partner approves or rejects a pending refund
router.patch(
  '/:id/process',
  authenticate,
  requireRoles('partner'),
  controller.validateProcessRefund,
  controller.processRefund
);

// GET /api/refunds/:id — get one refund's full detail.
// Access control (customer owns booking, partner owns service, or manager)
// is enforced inside the service layer so partners and managers can also
// use this endpoint without a separate route.
router.get(
  '/:id',
  authenticate,
  controller.getRefundDetail
);

module.exports = router;
