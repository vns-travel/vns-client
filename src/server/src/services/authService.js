const bcrypt      = require('bcryptjs');
const userRepo    = require('../repositories/userRepo');
const { signToken } = require('../utils/jwt');

async function register(payload) {
  const { email, password, fullName, phone, role } = payload;

  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw Object.assign(new Error('Email already in use'), { code: 'ALREADY_EXISTS', statusCode: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepo.create({ email, passwordHash, fullName, phone, role });

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: sanitize(user) };
}

async function login(payload) {
  const { email, password } = payload;

  const user = await userRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { code: 'AUTH_INVALID', statusCode: 401 });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { code: 'AUTH_INVALID', statusCode: 401 });

  if (user.status !== 'active') {
    throw Object.assign(new Error('Account is suspended'), { code: 'FORBIDDEN', statusCode: 403 });
  }

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: sanitize(user) };
}

async function refreshToken(payload) {
  // TODO: implement refresh token rotation
  return null;
}

async function forgotPassword(payload) {
  // TODO: generate reset token, send email
  return null;
}

async function resetPassword(payload) {
  // TODO: verify reset token, hash new password, update user
  return null;
}

function sanitize(user) {
  const { password_hash, ...safe } = user; // eslint-disable-line no-unused-vars
  return safe;
}

module.exports = { register, login, refreshToken, forgotPassword, resetPassword };
