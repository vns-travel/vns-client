const vehicleRepo = require('../repositories/vehicleRepo');

async function createVehicle(serviceId, payload) {
  return vehicleRepo.createVehicle({ serviceId, ...payload });
}

async function getVehicle(serviceId) {
  return vehicleRepo.findByServiceId(serviceId);
}

async function getAvailability(vehicleId, date) {
  return vehicleRepo.getAvailability(vehicleId, date);
}

async function blockDate(vehicleId, date) {
  return vehicleRepo.blockDate(vehicleId, date);
}

module.exports = { createVehicle, getVehicle, getAvailability, blockDate };
