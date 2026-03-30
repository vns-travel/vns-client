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

module.exports = { validate };
