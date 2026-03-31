const { Router } = require('express');
const { z } = require('zod');
const controller = require('./reviews.controller');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');

const router = Router();

const createSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  // image_urls is optional; each entry must be a URL string
  imageUrls: z.array(z.string().url()).max(10).optional(),
});

// POST /api/reviews — authenticated user creates a review for a completed booking
router.post('/', authenticate, validate(createSchema), controller.create);

// GET /api/reviews/service/:serviceId — public; anyone can read a service's reviews
router.get('/service/:serviceId', controller.getByService);

// GET /api/reviews/booking/:bookingId — authenticated owner checks their own review
router.get('/booking/:bookingId', authenticate, controller.getByBooking);

module.exports = router;
