const { Router }       = require('express');
const { z }            = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validateQuery } = require('../../middleware/validate');
const controller       = require('./refunds.controller');

const router = Router();

const listQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'processed']).optional(),
  page:   z.coerce.number().int().min(1).max(1000).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
});

// IMPORTANT: literal segments (/my, /partner) must be declared before /:id
// so Express does not capture them as the :id parameter.

// GET /api/refunds/my — list the authenticated customer's own refund requests
router.get(
  '/my',
  authenticate,
  requireRoles('customer'),
  validateQuery(listQuerySchema),
  controller.listMyRefunds
);

// GET /api/refunds/partner — list refund requests for the partner's services
// Optional query params: status (pending|approved|rejected|processed), page, limit
router.get(
  '/partner',
  authenticate,
  requireRoles('partner'),
  validateQuery(listQuerySchema),
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
