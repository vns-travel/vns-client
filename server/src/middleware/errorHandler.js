/**
 * Centralised Express error handler. Must be registered last (after all routes).
 * Controllers and services signal errors by calling next(err).
 *
 * Attaches a statusCode property to the error to control HTTP status.
 * Unrecognised errors default to 500 Internal Server Error.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ success: false, message, code: err.code });
}

module.exports = { errorHandler };
