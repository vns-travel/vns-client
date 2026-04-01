// Rate limiting middleware backed by Redis.
//
// Uses a fixed-window counter per key. The INCR + EXPIRE are executed as a
// single Lua script so the key always has a TTL — no zombie keys if the
// process crashes between two separate INCR and EXPIRE commands.
//
// Fails open when Redis is unavailable: a Redis outage must never prevent
// legitimate users from logging in.

const redis = require('../config/redis');

// Atomic: increment counter and set TTL on first hit in a window.
// Returns the updated count as an integer.
const INCR_EXPIRE_SCRIPT = `
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end
  return count
`;

/**
 * Returns an Express middleware that enforces a fixed-window rate limit.
 *
 * @param {object}          opts
 * @param {(req) => string} opts.keyFn      — derives a unique key suffix from the request (e.g. IP, email)
 * @param {number}          opts.max        — max requests allowed per window
 * @param {number}          opts.windowSecs — window duration in seconds
 */
function rateLimit({ keyFn, max, windowSecs }) {
  return async function rateLimitMiddleware(req, res, next) {
    const key = `rl:${keyFn(req)}`;
    try {
      const count = await redis.eval(INCR_EXPIRE_SCRIPT, 1, key, String(windowSecs));

      if (count > max) {
        const ttl = await redis.ttl(key);
        res.set('Retry-After', String(Math.max(ttl, 1)));
        return res.status(429).json({
          success: false,
          message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
          code:    'RATE_LIMIT_EXCEEDED',
        });
      }

      next();
    } catch (err) {
      // Fail open — a Redis outage must not lock users out of auth.
      console.error('[rateLimit] Redis error, failing open:', err.message);
      next();
    }
  };
}

module.exports = { rateLimit };
