const paymentRepo = require('../repositories/paymentRepo');
const bookingRepo = require('../repositories/bookingRepo');

async function initiatePayment(bookingId, method) {
  // TODO: create payment gateway order (ZaloPay / PayOS)
  // Return the gateway redirect URL / QR payload
  return null;
}

async function handleCallback(gatewayName, payload) {
  // Idempotency: if already confirmed, ignore duplicate callback
  // TODO: verify gateway signature, parse bookingId + status from payload
  // On success: update payment → paid, booking → confirmed, notify user + partner
  // On failure: update payment → failed, booking → cancelled, restore inventory
  return null;
}

async function initiateRefund(bookingId, approvedAmount) {
  // TODO: call gateway refund API, create refund payment row
  return null;
}

module.exports = { initiatePayment, handleCallback, initiateRefund };
