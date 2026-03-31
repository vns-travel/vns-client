// All business logic for the bookings domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { randomUUID } = require('crypto');
const { pool } = require('../../config/db');
const redis = require('../../config/redis');

// ---------------------------------------------------------------------------
// Status transition maps — defines which transitions are legal per actor role.
// Terminal states (completed, cancelled, refunded) have no outgoing transitions.
// ---------------------------------------------------------------------------
const PARTNER_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['cancelled'],
};

const MANAGER_TRANSITIONS = {
  confirmed:   ['in_progress', 'refunded'],
  in_progress: ['completed'],
};

// ---------------------------------------------------------------------------
// Redis lock helpers (Redlock-lite pattern using SET NX PX + Lua CAS delete).
// All inventory writes (slots, availability, vehicle windows) must go through
// these helpers so concurrent requests are serialised without a full DB lock.
// ---------------------------------------------------------------------------

async function acquireLock(key, ttlMs = 10000) {
  const token = randomUUID();
  // SET key token NX PX ttl — returns 'OK' if acquired, null if already held
  const result = await redis.set(key, token, 'NX', 'PX', ttlMs);
  if (result !== 'OK') {
    const err = new Error('Inventory temporarily locked, please retry');
    err.statusCode = 409;
    err.code = 'LOCK_CONTENTION';
    throw err;
  }
  return token;
}

async function releaseLock(key, token) {
  // Compare-and-delete via Lua script — only releases the lock if we still own
  // it, preventing accidental release of a lock acquired by another request
  // after our TTL expired.
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(script, 1, key, token);
}

// ---------------------------------------------------------------------------
// Voucher helpers
// ---------------------------------------------------------------------------

function calcDiscount(voucher, originalAmount) {
  if (voucher.type === 'percent') {
    const raw = originalAmount * (Number(voucher.value) / 100);
    return voucher.max_discount ? Math.min(raw, Number(voucher.max_discount)) : raw;
  }
  // 'fixed'
  return Math.min(Number(voucher.value), originalAmount);
}

/**
 * Validate voucher and record its usage inside an existing pg transaction.
 * Must be called with a pg client (not pool) that has already begun a tx.
 * Returns { voucher, discountAmount } on success; throws on any violation.
 */
async function validateVoucher(client, { voucherCode, userId, serviceType, originalAmount, bookingId }) {
  // Lock the voucher row to prevent concurrent double-redemption
  const { rows } = await client.query(
    `SELECT id, type, value, min_spend, max_discount, max_uses, used_count,
            is_active, valid_from, valid_to, user_id, applicable_service_types
     FROM vouchers WHERE code = $1
     FOR UPDATE`,
    [voucherCode]
  );

  if (!rows.length) {
    const err = new Error('Mã giảm giá không tồn tại');
    err.statusCode = 422; err.code = 'VOUCHER_NOT_FOUND';
    throw err;
  }

  const v = rows[0];

  if (!v.is_active) {
    const err = new Error('Mã giảm giá không còn hiệu lực');
    err.statusCode = 422; err.code = 'VOUCHER_INACTIVE';
    throw err;
  }

  const now = new Date();
  if (now < new Date(v.valid_from) || now > new Date(v.valid_to)) {
    const err = new Error('Mã giảm giá đã hết hạn');
    err.statusCode = 422; err.code = 'VOUCHER_EXPIRED';
    throw err;
  }

  if (v.used_count >= v.max_uses) {
    const err = new Error('Mã giảm giá đã hết lượt sử dụng');
    err.statusCode = 422; err.code = 'VOUCHER_EXHAUSTED';
    throw err;
  }

  if (v.user_id && v.user_id !== userId) {
    const err = new Error('Mã giảm giá không dành cho tài khoản này');
    err.statusCode = 422; err.code = 'VOUCHER_NOT_YOURS';
    throw err;
  }

  // applicable_service_types is a TEXT[]. Empty array means applicable to all types.
  const applicable = v.applicable_service_types || [];
  if (applicable.length > 0 && !applicable.includes(serviceType)) {
    const err = new Error('Mã giảm giá không áp dụng cho loại dịch vụ này');
    err.statusCode = 422; err.code = 'VOUCHER_NOT_APPLICABLE';
    throw err;
  }

  if (Number(v.min_spend) > 0 && originalAmount < Number(v.min_spend)) {
    const err = new Error(`Giá trị đơn hàng tối thiểu để dùng mã là ${v.min_spend}`);
    err.statusCode = 422; err.code = 'VOUCHER_MIN_SPEND_NOT_MET';
    throw err;
  }

  // Check this user hasn't already used this voucher
  const usageCheck = await client.query(
    `SELECT 1 FROM voucher_usages WHERE voucher_id = $1 AND user_id = $2`,
    [v.id, userId]
  );
  if (usageCheck.rows.length) {
    const err = new Error('Bạn đã sử dụng mã giảm giá này rồi');
    err.statusCode = 422; err.code = 'VOUCHER_ALREADY_USED';
    throw err;
  }

  const discountAmount = calcDiscount(v, originalAmount);

  // Record usage and increment counter inside the same transaction
  await client.query(
    `INSERT INTO voucher_usages (voucher_id, user_id, booking_id) VALUES ($1, $2, $3)`,
    [v.id, userId, bookingId]
  );
  await client.query(
    `UPDATE vouchers SET used_count = used_count + 1 WHERE id = $1`,
    [v.id]
  );

  return { voucher: v, discountAmount };
}

