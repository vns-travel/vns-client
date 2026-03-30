const router            = require('express').Router();
const bookingController = require('../controllers/bookingController');
const auth              = require('../middlewares/auth');

router.post('/',    auth, bookingController.createBooking);
router.get('/:id',  auth, bookingController.getBooking);
router.delete('/:id', auth, bookingController.cancelBooking);

module.exports = router;
