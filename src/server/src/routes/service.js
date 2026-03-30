const router            = require('express').Router();
const serviceController = require('../controllers/serviceController');

// Public routes — no auth required
router.get('/',                      serviceController.getPublicCatalog);
router.get('/:serviceId',            serviceController.getServiceById);
router.get('/:serviceId/tour',       serviceController.getTourFull);

module.exports = router;
