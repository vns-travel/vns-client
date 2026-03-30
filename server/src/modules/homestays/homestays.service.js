const { pool } = require('../../config/db');

/**
 * Create a homestay — inserts a services row and a homestays row in a transaction.
 * Returns { homestayId, serviceId }.
 */
async function createHomestay({ partnerId, title, description, location, checkInTime, checkOutTime, cancellationPolicy, houseRules }) {
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
async function addRoom({ partnerId, homestayId, roomName, roomDescription, maxOccupancy, roomSizeSqm, bedType, bedCount, privateBathroom, basePrice, weekendPrice, holidayPrice, roomAmenities, numberOfRooms }) {
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
    `INSERT INTO rooms (homestay_id, room_name, max_occupancy, size_sqm, bed_type, bed_count,
                        private_bathroom, base_price, weekend_price, holiday_price, total_units)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id`,
    [
      homestayId, roomName,
      maxOccupancy ?? null, roomSizeSqm ?? null,
      bedType ?? null, bedCount ?? null,
      privateBathroom ?? true,
      basePrice, weekendPrice ?? basePrice, holidayPrice ?? weekendPrice ?? basePrice,
      numberOfRooms ?? 1,
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
    for (const room of rooms) {
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
          [room.roomId, dateStr, 1, room.defaultPrice ?? null, room.minNights ?? 1]
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

  await pool.query(
    `UPDATE services SET status = 'pending', updated_at = NOW() WHERE id = $1`,
    [rows[0].service_id]
  );
}

module.exports = { createHomestay, addRoom, bulkAvailability, submitHomestay };
