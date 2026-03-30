const router            = require('express').Router();
const bookingController = require('../controllers/bookingController');
const partnerController = require('../controllers/partnerController');
const auth              = require('../middlewares/auth');
const requireRole       = require('../middlewares/requireRole');

router.get('/profile',               auth, requireRole('partner'), partnerController.getProfile);
router.post('/profile',              auth, requireRole('partner'), partnerController.createProfile);
router.get('/bookings',              auth, requireRole('partner'), bookingController.getPartnerBookings);
router.put('/bookings/:id/status',   auth, requireRole('partner'), bookingController.transitionStatus);

module.exports = router;
