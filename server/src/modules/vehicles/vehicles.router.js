const { Router } = require('express');
const { z } = require('zod');
const controller = require('./vehicles.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router();

const createVehicleSchema = z.object({
  serviceId: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().optional(),
  vehicleType: z.enum(['sedan', 'suv', 'van', 'motorbike']),
  capacity: z.number().int().min(1),
  pricingModel: z.enum(['daily', 'hourly']),
  dailyRate: z.number().positive().optional(),
  hourlyRate: z.number().positive().optional(),
  driverIncluded: z.boolean().default(false),
  depositAmount: z.number().min(0).default(0),
  includedFeatures: z.array(z.string()).default([]),
});

const bulkAvailabilitySchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  availableFrom: z.string().min(1), // HH:MM
  availableTo: z.string().min(1),   // HH:MM
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
