const serviceRepo       = require('../repositories/serviceRepo');
const partnerRepo       = require('../repositories/partnerRepo');
const notificationService = require('./notificationService');

async function createService(userId, payload) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  // Only approved partners may list services — unverified accounts could abuse the catalog.
  if (partner.verify_status !== 'approved') {
    throw new Error('Your account must be approved to list services');
  }

  const status = payload.asDraft ? 'draft' : 'pending';

  const service = await serviceRepo.create({
    partnerId: partner.id,
    type:      payload.serviceType,
    title:     payload.title,
    description: payload.description,
    city:      payload.city,
    address:   payload.address,
    latitude:  payload.latitude,
    longitude: payload.longitude,
    status,
  });

  if (payload.images && payload.images.length > 0) {
    await serviceRepo.addImages(service.id, payload.images);
  }

  return { service };
}

async function getServiceById(serviceId) {
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service not found');

  const images = await serviceRepo.getImages(serviceId);
  return { service, images };
}

async function getPartnerServices(userId, filters = {}) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  const services = await serviceRepo.findAll({ ...filters, partnerId: partner.id });
  return { services };
}

async function getPublicCatalog(filters = {}) {
  // Always force approved regardless of query params — public catalog must never expose drafts.
  const services = await serviceRepo.findAll({ ...filters, status: 'approved' });
  return { services };
}

async function submitForReview(serviceId, userId) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  const owned = await serviceRepo.verifyOwnership(serviceId, partner.id);
  if (!owned) throw new Error('You do not own this service');

  const service = await serviceRepo.findById(serviceId);
  if (service.status !== 'draft') {
    throw new Error('Only draft services can be submitted');
  }

  await serviceRepo.updateStatus(serviceId, 'pending');
  return { message: 'Submitted for review successfully' };
}

async function approveService(serviceId, managerId) {
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service not found');

  if (service.status !== 'pending') {
    throw new Error('Service is not pending review');
  }

  const updated = await serviceRepo.updateStatus(serviceId, 'approved');

  // Notify the partner's user account so they know the listing is live.
  const partner = await partnerRepo.findById(service.partner_id);
  if (partner) {
    await notificationService.send(
      partner.user_id,
      'Service Approved',
      `Your service "${service.title}" is now live.`,
      'system',
      serviceId
    );
  }

  return { message: 'Service approved', service: updated };
}

async function rejectService(serviceId, managerId, reason) {
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service not found');

  if (service.status !== 'pending') {
    throw new Error('Service is not pending review');
  }

  const updated = await serviceRepo.updateStatus(serviceId, 'rejected', reason);

  const partner = await partnerRepo.findById(service.partner_id);
  if (partner) {
    await notificationService.send(
      partner.user_id,
      'Service Not Approved',
      `Your service "${service.title}" was rejected. Reason: ${reason}`,
      'system',
      serviceId
    );
  }

  return { message: 'Service rejected', service: updated };
}

module.exports = {
  createService,
  getServiceById,
  getPartnerServices,
  getPublicCatalog,
  submitForReview,
  approveService,
  rejectService,
};
