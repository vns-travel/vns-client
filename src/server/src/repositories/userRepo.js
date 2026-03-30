const { query } = require('../config/db');

async function findById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function create(data) {
  const { email, passwordHash, fullName, phone, role } = data;
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, full_name, phone, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, passwordHash, fullName, phone || null, role || 'customer']
  );
  return rows[0];
}

async function updateById(id, data) {
  // TODO: build dynamic SET clause
  return null;
}

async function softDelete(id) {
  const { rows } = await query(
    `UPDATE users SET status = 'deleted', updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { findById, findByEmail, create, updateById, softDelete };
