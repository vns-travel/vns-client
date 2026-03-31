const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate, validateQuery, validateParams } = require('../../middleware/validate');
const controller = require('./vouchers.controller');

const router = Router();

// Shared ISO date regex used for validFrom / validTo.
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải có định dạng YYYY-MM-DD').optional();

const createVoucherSchema = z.object({
  name:        z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  code:        z.string().trim().regex(/^[A-Z0-9]+$/, 'Mã chỉ được dùng chữ in hoa và số').max(50),
  type:        z.enum(['percent', 'fixed']),
  value:       z.number().positive(),
  minSpend:    z.number().min(0).optional(),
  maxDiscount: z.number().positive().optional(),
  maxUses:     z.number().int().positive().optional(),
  validFrom:   isoDate,
  validTo:     isoDate,
  // Restrict to known service type integers; empty array = all types.
  applicableServiceTypes: z.array(z.enum(['0', '1', '2'])).optional(),
});

// Query params for manager list: search text and active/inactive filter.
const listVouchersQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Shared UUID param schema.
const idParamSchema = z.object({ id: z.string().uuid('ID voucher không hợp lệ') });

// GET /api/vouchers/public
// No auth required — consumed by the Flutter mobile app to display available vouchers.
// Must be declared before /:id routes to avoid shadowing.
router.get('/public', controller.listPublicVouchers);

// GET /api/vouchers
// Manager lists all vouchers. Supports ?search= and ?status= query params.
router.get('/', authenticate, requireRoles('manager', 'super_admin'), validateQuery(listVouchersQuerySchema), controller.listVouchers);

// POST /api/vouchers
// Manager creates a new platform-wide voucher.
router.post(
  '/',
  authenticate,
  requireRoles('manager', 'super_admin'),
  validate(createVoucherSchema),
  controller.createVoucher,
);

// PATCH /api/vouchers/:id/toggle
// Manager toggles is_active on a voucher (pause / resume).
router.patch('/:id/toggle', authenticate, requireRoles('manager', 'super_admin'), validateParams(idParamSchema), controller.toggleVoucher);

module.exports = router;
