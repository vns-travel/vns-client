// All business logic for the partners domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

/**
 * List partner profiles for manager review.
 * @param {object} opts
 * @param {'pending'|'approved'|'rejected'} [opts.status]  Filter by verify_status; omit for all.
 */
async function listPartners({ status } = {}) {
  const params = [];
  const where = status ? `WHERE pp.verify_status = $${params.push(status)}` : '';

  const { rows } = await pool.query(
    `SELECT
       pp.id AS partner_id,
       pp.business_name,
       pp.rejection_reason,
       pp.verify_status,
       pp.created_at,
       u.id   AS user_id,
       u.email,
       u.full_name,
       u.phone
     FROM partner_profiles pp
     JOIN users u ON u.id = pp.user_id
     ${where}
     ORDER BY pp.created_at ASC`,
    params,
  );

  return rows.map((r) => ({
    partnerId:       r.partner_id,
    businessName:    r.business_name,
    rejectionReason: r.rejection_reason,
    verifyStatus:    r.verify_status,
    createdAt:       r.created_at,
    userId:          r.user_id,
    email:           r.email,
    fullName:        r.full_name,
    phone:           r.phone,
  }));
}

// Keep the focused pending-only helper for backward compatibility.
async function listPendingPartners() {
  return listPartners({ status: 'pending' });
}

/**
 * Approve a pending partner — sets verify_status='approved' and verified_at.
 * Guard: only 'pending' partners can be approved.
 */
async function approvePartner({ partnerId }) {
  const check = await pool.query(
    `SELECT verify_status FROM partner_profiles WHERE id = $1`,
    [partnerId],
  );
  if (!check.rows.length) {
    const err = new Error('Partner không tồn tại'); err.statusCode = 404; throw err;
  }
  if (check.rows[0].verify_status !== 'pending') {
    const err = new Error('Chỉ có thể duyệt partner đang chờ');
    err.statusCode = 422; err.code = 'PARTNER_NOT_PENDING'; throw err;
  }

  await pool.query(
    `UPDATE partner_profiles
     SET verify_status = 'approved', verified_at = NOW()
     WHERE id = $1`,
    [partnerId],
  );
}

/**
 * Reject a pending partner — sets verify_status='rejected' and stores reason.
 * Guard: only 'pending' partners can be rejected.
 */
async function rejectPartner({ partnerId, reason }) {
  const check = await pool.query(
    `SELECT verify_status FROM partner_profiles WHERE id = $1`,
    [partnerId],
  );
  if (!check.rows.length) {
    const err = new Error('Partner không tồn tại'); err.statusCode = 404; throw err;
  }
  if (check.rows[0].verify_status !== 'pending') {
    const err = new Error('Chỉ có thể từ chối partner đang chờ');
    err.statusCode = 422; err.code = 'PARTNER_NOT_PENDING'; throw err;
  }

  await pool.query(
    `UPDATE partner_profiles
     SET verify_status = 'rejected', rejection_reason = $1
     WHERE id = $2`,
    [reason ?? null, partnerId],
  );
}

module.exports = { listPartners, listPendingPartners, approvePartner, rejectPartner };
