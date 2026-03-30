const service = require('./services.service');

async function createService(req, res, next) {
  try {
    const data = await service.createService({
      partnerId: req.user.partnerId,
      serviceType: req.body.serviceType,
      title: req.body.title,
      city: req.body.city,
      address: req.body.address,
      description: req.body.description,
      tourDetails: req.body.tourDetails,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function submitService(req, res, next) {
  try {
    await service.submitService({
      serviceId: req.params.serviceId,
      partnerId: req.user.partnerId,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function listPartnerServices(req, res, next) {
  try {
    const data = await service.listPartnerServices(req.user.partnerId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createService, submitService, listPartnerServices };
