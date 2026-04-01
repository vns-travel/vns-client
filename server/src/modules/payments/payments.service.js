// All business logic for the payments domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');
const payos = require('../../config/payos');
const env = require('../../config/env');
const { notify } = require('../notifications/notifications.service');

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

// ---------------------------------------------------------------------------
// initiatePayment
// Creates a pending payment row and a PayOS hosted checkout link.
// Only one un-paid payment per booking is allowed at a time.
// ---------------------------------------------------------------------------

/**
 * Initiate a PayOS payment for an existing pending booking.
 * Returns { checkoutUrl, paymentId } on success.
 */
async function initiatePayment({ bookingId, userId }) {
  // Load the booking — must belong to the calling user and be in 'pending' status
  const bookingRes = await pool.query(
    `SELECT id, user_id, final_amount, status FROM bookings WHERE id = $1`,
    [bookingId],
  );
  if (!bookingRes.rows.length) {
    const err = new Error('Booking không tồn tại'); err.statusCode = 404; throw err;
  }
  const booking = bookingRes.rows[0];

  if (booking.user_id !== userId) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }
  if (booking.status !== 'pending') {
    const err = new Error('Chỉ có thể thanh toán booking đang ở trạng thái chờ');
    err.statusCode = 422; err.code = 'BOOKING_NOT_PENDING'; throw err;
  }

  // Guard: prevent duplicate PayOS payment rows.
  // - If a paid PayOS row exists: booking is already settled.
  // - If a pending PayOS row exists with a checkout URL: re-use it so the user
  //   can return to the same payment page without creating a second record.
  // A pending row with no checkout URL (PayOS call failed last time) falls
  // through so we retry and update that same row.
  const existingPayos = await pool.query(
    `SELECT id, status, gateway_response
     FROM payments
     WHERE booking_id = $1 AND method = 'payos'
     ORDER BY created_at DESC
     LIMIT 1`,
    [bookingId],
  );
  if (existingPayos.rows.length) {
    const existing = existingPayos.rows[0];
    if (existing.status === 'paid') {
      const err = new Error('Booking này đã được thanh toán');
      err.statusCode = 422; err.code = 'ALREADY_PAID'; throw err;
    }
    if (existing.status === 'pending') {
      const stored = existing.gateway_response ? JSON.parse(existing.gateway_response) : {};
      if (stored.checkoutUrl) {
        // Return the existing checkout link — idempotent re-initiation.
        return { checkoutUrl: stored.checkoutUrl, paymentId: existing.id };
      }
      // No checkout URL means the PayOS call failed previously; fall through
      // to retry, but reuse this row's id to avoid creating a duplicate.
    }
  }

  // PayOS requires a unique positive integer order code (max 9007199254740991).
  // We derive it from Date.now() which gives us ms-precision uniqueness.
  const orderCode = Date.now();

  const amount = Math.round(Number(booking.final_amount));

  // If a previous pending row exists but has no checkout URL (failed PayOS call),
  // reuse it rather than inserting a new one.
  let paymentId;
  if (existingPayos.rows.length && existingPayos.rows[0].status === 'pending') {
    await pool.query(
      `UPDATE payments SET gateway_tx_id = $1, gateway_response = NULL WHERE id = $2`,
      [String(orderCode), existingPayos.rows[0].id],
    );
    paymentId = existingPayos.rows[0].id;
  } else {
    // Insert the payment row before calling PayOS so we have a local record
    // even if the redirect is never completed by the user.
    const paymentInsert = await pool.query(
      `INSERT INTO payments (booking_id, type, method, status, amount, gateway_tx_id)
       VALUES ($1, 'full', 'payos', 'pending', $2, $3)
       RETURNING id`,
      [bookingId, amount, String(orderCode)],
    );
    paymentId = paymentInsert.rows[0].id;
  }

  // Call PayOS to create a hosted checkout link
  let payosResponse;
  try {
    payosResponse = await payos.createPaymentLink({
      orderCode,
      amount,
      description: `VNS-${bookingId.slice(0, 8).toUpperCase()}`,
      returnUrl: env.PAYOS_RETURN_URL,
      cancelUrl: env.PAYOS_CANCEL_URL,
    });
  } catch (payosErr) {
    // Mark payment as failed so the user can retry; don't expose internal detail
    await pool.query(
      `UPDATE payments SET status = 'failed', gateway_response = $1 WHERE id = $2`,
      [JSON.stringify({ error: payosErr.message }), paymentId],
    );
    const err = new Error('Không thể tạo liên kết thanh toán, vui lòng thử lại');
    err.statusCode = 502; err.code = 'PAYOS_ERROR'; throw err;
  }

  // Persist the PayOS checkout URL in gateway_response for audit trail
  await pool.query(
    `UPDATE payments SET gateway_response = $1 WHERE id = $2`,
    [JSON.stringify(payosResponse), paymentId],
  );

  return { checkoutUrl: payosResponse.checkoutUrl, paymentId };
}

