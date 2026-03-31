// All business logic for the combos domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

/**
 * Create a combo and its child combo_services rows in a single transaction.
 * Each entry in `services` must be a service owned by the calling partner —
 * we verify ownership in bulk before inserting.
 *
 * @param {object} p
 * @param {string}   p.partnerId
 * @param {string}   p.title
 * @param {string}   [p.description]
 * @param {number}   p.originalPrice
 * @param {number}   p.discountedPrice
 * @param {number}   [p.maxBookings]
 * @param {string}   [p.validFrom]   ISO date string
 * @param {string}   [p.validTo]     ISO date string
 * @param {Array<{serviceId: string, quantity?: number, includedFeatures?: string, sequenceOrder?: number}>} p.services
 */
async function createCombo({ partnerId, title, description, originalPrice, discountedPrice, maxBookings, validFrom, validTo, services }) {
  if (discountedPrice > originalPrice) {
    const err = new Error('Giá khuyến mãi không thể lớn hơn giá gốc');
    err.statusCode = 422; err.code = 'INVALID_PRICE'; throw err;
  }
  if (validFrom && validTo && new Date(validTo) <= new Date(validFrom)) {
    const err = new Error('Ngày kết thúc phải sau ngày bắt đầu');
    err.statusCode = 422; err.code = 'INVALID_DATE_RANGE'; throw err;
  }

  // Verify every service_id belongs to this partner before touching anything.
  // A single query is faster and avoids partial-insert rollback scenarios.
  const serviceIds = services.map((s) => s.serviceId);
  const ownershipRes = await pool.query(
    `SELECT id FROM services WHERE id = ANY($1) AND partner_id = $2`,
    [serviceIds, partnerId],
  );
  if (ownershipRes.rows.length !== serviceIds.length) {
    const err = new Error('Một hoặc nhiều dịch vụ không thuộc về partner này');
    err.statusCode = 403; err.code = 'SERVICE_NOT_OWNED'; throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const comboRes = await client.query(
      `INSERT INTO combos
         (partner_id, title, description, original_price, discounted_price,
          max_bookings, valid_from, valid_to, status, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',false)
       RETURNING id`,
      [
        partnerId, title, description ?? null, originalPrice, discountedPrice,
        maxBookings ?? null, validFrom ?? null, validTo ?? null,
      ],
    );
    const comboId = comboRes.rows[0].id;

    // Insert combo_services in the declared order
    for (let i = 0; i < services.length; i++) {
      const { serviceId, quantity = 1, includedFeatures = null, sequenceOrder } = services[i];
      await client.query(
        `INSERT INTO combo_services (combo_id, service_id, quantity, sequence_order, included_features)
         VALUES ($1,$2,$3,$4,$5)`,
        [comboId, serviceId, quantity, sequenceOrder ?? i + 1, includedFeatures],
      );
    }

    await client.query('COMMIT');
    return { comboId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * List all combos for a given partner, including how many services each has.
 */
async function listPartnerCombos(partnerId) {
  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.description, c.original_price, c.discounted_price,
       c.max_bookings, c.current_bookings, c.is_active, c.status,
       c.rejection_reason, c.valid_from, c.valid_to, c.created_at,
       COUNT(cs.id)::int AS service_count
     FROM combos c
     LEFT JOIN combo_services cs ON cs.combo_id = c.id
     WHERE c.partner_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [partnerId],
  );

  return rows.map((r) => ({
    comboId:         r.id,
    title:           r.title,
    description:     r.description,
    originalPrice:   Number(r.original_price),
    discountedPrice: Number(r.discounted_price),
    maxBookings:     r.max_bookings,
    currentBookings: r.current_bookings,
    isActive:        r.is_active,
    status:          r.status,
    rejectionReason: r.rejection_reason,
    validFrom:       r.valid_from,
    validTo:         r.valid_to,
    createdAt:       r.created_at,
    serviceCount:    r.service_count,
  }));
}

/**
 * List all pending combos for manager review, with partner name and service count.
 */
async function listPendingCombos() {
  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.description, c.original_price, c.discounted_price,
       c.max_bookings, c.valid_from, c.valid_to, c.created_at,
       pp.id AS partner_id, pp.business_name,
       COUNT(cs.id)::int AS service_count
     FROM combos c
     JOIN partner_profiles pp ON pp.id = c.partner_id
     LEFT JOIN combo_services cs ON cs.combo_id = c.id
     WHERE c.status = 'pending'
     GROUP BY c.id, pp.id, pp.business_name
     ORDER BY c.created_at ASC`,
  );

  return rows.map((r) => ({
    comboId:         r.id,
    title:           r.title,
    description:     r.description,
    originalPrice:   Number(r.original_price),
    discountedPrice: Number(r.discounted_price),
    maxBookings:     r.max_bookings,
    validFrom:       r.valid_from,
    validTo:         r.valid_to,
    createdAt:       r.created_at,
    partnerId:       r.partner_id,
    businessName:    r.business_name,
    serviceCount:    r.service_count,
  }));
}

/**
 * Approve a pending combo — sets status='approved' and is_active=true.
 * Guard: only 'pending' combos can be approved.
 */
async function approveCombo({ comboId }) {
  const check = await pool.query(
    `SELECT status FROM combos WHERE id = $1`,
    [comboId],
  );
  if (!check.rows.length) {
    const err = new Error('Combo không tồn tại'); err.statusCode = 404; throw err;
  }
  if (check.rows[0].status !== 'pending') {
    const err = new Error('Chỉ có thể duyệt combo đang chờ');
    err.statusCode = 422; err.code = 'COMBO_NOT_PENDING'; throw err;
  }

  await pool.query(
    `UPDATE combos SET status='approved', is_active=true WHERE id=$1`,
    [comboId],
  );
}

/**
 * Reject a pending combo — sets status='rejected' and stores the reason.
 * Guard: only 'pending' combos can be rejected.
 */
async function rejectCombo({ comboId, reason }) {
  const check = await pool.query(
    `SELECT status FROM combos WHERE id = $1`,
    [comboId],
  );
  if (!check.rows.length) {
    const err = new Error('Combo không tồn tại'); err.statusCode = 404; throw err;
  }
  if (check.rows[0].status !== 'pending') {
    const err = new Error('Chỉ có thể từ chối combo đang chờ');
    err.statusCode = 422; err.code = 'COMBO_NOT_PENDING'; throw err;
  }

  await pool.query(
    `UPDATE combos SET status='rejected', rejection_reason=$1 WHERE id=$2`,
    [reason ?? null, comboId],
  );
}

module.exports = { createCombo, listPartnerCombos, listPendingCombos, approveCombo, rejectCombo };
