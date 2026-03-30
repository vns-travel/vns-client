const serviceService  = require('../services/serviceService');
const tourService     = require('../services/tourService');
const homestayService = require('../services/homestayService');
const serviceRepo     = require('../repositories/serviceRepo');
const response        = require('../utils/response');

// ---------------------------------------------------------------------------
// Error routing helper — maps well-known error messages to HTTP status codes.
// Errors that don't match fall through to the global error handler (next(err)).
// ---------------------------------------------------------------------------
function handleError(err, res, next) {
  const msg  = err.message;
  const low  = msg.toLowerCase();
  if (low.includes('not found') || low.includes('not a tour') || low.includes('not a homestay') || low.includes('details not found')) {
    return response.fail(res, msg, 'NOT_FOUND', 404);
  }
  if (low.includes('not own') || low.includes('does not belong') || low.includes('approved')) {
    return response.fail(res, msg, 'FORBIDDEN', 403);
  }
  if (low.includes('already added') || low.includes('past dates') || low.includes('check-out must be')) {
    return response.fail(res, msg, 'VALIDATION_ERROR', 400);
  }
  next(err);
}

// ---------------------------------------------------------------------------
// Public catalog
// ---------------------------------------------------------------------------
async function getPublicCatalog(req, res, next) {
  try {
    const { city, serviceType, limit, offset } = req.query;
    const result = await serviceService.getPublicCatalog({
      city,
      serviceType,
      limit:  limit  ? parseInt(limit,  10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function getServiceById(req, res, next) {
  try {
    const result = await serviceService.getServiceById(req.params.serviceId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

// ---------------------------------------------------------------------------
// Partner: service lifecycle
// ---------------------------------------------------------------------------
async function createService(req, res, next) {
  try {
    const result = await serviceService.createService(req.user.userId, req.body);
    return response.success(res, result, null, 201);
  } catch (err) { handleError(err, res, next); }
}

async function getPartnerServices(req, res, next) {
  try {
    const { city, serviceType, status, limit, offset } = req.query;
    const result = await serviceService.getPartnerServices(req.user.userId, {
      city,
      serviceType,
      status,
      limit:  limit  ? parseInt(limit,  10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function submitForReview(req, res, next) {
  try {
    const result = await serviceService.submitForReview(req.params.serviceId, req.user.userId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

// ---------------------------------------------------------------------------
// Partner: tour sub-resources
// ---------------------------------------------------------------------------
async function addTourDetails(req, res, next) {
  try {
    const result = await tourService.addTourDetails(req.params.serviceId, req.user.userId, req.body);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function setItinerary(req, res, next) {
  try {
    const result = await tourService.setItinerary(req.params.serviceId, req.user.userId, req.body.itinerary);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function addSchedules(req, res, next) {
  try {
    const result = await tourService.addSchedules(req.params.serviceId, req.user.userId, req.body.schedules);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function getTourFull(req, res, next) {
  try {
    const result = await tourService.getTourFull(req.params.serviceId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

// ---------------------------------------------------------------------------
// Partner: homestay sub-resources
// ---------------------------------------------------------------------------
async function addHomestayDetails(req, res, next) {
  try {
    const result = await homestayService.addHomestayDetails(req.params.serviceId, req.user.userId, req.body);
    return response.success(res, result, null, 201);
  } catch (err) { handleError(err, res, next); }
}

async function addRoom(req, res, next) {
  try {
    const result = await homestayService.addRoom(req.params.serviceId, req.user.userId, req.body);
    return response.success(res, result, null, 201);
  } catch (err) { handleError(err, res, next); }
}

async function updateRoom(req, res, next) {
  try {
    const result = await homestayService.updateRoom(req.params.serviceId, req.user.userId, req.params.roomId, req.body);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function setRoomAvailability(req, res, next) {
  try {
    const result = await homestayService.setRoomAvailability(req.params.serviceId, req.user.userId, req.params.roomId, req.body.dates);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

// ---------------------------------------------------------------------------
// Public: homestay catalog reads
// ---------------------------------------------------------------------------
async function getHomestayFull(req, res, next) {
  try {
    const result = await homestayService.getHomestayFull(req.params.serviceId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function getRooms(req, res, next) {
  try {
    const result = await homestayService.getRooms(req.params.serviceId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function getRoomAvailability(req, res, next) {
  try {
    const { checkIn, checkOut } = req.query;
    const result = await homestayService.getRoomAvailability(
      req.params.serviceId,
      req.params.roomId,
      checkIn,
      checkOut
    );
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

// ---------------------------------------------------------------------------
// Manager: review queue
// ---------------------------------------------------------------------------
async function getAllServicesManager(req, res, next) {
  try {
    const { status, city, serviceType, limit, offset } = req.query;
    // Call repo directly — no business-logic transformation needed for the manager list view.
    const services = await serviceRepo.findAll({
      status,
      city,
      serviceType,
      limit:  limit  ? parseInt(limit,  10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    return response.success(res, { services });
  } catch (err) { handleError(err, res, next); }
}

async function approveService(req, res, next) {
  try {
    const result = await serviceService.approveService(req.params.serviceId, req.user.userId);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

async function rejectService(req, res, next) {
  try {
    const result = await serviceService.rejectService(req.params.serviceId, req.user.userId, req.body.reason);
    return response.success(res, result);
  } catch (err) { handleError(err, res, next); }
}

module.exports = {
  getPublicCatalog,
  getServiceById,
  createService,
  getPartnerServices,
  submitForReview,
  addTourDetails,
  setItinerary,
  addSchedules,
  getTourFull,
  addHomestayDetails,
  addRoom,
  updateRoom,
  setRoomAvailability,
  getHomestayFull,
  getRooms,
  getRoomAvailability,
  getAllServicesManager,
  approveService,
  rejectService,
};
