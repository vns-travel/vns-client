/**
 * Zod request validation middleware.
 * Usage: validate(schema) — validates req.body against the provided Zod schema.
 * Returns 400 with formatted errors on failure; calls next() on success.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

/**
 * Zod query-string validation middleware.
 * Usage: validateQuery(schema) — validates req.query against the provided Zod schema.
 * Returns 400 with formatted errors on failure; calls next() on success.
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.query = result.data;
    next();
  };
}

/**
 * Zod URL-params validation middleware.
 * Usage: validateParams(schema) — validates req.params against the provided Zod schema.
 * Returns 400 with formatted errors on failure; calls next() on success.
 */
function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL parameters',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.params = result.data;
    next();
  };
}

module.exports = { validate, validateQuery, validateParams };
