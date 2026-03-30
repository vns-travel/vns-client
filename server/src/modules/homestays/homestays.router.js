const { Router } = require('express');
const { z } = require('zod');
const controller = require('./homestays.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRoles } = require('../../middleware/roles');
const { validate } = require('../../middleware/validate');

const router = Router();

const createHomestaySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    ward: z.string().optional(),
    postalCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    phoneNumber: z.string().optional(),
    openingHours: z.string().optional(),
  }).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  houseRules: z.string().optional(),
});

const addRoomSchema = z.object({
  roomName: z.string().min(1),
  roomDescription: z.string().optional(),
  maxOccupancy: z.number().int().optional(),
  roomSizeSqm: z.number().optional(),
  bedType: z.string().optional(),
  bedCount: z.number().int().optional(),
  privateBathroom: z.boolean().optional(),
  basePrice: z.number().positive(),
  weekendPrice: z.number().optional(),
  holidayPrice: z.number().optional(),
  roomAmenities: z.array(z.string()).optional(),
  numberOfRooms: z.number().int().optional(),
});

const bulkAvailabilitySchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  rooms: z.array(z.object({
    roomId: z.string().uuid(),
    defaultPrice: z.number().optional(),
    minNights: z.number().int().optional(),
  })),
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
