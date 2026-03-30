const partnerService      = require('../services/partnerService');
const { success, fail }   = require('../utils/response');

const KNOWN_ERRORS = new Set([
  'Partner profile not found',
  'Partner not found',
  'Approved partners cannot re-upload documents',
  'Partner is not in reviewing status',
  'Partner is not in a rejectable status',
]);

function handleError(err, res, next) {
  if (KNOWN_ERRORS.has(err.message)) {
    return fail(res, err.message, 'PARTNER_ERROR', 400);
  }
  next(err);
}

async function getMyProfile(req, res, next) {
  try {
    const data = await partnerService.getMyProfile(req.user.userId);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

async function updateMyProfile(req, res, next) {
  try {
    const data = await partnerService.updateMyProfile(req.user.userId, req.body);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

async function uploadDocuments(req, res, next) {
  try {
    const data = await partnerService.uploadDocuments(req.user.userId, req.body.documents);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

async function getAllPartners(req, res, next) {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const { partners, total } = await partnerService.getAllPartners(req.query);
    success(res, { partners }, { total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) });
  } catch (err) { handleError(err, res, next); }
}

async function getPartnerById(req, res, next) {
  try {
    const data = await partnerService.getPartnerById(req.params.partnerId);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

async function approvePartner(req, res, next) {
  try {
    const data = await partnerService.approvePartner(req.params.partnerId);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

async function rejectPartner(req, res, next) {
  try {
    const data = await partnerService.rejectPartner(req.params.partnerId, req.body.reason);
    success(res, data);
  } catch (err) { handleError(err, res, next); }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadDocuments,
  getAllPartners,
  getPartnerById,
  approvePartner,
  rejectPartner,
};
