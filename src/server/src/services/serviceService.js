const serviceRepo = require('../repositories/serviceRepo');

async function getAll(filters = {}) {
  return serviceRepo.findAll(filters);
}

async function getById(id) {
  const service = await serviceRepo.findById(id);
  if (!service) throw Object.assign(new Error('Service not found'), { code: 'NOT_FOUND', statusCode: 404 });
  return service;
}

async function create(partnerId, payload) {
  // TODO: validate partner is approved before allowing service creation
  return serviceRepo.create({ partnerId, ...payload });
}

async function updateStatus(id, status, reason) {
  const service = await serviceRepo.findById(id);
  if (!service) throw Object.assign(new Error('Service not found'), { code: 'NOT_FOUND', statusCode: 404 });
  return serviceRepo.updateStatus(id, status);
}

module.exports = { getAll, getById, create, updateStatus };
