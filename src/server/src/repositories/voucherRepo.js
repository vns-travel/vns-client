const { query } = require('../config/db');

async function findByCode(code) {
  const { rows } = await query('SELECT * FROM vouchers WHERE code = $1', [code]);
  return rows[0] || null;
}

/**
 * Validates a voucher against amount and user — returns the voucher row if valid,
 * throws with a descriptive code if not.
 */
async function validate(code, userId, amount, serviceType) {
  const voucher = await findByCode(code);
  if (!voucher) throw Object.assign(new Error('Voucher not found'), { code: 'VOUCHER_INVALID', statusCode: 400 });
  if (!voucher.is_active) throw Object.assign(new Error('Voucher is inactive'), { code: 'VOUCHER_INVALID', statusCode: 400 });

  const now = new Date();
  if (voucher.valid_from && new Date(voucher.valid_from) > now)
    throw Object.assign(new Error('Voucher is not yet valid'), { code: 'VOUCHER_INVALID', statusCode: 400 });
  if (voucher.valid_to && new Date(voucher.valid_to) < now)
    throw Object.assign(new Error('Voucher has expired'), { code: 'VOUCHER_EXPIRED', statusCode: 400 });
  if (voucher.max_uses !== null && voucher.used_count >= voucher.max_uses)
    throw Object.assign(new Error('Voucher has reached maximum uses'), { code: 'VOUCHER_INVALID', statusCode: 400 });
  if (amount < voucher.min_spend)
    throw Object.assign(new Error(`Minimum spend of ${voucher.min_spend} required`), { code: 'VOUCHER_INVALID', statusCode: 400 });

  // Restrict to service types if set
  if (voucher.applicable_service_types?.length > 0 && serviceType) {
    if (!voucher.applicable_service_types.includes(serviceType))
      throw Object.assign(new Error('Voucher does not apply to this service type'), { code: 'VOUCHER_INVALID', statusCode: 400 });
  }
  // User-specific voucher
  if (voucher.user_id && voucher.user_id !== userId)
    throw Object.assign(new Error('Voucher is not available for your account'), { code: 'VOUCHER_INVALID', statusCode: 400 });

  return voucher;
}

async function incrementUsage(voucherId, client) {
  const db = client || { query: (t, p) => query(t, p) };
  await db.query(
    'UPDATE vouchers SET used_count = used_count + 1 WHERE id = $1',
    [voucherId]
  );
}

async function logUsage(voucherId, userId, bookingId, client) {
  const db = client || { query: (t, p) => query(t, p) };
  await db.query(
    'INSERT INTO voucher_usages (voucher_id, user_id, booking_id) VALUES ($1, $2, $3)',
    [voucherId, userId, bookingId]
  );
}

module.exports = { findByCode, validate, incrementUsage, logUsage };
