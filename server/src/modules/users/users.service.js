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
    `SELECT id, email, full_name, phone, avatar_url, role, status, created_at
     FROM users WHERE id = $1`,
    [userId],
  );

  if (!rows.length) {
    const err = new Error('Người dùng không tồn tại');
    err.statusCode = 404;
    throw err;
  }

  const u = rows[0];
  return {
    id:        u.id,
    email:     u.email,
    fullName:  u.full_name,
    phone:     u.phone,
    avatarUrl: u.avatar_url,
    role:      u.role,
    status:    u.status,
    createdAt: u.created_at,
  };
}

/**
 * Update mutable profile fields for the authenticated user.
 * Only the fields present in `fields` are written — undefined keys are skipped.
 * The caller (router Zod schema) guarantees at least one field is present.
 */
async function updateProfile(userId, { fullName, phone, avatarUrl }) {
  // Build a dynamic SET clause so we only touch provided columns.
  const setClauses = [];
  const values     = [];
  let   idx        = 1;

  if (fullName  !== undefined) { setClauses.push(`full_name  = $${idx++}`); values.push(fullName); }
  if (phone     !== undefined) { setClauses.push(`phone      = $${idx++}`); values.push(phone); }
  if (avatarUrl !== undefined) { setClauses.push(`avatar_url = $${idx++}`); values.push(avatarUrl); }

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

  const u = rows[0];
  return {
    id:        u.id,
    email:     u.email,
    fullName:  u.full_name,
    phone:     u.phone,
    avatarUrl: u.avatar_url,
    role:      u.role,
    status:    u.status,
    createdAt: u.created_at,
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

module.exports = { getProfile, updateProfile, changePassword };
