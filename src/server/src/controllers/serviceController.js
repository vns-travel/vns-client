const serviceService = require('../services/serviceService');
const { success, fail } = require('../utils/response');

async function getAll(req, res, next) {
  try {
    const data = await serviceService.getAll(req.query);
    success(res, data);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const data = await serviceService.getById(req.params.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function approveService(req, res, next) {
  try {
    const data = await serviceService.updateStatus(req.params.id, 'approved');
    success(res, data);
  } catch (err) { next(err); }
}

async function rejectService(req, res, next) {
  try {
    const data = await serviceService.updateStatus(req.params.id, 'rejected', req.body.reason);
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, approveService, rejectService };