// ---------------------------------------------------------------------------
// handlePayosWebhook
// Verifies the PayOS signature, then marks the payment as paid and advances
// the booking to 'confirmed'. Safe to call multiple times (idempotent).
// ---------------------------------------------------------------------------

/**
 * Process an inbound PayOS webhook payload.
 * webhookBody is the raw parsed JSON from the request.
 */
async function handlePayosWebhook(webhookBody) {
  // The SDK verifies the HMAC-SHA256 signature and throws if invalid
  let data;
  try {
    data = payos.verifyPaymentWebhookData(webhookBody);
  } catch {
    const err = new Error('Webhook signature không hợp lệ');
    err.statusCode = 400; err.code = 'INVALID_SIGNATURE'; throw err;
  }

  // data.orderCode is the numeric value we set during initiation
  const orderCode = String(data.orderCode);

  // Find the payment row by our gateway_tx_id (the orderCode we stored)
  const paymentRes = await pool.query(
    `SELECT id, booking_id, status FROM payments WHERE gateway_tx_id = $1`,
    [orderCode],
  );
  if (!paymentRes.rows.length) {
    // Unknown order — acknowledge receipt so PayOS stops retrying
    return { acknowledged: true };
  }

  const payment = paymentRes.rows[0];

  // Idempotency: if already processed, nothing to do
  if (payment.status === 'paid') {
    return { acknowledged: true };
  }

  // PayOS sends code '00' for successful payment
  if (data.code !== '00') {
    // Payment failed or was cancelled — update row and leave booking pending
    await pool.query(
      `UPDATE payments
       SET status = 'failed', gateway_response = $1
       WHERE id = $2`,
      [JSON.stringify(data), payment.id],
    );
    return { acknowledged: true };
  }

  // Successful payment — compute the revenue split and persist everything
  // in a single transaction so the fee columns are never left empty on a paid row.
  const feeRate = env.PLATFORM_FEE_RATE_PERCENT;
  const grossAmount = Number(
    (await pool.query('SELECT amount FROM payments WHERE id = $1', [payment.id])).rows[0].amount,
  );
  // Round to whole VNĐ — no fractional currency in Vietnamese payments.
  const platformFeeAmount = Math.round(grossAmount * feeRate / 100);
  const partnerPayoutAmount = grossAmount - platformFeeAmount;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE payments
       SET status = 'paid',
           paid_at = NOW(),
           platform_fee_amount  = $1,
           partner_payout_amount = $2,
           gateway_response     = $3
       WHERE id = $4`,
      [platformFeeAmount, partnerPayoutAmount, JSON.stringify(data), payment.id],
    );

    // Advance booking: pending → confirmed (state machine guard)
    const bookingRes = await client.query(
      `SELECT status FROM bookings WHERE id = $1`,
      [payment.booking_id],
    );
    if (bookingRes.rows.length && bookingRes.rows[0].status === 'pending') {
      await client.query(
        `UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
        [payment.booking_id],
      );
    }

    await client.query('COMMIT');
  } catch (txErr) {
    await client.query('ROLLBACK');
    throw txErr;
  } finally {
    client.release();
  }

  // Fire-and-forget: notify both the customer and the partner post-commit.
  // Single query fetches all required IDs to avoid multiple round-trips.
  pool.query(
    `SELECT b.user_id, par.user_id AS partner_user_id
     FROM bookings b
     LEFT JOIN services s   ON s.id  = b.service_id
     LEFT JOIN partners par ON par.id = s.partner_id
     WHERE b.id = $1`,
    [payment.booking_id],
  )
    .then(({ rows }) => {
      if (!rows.length) return;
      notify(rows[0].user_id, {
        title: 'Thanh toán thành công',
        body:  'Thanh toán của bạn đã được xác nhận. Booking đã được xác nhận!',
        type:  'payment',
        refId: payment.booking_id,
      });
      if (rows[0].partner_user_id) {
        notify(rows[0].partner_user_id, {
          title: 'Đặt chỗ đã thanh toán',
          body:  'Một đặt chỗ của bạn đã được khách thanh toán và xác nhận.',
          type:  'booking',
          refId: payment.booking_id,
        });
      }
    })
    .catch((err) => console.error('[notifications] payment webhook notify failed:', err.message));

  return { acknowledged: true };
}

