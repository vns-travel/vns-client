const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');
const controller = require('./payments.controller');

const router = Router();

const initiateSchema = z.object({
  bookingId: z.string().uuid(),
});

// POST /api/payments/initiate
// Creates a PayOS checkout link for a pending booking.
// Body: { bookingId }
router.post('/initiate', authenticate, validate(initiateSchema), controller.initiate);

// POST /api/payments/payos/webhook
// Receives PayOS server-to-server payment confirmation.
// No JWT auth — PayOS doesn't send our token; signature is verified in the service.
router.post('/payos/webhook', controller.payosWebhook);

// GET /api/payments/earnings/partner
// Returns the authenticated partner's revenue summary and recent transactions.
// Must be registered before /:bookingId to prevent Express matching 'earnings' as a bookingId.
router.get('/earnings/partner', authenticate, requireRoles('partner'), controller.partnerEarnings);

// GET /api/payments/earnings/platform
// Returns platform-wide revenue stats and per-partner breakdown.
router.get('/earnings/platform', authenticate, requireRoles('manager', 'super_admin'), controller.platformRevenue);

// GET /api/payments/:bookingId
// Returns all payment records for a booking.
// Auth check (owner vs partner vs manager) is handled in the service layer.
// Kept last so static paths above are matched first.
router.get('/:bookingId', authenticate, controller.getByBooking);

module.exports = router;
