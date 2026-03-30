const { v4: uuidv4 } = require('uuid');
const { redis }      = require('../config/db');

/**
 * Try to acquire a Redis lock.
 * Uses SET NX EX so the lock auto-expires even if the caller crashes.
 *
 * @returns {string|null} lockValue to pass to releaseLock, or null if not acquired
 */
async function acquireLock(key, ttlSeconds) {
  const lockValue = uuidv4();
  const result = await redis.set(key, lockValue, 'NX', 'EX', ttlSeconds);
  return result === 'OK' ? lockValue : null;
}

/**
 * Release a lock only if we still own it.
 * Lua script is atomic — prevents accidentally releasing another caller's lock
 * if ours expired between the GET check and the DEL.
 */
async function releaseLock(key, lockValue) {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  return redis.eval(script, 1, key, lockValue);
}

module.exports = { acquireLock, releaseLock };
