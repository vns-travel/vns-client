const { Router } = require('express');
const { z } = require('zod');
const controller = require('./tours.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router({ mergeParams: true });

// HH:MM regex reused across both schemas
const timeRegex = /^\d{2}:\d{2}$/;

const scheduleSchema = z.object({
  // Enforce YYYY-MM-DD format; bare .min(1) previously accepted any non-empty string
  tourDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'tourDate must be YYYY-MM-DD'),
  startTime: z.string().regex(timeRegex, 'startTime must be HH:MM').optional(),
  endTime:   z.string().regex(timeRegex, 'endTime must be HH:MM').optional(),
  // min(0) allowed "0 slots available" which is meaningless; a schedule must have capacity
  availableSlots: z.number().int().min(1),
  price: z.number().positive().max(100_000_000),
  guideId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

const itinerarySchema = z.object({
  stepOrder: z.number().int().min(1).max(100),
  location:  z.string().max(200).trim().optional(),
  activity:  z.string().min(1).max(200).trim(),
  durationMinutes: z.number().int().min(0).max(1440).optional(), // max 24 h
  description: z.string().max(1000).trim().optional(),
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
