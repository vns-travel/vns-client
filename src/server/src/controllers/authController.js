const authService     = require('../services/authService');
const { success, fail } = require('../utils/response');

// Business errors we expect — return 400 with the error message directly.
// All other errors bubble to the global error handler (500).
const KNOWN_ERRORS = new Set([
  'Email already in use',
  'Invalid email or password',
  'Account is suspended',
  'Invalid or expired OTP',
  'User not found',
]);

function handleError(err, res, next) {
  if (KNOWN_ERRORS.has(err.message)) {
    return fail(res, err.message, 'AUTH_ERROR', 400);
  }
  next(err);
}

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    success(res, data, null, 201);
  } catch (err) {
    handleError(err, res, next);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    success(res, data);
  } catch (err) {
    handleError(err, res, next);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const data = await authService.forgotPassword(req.body);
    success(res, data);
  } catch (err) {
    handleError(err, res, next);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = await authService.resetPassword(req.body);
    success(res, data);
  } catch (err) {
    handleError(err, res, next);
  }
}

async function registerPartner(req, res, next) {
  try {
    const data = await authService.registerPartner(req.body);
    success(res, data, null, 201);
  } catch (err) {
    handleError(err, res, next);
  }
}

module.exports = { register, login, forgotPassword, resetPassword, registerPartner };
