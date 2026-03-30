const partnerRepo = require('../repositories/partnerRepo');

async function getProfile(userId) {
  return partnerRepo.findByUserId(userId);
}

async function createProfile(userId, payload) {
  const existing = await partnerRepo.findByUserId(userId);
  if (existing) throw Object.assign(new Error('Partner profile already exists'), { code: 'ALREADY_EXISTS', statusCode: 409 });
  return partnerRepo.create({ userId, ...payload });
}

async function updateVerifyStatus(partnerId, status, rejectionReason) {
  return partnerRepo.updateVerifyStatus(partnerId, status, rejectionReason);
}

module.exports = { getProfile, createProfile, updateVerifyStatus };
