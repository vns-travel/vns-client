// All business logic for the vouchers domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

// Maps the flat row returned from PostgreSQL to the camelCase shape the
// controller returns to clients. Keeps the rest of the code DRY.
function toDTO(r) {
  return {
    id:                     r.id,
    name:                   r.name,
    description:            r.description,
    code:                   r.code,
    type:                   r.type,            // 'percent' | 'fixed'
    value:                  Number(r.value),
    minSpend:               Number(r.min_spend),
    maxDiscount:            r.max_discount != null ? Number(r.max_discount) : null,
    maxUses:                r.max_uses,
    usedCount:              r.used_count,
    isActive:               r.is_active,
    validFrom:              r.valid_from,
    validTo:                r.valid_to,
    userId:                 r.user_id,
    applicableServiceTypes: r.applicable_service_types ?? [],
    createdAt:              r.created_at,
  };
}

/**
 * Create a platform-wide voucher. Manager-only.
 *
 * @param {object} p
 * @param {string}   p.name
 * @param {string}   [p.description]
 * @param {string}   p.code               Uppercase alphanumeric
 * @param {'percent'|'fixed'} p.type
 * @param {number}   p.value              Percentage (1–100) or fixed amount
 * @param {number}   [p.minSpend]
 * @param {number}   [p.maxDiscount]      Only meaningful for type='percent'
 * @param {number}   [p.maxUses]
 * @param {string}   [p.validFrom]        ISO date string
 * @param {string}   [p.validTo]          ISO date string
 * @param {string[]} [p.applicableServiceTypes]  Empty = all types
 */
async function createVoucher({
  name, description, code, type, value,
  minSpend, maxDiscount, maxUses, validFrom, validTo,
  applicableServiceTypes,
}) {
  if (type === 'percent' && (value <= 0 || value > 100)) {
    const err = new Error('Giá trị phần trăm phải từ 1 đến 100');
    err.statusCode = 422; err.code = 'INVALID_VALUE'; throw err;
  }
  if (type === 'fixed' && value <= 0) {
    const err = new Error('Giá trị giảm phải lớn hơn 0');
    err.statusCode = 422; err.code = 'INVALID_VALUE'; throw err;
  }
  if (validFrom && validTo && new Date(validTo) <= new Date(validFrom)) {
    const err = new Error('Ngày kết thúc phải sau ngày bắt đầu');
    err.statusCode = 422; err.code = 'INVALID_DATE_RANGE'; throw err;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO vouchers
         (name, description, code, type, value, min_spend, max_discount,
          max_uses, valid_from, valid_to, applicable_service_types)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name ?? null,
        description ?? null,
        code,
        type,
        value,
        minSpend    ?? 0,
        maxDiscount ?? null,
        maxUses     ?? null,
        validFrom   ?? null,
        validTo     ?? null,
        applicableServiceTypes ?? [],
      ],
    );
    return toDTO(rows[0]);
  } catch (err) {
    // pg unique_violation error code
    if (err.code === '23505') {
      const e = new Error('Mã voucher đã tồn tại');
      e.statusCode = 409; e.code = 'CODE_TAKEN'; throw e;
    }
    throw err;
  }
}

/**
 * List all vouchers for the manager dashboard.
 * Supports optional search by code or name, and optional status filter.
 *
 * @param {object} opts
 * @param {string} [opts.search]   Filter by code or name (case-insensitive)
 * @param {string} [opts.status]   'active' | 'expired' | 'inactive'
 */
async function listVouchers({ search, status } = {}) {
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(code ILIKE $${params.length} OR name ILIKE $${params.length})`);
  }

  if (status === 'active') {
    conditions.push(`is_active = true AND (valid_to IS NULL OR valid_to > NOW())`);
  } else if (status === 'expired') {
    conditions.push(`valid_to IS NOT NULL AND valid_to <= NOW()`);
  } else if (status === 'inactive') {
    conditions.push(`is_active = false`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT * FROM vouchers ${where} ORDER BY created_at DESC`,
    params,
  );

  return rows.map(toDTO);
}

/**
 * List vouchers available to users: active, not expired, not user-locked.
 * This endpoint is consumed by the Flutter mobile app.
 */
async function listPublicVouchers() {
  const { rows } = await pool.query(
    `SELECT * FROM vouchers
     WHERE is_active = true
       AND user_id IS NULL
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_to   IS NULL OR valid_to   >  NOW())
     ORDER BY created_at DESC`,
  );
  return rows.map(toDTO);
}

/**
 * Toggle is_active for a voucher. Manager-only.
 */
async function toggleVoucher(voucherId) {
  const check = await pool.query(`SELECT is_active FROM vouchers WHERE id = $1`, [voucherId]);
  if (!check.rows.length) {
    const err = new Error('Voucher không tồn tại'); err.statusCode = 404; throw err;
  }
  const { rows } = await pool.query(
    `UPDATE vouchers SET is_active = NOT is_active WHERE id = $1 RETURNING *`,
    [voucherId],
  );
  return toDTO(rows[0]);
}

module.exports = { createVoucher, listVouchers, listPublicVouchers, toggleVoucher };
