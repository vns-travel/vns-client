const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate, validateQuery, validateParams } = require('../../middleware/validate');
const controller = require('./partners.controller');

const router = Router();

const listQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

const partnerIdParamSchema = z.object({
  partnerId: z.string().uuid('ID partner không hợp lệ'),
});

const rejectSchema = z.object({
  reason: z.string().min(1).max(1000).trim(),
});

// GET /api/partners?status=pending|approved|rejected
// Manager lists partner profiles, optionally filtered by verify_status.
router.get(
  '/',
  authenticate,
  requireRoles('manager', 'super_admin'),
  validateQuery(listQuerySchema),
  controller.listPartners,
);

// POST /api/partners/:partnerId/approve
// Manager approves a pending partner.
router.post(
  '/:partnerId/approve',
  authenticate,
  requireRoles('manager', 'super_admin'),
  validateParams(partnerIdParamSchema),
  controller.approvePartner,
);

// POST /api/partners/:partnerId/reject
// Manager rejects a pending partner with a mandatory reason.
router.post(
  '/:partnerId/reject',
  authenticate,
  requireRoles('manager', 'super_admin'),
  validateParams(partnerIdParamSchema),
  validate(rejectSchema),
  controller.rejectPartner,
);

module.exports = router;
