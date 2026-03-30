const { z } = require('zod');
// Re-export validate so routes only need to import from this file.
const { validate } = require('./auth');

const createServiceSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  city:        z.string().min(2),
  address:     z.string().optional(),
  latitude:    z.number().optional(),
  longitude:   z.number().optional(),
  serviceType: z.enum(['tour', 'homestay', 'car_rental']),
  images: z.array(z.object({
    url:       z.string().url(),
    sortOrder: z.number().int().default(0),
  })).optional(),
  // asDraft true → status = 'draft', false → status = 'pending' (submitted immediately)
  asDraft: z.boolean().default(false),
});

const addTourDetailsSchema = z.object({
  durationHours:      z.number().int().min(1),
  maxCapacity:        z.number().int().min(1),
  meetingPoint:       z.string().optional(),
  cancellationPolicy: z.string().optional(),
  highlights:         z.string().optional(),
});

const addItinerarySchema = z.object({
  itinerary: z.array(z.object({
    stepOrder:       z.number().int().min(1),
    location:        z.string().min(1),
    activity:        z.string().min(1),
    durationMinutes: z.number().int().min(1),
    description:     z.string().optional(),
  })).min(1),
});

const addSchedulesSchema = z.object({
  schedules: z.array(z.object({
    tourDate:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime:      z.string().regex(/^\d{2}:\d{2}$/),
    endTime:        z.string().regex(/^\d{2}:\d{2}$/),
    availableSlots: z.number().int().min(1),
    price:          z.number().positive(),
    guideId:        z.string().uuid().optional(),
  })).min(1),
});

const rejectServiceSchema = z.object({
  reason: z.string().min(10),
});

module.exports = {
  validate,
  createServiceSchema,
  addTourDetailsSchema,
  addItinerarySchema,
  addSchedulesSchema,
  rejectServiceSchema,
};
