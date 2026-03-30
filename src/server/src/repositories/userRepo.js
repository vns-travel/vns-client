const { query } = require('../config/db');

// Column list used by all read queries — password_hash is intentionally excluded
// so we can never accidentally leak it through a serialization path.
const SAFE_COLUMNS = 'id, email, full_name, avatar_url, phone, role, status, created_at';

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await query(
    `SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ email, passwordHash, fullName, phone, role }) {
  const { rows } = await query(
    `INSERT INTO users (id, email, password_hash, full_name, phone, role)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
     RETURNING ${SAFE_COLUMNS}`,
    [email, passwordHash, fullName, phone || null, role || 'customer']
  );
  return rows[0];
}

async function updateById(id, fields) {
  // Only these columns may be updated — all others are rejected to prevent mass-assignment.
  const ALLOWED = ['full_name', 'avatar_url', 'phone', 'status', 'updated_at'];

  const entries = Object.entries(fields).filter(([col]) => ALLOWED.includes(col));
  if (entries.length === 0) return findById(id);

  // Build parameterised SET clause: full_name = $1, phone = $2, ...
  const setClauses = entries.map(([col], i) => `${col} = $${i + 1}`);
  setClauses.push(`updated_at = NOW()`);
  const values = entries.map(([, val]) => val);
  values.push(id); // last param for WHERE

  const { rows } = await query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${values.length}
     RETURNING ${SAFE_COLUMNS}`,
    values
  );
  return rows[0] || null;
}

async function updateRole(userId, role) {
  const { rows } = await query(
    'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role, status',
    [role, userId]
  );
  return rows[0] || null;
}

async function softDelete(id) {
  const { rows } = await query(
    `UPDATE users SET status = 'deleted', updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { findByEmail, findById, create, updateById, updateRole, softDelete };
