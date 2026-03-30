const { z } = require('zod');

const createServiceSchema = z.object({
  type:        z.enum(['tour', 'homestay', 'car_rental', 'other']),
  title:       z.string().min(1),
  description: z.string().optional(),
  city:        z.string().optional(),
  address:     z.string().optional(),
  latitude:    z.number().min(-90).max(90).optional(),
  longitude:   z.number().min(-180).max(180).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  reason: z.string().optional(),
});

module.exports = { createServiceSchema, updateStatusSchema };
