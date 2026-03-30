const { z } = require('zod');

const uploadDocumentsSchema = z.object({
  documents: z
    .array(
      z.object({
        docType: z.string().min(1),   // e.g. 'business_license', 'tax_certificate', 'id_card'
        fileUrl: z.string().url(),    // Firebase Storage download URL
      })
    )
    .min(1, 'At least one document is required'),
});

const updateProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  businessType: z.string().optional(),
  taxCode:      z.string().optional(),
  address:      z.string().optional(),
  city:         z.string().optional(),
  description:  z.string().optional(),
});

// approve has no required body fields — empty object is valid
const approvePartnerSchema = z.object({}).passthrough();

const rejectPartnerSchema = z.object({
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

module.exports = {
  uploadDocumentsSchema,
  updateProfileSchema,
  approvePartnerSchema,
  rejectPartnerSchema,
};
