// Load and validate all required environment variables at startup.
// Anything missing here crashes the process immediately rather than failing
// silently at runtime — fail fast is intentional.
const required = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
];

const missing = required.filter((key) => !process.env[key]);
// Support both MONGODB_URI (spec) and MONGO_URI (legacy .env key)
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  missing.push('MONGODB_URI');
}
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = {
  PORT:                parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL:        process.env.DATABASE_URL,
  MONGODB_URI:         process.env.MONGODB_URI || process.env.MONGO_URI,
  REDIS_URL:           process.env.REDIS_URL,
  JWT_SECRET:          process.env.JWT_SECRET,
  JWT_EXPIRES_IN:      process.env.JWT_EXPIRES_IN || '7d',
  // Payment gateways — optional in dev, required in prod
  ZALOPAY_APP_ID:      process.env.ZALOPAY_APP_ID,
  ZALOPAY_KEY1:        process.env.ZALOPAY_KEY1,
  ZALOPAY_KEY2:        process.env.ZALOPAY_KEY2,
  ZALOPAY_ENDPOINT:    process.env.ZALOPAY_ENDPOINT,
  PAYOS_CLIENT_ID:     process.env.PAYOS_CLIENT_ID,
  PAYOS_API_KEY:       process.env.PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY:  process.env.PAYOS_CHECKSUM_KEY,
  PLATFORM_FEE_PERCENT: parseFloat(process.env.PLATFORM_FEE_PERCENT || '10'),
  // SMTP — required for OTP email delivery
  SMTP_HOST:  process.env.SMTP_HOST,
  SMTP_PORT:  parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER:  process.env.SMTP_USER,
  SMTP_PASS:  process.env.SMTP_PASS,
  SMTP_FROM:  process.env.SMTP_FROM,
};
