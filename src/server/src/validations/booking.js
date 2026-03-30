const { z } = require('zod');

const createBookingSchema = z.object({
  type:            z.enum(['service', 'combo']),
  serviceId:       z.string().uuid().optional(),
  comboId:         z.string().uuid().optional(),
  voucherCode:     z.string().optional(),
  guests:          z.number().int().positive().optional(),
  specialRequests: z.string().optional(),
  // Tour
  scheduleId:      z.string().uuid().optional(),
  participants:    z.number().int().positive().optional(),
  pickupLocation:  z.string().optional(),
  pickupTime:      z.string().optional(),
  // Homestay
  roomId:          z.string().uuid().optional(),
  checkIn:         z.string().optional(),
  checkOut:        z.string().optional(),
  adults:          z.number().int().positive().optional(),
  children:        z.number().int().min(0).optional(),
  // Transport
  vehicleId:       z.string().uuid().optional(),
  rentalStart:     z.string().optional(),
  rentalEnd:       z.string().optional(),
  returnLocation:  z.string().optional(),
});

const transitionStatusSchema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed', 'cancelled', 'refunded']),
});

module.exports = { createBookingSchema, transitionStatusSchema };
