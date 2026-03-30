const router = require('express').Router();

router.use('/auth',          require('./auth'));
router.use('/services',      require('./service'));
router.use('/bookings',      require('./booking'));
router.use('/payments',      require('./payment'));
router.use('/vouchers',      require('./voucher'));
router.use('/reviews',       require('./review'));
router.use('/notifications', require('./notification'));
router.use('/partner',       require('./partner'));
router.use('/manager',       require('./manager'));

module.exports = router;
