const router            = require('express').Router();
const bookingController = require('../controllers/bookingController');
const partnerController = require('../controllers/partnerController');
const serviceController = require('../controllers/serviceController');
const auth              = require('../middlewares/auth');
const requireRole       = require('../middlewares/requireRole');
const { validate }      = require('../validations/auth');
const {
  uploadDocumentsSchema,
  updateProfileSchema,
} = require('../validations/partner');
const {
  createServiceSchema,
  addTourDetailsSchema,
  addItinerarySchema,
  addSchedulesSchema,
  addHomestayDetailsSchema,
  addRoomSchema,
  updateRoomSchema,
  bulkSetAvailabilitySchema,
} = require('../validations/service');

// ---------------------------------------------------------------------------
// Partner self-service routes
// ---------------------------------------------------------------------------
router.get('/me',         auth, requireRole('partner'), partnerController.getMyProfile);
router.put('/me',         auth, requireRole('partner'), validate(updateProfileSchema), partnerController.updateMyProfile);
router.post('/documents', auth, requireRole('partner'), validate(uploadDocumentsSchema), partnerController.uploadDocuments);

// Existing booking routes
router.get('/bookings',            auth, requireRole('partner'), bookingController.getPartnerBookings);
router.put('/bookings/:id/status', auth, requireRole('partner'), bookingController.transitionStatus);

// ---------------------------------------------------------------------------
// Partner: service listing management
// ---------------------------------------------------------------------------
router.post('/services',
  auth, requireRole('partner'), validate(createServiceSchema), serviceController.createService);

router.get('/services',
  auth, requireRole('partner'), serviceController.getPartnerServices);

router.put('/services/:serviceId/submit',
  auth, requireRole('partner'), serviceController.submitForReview);

// ---------------------------------------------------------------------------
// Partner: tour sub-resources
// ---------------------------------------------------------------------------
router.post('/services/:serviceId/tour',
  auth, requireRole('partner'), validate(addTourDetailsSchema), serviceController.addTourDetails);

router.put('/services/:serviceId/tour/itinerary',
  auth, requireRole('partner'), validate(addItinerarySchema), serviceController.setItinerary);

router.post('/services/:serviceId/tour/schedules',
  auth, requireRole('partner'), validate(addSchedulesSchema), serviceController.addSchedules);

// ---------------------------------------------------------------------------
// Partner: homestay sub-resources
// ---------------------------------------------------------------------------
router.post('/services/:serviceId/homestay',
  auth, requireRole('partner'), validate(addHomestayDetailsSchema), serviceController.addHomestayDetails);

router.post('/services/:serviceId/homestay/rooms',
  auth, requireRole('partner'), validate(addRoomSchema), serviceController.addRoom);

router.put('/services/:serviceId/homestay/rooms/:roomId',
  auth, requireRole('partner'), validate(updateRoomSchema), serviceController.updateRoom);

router.put('/services/:serviceId/homestay/rooms/:roomId/availability',
  auth, requireRole('partner'), validate(bulkSetAvailabilitySchema), serviceController.setRoomAvailability);

module.exports = router;
