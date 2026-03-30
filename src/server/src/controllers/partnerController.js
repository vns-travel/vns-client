const partnerService = require('../services/partnerService');
const { success }    = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const data = await partnerService.getProfile(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function createProfile(req, res, next) {
  try {
    const data = await partnerService.createProfile(req.user.id, req.body);
    success(res, data, null, 201);
  } catch (err) { next(err); }
}

module.exports = { getProfile, createProfile };
