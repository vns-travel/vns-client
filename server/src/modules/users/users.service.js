// All business logic for the users domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const bcrypt = require('bcrypt');
const { pool } = require('../../config/db');

const SALT_ROUNDS = 10;

/**
 * Return the public profile for a given user.
 * Excludes password_hash and any other internal fields.
 */
async function getProfile(userId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, u.role, u.status, u.created_at,
            pp.id AS partner_profile_id, pp.business_name, pp.verify_status
     FROM users u
     LEFT JOIN partner_profiles pp ON pp.user_id = u.id
     WHERE u.id = $1`,
    [userId],
  );

  if (!rows.length) {
    const err = new Error('Người dùng không tồn tại');
    err.statusCode = 404;
    throw err;
  }

  const u = rows[0];

  // Load uploaded documents for partner users.
  let documents = [];
  if (u.partner_profile_id) {
    const { rows: docRows } = await pool.query(
      `SELECT doc_type, file_url, status FROM partner_documents WHERE partner_id = $1`,
      [u.partner_profile_id],
    );
    documents = docRows.map((r) => ({ docType: r.doc_type, fileUrl: r.file_url, status: r.status }));
  }

  return {
    id:           u.id,
    email:        u.email,
    fullName:     u.full_name,
    phone:        u.phone,
    avatarUrl:    u.avatar_url,
    role:         u.role,
    status:       u.status,
    createdAt:    u.created_at,
    businessName: u.business_name || null,
    verifyStatus: u.verify_status || null,
    documents,
  };
}

/**
 * Update mutable profile fields for the authenticated user.
 * Only the fields present in `fields` are written — undefined keys are skipped.
 * The caller (router Zod schema) guarantees at least one field is present.
 */
async function updateProfile(userId, { fullName, phone, avatarUrl, businessName }) {
  // Build a dynamic SET clause so we only touch provided columns.
  const setClauses = [];
  const values     = [];
  let   idx        = 1;

  if (fullName  !== undefined) { setClauses.push(`full_name  = $${idx++}`); values.push(fullName); }
  if (phone     !== undefined) { setClauses.push(`phone      = $${idx++}`); values.push(phone); }
  if (avatarUrl !== undefined) { setClauses.push(`avatar_url = $${idx++}`); values.push(avatarUrl); }

  let updatedUser;

  if (setClauses.length > 0) {
    // Always bump updated_at so the mobile app can detect stale cached data.
    setClauses.push(`updated_at = NOW()`);
    values.push(userId);

    const { rows } = await pool.query(
      `UPDATE users
       SET ${setClauses.join(', ')}
       WHERE id = $${idx}
       RETURNING id, email, full_name, phone, avatar_url, role, status, created_at`,
      values,
    );

    if (!rows.length) {
      const err = new Error('Người dùng không tồn tại');
      err.statusCode = 404;
      throw err;
    }
    updatedUser = rows[0];
  } else {
    // No users-table fields changed; fetch current row to build return value.
    const { rows } = await pool.query(
      `SELECT id, email, full_name, phone, avatar_url, role, status, created_at
       FROM users WHERE id = $1`,
      [userId],
    );
    if (!rows.length) {
      const err = new Error('Người dùng không tồn tại');
      err.statusCode = 404;
      throw err;
    }
    updatedUser = rows[0];
  }

  // Write businessName to partner_profiles — every partner has exactly one row
  // created at registration, so a plain UPDATE is safe here.
  if (businessName !== undefined) {
    await pool.query(
      `UPDATE partner_profiles SET business_name = $1 WHERE user_id = $2`,
      [businessName, userId],
    );
  }

  const u = updatedUser;
  return {
    id:           u.id,
    email:        u.email,
    fullName:     u.full_name,
    phone:        u.phone,
    avatarUrl:    u.avatar_url,
    role:         u.role,
    status:       u.status,
    createdAt:    u.created_at,
    businessName: businessName !== undefined ? businessName : undefined,
  };
}

/**
 * Change the authenticated user's password.
 * Guards:
 *  - currentPassword must match the stored hash (403 on mismatch)
 *  - newPassword must differ from currentPassword (422)
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  const { rows } = await pool.query(
    `SELECT password_hash FROM users WHERE id = $1`,
    [userId],
  );

  if (!rows.length) {
    const err = new Error('Người dùng không tồn tại');
    err.statusCode = 404;
    throw err;
  }

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!valid) {
    const err = new Error('Mật khẩu hiện tại không đúng');
    err.statusCode = 403;
    err.code = 'WRONG_CURRENT_PASSWORD';
    throw err;
  }

  // Prevent no-op password changes — same raw value means no real update.
  if (newPassword === currentPassword) {
    const err = new Error('Mật khẩu mới không được trùng mật khẩu cũ');
    err.statusCode = 422;
    err.code = 'PASSWORD_UNCHANGED';
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newHash, userId],
  );
}

/**
 * Persist a partner document URL after upload.
 * Checks for an existing row by (partner_id, doc_type) and updates it;
 * inserts a new row if none exists. No unique constraint migration needed.
 */
async function upsertDocument(userId, { docType, fileUrl }) {
  const { rows: profileRows } = await pool.query(
    `SELECT id FROM partner_profiles WHERE user_id = $1`,
    [userId],
  );
  if (!profileRows.length) {
    const err = new Error('Partner profile không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  const partnerId = profileRows[0].id;

  const { rows: existing } = await pool.query(
    `SELECT id FROM partner_documents WHERE partner_id = $1 AND doc_type = $2`,
    [partnerId, docType],
  );

  if (existing.length) {
    await pool.query(
      `UPDATE partner_documents SET file_url = $1, uploaded_at = NOW() WHERE id = $2`,
      [fileUrl, existing[0].id],
    );
  } else {
    await pool.query(
      `INSERT INTO partner_documents (partner_id, doc_type, file_url) VALUES ($1, $2, $3)`,
      [partnerId, docType, fileUrl],
    );
  }
}

module.exports = { getProfile, updateProfile, changePassword, upsertDocument };
