const { z } = require('zod');

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  MONGO_URI:    z.string().min(1),
  REDIS_URL:    z.string().min(1),
  JWT_SECRET:   z.string().min(1),
  PORT:         z.string().default('3000'),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const missing = result.error.issues.map(i => i.path.join('.')).join(', ');
  throw new Error(`Missing or invalid environment variables: ${missing}`);
}

module.exports = result.data;
