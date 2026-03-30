// dotenv must be loaded before any other local require so env vars are
// available when config/env.js runs its validation check.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const env                              = require('./config/env');
const app                              = require('./app');
const { connectPostgres, connectMongo } = require('./config/db');
const startJobs                        = require('./jobs');

async function start() {
  await connectPostgres();
  await connectMongo();
  startJobs();

  app.listen(env.PORT, () => {
    console.log(`[Server] VNS API listening on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Startup failed:', err.message);
  process.exit(1);
});
