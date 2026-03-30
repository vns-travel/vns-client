const tourRepo = require('../repositories/tourRepo');

async function createTour(serviceId, payload) {
  // TODO: validate service belongs to partner + is correct type
  return tourRepo.createTour({ serviceId, ...payload });
}

async function addSchedule(tourId, payload) {
  return tourRepo.addSchedule({ tourId, ...payload });
}

async function addItinerary(tourId, payload) {
  return tourRepo.addItinerary({ tourId, ...payload });
}

async function getTour(serviceId) {
  return tourRepo.findByServiceId(serviceId);
}

module.exports = { createTour, addSchedule, addItinerary, getTour };
