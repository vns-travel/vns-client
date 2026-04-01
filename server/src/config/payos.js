// PayOS client singleton.
// Initialised once at startup using validated env vars.
// Import this wherever the PayOS SDK is needed.

const { PayOS } = require('@payos/node');
const env = require('./env');

const payos = new PayOS(
  env.PAYOS_CLIENT_ID,
  env.PAYOS_API_KEY,
  env.PAYOS_CHECKSUM_KEY,
);

module.exports = payos;
