const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');
const controller = require('./combos.controller');

const router = Router();

const comboServiceItemSchema = z.object({
  serviceId:        z.string().uuid(),
  quantity:         z.number().int().min(1).max(100).optional(),
  includedFeatures: z.string().max(500).trim().optional(),
  sequenceOrder:    z.number().int().min(1).max(100).optional(),
});

const createComboSchema = z.object({
  title:           z.string().min(1).max(200).trim(),
  description:     z.string().max(2000).trim().optional(),
  originalPrice:   z.number().positive().max(100_000_000),
  discountedPrice: z.number().positive().max(100_000_000),
  maxBookings:     z.number().int().min(1).max(100_000).optional(),
  validFrom:       z.string().datetime({ offset: true }).optional(),
  validTo:         z.string().datetime({ offset: true }).optional(),
  services:        z.array(comboServiceItemSchema).min(1, 'Combo phải có ít nhất một dịch vụ').max(20),
});

const rejectSchema = z.object({
  reason: z.string().min(1).max(1000).trim(),
});

// GET /api/combos/partner
// Partner lists their own combos. Must come before /:comboId to avoid route shadowing.
router.get('/partner', authenticate, requireRoles('partner'), controller.listPartnerCombos);

// GET /api/combos/pending
// Manager/admin lists all pending combos awaiting approval.
router.get('/pending', authenticate, requireRoles('manager', 'super_admin'), controller.listPendingCombos);

// POST /api/combos
// Partner submits a new combo for manager review.
router.post('/', authenticate, requireRoles('partner'), validate(createComboSchema), controller.createCombo);

// POST /api/combos/:comboId/approve
// Manager approves a pending combo.
router.post('/:comboId/approve', authenticate, requireRoles('manager', 'super_admin'), controller.approveCombo);

// POST /api/combos/:comboId/reject
// Manager rejects a pending combo with a mandatory reason.
router.post('/:comboId/reject', authenticate, requireRoles('manager', 'super_admin'), validate(rejectSchema), controller.rejectCombo);

module.exports = router;
