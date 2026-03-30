// Load and validate environment variables before anything else.
// This will throw immediately if required vars are missing.
require('./src/config/env');
require('dotenv').config();

const app = require('./src/app');
const { connectPostgres, connectMongo } = require('./src/config/db');
// Importing redis triggers connection and logs connect/error events
require('./src/config/redis');

const env = require('./src/config/env');

async function start() {
  await connectPostgres();
  await connectMongo();

  app.listen(env.PORT, () => {
    console.log(`VNS server listening on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
