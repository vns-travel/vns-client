const router            = require('express').Router();
const voucherController = require('../controllers/voucherController');
const auth              = require('../middlewares/auth');

router.get('/my',        auth, voucherController.getUserVouchers);
router.post('/validate', auth, voucherController.validateAndApply);

module.exports = router;
