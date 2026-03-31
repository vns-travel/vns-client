// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./combos.service');

async function createCombo(req, res, next) {
  try {
    const data = await service.createCombo({
      partnerId:       req.user.partnerId,
      title:           req.body.title,
      description:     req.body.description,
      originalPrice:   req.body.originalPrice,
      discountedPrice: req.body.discountedPrice,
      maxBookings:     req.body.maxBookings,
      validFrom:       req.body.validFrom,
      validTo:         req.body.validTo,
      services:        req.body.services,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPartnerCombos(req, res, next) {
  try {
    const data = await service.listPartnerCombos(req.user.partnerId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPendingCombos(req, res, next) {
  try {
    const data = await service.listPendingCombos();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function approveCombo(req, res, next) {
  try {
    await service.approveCombo({ comboId: req.params.comboId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function rejectCombo(req, res, next) {
  try {
    await service.rejectCombo({
      comboId: req.params.comboId,
      reason:  req.body.reason,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCombo, listPartnerCombos, listPendingCombos, approveCombo, rejectCombo };
