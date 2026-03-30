const homestayRepo = require('../repositories/homestayRepo');

async function createHomestay(serviceId, payload) {
  return homestayRepo.createHomestay({ serviceId, ...payload });
}

async function addRoom(homestayId, payload) {
  return homestayRepo.addRoom({ homestayId, ...payload });
}

async function getRoomAvailability(roomId, checkIn, checkOut) {
  return homestayRepo.getAvailability(roomId, checkIn, checkOut);
}

async function setAvailability(roomId, rows) {
  return homestayRepo.bulkSetAvailability(roomId, rows);
}

module.exports = { createHomestay, addRoom, getRoomAvailability, setAvailability };
