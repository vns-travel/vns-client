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

async function getServiceById(req, res, next) {
  try {
    const data = await service.getServiceById(req.params.serviceId);
    if (!data) return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    // Ownership check: partner can only view their own services via this route
    if (data.partnerId !== req.user.partnerId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const data = await service.updateService({
      serviceId: req.params.serviceId,
      partnerId: req.user.partnerId,
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      address: req.body.address,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    await service.deleteService({
      serviceId: req.params.serviceId,
      partnerId: req.user.partnerId,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createService, submitService, listPartnerServices, getServiceById, updateService, deleteService };
