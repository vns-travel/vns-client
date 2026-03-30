const authService   = require('../services/authService');
const { success }   = require('../utils/response');

async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    success(res, data, null, 201);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    success(res, data);
  } catch (err) { next(err); }
}

async function refreshToken(req, res, next) {
  try {
    const data = await authService.refreshToken(req.body);
    success(res, data);
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body);
    success(res, { message: 'If that email exists, a reset link has been sent' });
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body);
    success(res, { message: 'Password reset successfully' });
  } catch (err) { next(err); }
}

module.exports = { register, login, refreshToken, forgotPassword, resetPassword };
