const router            = require('express').Router();
const serviceController = require('../controllers/serviceController');

// Public routes — no auth required
router.get('/',                      serviceController.getPublicCatalog);
router.get('/:serviceId',            serviceController.getServiceById);
router.get('/:serviceId/tour',       serviceController.getTourFull);

// Homestay public reads
router.get('/:serviceId/homestay',                                          serviceController.getHomestayFull);
router.get('/:serviceId/homestay/rooms',                                    serviceController.getRooms);
router.get('/:serviceId/homestay/rooms/:roomId/availability',               serviceController.getRoomAvailability);

module.exports = router;
