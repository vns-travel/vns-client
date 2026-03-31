const { Router } = require('express');
const { authenticate } = require('../../middleware/auth');
const controller = require('./payments.controller');

const router = Router();

// GET /api/payments/:bookingId
// Returns all payment records for a booking.
// Auth check (owner vs partner vs manager) is handled in the service layer.
router.get('/:bookingId', authenticate, controller.getByBooking);

module.exports = router;
