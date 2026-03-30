const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Verifies the JWT in the Authorization header and attaches the decoded
 * payload to req.user. Rejects with 401 if the token is missing or invalid.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
