const router             = require('express').Router();
const serviceController  = require('../controllers/serviceController');
const voucherController  = require('../controllers/voucherController');
const partnerController  = require('../controllers/partnerController');
const auth               = require('../middlewares/auth');
const requireRole        = require('../middlewares/requireRole');
const { validate }       = require('../validations/auth');
const { rejectPartnerSchema } = require('../validations/partner');
const { rejectServiceSchema } = require('../validations/service');

// ---------------------------------------------------------------------------
// Manager: service review queue
// ---------------------------------------------------------------------------
router.get('/services',
  auth, requireRole('manager', 'super_admin'), serviceController.getAllServicesManager);

router.put('/services/:serviceId/approve',
  auth, requireRole('manager', 'super_admin'), serviceController.approveService);

router.put('/services/:serviceId/reject',
  auth, requireRole('manager', 'super_admin'), validate(rejectServiceSchema), serviceController.rejectService);

// ---------------------------------------------------------------------------
// Voucher management
// ---------------------------------------------------------------------------
router.post('/vouchers',
  auth, requireRole('manager', 'super_admin'), voucherController.createVoucher);

// ---------------------------------------------------------------------------
// Partner review and approval
// ---------------------------------------------------------------------------
router.get('/partners',
  auth, requireRole('manager', 'super_admin'), partnerController.getAllPartners);

router.get('/partners/:partnerId',
  auth, requireRole('manager', 'super_admin'), partnerController.getPartnerById);

router.put('/partners/:partnerId/approve',
  auth, requireRole('manager', 'super_admin'), partnerController.approvePartner);

router.put('/partners/:partnerId/reject',
  auth, requireRole('manager', 'super_admin'), validate(rejectPartnerSchema), partnerController.rejectPartner);

module.exports = router;
