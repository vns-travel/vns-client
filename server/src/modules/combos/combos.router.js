const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');
const controller = require('./combos.controller');

const router = Router();

const comboServiceItemSchema = z.object({
  serviceId:        z.string().uuid(),
  quantity:         z.number().int().positive().optional(),
  includedFeatures: z.string().optional(),
  sequenceOrder:    z.number().int().positive().optional(),
});

const createComboSchema = z.object({
  title:           z.string().min(1),
  description:     z.string().optional(),
  originalPrice:   z.number().positive(),
  discountedPrice: z.number().positive(),
  maxBookings:     z.number().int().positive().optional(),
  validFrom:       z.string().datetime({ offset: true }).optional(),
  validTo:         z.string().datetime({ offset: true }).optional(),
  services:        z.array(comboServiceItemSchema).min(1, 'Combo phải có ít nhất một dịch vụ'),
});

const rejectSchema = z.object({
  reason: z.string().min(1),
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
