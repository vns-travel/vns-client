const { fail } = require('../utils/response');

function notFound(req, res) {
  return fail(res, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND', 404);
}

module.exports = notFound;
