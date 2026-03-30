const { z } = require('zod');

const createReviewSchema = z.object({
  bookingId:  z.string().uuid(),
  rating:     z.number().int().min(1).max(5),
  comment:    z.string().optional(),
  imageUrls:  z.array(z.string().url()).default([]),
});

module.exports = { createReviewSchema };
