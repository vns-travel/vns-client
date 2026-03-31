// dotenv must populate process.env before env.js runs its validation check.
require('dotenv').config();
require('./src/config/env');

const app = require('./src/app');
const { connectPostgres, connectMongo } = require('./src/config/db');
// Importing redis triggers connection and logs connect/error events
require('./src/config/redis');

const env = require('./src/config/env');
const { startBookingCrons } = require('./src/jobs/bookings.cron');

async function start() {
  await connectPostgres();
  await connectMongo();

  // Start cron jobs after DB connections are confirmed so the first run
  // never races against an uninitialised pg pool.
  startBookingCrons();

  app.listen(env.PORT, () => {
    console.log(`VNS server listening on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
