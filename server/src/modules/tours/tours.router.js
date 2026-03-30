const { Router } = require('express');
const { z } = require('zod');
const controller = require('./tours.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router({ mergeParams: true });

const scheduleSchema = z.object({
  tourDate: z.string().min(1),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableSlots: z.number().int().min(0),
  price: z.number().positive(),
  guideId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

const itinerarySchema = z.object({
  stepOrder: z.number().int().min(1),
  location: z.string().optional(),
  activity: z.string().min(1),
  durationMinutes: z.number().int().optional(),
  description: z.string().optional(),
});

// POST /api/partner/tours/:tourId/schedules
router.post(
  '/:tourId/schedules',
  authenticate,
  requireRoles('partner'),
  validate(scheduleSchema),
  controller.addSchedule
);

// POST /api/partner/tours/:tourId/itineraries
router.post(
  '/:tourId/itineraries',
  authenticate,
  requireRoles('partner'),
  validate(itinerarySchema),
  controller.addItinerary
);

module.exports = router;
