const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../config/db');
const env = require('../../config/env');

const SALT_ROUNDS = 10;

/**
 * Sign a JWT with the fields that auth middleware and downstream services expect.
 * Payload includes both users.id and partner_profiles.id so service-layer
 * ownership checks can use either without an extra DB round-trip.
 */
function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Register a new partner account.
 * Creates a users row (role='partner') + partner_profiles row in a transaction,
 * then returns a signed JWT alongside basic profile data.
 */
async function register({ email, password, fullName, phoneNumber, businessName }) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    const err = new Error('Email đã được sử dụng');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'partner')
       RETURNING id, email, full_name, role`,
      [email, passwordHash, fullName || null, phoneNumber || null]
    );
    const user = userRes.rows[0];

    const profileRes = await client.query(
      `INSERT INTO partner_profiles (user_id, business_name) VALUES ($1, $2) RETURNING id`,
      [user.id, businessName || null]
    );
    const partnerId = profileRes.rows[0].id;

    await client.query('COMMIT');

    const token = signToken({ id: user.id, partnerId, role: user.role, email: user.email, fullName: user.full_name });
    return { token, id: user.id, partnerId, role: user.role, email: user.email, fullName: user.full_name };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Authenticate an existing user.
 * Returns a signed JWT on success; throws 401 on bad credentials.
 */
async function login({ email, password }) {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.password_hash, u.full_name, u.role, u.status,
            p.id AS partner_id
     FROM users u
     LEFT JOIN partner_profiles p ON p.user_id = u.id
     WHERE u.email = $1`,
    [email]
  );

  if (!rows.length) {
    const err = new Error('Email hoặc mật khẩu không đúng');
    err.statusCode = 401;
    throw err;
  }

  const user = rows[0];

  if (user.status === 'suspended') {
    const err = new Error('Tài khoản đã bị khóa');
    err.statusCode = 403;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Email hoặc mật khẩu không đúng');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({
    id: user.id,
    partnerId: user.partner_id,
    role: user.role,
    email: user.email,
    fullName: user.full_name,
  });

  return { token, id: user.id, partnerId: user.partner_id, role: user.role, email: user.email, fullName: user.full_name };
}

module.exports = { register, login };
