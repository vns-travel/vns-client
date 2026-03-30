const { z } = require('zod');

const createPartnerProfileSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  taxCode:      z.string().optional(),
  address:      z.string().optional(),
  city:         z.string().optional(),
  description:  z.string().optional(),
});

const updateVerifyStatusSchema = z.object({
  status:          z.enum(['reviewing', 'approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

module.exports = { createPartnerProfileSchema, updateVerifyStatusSchema };
