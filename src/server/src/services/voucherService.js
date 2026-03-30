const voucherRepo = require('../repositories/voucherRepo');

async function validateAndApply(code, userId, originalAmount, serviceType) {
  const voucher = await voucherRepo.validate(code, userId, originalAmount, serviceType);

  let discountAmount = 0;
  if (voucher.type === 'percent') {
    discountAmount = (originalAmount * voucher.value) / 100;
    if (voucher.max_discount) discountAmount = Math.min(discountAmount, voucher.max_discount);
  } else {
    discountAmount = voucher.value;
  }
  discountAmount = Math.min(discountAmount, originalAmount); // never exceed order value

  return {
    voucherId:      voucher.id,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount:    Math.round((originalAmount - discountAmount) * 100) / 100,
  };
}

async function createVoucher(payload) {
  // TODO: insert voucher row
  return null;
}

async function getUserVouchers(userId) {
  // TODO: query vouchers where user_id = userId OR user_id IS NULL
  return [];
}

module.exports = { validateAndApply, createVoucher, getUserVouchers };
