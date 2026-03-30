/**
 * Global Express error handler — must be registered LAST in app.js.
 * All async controller errors are forwarded via next(err).
 *
 * Attaches statusCode to thrown errors to control HTTP status:
 *   const err = new Error('Not found'); err.statusCode = 404; throw err;
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack || err.message);

  // Determine status code from the error or fall back to 500
  let status = err.statusCode || err.status || 500;

  // ZodError from manual validation (not via middleware)
  if (err.name === 'ZodError') status = 400;

  const message = status === 500 ? 'Internal server error' : (err.message || 'Something went wrong');

  res.status(status).json({
    success: false,
    message,
    code: err.code || 'SERVER_ERROR',
  });
}

module.exports = errorHandler;
