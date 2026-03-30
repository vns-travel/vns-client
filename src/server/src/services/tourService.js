const serviceRepo = require('../repositories/serviceRepo');
const partnerRepo = require('../repositories/partnerRepo');
const tourRepo    = require('../repositories/tourRepo');

/**
 * Shared ownership + type guard used by every mutating tour endpoint.
 * Returns { partner, service, tour } so callers don't repeat these lookups.
 */
async function _verifyTourOwnership(serviceId, userId) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  const owned = await serviceRepo.verifyOwnership(serviceId, partner.id);
  if (!owned) throw new Error('You do not own this service');

  const service = await serviceRepo.findById(serviceId);
  if (service.type !== 'tour') throw new Error('Service is not a tour');

  const tour = await tourRepo.findByServiceId(serviceId);
  return { partner, service, tour };
}

async function addTourDetails(serviceId, userId, payload) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  const owned = await serviceRepo.verifyOwnership(serviceId, partner.id);
  if (!owned) throw new Error('You do not own this service');

  const service = await serviceRepo.findById(serviceId);
  if (service.type !== 'tour') throw new Error('Service is not a tour');

  // Prevent double-creation of the tour detail record.
  const existing = await tourRepo.findByServiceId(serviceId);
  if (existing) throw new Error('Tour details already added');

  const tour = await tourRepo.createTour({ serviceId, ...payload });
  return { tour };
}

async function setItinerary(serviceId, userId, itinerary) {
  const { tour } = await _verifyTourOwnership(serviceId, userId);
  if (!tour) throw new Error('Tour details not found — add tour details first');

  const steps = await tourRepo.replaceItinerary(tour.id, itinerary);
  return { itinerary: steps };
}

async function addSchedules(serviceId, userId, schedules) {
  const { tour } = await _verifyTourOwnership(serviceId, userId);
  if (!tour) throw new Error('Tour details not found — add tour details first');

  // Reject past dates early — a schedule in the past can never be booked.
  const today = new Date().toISOString().split('T')[0];
  const pastDates = schedules.filter(s => s.tourDate <= today);
  if (pastDates.length > 0) throw new Error('Schedule dates must be in the future');

  const inserted = await tourRepo.addSchedules(tour.id, schedules);
  return { schedules: inserted, count: inserted.length };
}

async function getTourFull(serviceId) {
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service not found');

  const tour = await tourRepo.findByServiceId(serviceId);
  if (!tour) throw new Error('Tour details not found');

  const today = new Date().toISOString().split('T')[0];
  const [itinerary, schedules] = await Promise.all([
    tourRepo.getItinerary(tour.id),
    tourRepo.getSchedules(tour.id, { fromDate: today, activeOnly: true }),
  ]);

  return { service, tour, itinerary, schedules };
}

module.exports = { addTourDetails, setItinerary, addSchedules, getTourFull };
