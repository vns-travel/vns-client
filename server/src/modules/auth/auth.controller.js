const service = require('./auth.service');

async function register(req, res, next) {
  try {
    const data = await service.register({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = await service.login({
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
