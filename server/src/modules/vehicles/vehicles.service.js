// Business logic for the vehicles domain.
// Repositories return plain objects; HTTP errors are signalled via Error.statusCode.

const { pool } = require('../../config/db');

/**
 * Add a vehicle to an existing car-rental service (fleet).
 * Verifies the calling partner owns the service before inserting.
 */
async function createVehicle({ partnerId, serviceId, make, model, year, vehicleType, capacity,
                                pricingModel, dailyRate, hourlyRate, driverIncluded,
                                depositAmount, includedFeatures }) {
  // Ownership check
  const { rows: svcRows } = await pool.query(
    `SELECT partner_id FROM services WHERE id = $1`,
    [serviceId]
  );
  if (!svcRows.length) {
    const err = new Error('Service not found');
    err.statusCode = 404;
    throw err;
  }
  if (svcRows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  // Business rule: rate must match pricing model
  if (pricingModel === 'daily' && !dailyRate) {
    const err = new Error('dailyRate is required when pricingModel is daily');
    err.statusCode = 400;
    throw err;
  }
  if (pricingModel === 'hourly' && !hourlyRate) {
    const err = new Error('hourlyRate is required when pricingModel is hourly');
    err.statusCode = 400;
    throw err;
  }

  const { rows } = await pool.query(
    `INSERT INTO vehicles
       (service_id, make, model, year, vehicle_type, capacity, pricing_model,
        daily_rate, hourly_rate, driver_included, deposit_amount, included_features)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING id`,
    [serviceId, make, model, year ?? null, vehicleType, capacity,
     pricingModel, dailyRate ?? null, hourlyRate ?? null,
     driverIncluded, depositAmount, includedFeatures]
  );
  return { vehicleId: rows[0].id };
}

/**
 * Bulk-create vehicle_availability rows for a date range.
 * One row per calendar day, using ON CONFLICT DO UPDATE so it is idempotent.
 * Verifies the calling partner owns the vehicle before writing.
 */
async function bulkVehicleAvailability({ partnerId, vehicleId, startDate, endDate, availableFrom, availableTo }) {
  // Ownership check (vehicle → service → partner)
  const { rows: vRows } = await pool.query(
    `SELECT s.partner_id
     FROM vehicles v
     JOIN services s ON s.id = v.service_id
     WHERE v.id = $1`,
    [vehicleId]
  );
  if (!vRows.length) {
    const err = new Error('Vehicle not found');
    err.statusCode = 404;
    throw err;
  }
  if (vRows[0].partner_id !== partnerId) {
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
  if (availableTo <= availableFrom) {
    const err = new Error('availableTo must be after availableFrom');
    err.statusCode = 400;
    throw err;
  }

  // Generate one row per date; upsert so re-runs are safe
  let count = 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cursor = new Date(start);
    while (cursor <= end) {
      const dateStr = cursor.toISOString().slice(0, 10);
      await client.query(
        `INSERT INTO vehicle_availability (vehicle_id, date, available_from, available_to, is_blocked)
         VALUES ($1, $2, $3, $4, false)
         ON CONFLICT (vehicle_id, date) DO UPDATE
           SET available_from = EXCLUDED.available_from,
               available_to   = EXCLUDED.available_to,
               is_blocked     = false`,
        [vehicleId, dateStr, availableFrom, availableTo]
      );
      count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { count };
}

module.exports = { createVehicle, bulkVehicleAvailability };
