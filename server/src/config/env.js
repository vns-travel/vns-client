const { z } = require('zod');

const schema = z.object({
  DATABASE_URL:          z.string().min(1),
  MONGO_URI:             z.string().min(1),
  REDIS_URL:             z.string().min(1),
  JWT_SECRET:            z.string().min(1),
  PORT:                  z.string().default('3000'),
  PAYOS_CLIENT_ID:       z.string().min(1),
  PAYOS_API_KEY:         z.string().min(1),
  PAYOS_CHECKSUM_KEY:    z.string().min(1),
  PAYOS_RETURN_URL:           z.string().url(),
  PAYOS_CANCEL_URL:           z.string().url(),
  // Platform fee percentage charged on every successful payment (default 10%).
  PLATFORM_FEE_RATE_PERCENT:  z.coerce.number().min(0).max(100).default(10),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const missing = result.error.issues.map(i => i.path.join('.')).join(', ');
  throw new Error(`Missing or invalid environment variables: ${missing}`);
}

module.exports = result.data;
