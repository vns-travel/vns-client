/**
 * Unified response helpers — every controller must use these so the API
 * always returns { success, data, meta } or { success, message, code }.
 */

function success(res, data, meta = null, status = 200) {
  const body = { success: true, data };
  if (meta !== null) body.meta = meta;
  return res.status(status).json(body);
}

function fail(res, message, code = null, status = 400) {
  return res.status(status).json({ success: false, message, code });
}

module.exports = { success, fail };
