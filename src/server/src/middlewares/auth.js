const { verifyToken } = require('../utils/jwt');
const { fail }        = require('../utils/response');

/**
 * Verifies the Bearer JWT, attaches decoded payload to req.user.
 * Any protected route must have this middleware before the handler.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'Authentication required', 'AUTH_REQUIRED', 401);
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    return fail(res, 'Invalid or expired token', 'AUTH_INVALID', 401);
  }
}

module.exports = auth;
