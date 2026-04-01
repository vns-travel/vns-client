const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate, validateQuery, validateParams } = require('../../middleware/validate');
const controller = require('./bookings.controller');

const router = Router();

// ---------------------------------------------------------------------------
// Zod schemas — defined here to keep the router self-contained
// ---------------------------------------------------------------------------

// Shared UUID param schema reused across bookings routes.
const idParamSchema = z.object({ id: z.string().uuid('ID đặt chỗ không hợp lệ') });

// Shared pagination schema — cap limit at 100 to prevent DB DoS.
const listQuerySchema = z.object({
  status:    z.string().trim().optional(),
  serviceId: z.string().uuid().optional(),
  page:      z.coerce.number().int().min(1).max(1000).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
});

const createBookingSchema = z
  .object({
    serviceId:       z.string().uuid(),
    serviceType:     z.enum(['tour', 'homestay', 'car_rental']),
    guests:          z.number().int().min(1).max(500).optional(),
    specialRequests: z.string().trim().max(1000).optional(),
    // Voucher codes are uppercase alphanumeric (matches create schema in vouchers router).
    voucherCode:     z.string().trim().max(50).optional(),
    paymentMethod:   z.enum(['cash', 'bank_transfer']),
    paymentType:     z.enum(['full', 'deposit']).default('full'),
    tourDetail: z
      .object({
        scheduleId:     z.string().uuid(),
        participants:   z.number().int().min(1).max(500),
        pickupLocation: z.string().trim().max(500).optional(),
        pickupTime:     z.string().trim().optional(),
      })
      .optional(),
    homestayDetail: z
      .object({
        roomId:   z.string().uuid(),
        checkIn:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        adults:   z.number().int().min(1).max(50),
        children: z.number().int().min(0).max(50).default(0),
      })
      .optional(),
    carDetail: z
      .object({
        vehicleId:      z.string().uuid(),
        rentalStart:    z.string().datetime(),
        rentalEnd:      z.string().datetime(),
        pickupLocation: z.string().trim().max(500).optional(),
        returnLocation: z.string().trim().max(500).optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.serviceType === 'tour') return !!data.tourDetail;
      if (data.serviceType === 'homestay') return !!data.homestayDetail;
      if (data.serviceType === 'car_rental') return !!data.carDetail;
      return false;
    },
    { message: 'Detail block matching serviceType is required' }
  );

const cancelBookingSchema = z.object({
  reason:       z.string().trim().max(500).optional(),
  evidenceUrls: z.array(z.string().url()).max(5).optional(),
});

const partnerStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
  reason: z.string().trim().max(500).optional(),
});

const managerStatusSchema = z.object({
  status: z.enum(['in_progress', 'completed', 'refunded']),
  reason: z.string().trim().max(500).optional(),
});

// ---------------------------------------------------------------------------
// Routes
// IMPORTANT: /partner and /manager must be declared before /:id to prevent
// Express from treating the literal strings 'partner'/'manager' as UUID params.
// ---------------------------------------------------------------------------

// Partner routes
router.get(
  '/partner',
  authenticate,
  requireRoles('partner'),
  validateQuery(listQuerySchema),
  controller.listPartnerBookings
);

router.patch(
  '/partner/:id/status',
  authenticate,
  requireRoles('partner'),
  validateParams(idParamSchema),
  validate(partnerStatusSchema),
  controller.updatePartnerStatus
);

// Manager routes
router.patch(
  '/manager/:id/status',
  authenticate,
  requireRoles('manager', 'super_admin'),
  validateParams(idParamSchema),
  validate(managerStatusSchema),
  controller.updateManagerStatus
);

// Customer routes
router.post(
  '/',
  authenticate,
  requireRoles('customer'),
  validate(createBookingSchema),
  controller.createBooking
);

router.get(
  '/',
  authenticate,
  requireRoles('customer'),
  validateQuery(listQuerySchema),
  controller.listMyBookings
);

// Customer cancellation — /:id/cancel has two path segments so Express
// will never confuse it with the /:id catch-all below, but registering
// it first is the safest practice.
router.patch(
  '/:id/cancel',
  authenticate,
  requireRoles('customer'),
  validateParams(idParamSchema),
  validate(cancelBookingSchema),
  controller.cancelBooking
);

// Must be last — catches /:id
router.get(
  '/:id',
  authenticate,
  validateParams(idParamSchema),
  controller.getBookingDetail
);

module.exports = router;
