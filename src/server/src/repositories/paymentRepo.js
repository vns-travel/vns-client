const { query } = require('../config/db');

async function create(data, client) {
  const db = client || { query: (t, p) => query(t, p) };
  const { bookingId, type, method, amount, platformFeeAmount, partnerPayoutAmount } = data;
  const { rows } = await db.query(
    `INSERT INTO payments (booking_id, type, method, amount, platform_fee_amount, partner_payout_amount)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [bookingId, type || 'full', method, amount, platformFeeAmount || 0, partnerPayoutAmount || null]
  );
  return rows[0];
}

async function findByBookingId(bookingId) {
  const { rows } = await query(
    'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC',
    [bookingId]
  );
  return rows;
}

async function updateStatus(id, status, extra = {}) {
  const { gatewayTxId, gatewayResponse, paidAt } = extra;
  const { rows } = await query(
    `UPDATE payments
     SET status = $1,
         gateway_tx_id = COALESCE($2, gateway_tx_id),
         gateway_response = COALESCE($3, gateway_response),
         paid_at = COALESCE($4, paid_at)
     WHERE id = $5 RETURNING *`,
    [status, gatewayTxId || null, gatewayResponse ? JSON.stringify(gatewayResponse) : null, paidAt || null, id]
  );
  return rows[0] || null;
}

async function findByGatewayTxId(gatewayTxId) {
  const { rows } = await query(
    'SELECT * FROM payments WHERE gateway_tx_id = $1',
    [gatewayTxId]
  );
  return rows[0] || null;
}

module.exports = { create, findByBookingId, updateStatus, findByGatewayTxId };