// ---------------------------------------------------------------------------
// getPartnerEarnings
// Returns aggregate revenue stats + recent transactions for a single partner.
// Used by the Partner Finance page.
// ---------------------------------------------------------------------------

async function getPartnerEarnings({ partnerId }) {
  // Aggregate totals across all time and current calendar month
  const statsRes = await pool.query(
    `SELECT
       COUNT(p.id) FILTER (WHERE p.status = 'paid')                                           AS total_transactions,
       COALESCE(SUM(p.amount)                FILTER (WHERE p.status = 'paid'), 0)             AS total_gross,
       COALESCE(SUM(p.platform_fee_amount)   FILTER (WHERE p.status = 'paid'), 0)             AS total_fees,
       COALESCE(SUM(p.partner_payout_amount) FILTER (WHERE p.status = 'paid'), 0)             AS total_net,
       COALESCE(SUM(p.amount) FILTER (
         WHERE p.status = 'paid'
           AND DATE_TRUNC('month', p.paid_at) = DATE_TRUNC('month', NOW())
       ), 0)                                                                                   AS monthly_gross,
       COALESCE(SUM(p.partner_payout_amount) FILTER (
         WHERE p.status = 'paid'
           AND DATE_TRUNC('month', p.paid_at) = DATE_TRUNC('month', NOW())
       ), 0)                                                                                   AS monthly_net,
       COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'pending'), 0)                        AS pending_amount
     FROM payments p
     JOIN bookings b ON b.id = p.booking_id
     JOIN services s ON s.id = b.service_id
     WHERE s.partner_id = $1`,
    [partnerId],
  );

  const stats = statsRes.rows[0];

  // Most recent 50 paid/pending payment rows for the transactions table
  const txRes = await pool.query(
    `SELECT
       p.id, p.amount, p.platform_fee_amount, p.partner_payout_amount,
       p.status, p.method, p.paid_at, p.created_at,
       s.title AS service_title, s.type AS service_type
     FROM payments p
     JOIN bookings b ON b.id = p.booking_id
     JOIN services s ON s.id = b.service_id
     WHERE s.partner_id = $1
     ORDER BY p.created_at DESC
     LIMIT 50`,
    [partnerId],
  );

  return {
    summary: {
      totalTransactions: Number(stats.total_transactions),
      totalGross:        Number(stats.total_gross),
      totalFees:         Number(stats.total_fees),
      totalNet:          Number(stats.total_net),
      monthlyGross:      Number(stats.monthly_gross),
      monthlyNet:        Number(stats.monthly_net),
      pendingAmount:     Number(stats.pending_amount),
      feeRatePercent:    env.PLATFORM_FEE_RATE_PERCENT,
    },
    transactions: txRes.rows.map((p) => ({
      paymentId:          p.id,
      amount:             Number(p.amount),
      platformFeeAmount:  p.platform_fee_amount ? Number(p.platform_fee_amount) : null,
      partnerPayoutAmount: p.partner_payout_amount ? Number(p.partner_payout_amount) : null,
      status:             p.status,
      method:             p.method,
      serviceTitle:       p.service_title,
      serviceType:        p.service_type,
      paidAt:             p.paid_at,
      createdAt:          p.created_at,
    })),
  };
}

