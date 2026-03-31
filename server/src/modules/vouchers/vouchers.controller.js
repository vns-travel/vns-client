// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./vouchers.service');

async function createVoucher(req, res, next) {
  try {
    const data = await service.createVoucher({
      name:                   req.body.name,
      description:            req.body.description,
      code:                   req.body.code,
      type:                   req.body.type,
      value:                  req.body.value,
      minSpend:               req.body.minSpend,
      maxDiscount:            req.body.maxDiscount,
      maxUses:                req.body.maxUses,
      validFrom:              req.body.validFrom,
      validTo:                req.body.validTo,
      applicableServiceTypes: req.body.applicableServiceTypes,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listVouchers(req, res, next) {
  try {
    const data = await service.listVouchers({
      search: req.query.search,
      status: req.query.status,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPublicVouchers(req, res, next) {
  try {
    const data = await service.listPublicVouchers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function toggleVoucher(req, res, next) {
  try {
    const data = await service.toggleVoucher(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createVoucher, listVouchers, listPublicVouchers, toggleVoucher };
