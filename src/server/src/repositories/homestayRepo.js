const { query } = require('../config/db');

async function findByServiceId(serviceId) {
  const { rows } = await query('SELECT * FROM homestays WHERE service_id = $1', [serviceId]);
  return rows[0] || null;
}

async function createHomestay(data) {
  const { serviceId, checkInTime, checkOutTime, cancellationPolicy, houseRules, amenities, hostApprovalRequired } = data;
  const { rows } = await query(
    `INSERT INTO homestays (service_id, check_in_time, check_out_time, cancellation_policy, house_rules, amenities, host_approval_required)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [serviceId, checkInTime, checkOutTime, cancellationPolicy, houseRules, amenities, hostApprovalRequired || false]
  );
  return rows[0];
}

async function addRoom(data) {
  const { homestayId, roomName, maxOccupancy, sizeSqm, bedType, bedCount, privateBathroom,
          basePrice, weekendPrice, holidayPrice, totalUnits, cleaningFee, serviceFee } = data;
  const { rows } = await query(
    `INSERT INTO rooms (homestay_id, room_name, max_occupancy, size_sqm, bed_type, bed_count,
       private_bathroom, base_price, weekend_price, holiday_price, total_units, cleaning_fee, service_fee)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [homestayId, roomName, maxOccupancy, sizeSqm, bedType, bedCount, privateBathroom ?? true,
     basePrice, weekendPrice, holidayPrice, totalUnits || 1, cleaningFee || 0, serviceFee || 0]
  );
  return rows[0];
}

async function findRoomById(roomId) {
  const { rows } = await query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  return rows[0] || null;
}

async function getAvailability(roomId, checkIn, checkOut) {
  const { rows } = await query(
    `SELECT * FROM room_availability
     WHERE room_id = $1 AND date >= $2 AND date < $3
     ORDER BY date`,
    [roomId, checkIn, checkOut]
  );
  return rows;
}

async function bulkSetAvailability(roomId, rows) {
  // TODO: upsert availability rows using INSERT ... ON CONFLICT DO UPDATE
  return null;
}

/** Must be called inside a pg transaction client */
async function decrementAvailability(roomId, date, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { rows } = await db.query(
    `UPDATE room_availability
     SET available_units = available_units - 1
     WHERE room_id = $1 AND date = $2 AND available_units > 0 AND is_blocked = false
     RETURNING *`,
    [roomId, date]
  );
  return rows[0] || null;
}

async function restoreAvailability(roomId, date, client) {
  const db = client || { query: (t, p) => query(t, p) };
  await db.query(
    `UPDATE room_availability SET available_units = available_units + 1 WHERE room_id = $1 AND date = $2`,
    [roomId, date]
  );
}

module.exports = {
  findByServiceId, createHomestay, addRoom, findRoomById,
  getAvailability, bulkSetAvailability, decrementAvailability, restoreAvailability,
};
