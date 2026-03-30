const router            = require('express').Router();
const serviceController = require('../controllers/serviceController');
const voucherController = require('../controllers/voucherController');
const auth              = require('../middlewares/auth');
const requireRole       = require('../middlewares/requireRole');

router.get('/services',              auth, requireRole('manager', 'super_admin'), serviceController.getAll);
router.put('/services/:id/approve',  auth, requireRole('manager', 'super_admin'), serviceController.approveService);
router.put('/services/:id/reject',   auth, requireRole('manager', 'super_admin'), serviceController.rejectService);
router.post('/vouchers',             auth, requireRole('manager', 'super_admin'), voucherController.createVoucher);

module.exports = router;
