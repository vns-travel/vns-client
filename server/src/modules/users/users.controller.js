// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./users.service');

async function getMe(req, res, next) {
  try {
    const data = await service.getProfile(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const data = await service.updateProfile(req.user.id, {
      fullName:  req.body.fullName,
      phone:     req.body.phone,
      avatarUrl: req.body.avatarUrl,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    await service.changePassword(req.user.id, {
      currentPassword: req.body.currentPassword,
      newPassword:     req.body.newPassword,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, changePassword };
