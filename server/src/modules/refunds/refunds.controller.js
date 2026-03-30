const service = require('./refunds.service');

// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

// Example stub:
// async function getAll(req, res, next) {
//   try {
//     const data = await service.getAll();
//     res.json({ success: true, data });
//   } catch (err) {
//     next(err);
//   }
// }

module.exports = {};