// ---------------------------------------------------------------------------
// Service-type availability checks (read-only, run BEFORE acquiring the lock)
// ---------------------------------------------------------------------------

/**
 * Check a tour schedule has enough free slots.
 * Returns { schedule, originalAmount } or throws.
 */
async function checkTourAvailability({ scheduleId, participants }) {
  const { rows } = await pool.query(
    `SELECT ts.id, ts.available_slots, ts.booked_slots, ts.price,
            ts.is_active, ts.tour_date,
            s.status AS service_status, s.partner_id
     FROM tour_schedules ts
     JOIN tours t ON t.id = ts.tour_id
     JOIN services s ON s.id = t.service_id
     WHERE ts.id = $1`,
    [scheduleId]
  );

  if (!rows.length) {
    const err = new Error('Lịch tour không tồn tại'); err.statusCode = 404; throw err;
  }
  const ts = rows[0];

  if (ts.service_status !== 'approved') {
    const err = new Error('Dịch vụ chưa được duyệt');
    err.statusCode = 422; err.code = 'SERVICE_NOT_APPROVED'; throw err;
  }
  if (!ts.is_active) {
    const err = new Error('Lịch tour không còn hoạt động');
    err.statusCode = 422; err.code = 'SCHEDULE_INACTIVE'; throw err;
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (new Date(ts.tour_date) < today) {
    const err = new Error('Lịch tour đã qua');
    err.statusCode = 422; err.code = 'SCHEDULE_PAST'; throw err;
  }

  const freeSlots = ts.available_slots - ts.booked_slots;
  if (freeSlots < participants) {
    const err = new Error(`Chỉ còn ${freeSlots} chỗ trống`);
    err.statusCode = 422; err.code = 'INSUFFICIENT_SLOTS'; throw err;
  }

  return {
    schedule: ts,
    originalAmount: Number(ts.price) * participants,
  };
}

/**
 * Check a homestay room is available for the requested date range.
 * checkIn / checkOut are 'YYYY-MM-DD' strings (checkOut is exclusive — guest
 * leaves on that day, so the night of checkOut is NOT booked).
 * Returns { room, dateRows, originalAmount } or throws.
 */
async function checkHomestayAvailability({ roomId, checkIn, checkOut, adults, children }) {
  // Fetch room meta
  const roomRes = await pool.query(
    `SELECT r.id, r.max_occupancy, r.base_price, r.total_units,
            s.status AS service_status, s.partner_id
     FROM rooms r
     JOIN homestays h ON h.id = r.homestay_id
     JOIN services s ON s.id = h.service_id
     WHERE r.id = $1`,
    [roomId]
  );
  if (!roomRes.rows.length) {
    const err = new Error('Phòng không tồn tại'); err.statusCode = 404; throw err;
  }
  const room = roomRes.rows[0];

  if (room.service_status !== 'approved') {
    const err = new Error('Dịch vụ chưa được duyệt');
    err.statusCode = 422; err.code = 'SERVICE_NOT_APPROVED'; throw err;
  }

  if ((adults + children) > room.max_occupancy) {
    const err = new Error(`Phòng chỉ chứa tối đa ${room.max_occupancy} người`);
    err.statusCode = 422; err.code = 'OCCUPANCY_EXCEEDED'; throw err;
  }

  // Fetch availability rows for [checkIn, checkOut)
  const avRes = await pool.query(
    `SELECT date, available_units, price_override, min_nights, is_blocked
     FROM room_availability
     WHERE room_id = $1 AND date >= $2 AND date < $3
     ORDER BY date ASC`,
    [roomId, checkIn, checkOut]
  );

  // Verify every night in the range has a row
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.round((checkOutDate - checkInDate) / 86400000);

  if (nights <= 0) {
    const err = new Error('Ngày check-out phải sau ngày check-in');
    err.statusCode = 422; err.code = 'INVALID_DATES'; throw err;
  }

  if (avRes.rows.length < nights) {
    const err = new Error('Phòng không có lịch cho khoảng thời gian này');
    err.statusCode = 422; err.code = 'DATES_NOT_AVAILABLE'; throw err;
  }

  const maxMinNights = Math.max(...avRes.rows.map((r) => r.min_nights || 1));
  if (nights < maxMinNights) {
    const err = new Error(`Yêu cầu ở tối thiểu ${maxMinNights} đêm`);
    err.statusCode = 422; err.code = 'MIN_NIGHTS_NOT_MET'; throw err;
  }

  for (const row of avRes.rows) {
    if (row.is_blocked) {
      const err = new Error(`Phòng đã bị khóa vào ngày ${row.date}`);
      err.statusCode = 422; err.code = 'DATES_BLOCKED'; throw err;
    }
    if (row.available_units < 1) {
      const err = new Error(`Phòng đã hết chỗ vào ngày ${row.date}`);
      err.statusCode = 422; err.code = 'NO_ROOMS_AVAILABLE'; throw err;
    }
  }

  const originalAmount = avRes.rows.reduce(
    (sum, row) => sum + Number(row.price_override || room.base_price),
    0
  );

  return { room, dateRows: avRes.rows, originalAmount };
}

/**
 * Check a vehicle is available for the rental window.
 * rentalStart / rentalEnd are ISO 8601 datetime strings.
 * Returns { vehicle, calendarDates, originalAmount } or throws.
 */
async function checkCarAvailability({ vehicleId, rentalStart, rentalEnd }) {
  const vehicleRes = await pool.query(
    `SELECT v.id, v.pricing_model, v.daily_rate, v.hourly_rate,
            v.deposit_amount, v.driver_included,
            s.status AS service_status, s.partner_id
     FROM vehicles v
     JOIN services s ON s.id = v.service_id
     WHERE v.id = $1`,
    [vehicleId]
  );
  if (!vehicleRes.rows.length) {
    const err = new Error('Xe không tồn tại'); err.statusCode = 404; throw err;
  }
  const vehicle = vehicleRes.rows[0];

  if (vehicle.service_status !== 'approved') {
    const err = new Error('Dịch vụ chưa được duyệt');
    err.statusCode = 422; err.code = 'SERVICE_NOT_APPROVED'; throw err;
  }

  const startDt = new Date(rentalStart);
  const endDt = new Date(rentalEnd);
  if (endDt <= startDt) {
    const err = new Error('Thời gian trả xe phải sau thời gian nhận xe');
    err.statusCode = 422; err.code = 'INVALID_DATES'; throw err;
  }

  // Derive the calendar dates that span the rental
  const calendarDates = [];
  const cursor = new Date(startDt); cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(endDt); endDay.setHours(0, 0, 0, 0);
  while (cursor <= endDay) {
    calendarDates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  const startDate = calendarDates[0];
  const endDate = calendarDates[calendarDates.length - 1];

  const avRes = await pool.query(
    `SELECT date, available_from, available_to, is_blocked
     FROM vehicle_availability
     WHERE vehicle_id = $1 AND date BETWEEN $2 AND $3
     ORDER BY date ASC`,
    [vehicleId, startDate, endDate]
  );

  if (avRes.rows.length < calendarDates.length) {
    const err = new Error('Xe không có lịch cho khoảng thời gian này');
    err.statusCode = 422; err.code = 'DATES_NOT_AVAILABLE'; throw err;
  }

  for (const row of avRes.rows) {
    if (row.is_blocked) {
      const err = new Error(`Xe không khả dụng vào ngày ${row.date}`);
      err.statusCode = 422; err.code = 'VEHICLE_BLOCKED'; throw err;
    }
  }

  // Check start/end times fall within the availability window of first/last day
  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  const startTime = `${String(startDt.getHours()).padStart(2, '0')}:${String(startDt.getMinutes()).padStart(2, '0')}`;
  const endTime = `${String(endDt.getHours()).padStart(2, '0')}:${String(endDt.getMinutes()).padStart(2, '0')}`;
  const firstRow = avRes.rows[0];
  const lastRow = avRes.rows[avRes.rows.length - 1];

  if (
    timeToMinutes(startTime) < timeToMinutes(firstRow.available_from) ||
    timeToMinutes(startTime) > timeToMinutes(firstRow.available_to)
  ) {
    const err = new Error('Giờ nhận xe nằm ngoài khung thời gian hoạt động');
    err.statusCode = 422; err.code = 'OUTSIDE_AVAILABILITY_WINDOW'; throw err;
  }
  if (
    timeToMinutes(endTime) < timeToMinutes(lastRow.available_from) ||
    timeToMinutes(endTime) > timeToMinutes(lastRow.available_to)
  ) {
    const err = new Error('Giờ trả xe nằm ngoài khung thời gian hoạt động');
    err.statusCode = 422; err.code = 'OUTSIDE_AVAILABILITY_WINDOW'; throw err;
  }

  // Compute price
  let originalAmount;
  if (vehicle.pricing_model === 'daily') {
    const numberOfDays = calendarDates.length;
    originalAmount = Number(vehicle.daily_rate) * numberOfDays;
  } else {
    // 'hourly'
    const numberOfHours = (endDt - startDt) / 3600000;
    originalAmount = Number(vehicle.hourly_rate) * numberOfHours;
  }

  return { vehicle, calendarDates, originalAmount };
}

// ---------------------------------------------------------------------------
// Exported service functions
// ---------------------------------------------------------------------------

/**
 * Create a booking for a single service (tour, homestay, or car_rental).
 * Enforces: approved service, availability check, Redis lock, pg transaction
 * with SELECT FOR UPDATE, inventory decrement, optional voucher, payment record.
 */
async function createBooking({
  userId,
  serviceType,
  serviceId,
  guests,
  specialRequests,
  voucherCode,
  paymentMethod,
  paymentType,
  tourDetail,
  homestayDetail,
  carDetail,
}) {
  // ------------------------------------------------------------------
  // Step 1 — Pre-flight availability check (read-only, no lock yet)
  // ------------------------------------------------------------------
  let availabilityData;
  let lockKey;

  if (serviceType === 'tour') {
    availabilityData = await checkTourAvailability({
      scheduleId: tourDetail.scheduleId,
      participants: tourDetail.participants,
    });
    lockKey = `lock:tour_schedule:${tourDetail.scheduleId}`;
  } else if (serviceType === 'homestay') {
    availabilityData = await checkHomestayAvailability({
      roomId: homestayDetail.roomId,
      checkIn: homestayDetail.checkIn,
      checkOut: homestayDetail.checkOut,
      adults: homestayDetail.adults,
      children: homestayDetail.children,
    });
    lockKey = `lock:room:${homestayDetail.roomId}:${homestayDetail.checkIn}:${homestayDetail.checkOut}`;
  } else {
    // car_rental
    availabilityData = await checkCarAvailability({
      vehicleId: carDetail.vehicleId,
      rentalStart: carDetail.rentalStart,
      rentalEnd: carDetail.rentalEnd,
    });
    const startDate = carDetail.rentalStart.slice(0, 10);
    const endDate = carDetail.rentalEnd.slice(0, 10);
    lockKey = `lock:vehicle:${carDetail.vehicleId}:${startDate}:${endDate}`;
  }

  const originalAmount = availabilityData.originalAmount;

  // ------------------------------------------------------------------
  // Step 2 — Acquire Redis lock (serialise concurrent requests)
  // ------------------------------------------------------------------
  const lockToken = await acquireLock(lockKey);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ----------------------------------------------------------------
    // Step 3 — Re-check availability with SELECT FOR UPDATE (DB-level guard)
    // This is the authoritative check; the outer Redis lock only serialises
    // within a single process instance.
    // ----------------------------------------------------------------
    if (serviceType === 'tour') {
      const { rows: tsRows } = await client.query(
        `SELECT available_slots, booked_slots FROM tour_schedules WHERE id = $1 FOR UPDATE`,
        [tourDetail.scheduleId]
      );
      if ((tsRows[0].available_slots - tsRows[0].booked_slots) < tourDetail.participants) {
        const err = new Error('Hết chỗ trống'); err.statusCode = 409; err.code = 'SLOTS_GONE';
        throw err;
      }
    } else if (serviceType === 'homestay') {
      for (const dateRow of availabilityData.dateRows) {
        const dateStr = new Date(dateRow.date).toISOString().slice(0, 10);
        const { rows: avRows } = await client.query(
          `SELECT available_units, is_blocked
           FROM room_availability WHERE room_id = $1 AND date = $2 FOR UPDATE`,
          [homestayDetail.roomId, dateStr]
        );
        if (!avRows.length || avRows[0].is_blocked || avRows[0].available_units < 1) {
          const err = new Error('Phòng không còn trống'); err.statusCode = 409; err.code = 'SLOTS_GONE';
          throw err;
        }
      }
    } else {
      // car_rental
      for (const dateStr of availabilityData.calendarDates) {
        const { rows: avRows } = await client.query(
          `SELECT is_blocked FROM vehicle_availability WHERE vehicle_id = $1 AND date = $2 FOR UPDATE`,
          [carDetail.vehicleId, dateStr]
        );
        if (!avRows.length || avRows[0].is_blocked) {
          const err = new Error('Xe không còn khả dụng'); err.statusCode = 409; err.code = 'SLOTS_GONE';
          throw err;
        }
      }
    }

    // ----------------------------------------------------------------
    // Step 4 — Decrement inventory
    // ----------------------------------------------------------------
    if (serviceType === 'tour') {
      const upd = await client.query(
        `UPDATE tour_schedules
         SET booked_slots = booked_slots + $1, updated_at = NOW()
         WHERE id = $2 AND (available_slots - booked_slots) >= $1`,
        [tourDetail.participants, tourDetail.scheduleId]
      );
      if (upd.rowCount === 0) {
        const err = new Error('Hết chỗ trống'); err.statusCode = 409; err.code = 'SLOTS_GONE';
        throw err;
      }
    } else if (serviceType === 'homestay') {
      for (const dateRow of availabilityData.dateRows) {
        const dateStr = new Date(dateRow.date).toISOString().slice(0, 10);
        const upd = await client.query(
          `UPDATE room_availability
           SET available_units = available_units - 1
           WHERE room_id = $1 AND date = $2 AND available_units >= 1 AND is_blocked = false`,
          [homestayDetail.roomId, dateStr]
        );
        if (upd.rowCount === 0) {
          const err = new Error('Phòng không còn trống'); err.statusCode = 409; err.code = 'SLOTS_GONE';
          throw err;
        }
      }
    } else {
      // car_rental — mark each day as blocked
      for (const dateStr of availabilityData.calendarDates) {
        const upd = await client.query(
          `UPDATE vehicle_availability
           SET is_blocked = true
           WHERE vehicle_id = $1 AND date = $2 AND is_blocked = false`,
          [carDetail.vehicleId, dateStr]
        );
        if (upd.rowCount === 0) {
          const err = new Error('Xe không còn khả dụng'); err.statusCode = 409; err.code = 'SLOTS_GONE';
          throw err;
        }
      }
    }

    // ----------------------------------------------------------------
    // Step 5 — Voucher validation (inside tx, with FOR UPDATE on voucher row)
    // ----------------------------------------------------------------
    let discountAmount = 0;
    let voucherId = null;

    // Temporarily insert the booking row placeholder so voucher_usages FK works.
    // We will INSERT bookings below; to avoid a chicken-and-egg FK issue we handle
    // voucher_usages AFTER the booking insert (steps are reordered from the plan).

    // ----------------------------------------------------------------
    // Step 6 — Compute amounts
    // ----------------------------------------------------------------
    // Discount is calculated after we insert the booking (see step 7b below).
    // We resolve the final amounts in two passes: pre-voucher now, post-voucher after.

    // ----------------------------------------------------------------
    // Step 7a — INSERT bookings (placeholder amounts, updated after voucher)
    // ----------------------------------------------------------------
    const bookingRes = await client.query(
      `INSERT INTO bookings
         (user_id, service_id, type, status, guests, special_requests,
          original_amount, discount_amount, total_amount, final_amount)
       VALUES ($1, $2, 'service', 'pending', $3, $4, $5, 0, $5, $5)
       RETURNING id`,
      [userId, serviceId, guests || null, specialRequests || null, originalAmount]
    );
    const bookingId = bookingRes.rows[0].id;

    // ----------------------------------------------------------------
    // Step 7b — Voucher (now that bookingId exists for the FK in voucher_usages)
    // ----------------------------------------------------------------
    if (voucherCode) {
      const voucherResult = await validateVoucher(client, {
        voucherCode,
        userId,
        serviceType,
        originalAmount,
        bookingId,
      });
      discountAmount = voucherResult.discountAmount;
      voucherId = voucherResult.voucher.id;

      // Update the booking row with discount info
      const finalAmount = originalAmount - discountAmount;
      await client.query(
        `UPDATE bookings
         SET voucher_id = $1, discount_amount = $2, total_amount = $3, final_amount = $3
         WHERE id = $4`,
        [voucherId, discountAmount, finalAmount, bookingId]
      );
    }

    const finalAmount = originalAmount - discountAmount;

    // ----------------------------------------------------------------
    // Step 8 — INSERT service-type-specific detail record
    // ----------------------------------------------------------------
    if (serviceType === 'tour') {
      await client.query(
        `INSERT INTO booking_tour_detail
           (booking_id, schedule_id, participants, pickup_location, pickup_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          bookingId,
          tourDetail.scheduleId,
          tourDetail.participants,
          tourDetail.pickupLocation || null,
          tourDetail.pickupTime || null,
        ]
      );
    } else if (serviceType === 'homestay') {
      const { room } = availabilityData;
      await client.query(
        `INSERT INTO booking_homestay_detail
           (booking_id, room_id, check_in, check_out, adults, children, cleaning_fee, service_fee)
         VALUES ($1, $2, $3, $4, $5, $6, 0, 0)`,
        [
          bookingId,
          homestayDetail.roomId,
          homestayDetail.checkIn,
          homestayDetail.checkOut,
          homestayDetail.adults,
          homestayDetail.children,
        ]
      );
    } else {
      // car_rental
      await client.query(
        `INSERT INTO booking_transport_detail
           (booking_id, vehicle_id, rental_start, rental_end, pickup_location, return_location)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          bookingId,
          carDetail.vehicleId,
          carDetail.rentalStart,
          carDetail.rentalEnd,
          carDetail.pickupLocation || null,
          carDetail.returnLocation || null,
        ]
      );
    }

    // ----------------------------------------------------------------
    // Step 9 — INSERT payments
    // ----------------------------------------------------------------
    const paymentRes = await client.query(
      `INSERT INTO payments (booking_id, type, method, status, amount)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id`,
      [bookingId, paymentType, paymentMethod, finalAmount]
    );
    const paymentId = paymentRes.rows[0].id;

    // Car rental with a security deposit requires a second payment record
    let depositPaymentId = null;
    if (serviceType === 'car_rental') {
      const depositAmount = Number(availabilityData.vehicle.deposit_amount || 0);
      if (depositAmount > 0) {
        const depRes = await client.query(
          `INSERT INTO payments (booking_id, type, method, status, amount)
           VALUES ($1, 'security_deposit', $2, 'pending', $3)
           RETURNING id`,
          [bookingId, paymentMethod, depositAmount]
        );
        depositPaymentId = depRes.rows[0].id;
      }
    }

    await client.query('COMMIT');

    return {
      bookingId,
      status: 'pending',
      type: serviceType,
      originalAmount,
      discountAmount,
      totalAmount: finalAmount,
      finalAmount,
      paymentId,
      depositPaymentId,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await releaseLock(lockKey, lockToken);
  }
}

/**
 * List bookings belonging to the authenticated customer.
 * Supports optional status filter and cursor-based pagination via OFFSET/LIMIT.
 */
async function listMyBookings({ userId, status, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const params = [userId, limit, offset];
  let whereStatus = '';
  if (status) {
    params.push(status);
    whereStatus = `AND b.status = $${params.length}`;
  }

  const { rows } = await pool.query(
    `SELECT b.id AS booking_id, b.status, b.type,
            b.original_amount, b.discount_amount, b.final_amount,
            b.created_at,
            s.title AS service_title, s.city AS service_city, s.type AS service_type,
            COUNT(*) OVER() AS total_count
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     WHERE b.user_id = $1
       ${whereStatus}
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
    params
  );

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  return {
    data: rows.map((r) => ({
      bookingId: r.booking_id,
      status: r.status,
      type: r.type,
      originalAmount: Number(r.original_amount),
      discountAmount: Number(r.discount_amount),
      finalAmount: Number(r.final_amount),
      createdAt: r.created_at,
      serviceTitle: r.service_title,
      serviceCity: r.service_city,
      serviceType: r.service_type,
    })),
    meta: { page, limit, total },
  };
}

/**
 * Get the full detail of a single booking.
 * Authorization: caller must be the booking owner (customer) OR the partner
 * who owns the service, OR a manager/admin.
 */
async function getBookingDetail({ bookingId, userId, partnerId, role }) {
  const { rows } = await pool.query(
    `SELECT b.id, b.user_id, b.service_id, b.type, b.status,
            b.guests, b.special_requests,
            b.original_amount, b.discount_amount, b.total_amount, b.final_amount,
            b.created_at, b.updated_at,
            s.title AS service_title, s.city AS service_city, s.type AS service_type,
            s.partner_id,
            v.code AS voucher_code, b.discount_amount AS voucher_discount
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     LEFT JOIN vouchers v ON v.id = b.voucher_id
     WHERE b.id = $1`,
    [bookingId]
  );

  if (!rows.length) {
    const err = new Error('Booking không tồn tại'); err.statusCode = 404; throw err;
  }

  const booking = rows[0];

  const isOwner = booking.user_id === userId;
  const isServicePartner = booking.partner_id && booking.partner_id === partnerId;
  const isManagerOrAdmin = role === 'manager' || role === 'super_admin';

  if (!isOwner && !isServicePartner && !isManagerOrAdmin) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }

  // Fetch service-type-specific detail
  let detail = null;
  if (booking.service_type === 'tour') {
    const detRes = await pool.query(
      `SELECT btd.schedule_id, ts.tour_date, ts.start_time, ts.end_time,
              btd.participants, btd.pickup_location, btd.pickup_time
       FROM booking_tour_detail btd
       JOIN tour_schedules ts ON ts.id = btd.schedule_id
       WHERE btd.booking_id = $1`,
      [bookingId]
    );
    detail = detRes.rows[0] || null;
  } else if (booking.service_type === 'homestay') {
    const detRes = await pool.query(
      `SELECT bhd.room_id, r.room_name, bhd.check_in, bhd.check_out,
              bhd.adults, bhd.children, bhd.cleaning_fee, bhd.service_fee
       FROM booking_homestay_detail bhd
       JOIN rooms r ON r.id = bhd.room_id
       WHERE bhd.booking_id = $1`,
      [bookingId]
    );
    detail = detRes.rows[0] || null;
  } else if (booking.service_type === 'car_rental') {
    const detRes = await pool.query(
      `SELECT btd.vehicle_id, v.make, v.model, v.vehicle_type,
              btd.rental_start, btd.rental_end,
              btd.pickup_location, btd.return_location,
              btd.driver_name, btd.driver_phone
       FROM booking_transport_detail btd
       JOIN vehicles v ON v.id = btd.vehicle_id
       WHERE btd.booking_id = $1`,
      [bookingId]
    );
    detail = detRes.rows[0] || null;
  }

  // Fetch payments
  const payRes = await pool.query(
    `SELECT id, type, method, status, amount, paid_at
     FROM payments WHERE booking_id = $1 ORDER BY created_at ASC`,
    [bookingId]
  );

  return {
    bookingId: booking.id,
    status: booking.status,
    type: booking.type,
    guests: booking.guests,
    specialRequests: booking.special_requests,
    originalAmount: Number(booking.original_amount),
    discountAmount: Number(booking.discount_amount),
    totalAmount: Number(booking.total_amount),
    finalAmount: Number(booking.final_amount),
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
    service: {
      id: booking.service_id,
      title: booking.service_title,
      city: booking.service_city,
      type: booking.service_type,
    },
    detail,
    payments: payRes.rows.map((p) => ({
      paymentId: p.id,
      type: p.type,
      method: p.method,
      status: p.status,
      amount: Number(p.amount),
      paidAt: p.paid_at,
    })),
    voucher: booking.voucher_code
      ? { code: booking.voucher_code, discountAmount: Number(booking.voucher_discount) }
      : null,
  };
}

/**
 * List all bookings across the partner's services.
 * Supports optional filters: status, serviceId. Paginated.
 */
async function listPartnerBookings({ partnerId, status, serviceId, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const params = [partnerId, limit, offset];
  const filters = [];

  if (status) {
    params.push(status);
    filters.push(`b.status = $${params.length}`);
  }
  if (serviceId) {
    params.push(serviceId);
    filters.push(`b.service_id = $${params.length}`);
  }

  const whereExtra = filters.length ? `AND ${filters.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT b.id AS booking_id, b.status, b.type,
            b.guests, b.final_amount, b.created_at, b.updated_at,
            s.id AS service_id, s.title AS service_title, s.type AS service_type,
            u.full_name AS customer_name, u.email AS customer_email,
            COUNT(*) OVER() AS total_count
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     JOIN users u ON u.id = b.user_id
     WHERE s.partner_id = $1
       ${whereExtra}
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
    params
  );

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  return {
    data: rows.map((r) => ({
      bookingId: r.booking_id,
      status: r.status,
      type: r.type,
      guests: r.guests,
      finalAmount: Number(r.final_amount),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      service: { id: r.service_id, title: r.service_title, type: r.service_type },
      customer: { name: r.customer_name, email: r.customer_email },
    })),
    meta: { page, limit, total },
  };
}

/**
 * Transition a booking's status.
 * actorRole determines which transition map is applied.
 * Partners can only operate on bookings for their own services.
 */
async function transitionStatus({ bookingId, newStatus, actorRole, actorPartnerId }) {
  const { rows } = await pool.query(
    `SELECT b.id, b.status, s.partner_id
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     WHERE b.id = $1`,
    [bookingId]
  );

  if (!rows.length) {
    const err = new Error('Booking không tồn tại'); err.statusCode = 404; throw err;
  }

  const booking = rows[0];

  if (actorRole === 'partner' && booking.partner_id !== actorPartnerId) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }

  const map = actorRole === 'partner' ? PARTNER_TRANSITIONS : MANAGER_TRANSITIONS;
  const allowed = map[booking.status] || [];

  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `Không thể chuyển trạng thái từ '${booking.status}' sang '${newStatus}'`
    );
    err.statusCode = 422; err.code = 'INVALID_TRANSITION';
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2`,
      [newStatus, bookingId]
    );

    // When a booking is refunded, mark the associated paid payment(s) as refunded
    if (newStatus === 'refunded') {
      await client.query(
        `UPDATE payments SET status = 'refunded' WHERE booking_id = $1 AND status = 'paid'`,
        [bookingId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { bookingId, status: newStatus };
}

// ---------------------------------------------------------------------------
// Customer cancellation
// ---------------------------------------------------------------------------

/**
 * Cancel a booking on behalf of the authenticated customer.
 *
 * Side effects (all inside one pg transaction):
 *  1. booking status → 'cancelled'
 *  2. inventory restored (tour slots / homestay units / vehicle dates)
 *  3. voucher usage removed so the code can be reused
 *  4. if a paid payment exists → INSERT refunds row with calculated amount
 *
 * Returns { bookingId, status: 'cancelled', refundRequest: { id, requestedAmount } | null }
 */
async function cancelBooking({ bookingId, userId, reason, evidenceUrls }) {
  const { calculateRefundAmount } = require('../refunds/refunds.service');

  // ------------------------------------------------------------------
  // Step 1 — Fetch booking context in a single query
  // Joins all three service-type detail tables so we can restore
  // inventory and determine the service start datetime without a
  // second round-trip after the transaction begins.
  // ------------------------------------------------------------------
  const contextRes = await pool.query(
    `SELECT
       b.id, b.status, b.user_id, b.service_id, b.voucher_id,
       b.final_amount,
       s.type          AS service_type,
       s.cancellation_policy,
       -- tour
       td.schedule_id,
       td.participants,
       ts.tour_date,
       ts.start_time   AS tour_start_time,
       -- homestay
       hd.room_id,
       hd.check_in,
       hd.check_out,
       -- car_rental
       btd.vehicle_id,
       btd.rental_start,
       btd.rental_end
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     LEFT JOIN booking_tour_detail td     ON td.booking_id  = b.id
     LEFT JOIN tour_schedules ts          ON ts.id          = td.schedule_id
     LEFT JOIN booking_homestay_detail hd ON hd.booking_id  = b.id
     LEFT JOIN booking_transport_detail btd ON btd.booking_id = b.id
     WHERE b.id = $1`,
    [bookingId]
  );

  if (!contextRes.rows.length) {
    const err = new Error('Booking không tồn tại'); err.statusCode = 404; throw err;
  }

  const ctx = contextRes.rows[0];

  // ------------------------------------------------------------------
  // Step 2 — Ownership check
  // ------------------------------------------------------------------
  if (ctx.user_id !== userId) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }

  // ------------------------------------------------------------------
  // Step 3 — State guard
  // Only pending and confirmed bookings may be cancelled by the customer.
  // ------------------------------------------------------------------
  if (!['pending', 'confirmed'].includes(ctx.status)) {
    const err = new Error(
      `Không thể huỷ booking ở trạng thái '${ctx.status}'`
    );
    err.statusCode = 422; err.code = 'INVALID_TRANSITION';
    throw err;
  }

  // ------------------------------------------------------------------
  // Step 4 — Derive the service start datetime for refund calculation.
  // This is determined from the service-type-specific detail row.
  // ------------------------------------------------------------------
  let serviceDatetime;
  if (ctx.service_type === 'tour') {
    // Combine tour_date (DATE) with start_time (TIME) into a JS Date
    serviceDatetime = new Date(`${new Date(ctx.tour_date).toISOString().slice(0, 10)}T${ctx.tour_start_time || '00:00:00'}`);
  } else if (ctx.service_type === 'homestay') {
    serviceDatetime = new Date(ctx.check_in);
  } else {
    // car_rental — rental_start is a TIMESTAMPTZ
    serviceDatetime = new Date(ctx.rental_start);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ----------------------------------------------------------------
    // Step 5 — Update booking status with an optimistic check.
    // The AND status IN (...) guard ensures that a concurrent cancel
    // request (race condition) results in 0 rows updated, not a
    // silent double-cancel.
    // ----------------------------------------------------------------
    const upd = await client.query(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND status IN ('pending', 'confirmed')`,
      [bookingId]
    );

    if (upd.rowCount === 0) {
      const err = new Error('Booking đã bị huỷ hoặc trạng thái đã thay đổi');
      err.statusCode = 409; err.code = 'ALREADY_CANCELLED';
      throw err;
    }

    // ----------------------------------------------------------------
    // Step 6 — Restore inventory (reverse of createBooking decrements)
    // ----------------------------------------------------------------
    if (ctx.service_type === 'tour') {
      await client.query(
        `UPDATE tour_schedules
         SET booked_slots = GREATEST(0, booked_slots - $1), updated_at = NOW()
         WHERE id = $2`,
        [ctx.participants, ctx.schedule_id]
      );
    } else if (ctx.service_type === 'homestay') {
      // Restore one unit per night in the [checkIn, checkOut) range
      const checkInDate  = new Date(ctx.check_in);
      const checkOutDate = new Date(ctx.check_out);
      for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
        await client.query(
          `UPDATE room_availability
           SET available_units = available_units + 1
           WHERE room_id = $1 AND date = $2`,
          [ctx.room_id, d.toISOString().slice(0, 10)]
        );
      }
    } else {
      // car_rental — unblock each calendar day of the rental window
      const startDay = new Date(new Date(ctx.rental_start).toISOString().slice(0, 10));
      const endDay   = new Date(new Date(ctx.rental_end).toISOString().slice(0, 10));
      for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
        await client.query(
          `UPDATE vehicle_availability
           SET is_blocked = false
           WHERE vehicle_id = $1 AND date = $2`,
          [ctx.vehicle_id, d.toISOString().slice(0, 10)]
        );
      }
    }

    // ----------------------------------------------------------------
    // Step 7 — Restore voucher if one was applied.
    // Removing the usage record frees the code for re-use; decrementing
    // used_count keeps the counter consistent. GREATEST(0, ...) prevents
    // a negative count if a data inconsistency already exists.
    // ----------------------------------------------------------------
    if (ctx.voucher_id) {
      await client.query(
        `DELETE FROM voucher_usages WHERE booking_id = $1`,
        [bookingId]
      );
      await client.query(
        `UPDATE vouchers
         SET used_count = GREATEST(0, used_count - 1)
         WHERE id = $1`,
        [ctx.voucher_id]
      );
    }

    // ----------------------------------------------------------------
    // Step 8 — Create refund request if a paid payment exists.
    // Only confirmed bookings will have a paid payment; pending bookings
    // never reach the payment gateway so this block is effectively a
    // no-op for them.
    // ----------------------------------------------------------------
    let refundRequest = null;

    const paidRes = await client.query(
      `SELECT id, amount FROM payments
       WHERE booking_id = $1 AND status = 'paid'
       ORDER BY created_at DESC`,
      [bookingId]
    );

    if (paidRes.rows.length > 0) {
      // Sum all paid amounts (handles deposit + balance split payments)
      const totalPaid = paidRes.rows.reduce((sum, p) => sum + Number(p.amount), 0);
      // Use the most recently paid payment row for the FK reference
      const primaryPaymentId = paidRes.rows[0].id;

      const refundAmount = calculateRefundAmount(
        totalPaid,
        ctx.cancellation_policy,
        serviceDatetime,
        new Date()
      );

      if (refundAmount > 0) {
        const refundRes = await client.query(
          `INSERT INTO refunds
             (booking_id, payment_id, reason, evidence_urls, requested_amount)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            bookingId,
            primaryPaymentId,
            reason || null,
            evidenceUrls && evidenceUrls.length > 0 ? evidenceUrls : null,
            refundAmount,
          ]
        );
        refundRequest = { id: refundRes.rows[0].id, requestedAmount: refundAmount };
      }
    }

    await client.query('COMMIT');

    return { bookingId, status: 'cancelled', refundRequest };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createBooking,
  listMyBookings,
  getBookingDetail,
  listPartnerBookings,
  transitionStatus,
  cancelBooking,
};
