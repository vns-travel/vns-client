const { query } = require('../config/db');

async function findByServiceId(serviceId) {
  const { rows } = await query('SELECT * FROM vehicles WHERE service_id = $1', [serviceId]);
  return rows[0] || null;
}

async function createVehicle(data) {
  const { serviceId, make, model, year, vehicleType, capacity, pricingModel,
          dailyRate, hourlyRate, driverIncluded, depositAmount, includedFeatures } = data;
  const { rows } = await query(
    `INSERT INTO vehicles (service_id, make, model, year, vehicle_type, capacity, pricing_model,
       daily_rate, hourly_rate, driver_included, deposit_amount, included_features)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [serviceId, make, model, year, vehicleType, capacity, pricingModel,
     dailyRate, hourlyRate, driverIncluded || false, depositAmount || 0, includedFeatures || []]
  );
  return rows[0];
}

async function findVehicleById(vehicleId) {
  const { rows } = await query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
  return rows[0] || null;
}

async function getAvailability(vehicleId, date) {
  const { rows } = await query(
    'SELECT * FROM vehicle_availability WHERE vehicle_id = $1 AND date = $2',
    [vehicleId, date]
  );
  return rows[0] || null;
}

async function blockDate(vehicleId, date) {
  await query(
    `INSERT INTO vehicle_availability (vehicle_id, date, is_blocked)
     VALUES ($1, $2, true)
     ON CONFLICT (vehicle_id, date) DO UPDATE SET is_blocked = true`,
    [vehicleId, date]
  );
}

async function unblockDate(vehicleId, date) {
  await query(
    `UPDATE vehicle_availability SET is_blocked = false WHERE vehicle_id = $1 AND date = $2`,
    [vehicleId, date]
  );
}

module.exports = { findByServiceId, createVehicle, findVehicleById, getAvailability, blockDate, unblockDate };
