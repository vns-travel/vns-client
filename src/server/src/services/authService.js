const bcrypt        = require('bcryptjs');
const userRepo      = require('../repositories/userRepo');
const partnerRepo   = require('../repositories/partnerRepo');
const { signToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../utils/mailer');
const OtpModel      = require('../models/Otp');
const { query }     = require('../config/db');

async function register(payload) {
  const { email, password, fullName, phone } = payload;

  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 12);
  // findByEmail returns password_hash; create returns safe columns only
  const user = await userRepo.create({ email, passwordHash, fullName, phone, role: 'customer' });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

async function login({ email, password }) {
  // findByEmail intentionally returns ALL columns so we can verify the hash
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  // Check suspension before password comparison to keep the error message generic
  if (user.status !== 'active') throw new Error('Account is suspended');

  const valid = await bcrypt.compare(password, user.password_hash);
  // Use the same message regardless of which field failed — never reveal which was wrong
  if (!valid) throw new Error('Invalid email or password');

  const token = signToken({ userId: user.id, role: user.role });
  const { password_hash, ...safeUser } = user; // eslint-disable-line no-unused-vars
  return { user: safeUser, token };
}

async function forgotPassword({ email }) {
  const user = await userRepo.findByEmail(email);

  // Return the same message whether the email exists or not — prevents email enumeration
  if (!user) return { message: 'If this email is registered, an OTP has been sent' };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Remove any previous unused OTPs for this email before creating a fresh one
  await OtpModel.deleteMany({ email: email.toLowerCase(), used: false });

  await OtpModel.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    used: false,
  });

  await sendOtpEmail(email, otp);

  return { message: 'If this email is registered, an OTP has been sent' };
}

async function resetPassword({ email, otp, newPassword }) {
  const otpDoc = await OtpModel.findOne({
    email: email.toLowerCase(),
    otp,
    used: false,
    expiresAt: { $gt: new Date() },
  });
  if (!otpDoc) throw new Error('Invalid or expired OTP');

  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User not found');

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Direct pg query — no separate repo method needed for a one-off password reset
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
    [passwordHash, email]
  );

  // Mark OTP as used so it cannot be replayed
  otpDoc.used = true;
  await otpDoc.save();

  return { message: 'Password reset successful' };
}

async function registerPartner({ email, password, businessName, phone }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 12);
  // Create user with role='partner'; phone stored on users table
  const user = await userRepo.create({ email, passwordHash, fullName: businessName, phone, role: 'partner' });

  // Create the partner profile — verify_status defaults to 'pending' from DB schema
  const partner = await partnerRepo.create({ userId: user.id, businessName });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, partner, token };
}

module.exports = { register, login, forgotPassword, resetPassword, registerPartner };