// ---------------------------------------------------------------------------
// getPlatformRevenue
// Returns platform-wide revenue stats + per-partner breakdown + recent txns.
// Used by the Manager Finance page. Restricted to manager/admin callers.
// ---------------------------------------------------------------------------

async function getPlatformRevenue() {
  // Platform totals
  const statsRes = await pool.query(
    `SELECT
       COUNT(id) FILTER (WHERE status = 'paid')                                   AS total_transactions,
       COALESCE(SUM(amount)                FILTER (WHERE status = 'paid'), 0)     AS total_gross,
       COALESCE(SUM(platform_fee_amount)   FILTER (WHERE status = 'paid'), 0)     AS total_fees,
       COALESCE(SUM(partner_payout_amount) FILTER (WHERE status = 'paid'), 0)     AS total_payouts
     FROM payments`,
  );

  // Per-partner breakdown ordered by gross revenue descending
  const partnersRes = await pool.query(
    `SELECT
       pp.id                                                                                AS partner_id,
       pp.business_name,
       COUNT(p.id) FILTER (WHERE p.status = 'paid')                                       AS transactions,
       COALESCE(SUM(p.amount)                FILTER (WHERE p.status = 'paid'), 0)         AS total_gross,
       COALESCE(SUM(p.platform_fee_amount)   FILTER (WHERE p.status = 'paid'), 0)         AS total_fees,
       COALESCE(SUM(p.partner_payout_amount) FILTER (WHERE p.status = 'paid'), 0)         AS total_net
     FROM partner_profiles pp
     LEFT JOIN services s ON s.partner_id = pp.id
     LEFT JOIN bookings b ON b.service_id = s.id
     LEFT JOIN payments p ON p.booking_id = b.id
     GROUP BY pp.id, pp.business_name
     ORDER BY total_gross DESC NULLS LAST
     LIMIT 20`,
  );

  // Recent 50 paid transactions across all partners
  const txRes = await pool.query(
    `SELECT
       p.id, p.amount, p.platform_fee_amount, p.partner_payout_amount,
       p.status, p.method, p.paid_at, p.created_at,
       pp.business_name AS partner_name,
       s.title          AS service_title
     FROM payments p
     JOIN bookings b    ON b.id = p.booking_id
     JOIN services s    ON s.id = b.service_id
     JOIN partner_profiles pp ON pp.id = s.partner_id
     WHERE p.status = 'paid'
     ORDER BY p.paid_at DESC
     LIMIT 50`,
  );

  const stats = statsRes.rows[0];

  return {
    summary: {
      totalTransactions: Number(stats.total_transactions),
      totalGross:        Number(stats.total_gross),
      totalFees:         Number(stats.total_fees),
      totalPayouts:      Number(stats.total_payouts),
      feeRatePercent:    env.PLATFORM_FEE_RATE_PERCENT,
    },
    partnerBreakdown: partnersRes.rows.map((r) => ({
      partnerId:    r.partner_id,
      businessName: r.business_name,
      transactions: Number(r.transactions),
      totalGross:   Number(r.total_gross),
      totalFees:    Number(r.total_fees),
      totalNet:     Number(r.total_net),
    })),
    transactions: txRes.rows.map((p) => ({
      paymentId:          p.id,
      amount:             Number(p.amount),
      platformFeeAmount:  p.platform_fee_amount ? Number(p.platform_fee_amount) : null,
      partnerPayoutAmount: p.partner_payout_amount ? Number(p.partner_payout_amount) : null,
      status:             p.status,
      method:             p.method,
      partnerName:        p.partner_name,
      serviceTitle:       p.service_title,
      paidAt:             p.paid_at,
      createdAt:          p.created_at,
    })),
  };
}

module.exports = {
  getPaymentsByBooking,
  initiatePayment,
  handlePayosWebhook,
  getPartnerEarnings,
  getPlatformRevenue,
};
