const serviceRepo  = require('../repositories/serviceRepo');
const partnerRepo  = require('../repositories/partnerRepo');
const homestayRepo = require('../repositories/homestayRepo');

/**
 * Shared ownership + type guard used by every mutating homestay endpoint.
 * Returns { partner, service } so callers don't repeat these lookups.
 */
async function _verifyHomestayOwnership(serviceId, userId) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner not found');

  const owned = await serviceRepo.verifyOwnership(serviceId, partner.id);
  if (!owned) throw new Error('You do not own this service');

  const service = await serviceRepo.findById(serviceId);
  if (service.type !== 'homestay') throw new Error('Service is not a homestay');

  return { partner, service };
}

async function addHomestayDetails(serviceId, userId, payload) {
  await _verifyHomestayOwnership(serviceId, userId);

  // Prevent double-creation — the homestays table has a UNIQUE constraint on service_id
  // but we give a clear error message rather than letting the DB throw a cryptic violation.
  const existing = await homestayRepo.findByServiceId(serviceId);
  if (existing) throw new Error('Homestay details already added');

  const homestay = await homestayRepo.createHomestay({ serviceId, ...payload });
  return { homestay };
}

async function addRoom(serviceId, userId, roomData) {
  await _verifyHomestayOwnership(serviceId, userId);

  const homestay = await homestayRepo.findByServiceId(serviceId);
  if (!homestay) throw new Error('Add homestay details first');

  const room = await homestayRepo.addRoom(homestay.id, roomData);
  return { room };
}

async function updateRoom(serviceId, userId, roomId, fields) {
  await _verifyHomestayOwnership(serviceId, userId);

  const room = await homestayRepo.findRoomById(roomId);
  if (!room) throw new Error('Room not found');

  // Verify the room actually belongs to this service, not another partner's homestay.
  if (room.service_id !== serviceId) {
    throw new Error('Room does not belong to this service');
  }

  const updated = await homestayRepo.updateRoom(roomId, fields);
  return { room: updated };
}

async function setRoomAvailability(serviceId, userId, roomId, dates) {
  await _verifyHomestayOwnership(serviceId, userId);

  const room = await homestayRepo.findRoomById(roomId);
  if (!room) throw new Error('Room not found');

  if (room.service_id !== serviceId) {
    throw new Error('Room does not belong to this service');
  }

  const today    = new Date().toISOString().split('T')[0];
  const pastDates = dates.filter(d => d.date < today);
  if (pastDates.length > 0) throw new Error('Cannot set availability for past dates');

  await homestayRepo.bulkSetAvailability(roomId, dates);
  return { message: 'Availability updated', count: dates.length };
}

async function getRooms(serviceId) {
  const homestay = await homestayRepo.findByServiceId(serviceId);
  if (!homestay) throw new Error('Homestay not found');

  const rooms = await homestayRepo.getRooms(homestay.id);
  return { rooms };
}

async function getHomestayFull(serviceId) {
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service not found');

  const homestay = await homestayRepo.findByServiceId(serviceId);
  if (!homestay) throw new Error('Homestay details not found');

  const rooms = await homestayRepo.getRooms(homestay.id);
  return { service, homestay, rooms };
}

async function getRoomAvailability(serviceId, roomId, checkIn, checkOut) {
  const homestay = await homestayRepo.findByServiceId(serviceId);
  if (!homestay) throw new Error('Homestay not found');

  const room = await homestayRepo.findRoomById(roomId);
  if (!room) throw new Error('Room not found');

  if (room.service_id !== serviceId) {
    throw new Error('Room does not belong to this service');
  }

  if (checkIn >= checkOut) throw new Error('Check-out must be after check-in');

  const rows = await homestayRepo.getPriceForDateRange(roomId, checkIn, checkOut);

  const nightlyTotal = rows.reduce((sum, row) => sum + Number(row.price_per_night), 0);
  const totalPrice   = nightlyTotal + Number(room.cleaning_fee) + Number(room.service_fee);

  return {
    nights:       rows.length,
    breakdown:    rows,      // one row per night with date and price_per_night
    nightlyTotal,
    cleaningFee:  room.cleaning_fee,
    serviceFee:   room.service_fee,
    totalPrice,
  };
}

module.exports = {
  addHomestayDetails,
  addRoom,
  updateRoom,
  setRoomAvailability,
  getRooms,
  getHomestayFull,
  getRoomAvailability,
};
