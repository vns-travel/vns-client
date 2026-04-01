const { Router } = require('express');
const { z } = require('zod');
const controller = require('./vehicles.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router();

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const createVehicleSchema = z.object({
  serviceId:    z.string().uuid(),
  make:         z.string().min(1).max(100).trim(),
  model:        z.string().min(1).max(100).trim(),
  year:         z.number().int().min(1900).max(2100).optional(),
  vehicleType:  z.enum(['sedan', 'suv', 'van', 'motorbike']),
  capacity:     z.number().int().min(1).max(100),
  pricingModel: z.enum(['daily', 'hourly']),
  dailyRate:    z.number().positive().max(100_000_000).optional(),
  hourlyRate:   z.number().positive().max(100_000_000).optional(),
  driverIncluded:   z.boolean().default(false),
  depositAmount:    z.number().min(0).max(100_000_000).default(0),
  includedFeatures: z.array(z.string().max(100).trim()).max(50).default([]),
});

const bulkAvailabilitySchema = z.object({
  startDate:     z.string().regex(dateRegex, 'startDate must be YYYY-MM-DD'),
  endDate:       z.string().regex(dateRegex, 'endDate must be YYYY-MM-DD'),
  availableFrom: z.string().regex(timeRegex, 'availableFrom must be HH:MM'),
  availableTo:   z.string().regex(timeRegex, 'availableTo must be HH:MM'),
});

// Partner adds a vehicle to their fleet (service)
router.post(
  '/',
  authenticate,
  requireRoles('partner'),
  validate(createVehicleSchema),
  controller.createVehicle
);

// Partner sets the operating date/time window for a specific vehicle
router.post(
  '/:vehicleId/availability/bulk',
  authenticate,
  requireRoles('partner'),
  validate(bulkAvailabilitySchema),
  controller.bulkVehicleAvailability
);

module.exports = router;
