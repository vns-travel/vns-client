// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./partners.service');

async function listPartners(req, res, next) {
  try {
    const data = await service.listPartners({ status: req.query.status });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPendingPartners(req, res, next) {
  try {
    const data = await service.listPendingPartners();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function approvePartner(req, res, next) {
  try {
    await service.approvePartner({ partnerId: req.params.partnerId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function rejectPartner(req, res, next) {
  try {
    await service.rejectPartner({
      partnerId: req.params.partnerId,
      reason:    req.body.reason,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPartners, listPendingPartners, approvePartner, rejectPartner };
