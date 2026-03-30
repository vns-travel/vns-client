const notificationService = require('../services/notificationService');
const notificationRepo    = require('../repositories/notificationRepo');
const { success }         = require('../utils/response');

async function getUnread(req, res, next) {
  try {
    const data = await notificationService.getUnread(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    const data = await notificationRepo.markRead(req.params.id, req.user.id);
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { getUnread, markRead };
