// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./notifications.service');

async function list(req, res, next) {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const data  = await service.listMyNotifications({ userId: req.user.id, page, limit });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const data = await service.markRead({
      notificationId: req.params.id,
      userId: req.user.id,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    const data = await service.markAllRead({ userId: req.user.id });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead, markAllRead };
