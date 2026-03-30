const voucherService = require('../services/voucherService');
const { success }    = require('../utils/response');

async function getUserVouchers(req, res, next) {
  try {
    const data = await voucherService.getUserVouchers(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function validateAndApply(req, res, next) {
  try {
    const { code, amount, serviceType } = req.body;
    const data = await voucherService.validateAndApply(code, req.user.id, amount, serviceType);
    success(res, data);
  } catch (err) { next(err); }
}

async function createVoucher(req, res, next) {
  try {
    const data = await voucherService.createVoucher(req.body);
    success(res, data, null, 201);
  } catch (err) { next(err); }
}

module.exports = { getUserVouchers, validateAndApply, createVoucher };
