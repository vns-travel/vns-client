const { pool } = require('../../config/db');

/**
 * Create a homestay — inserts a services row and a homestays row in a transaction.
 * Returns { homestayId, serviceId }.
 */
async function createHomestay({ partnerId, title, description, location, checkInTime, checkOutTime, cancellationPolicy, houseRules }) {
  // Doc §system-wide: partner must be verified before creating any service
  const { rows: pRows } = await pool.query(
    `SELECT verify_status FROM partner_profiles WHERE id = $1`,
    [partnerId]
  );
  if (!pRows.length || pRows[0].verify_status !== 'approved') {
    const err = new Error('Đối tác chưa được xác minh');
    err.statusCode = 403;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const svcRes = await client.query(
      `INSERT INTO services (partner_id, type, title, description, city, address, status)
       VALUES ($1, 'homestay', $2, $3, $4, $5, 'draft')
       RETURNING id`,
      [
        partnerId,
        title,
        description ?? null,
        location?.city ?? null,
        location?.address ?? null,
      ]
    );
    const serviceId = svcRes.rows[0].id;

    const hsRes = await client.query(
      `INSERT INTO homestays (service_id, check_in_time, check_out_time, cancellation_policy, house_rules)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [serviceId, checkInTime ?? null, checkOutTime ?? null, cancellationPolicy ?? null, houseRules ?? null]
    );
    const homestayId = hsRes.rows[0].id;

    await client.query('COMMIT');
    return { homestayId, serviceId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Add a room to an existing homestay.
 * Verifies the calling partner owns the homestay.
 */
async function addRoom({ partnerId, homestayId, roomName, roomType, roomDescription, maxOccupancy, roomSizeSqm, bedType, bedCount, privateBathroom, basePrice, weekendPrice, holidayPrice, roomAmenities, numberOfRooms, minNights }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id FROM homestays h JOIN services s ON s.id = h.service_id WHERE h.id = $1`,
    [homestayId]
  );
  if (!rows.length) {
    const err = new Error('Homestay không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const res = await pool.query(
    `INSERT INTO rooms (homestay_id, room_name, room_type, max_occupancy, size_sqm, bed_type,
                        bed_count, private_bathroom, base_price, weekend_price, holiday_price,
                        total_units, min_nights)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING id`,
    [
      homestayId, roomName,
      roomType ?? null,
      maxOccupancy ?? null, roomSizeSqm ?? null,
      bedType ?? null, bedCount ?? null,
      privateBathroom ?? true,
      basePrice, weekendPrice ?? basePrice, holidayPrice ?? weekendPrice ?? basePrice,
      numberOfRooms ?? 1,
      minNights ?? 1,
    ]
  );
  return { roomId: res.rows[0].id };
}

/**
 * Bulk-create room_availability rows for a date range across multiple rooms.
 * Verifies the calling partner owns the homestay.
 * Body: { startDate, endDate, rooms: [{ roomId, defaultPrice, minNights }], applyToAllDates }
 */
async function bulkAvailability({ partnerId, homestayId, startDate, endDate, rooms }) {
  const { rows: ownerRows } = await pool.query(
    `SELECT s.partner_id FROM homestays h JOIN services s ON s.id = h.service_id WHERE h.id = $1`,
    [homestayId]
  );
  if (!ownerRows.length) {
    const err = new Error('Homestay không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (ownerRows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    const err = new Error('endDate must be on or after startDate');
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();
  let totalCount = 0;
  try {
    await client.query('BEGIN');

    // Fetch total_units for all rooms up front — available_units must start at total_units,
    // not 1. Hardcoding 1 would silently break multi-unit bookings (doc §1.2).
    const { rows: roomRows } = await client.query(
      `SELECT id, total_units, min_nights FROM rooms WHERE id = ANY($1::uuid[])`,
      [rooms.map(r => r.roomId)]
    );
    const roomMeta = Object.fromEntries(roomRows.map(r => [r.id, r]));

    for (const room of rooms) {
      const meta = roomMeta[room.roomId];
      const availableUnits = meta ? meta.total_units : 1;
      // min_nights: per-room default wins unless the caller explicitly overrides per room
      const minNights = room.minNights ?? (meta ? meta.min_nights : 1) ?? 1;

      const cursor = new Date(start);
      while (cursor <= end) {
        const dateStr = cursor.toISOString().slice(0, 10);
        await client.query(
          `INSERT INTO room_availability (room_id, date, available_units, price_override, min_nights, is_blocked)
           VALUES ($1, $2, $3, $4, $5, false)
           ON CONFLICT (room_id, date) DO UPDATE
             SET available_units = EXCLUDED.available_units,
                 price_override  = EXCLUDED.price_override,
                 min_nights      = EXCLUDED.min_nights,
                 is_blocked      = false`,
          [room.roomId, dateStr, availableUnits, room.defaultPrice ?? null, minNights]
        );
        totalCount++;
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { count: totalCount };
}

/**
 * Submit a homestay for manager review (draft → pending).
 * Verifies the calling partner owns the homestay.
 */
async function submitHomestay({ partnerId, homestayId }) {
  const { rows } = await pool.query(
    `SELECT s.id AS service_id, s.partner_id, s.status
     FROM homestays h JOIN services s ON s.id = h.service_id
     WHERE h.id = $1`,
    [homestayId]
  );
  if (!rows.length) {
    const err = new Error('Homestay không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  if (rows[0].status !== 'draft') {
    const err = new Error(`Không thể gửi duyệt từ trạng thái '${rows[0].status}'`);
    err.statusCode = 400;
    throw err;
  }

  // Doc §1.5: at least 1 room type required before submission
  const { rows: roomCount } = await pool.query(
    `SELECT COUNT(*) FROM rooms WHERE homestay_id = $1`,
    [homestayId]
  );
  if (parseInt(roomCount[0].count) === 0) {
    const err = new Error('Cần ít nhất 1 loại phòng trước khi gửi duyệt');
    err.statusCode = 400;
    throw err;
  }

  // Doc §1.5: check-in time must be before check-out time
  const { rows: hsRows } = await pool.query(
    `SELECT check_in_time, check_out_time FROM homestays WHERE id = $1`,
    [homestayId]
  );
  const { check_in_time, check_out_time } = hsRows[0];
  if (check_in_time && check_out_time && check_in_time >= check_out_time) {
    const err = new Error('Giờ check-in phải trước giờ check-out');
    err.statusCode = 400;
    throw err;
  }

  await pool.query(
    `UPDATE services SET status = 'pending', updated_at = NOW() WHERE id = $1`,
    [rows[0].service_id]
  );
}

/**
 * Update property-level details on an approved (or any-status) homestay.
 * These are operational fields (house rules, check-in/out times, etc.) that a
 * partner can change at any time — unlike the service title/city which require
 * manager re-approval.
 *
 * Returns { hasActiveBookings, activeBookingCount } so the caller can surface a
 * warning when check-in/out times change while bookings are in flight.
 */
async function updateHomestayDetails({ partnerId, homestayId, checkInTime, checkOutTime, cancellationPolicy, houseRules, amenities, hostApprovalRequired }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id FROM homestays h JOIN services s ON s.id = h.service_id WHERE h.id = $1`,
    [homestayId]
  );
  if (!rows.length) {
    const err = new Error('Homestay không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  // Detect active bookings so the UI can warn the partner when check-in/out times
  // change while guests already have confirmed or pending reservations.
  const { rows: bRows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM bookings b
     JOIN booking_homestay_detail d ON d.booking_id = b.id
     JOIN rooms r ON r.id = d.room_id
     WHERE r.homestay_id = $1
       AND b.status IN ('pending', 'confirmed', 'in_progress')`,
    [homestayId]
  );
  const activeBookingCount = parseInt(bRows[0].count, 10);

  await pool.query(
    `UPDATE homestays
     SET check_in_time        = $1,
         check_out_time       = $2,
         cancellation_policy  = $3,
         house_rules          = $4,
         amenities            = $5,
         host_approval_required = $6
     WHERE id = $7`,
    [
      checkInTime ?? null,
      checkOutTime ?? null,
      cancellationPolicy ?? null,
      houseRules ?? null,
      amenities ?? [],
      hostApprovalRequired ?? false,
      homestayId,
    ]
  );

  return { hasActiveBookings: activeBookingCount > 0, activeBookingCount };
}

/**
 * Update an existing room's details.
 * Pricing changes only affect future bookings — confirmed bookings snapshot their
 * price at booking time in booking_homestay_detail, so they are never touched here.
 *
 * When total_units changes, future room_availability rows are updated so that
 * available_units reflects the new capacity (past rows are left alone to preserve
 * historical accuracy).
 */
async function updateRoom({ partnerId, homestayId, roomId, roomName, roomType, description, maxOccupancy, roomSizeSqm, bedType, bedCount, privateBathroom, basePrice, weekendPrice, holidayPrice, totalUnits, minNights, amenities }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id, r.total_units AS current_total_units
     FROM rooms r
     JOIN homestays h ON h.id = r.homestay_id
     JOIN services s ON s.id = h.service_id
     WHERE r.id = $1 AND h.id = $2`,
    [roomId, homestayId]
  );
  if (!rows.length) {
    const err = new Error('Phòng không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const currentTotalUnits = rows[0].current_total_units;
  const newTotalUnits = totalUnits ?? currentTotalUnits;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE rooms
       SET room_name        = $1,
           room_type        = $2,
           description      = $3,
           max_occupancy    = $4,
           size_sqm         = $5,
           bed_type         = $6,
           bed_count        = $7,
           private_bathroom = $8,
           base_price       = $9,
           weekend_price    = $10,
           holiday_price    = $11,
           total_units      = $12,
           min_nights       = $13,
           amenities        = $14
       WHERE id = $15`,
      [
        roomName,
        roomType ?? null,
        description ?? null,
        maxOccupancy ?? null,
        roomSizeSqm ?? null,
        bedType ?? null,
        bedCount ?? null,
        privateBathroom ?? true,
        basePrice,
        weekendPrice ?? basePrice,
        holidayPrice ?? weekendPrice ?? basePrice,
        newTotalUnits,
        minNights ?? 1,
        amenities ?? [],
        roomId,
      ]
    );

    // Propagate capacity change to future availability rows only.
    // Past rows are intentionally left unchanged — they represent what was actually
    // available on those dates and should not be retroactively altered.
    if (newTotalUnits !== currentTotalUnits) {
      await client.query(
        `UPDATE room_availability
         SET available_units = $1
         WHERE room_id = $2 AND date >= CURRENT_DATE`,
        [newTotalUnits, roomId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Toggle a room's is_active flag (active ↔ deactivated).
 * Deactivating stops new bookings from being made for that room, but does NOT
 * cancel existing confirmed bookings — those proceed normally.
 *
 * Returns { isActive, hasPendingBookings } so the caller can warn the partner
 * when deactivating a room that still has in-flight reservations.
 */
async function toggleRoomActive({ partnerId, homestayId, roomId }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id, r.is_active
     FROM rooms r
     JOIN homestays h ON h.id = r.homestay_id
     JOIN services s ON s.id = h.service_id
     WHERE r.id = $1 AND h.id = $2`,
    [roomId, homestayId]
  );
  if (!rows.length) {
    const err = new Error('Phòng không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const newIsActive = !rows[0].is_active;

  // Only check for pending bookings when deactivating — re-activating is always safe.
  let hasPendingBookings = false;
  if (!newIsActive) {
    const { rows: bRows } = await pool.query(
      `SELECT COUNT(*) AS count
       FROM bookings b
       JOIN booking_homestay_detail d ON d.booking_id = b.id
       WHERE d.room_id = $1
         AND b.status IN ('pending', 'confirmed', 'in_progress')`,
      [roomId]
    );
    hasPendingBookings = parseInt(bRows[0].count, 10) > 0;
  }

  await pool.query(
    `UPDATE rooms SET is_active = $1 WHERE id = $2`,
    [newIsActive, roomId]
  );

  return { isActive: newIsActive, hasPendingBookings };
}

/**
 * Replace images for a room (delete existing, insert new set).
 * Verifies the calling partner owns the room via the homestay → service chain.
 */
async function insertRoomImages({ partnerId, roomId, urls }) {
  const { rows } = await pool.query(
    `SELECT s.partner_id
     FROM rooms r
     JOIN homestays h ON h.id = r.homestay_id
     JOIN services s  ON s.id  = h.service_id
     WHERE r.id = $1`,
    [roomId]
  );
  if (!rows.length) {
    const err = new Error('Phòng không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Replace existing images (same UX as service_images — re-upload replaces previous set)
    await client.query(`DELETE FROM room_images WHERE room_id = $1`, [roomId]);
    for (let i = 0; i < urls.length; i++) {
      await client.query(
        `INSERT INTO room_images (room_id, url, sort_order) VALUES ($1, $2, $3)`,
        [roomId, urls[i], i]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createHomestay, addRoom, bulkAvailability, submitHomestay, updateHomestayDetails, updateRoom, toggleRoomActive, insertRoomImages };
