const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');
const controller = require('./bookings.controller');

const router = Router();

// ---------------------------------------------------------------------------
// Zod schemas — defined here to keep the router self-contained
// ---------------------------------------------------------------------------

const createBookingSchema = z
  .object({
    serviceId:       z.string().uuid(),
    serviceType:     z.enum(['tour', 'homestay', 'car_rental']),
    guests:          z.number().int().min(1).optional(),
    specialRequests: z.string().optional(),
    voucherCode:     z.string().optional(),
    paymentMethod:   z.enum(['cash', 'bank_transfer']),
    paymentType:     z.enum(['full', 'deposit']).default('full'),
    tourDetail: z
      .object({
        scheduleId:     z.string().uuid(),
        participants:   z.number().int().min(1),
        pickupLocation: z.string().optional(),
        pickupTime:     z.string().optional(),
      })
      .optional(),
    homestayDetail: z
      .object({
        roomId:   z.string().uuid(),
        checkIn:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        adults:   z.number().int().min(1),
        children: z.number().int().min(0).default(0),
      })
      .optional(),
    carDetail: z
      .object({
        vehicleId:      z.string().uuid(),
        rentalStart:    z.string().datetime(),
        rentalEnd:      z.string().datetime(),
        pickupLocation: z.string().optional(),
        returnLocation: z.string().optional(),
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
  reason:       z.string().max(500).optional(),
  evidenceUrls: z.array(z.string().url()).max(5).optional(),
});

const partnerStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
  reason: z.string().optional(),
});

const managerStatusSchema = z.object({
  status: z.enum(['in_progress', 'completed', 'refunded']),
  reason: z.string().optional(),
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
  controller.listPartnerBookings
);

router.patch(
  '/partner/:id/status',
  authenticate,
  requireRoles('partner'),
  validate(partnerStatusSchema),
  controller.updatePartnerStatus
);

// Manager routes
router.patch(
  '/manager/:id/status',
  authenticate,
  requireRoles('manager', 'super_admin'),
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
  controller.listMyBookings
);

// Customer cancellation — /:id/cancel has two path segments so Express
// will never confuse it with the /:id catch-all below, but registering
// it first is the safest practice.
router.patch(
  '/:id/cancel',
  authenticate,
  requireRoles('customer'),
  validate(cancelBookingSchema),
  controller.cancelBooking
);

// Must be last — catches /:id
router.get(
  '/:id',
  authenticate,
  controller.getBookingDetail
);

module.exports = router;
