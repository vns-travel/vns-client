const serviceService = require('../services/serviceService');
const tourService    = require('../services/tourService');
const serviceRepo    = require('../repositories/serviceRepo');
const response       = require('../utils/response');

// ---------------------------------------------------------------------------
// Error routing helper — maps well-known error messages to HTTP status codes.
// Errors that don't match fall through to the global error handler (next(err)).
// ---------------------------------------------------------------------------
function handleError(err, res, next) {
  const msg = err.message;
  if (msg.includes('not found') || msg.includes('not a tour') || msg.includes('details not found')) {
    return response.fail(res, msg, 'NOT_FOUND', 404);
  }
  if (msg.includes('not own') || msg.includes('approved')) {
    return response.fail(res, msg, 'FORBIDDEN', 403);
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
  getAllServicesManager,
  approveService,
  rejectService,
};
