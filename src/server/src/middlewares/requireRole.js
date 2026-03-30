const { fail } = require('../utils/response');

/**
 * Role guard factory. Always use after auth middleware.
 * Usage: router.get('/path', auth, requireRole('manager'), handler)
 *        router.get('/path', auth, requireRole('manager', 'super_admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'Insufficient permissions', 'FORBIDDEN', 403);
    }
    next();
  };
}

module.exports = requireRole;
