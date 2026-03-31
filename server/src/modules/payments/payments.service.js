// All business logic for the payments domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

/**
 * Fetch all payment records for a given booking.
 * Authorization: caller must be the booking owner (customer) OR the partner
 * who owns the service, OR a manager/admin.
 */
async function getPaymentsByBooking({ bookingId, userId, partnerId, role }) {
  // Resolve the booking's owner and the service's partner for auth check
  const bookingRes = await pool.query(
    `SELECT b.user_id, s.partner_id
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     WHERE b.id = $1`,
    [bookingId]
  );

  if (!bookingRes.rows.length) {
    const err = new Error('Booking không tồn tại'); err.statusCode = 404; throw err;
  }

  const { user_id: bookingUserId, partner_id: bookingPartnerId } = bookingRes.rows[0];

  const isOwner = bookingUserId === userId;
  const isServicePartner = bookingPartnerId && bookingPartnerId === partnerId;
  const isManagerOrAdmin = role === 'manager' || role === 'super_admin';

  if (!isOwner && !isServicePartner && !isManagerOrAdmin) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }

  const { rows } = await pool.query(
    `SELECT id, type, method, status, amount,
            platform_fee_amount, partner_payout_amount,
            gateway_tx_id, paid_at, created_at
     FROM payments
     WHERE booking_id = $1
     ORDER BY created_at ASC`,
    [bookingId]
  );

  return rows.map((p) => ({
    paymentId: p.id,
    type: p.type,
    method: p.method,
    status: p.status,
    amount: Number(p.amount),
    platformFeeAmount: p.platform_fee_amount ? Number(p.platform_fee_amount) : null,
    partnerPayoutAmount: p.partner_payout_amount ? Number(p.partner_payout_amount) : null,
    gatewayTxId: p.gateway_tx_id,
    paidAt: p.paid_at,
    createdAt: p.created_at,
  }));
}

module.exports = { getPaymentsByBooking };
