const { query, pool } = require('../config/db');

async function findByServiceId(serviceId) {
  const { rows } = await query(
    'SELECT * FROM homestays WHERE service_id = $1 LIMIT 1',
    [serviceId]
  );
  return rows[0] || null;
}

async function createHomestay({ serviceId, checkInTime, checkOutTime, cancellationPolicy, houseRules, amenities, hostApprovalRequired }) {
  const { rows } = await query(
    `INSERT INTO homestays
       (id, service_id, check_in_time, check_out_time, cancellation_policy, house_rules, amenities, host_approval_required)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [serviceId, checkInTime, checkOutTime, cancellationPolicy || null, houseRules || null, amenities || null, hostApprovalRequired ?? false]
  );
  return rows[0];
}

async function addRoom(homestayId, roomData) {
  const {
    roomName, maxOccupancy, sizeSqm, bedType, bedCount,
    privateBathroom, basePrice, weekendPrice, holidayPrice,
    totalUnits, cleaningFee, serviceFee,
  } = roomData;

  const { rows } = await query(
    `INSERT INTO rooms
       (id, homestay_id, room_name, max_occupancy, size_sqm, bed_type, bed_count,
        private_bathroom, base_price, weekend_price, holiday_price, total_units,
        cleaning_fee, service_fee)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      homestayId, roomName, maxOccupancy, sizeSqm || null, bedType || null,
      bedCount ?? 1, privateBathroom ?? true, basePrice,
      weekendPrice || null, holidayPrice || null, totalUnits ?? 1,
      cleaningFee ?? 0, serviceFee ?? 0,
    ]
  );
  return rows[0];
}

async function updateRoom(roomId, fields) {
  // Map camelCase field names (from Zod schema) to snake_case DB column names.
  const COLUMN_MAP = {
    roomName:        'room_name',
    maxOccupancy:    'max_occupancy',
    sizeSqm:         'size_sqm',
    bedType:         'bed_type',
    bedCount:        'bed_count',
    privateBathroom: 'private_bathroom',
    basePrice:       'base_price',
    weekendPrice:    'weekend_price',
    holidayPrice:    'holiday_price',
    totalUnits:      'total_units',
    cleaningFee:     'cleaning_fee',
    serviceFee:      'service_fee',
  };

  const entries = Object.entries(fields)
    .filter(([key, val]) => COLUMN_MAP[key] !== undefined && val !== undefined)
    .map(([key, val]) => [COLUMN_MAP[key], val]);

  if (entries.length === 0) return findRoomById(roomId);

  const setClauses = entries.map(([col], i) => `${col} = $${i + 1}`);
  const values     = entries.map(([, val]) => val);
  values.push(roomId);

  const { rows } = await query(
    `UPDATE rooms SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function getRooms(homestayId) {
  const { rows } = await query(
    'SELECT * FROM rooms WHERE homestay_id = $1 ORDER BY room_name ASC',
    [homestayId]
  );
  return rows;
}

async function findRoomById(roomId) {
  // JOIN homestays so callers can verify ownership via service_id without a second query.
  const { rows } = await query(
    `SELECT r.*, h.service_id
     FROM   rooms r
     JOIN   homestays h ON h.id = r.homestay_id
     WHERE  r.id = $1 LIMIT 1`,
    [roomId]
  );
  return rows[0] || null;
}

async function bulkSetAvailability(roomId, dates) {
  // Use unnest() to upsert all rows in a single round-trip instead of N queries.
  // ON CONFLICT (room_id, date) ensures idempotent re-runs (check 7: upsert, not duplicate).
  const dateArr           = dates.map(d => d.date);
  const availableUnitsArr = dates.map(d => d.availableUnits);
  const priceOverrideArr  = dates.map(d => d.priceOverride ?? null);
  const minNightsArr      = dates.map(d => d.minNights ?? 1);
  const isBlockedArr      = dates.map(d => d.isBlocked ?? false);

  const { rows } = await query(
    `INSERT INTO room_availability (id, room_id, date, available_units, price_override, min_nights, is_blocked)
     SELECT gen_random_uuid(), $1, unnest($2::date[]), unnest($3::int[]),
            unnest($4::numeric[]), unnest($5::int[]), unnest($6::bool[])
     ON CONFLICT (room_id, date) DO UPDATE SET
       available_units = EXCLUDED.available_units,
       price_override  = EXCLUDED.price_override,
       min_nights      = EXCLUDED.min_nights,
       is_blocked      = EXCLUDED.is_blocked
     RETURNING *`,
    [roomId, dateArr, availableUnitsArr, priceOverrideArr, minNightsArr, isBlockedArr]
  );
  return rows;
}

async function getAvailability(roomId, checkIn, checkOut) {
  const { rows } = await query(
    `SELECT * FROM room_availability
     WHERE room_id = $1
       AND date >= $2::date
       AND date < $3::date
       AND is_blocked = false
     ORDER BY date ASC`,
    [roomId, checkIn, checkOut]
  );
  return rows;
}

async function getPriceForDateRange(roomId, checkIn, checkOut) {
  // COALESCE falls back to room.base_price when no override is set for a specific date.
  const { rows } = await query(
    `SELECT date,
            COALESCE(price_override, (SELECT base_price FROM rooms WHERE id = $1)) AS price_per_night,
            available_units,
            min_nights
     FROM   room_availability
     WHERE  room_id = $1
       AND  date >= $2::date
       AND  date <  $3::date
       AND  is_blocked = false
     ORDER BY date ASC`,
    [roomId, checkIn, checkOut]
  );
  return rows;
}

/**
 * Decrement available_units for every night in [checkIn, checkOut).
 * Must be called inside a pg transaction when part of a booking flow.
 * Throws if any night is unavailable — callers must ROLLBACK on error.
 */
async function decrementAvailability(roomId, checkIn, checkOut, client) {
  const runner = client
    ? (t, p) => client.query(t, p)
    : query;

  const { rows } = await runner(
    `UPDATE room_availability
     SET available_units = available_units - 1
     WHERE room_id = $1
       AND date >= $2::date
       AND date <  $3::date
       AND available_units > 0
     RETURNING date`,
    [roomId, checkIn, checkOut]
  );

  // Compute expected nights to detect partial availability failures.
  const msPerDay       = 86400000;
  const expectedNights = Math.round((new Date(checkOut) - new Date(checkIn)) / msPerDay);

  if (rows.length < expectedNights) {
    throw new Error('Room not available for all selected dates');
  }
  return rows;
}

/** Reverse of decrementAvailability — used in cancellation and payment failure flows. */
async function restoreAvailability(roomId, checkIn, checkOut, client) {
  const runner = client
    ? (t, p) => client.query(t, p)
    : query;

  await runner(
    `UPDATE room_availability
     SET available_units = available_units + 1
     WHERE room_id = $1
       AND date >= $2::date
       AND date <  $3::date`,
    [roomId, checkIn, checkOut]
  );
}

module.exports = {
  findByServiceId,
  createHomestay,
  addRoom,
  updateRoom,
  getRooms,
  findRoomById,
  bulkSetAvailability,
  getAvailability,
  getPriceForDateRange,
  decrementAvailability,
  restoreAvailability,
};
