const { query } = require('../config/db');

async function create(data, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { userId, serviceId, comboId, voucherId, type, guests, specialRequests,
          originalAmount, discountAmount, totalAmount, finalAmount } = data;
  const { rows } = await db.query(
    `INSERT INTO bookings (user_id, service_id, combo_id, voucher_id, type, guests, special_requests,
       original_amount, discount_amount, total_amount, final_amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [userId, serviceId || null, comboId || null, voucherId || null, type,
     guests || null, specialRequests || null,
     originalAmount, discountAmount || 0, totalAmount, finalAmount]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findByUserId(userId) {
  const { rows } = await query(
    'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

async function findByServiceId(serviceId) {
  const { rows } = await query(
    'SELECT * FROM bookings WHERE service_id = $1 ORDER BY created_at DESC',
    [serviceId]
  );
  return rows;
}

async function updateStatus(id, status, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { rows } = await db.query(
    'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0] || null;
}

async function addHomestayDetail(data, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { bookingId, roomId, checkIn, checkOut, adults, children, cleaningFee, serviceFee } = data;
  const { rows } = await db.query(
    `INSERT INTO booking_homestay_detail (booking_id, room_id, check_in, check_out, adults, children, cleaning_fee, service_fee)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [bookingId, roomId, checkIn, checkOut, adults, children || 0, cleaningFee || 0, serviceFee || 0]
  );
  return rows[0];
}

async function addTourDetail(data, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { bookingId, scheduleId, participants, pickupLocation, pickupTime } = data;
  const { rows } = await db.query(
    `INSERT INTO booking_tour_detail (booking_id, schedule_id, participants, pickup_location, pickup_time)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [bookingId, scheduleId, participants, pickupLocation || null, pickupTime || null]
  );
  return rows[0];
}

async function addTransportDetail(data, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { bookingId, vehicleId, rentalStart, rentalEnd, pickupLocation, returnLocation, driverName, driverPhone } = data;
  const { rows } = await db.query(
    `INSERT INTO booking_transport_detail (booking_id, vehicle_id, rental_start, rental_end, pickup_location, return_location, driver_name, driver_phone)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [bookingId, vehicleId, rentalStart, rentalEnd, pickupLocation || null, returnLocation || null, driverName || null, driverPhone || null]
  );
  return rows[0];
}

module.exports = { create, findById, findByUserId, findByServiceId, updateStatus, addHomestayDetail, addTourDetail, addTransportDetail };
