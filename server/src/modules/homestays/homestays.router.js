const { Router } = require('express');
const { z } = require('zod');
const controller = require('./homestays.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router();

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const createHomestaySchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().optional(),
  location: z.object({
    name:         z.string().max(200).trim().optional(),
    address:      z.string().max(500).trim().optional(),
    city:         z.string().max(100).trim().optional(),
    district:     z.string().max(100).trim().optional(),
    ward:         z.string().max(100).trim().optional(),
    postalCode:   z.string().max(20).trim().optional(),
    latitude:     z.number().min(-90).max(90).optional(),
    longitude:    z.number().min(-180).max(180).optional(),
    phoneNumber:  z.string().max(20).trim().optional(),
    openingHours: z.string().max(200).trim().optional(),
  }).optional(),
  checkInTime:        z.string().regex(timeRegex, 'checkInTime must be HH:MM').optional(),
  checkOutTime:       z.string().regex(timeRegex, 'checkOutTime must be HH:MM').optional(),
  cancellationPolicy: z.string().max(2000).trim().optional(),
  houseRules:         z.string().max(2000).trim().optional(),
});

const addRoomSchema = z.object({
  roomName:        z.string().min(1).max(100).trim(),
  roomType:        z.enum(['single', 'double', 'twin', 'suite', 'dormitory']).optional(),
  roomDescription: z.string().max(1000).trim().optional(),
  maxOccupancy:    z.number().int().min(1).max(50).optional(),
  roomSizeSqm:     z.number().min(0).max(10000).optional(),
  bedType:         z.enum(['King', 'Queen', 'Twin', 'Single', 'Bunk', 'Sofa']).optional(),
  bedCount:        z.number().int().min(0).max(20).optional(),
  privateBathroom: z.boolean().optional(),
  basePrice:       z.number().positive().max(100_000_000),
  weekendPrice:    z.number().positive().max(100_000_000).optional(),
  holidayPrice:    z.number().positive().max(100_000_000).optional(),
  roomAmenities:   z.array(z.string().max(100).trim()).max(50).optional(),
  numberOfRooms:   z.number().int().min(1).max(1000).optional(),
  minNights:       z.number().int().min(1).max(365).optional(),
});

const bulkAvailabilitySchema = z.object({
  startDate: z.string().regex(dateRegex, 'startDate must be YYYY-MM-DD'),
  endDate:   z.string().regex(dateRegex, 'endDate must be YYYY-MM-DD'),
  rooms: z.array(z.object({
    roomId:       z.string().uuid(),
    defaultPrice: z.number().positive().max(100_000_000).optional(),
    minNights:    z.number().int().min(1).max(365).optional(),
  })).min(1),
  applyToAllDates: z.boolean().optional(),
});

// Partner creates a new homestay
router.post(
  '/',
  authenticate,
  requireRoles('partner'),
  validate(createHomestaySchema),
  controller.createHomestay
);

// Partner adds a room type to their homestay
router.post(
  '/:homestayId/rooms',
  authenticate,
  requireRoles('partner'),
  validate(addRoomSchema),
  controller.addRoom
);

// Partner sets availability windows for rooms in bulk
router.post(
  '/:homestayId/availability/bulk',
  authenticate,
  requireRoles('partner'),
  validate(bulkAvailabilitySchema),
  controller.bulkAvailability
);

// Partner submits homestay for manager review (draft → pending)
router.post(
  '/:homestayId/create',
  authenticate,
  requireRoles('partner'),
  controller.submitHomestay
);

module.exports = router;
