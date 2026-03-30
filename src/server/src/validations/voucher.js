const { z } = require('zod');

const validateVoucherSchema = z.object({
  code:        z.string().min(1),
  amount:      z.number().positive(),
  serviceType: z.enum(['tour', 'homestay', 'car_rental', 'other']).optional(),
});

const createVoucherSchema = z.object({
  code:                    z.string().min(1).toUpperCase(),
  type:                    z.enum(['percent', 'fixed']),
  value:                   z.number().positive(),
  minSpend:                z.number().min(0).default(0),
  maxDiscount:             z.number().positive().optional(),
  maxUses:                 z.number().int().positive().optional(),
  validFrom:               z.string().datetime().optional(),
  validTo:                 z.string().datetime().optional(),
  applicableServiceTypes:  z.array(z.enum(['tour', 'homestay', 'car_rental', 'other'])).default([]),
  userId:                  z.string().uuid().optional(),
});

module.exports = { validateVoucherSchema, createVoucherSchema };
