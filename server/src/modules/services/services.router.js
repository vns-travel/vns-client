const { Router } = require('express');
const { z } = require('zod');
const controller = require('./services.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router();

// serviceType 0=homestay, 1=tour, 2=car_rental ('other' removed)
const createServiceSchema = z.object({
  serviceType: z.union([z.number().int().min(0).max(2), z.string().min(1)]),
  title: z.string().min(1).max(200).trim(),
  city: z.string().max(100).trim().optional(),
  address: z.string().max(500).trim().optional(),
  description: z.string().max(5000).trim().optional(),
  platformFeeAmount: z.number().optional(), // forwarded from frontend, not stored on services table
  destinationId: z.string().optional(),     // forwarded from frontend, not stored yet
  tourDetails: z.object({
    tourType: z.number().optional(),
    durationHours: z.number().optional(),
    difficultyLevel: z.number().optional(),
    minParticipants: z.number().optional(),
    maxParticipants: z.number().optional(),
    includes: z.array(z.string().max(200).trim()).optional(),
    excludes: z.array(z.string().max(200).trim()).optional(),
    whatToBring: z.string().max(1000).trim().optional(),
    cancellationPolicy: z.string().max(2000).trim().optional(),
    ageRestrictions: z.string().max(500).trim().optional(),
    fitnessRequirements: z.string().max(500).trim().optional(),
  }).optional().nullable(),
});

const updateServiceSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().optional(),
  city: z.string().max(100).trim().optional(),
  address: z.string().max(500).trim().optional(),
});

// Partner lists their own services
router.get(
  '/partner/services',
  authenticate,
  requireRoles('partner'),
  controller.listPartnerServices
);

// Partner fetches a single service (must be their own)
router.get(
  '/partner/services/:serviceId',
  authenticate,
  requireRoles('partner'),
  controller.getServiceById
);

// Partner creates a service record (tour / homestay / car_rental)
router.post(
  '/partner/services',
  authenticate,
  requireRoles('partner'),
  validate(createServiceSchema),
  controller.createService
);

// Partner submits a draft service for manager review
router.post(
  '/partner/services/:serviceId/submit',
  authenticate,
  requireRoles('partner'),
  controller.submitService
);

// Partner updates a draft or rejected service
router.put(
  '/partner/services/:serviceId',
  authenticate,
  requireRoles('partner'),
  validate(updateServiceSchema),
  controller.updateService
);

// Partner deletes a draft service
router.delete(
  '/partner/services/:serviceId',
  authenticate,
  requireRoles('partner'),
  controller.deleteService
);

module.exports = router;
