// All business logic for the refunds domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

// ---------------------------------------------------------------------------
// Pure helper — no I/O, exported for use by bookings.service.js too.
// ---------------------------------------------------------------------------

/**
 * Calculate the refund amount a customer is entitled to based on
 * how far in advance they are cancelling relative to the service date.
 *
 * Policy shape (stored as JSONB on services.cancellation_policy):
 *   { fullRefundDays: N, partialRefundDays: M, partialRefundPercent: P }
 *
 * Uses continuous float days (not truncated integers) so that 23 hours
 * evaluates to ~0.96 days — correctly falling below a partialRefundDays of 1,
 * which maps to "no refund within 24h" as required by business rules.
 *
 * @param {number}  finalAmount       - Amount the customer paid
 * @param {object}  policy            - JSONB policy from services table
 * @param {Date}    serviceDatetime   - When the service starts
 * @param {Date}    cancellationDate  - When the cancellation is being requested (usually now)
 * @returns {number} Refund amount (0 ≤ result ≤ finalAmount)
 */
function calculateRefundAmount(finalAmount, policy, serviceDatetime, cancellationDate) {
  // Fallback: if policy is missing (pre-migration legacy row), use the same
  // default that the migration applies so behaviour is consistent.
  const p = policy || { fullRefundDays: 7, partialRefundDays: 1, partialRefundPercent: 50 };

  const MS_PER_DAY = 86_400_000;
  const daysUntilService = (new Date(serviceDatetime) - new Date(cancellationDate)) / MS_PER_DAY;

  if (daysUntilService >= p.fullRefundDays) {
    return finalAmount;
  }
  if (daysUntilService >= p.partialRefundDays) {
    // Round to 2 decimal places to match NUMERIC(12,2) column precision
    return Math.round(finalAmount * (p.partialRefundPercent / 100) * 100) / 100;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Customer-facing queries
// ---------------------------------------------------------------------------

/**
 * List all refund requests that belong to the authenticated customer.
 * Paginated; most-recent first.
 */
async function listMyRefunds({ userId, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT r.id, r.booking_id, r.status, r.requested_amount, r.approved_amount,
            r.rejection_reason, r.reason, r.requested_at, r.processed_at,
            b.status AS booking_status,
            s.title  AS service_title,
            s.type   AS service_type,
            COUNT(*) OVER() AS total_count
     FROM refunds r
     JOIN bookings b ON b.id = r.booking_id
     JOIN services s ON s.id = b.service_id
     WHERE b.user_id = $1
     ORDER BY r.requested_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  return {
    data: rows.map((r) => ({
      refundId:        r.id,
      bookingId:       r.booking_id,
      status:          r.status,
      requestedAmount: Number(r.requested_amount),
      approvedAmount:  r.approved_amount !== null ? Number(r.approved_amount) : null,
      rejectionReason: r.rejection_reason,
      reason:          r.reason,
      requestedAt:     r.requested_at,
      processedAt:     r.processed_at,
      bookingStatus:   r.booking_status,
      serviceTitle:    r.service_title,
      serviceType:     r.service_type,
    })),
    meta: { page, limit, total },
  };
}

/**
 * Get full detail of a single refund request.
 * Access control:
 *   customer   → must own the booking
 *   partner    → must own the service
 *   manager / super_admin → always allowed
 */
async function getRefundDetail({ refundId, userId, role, partnerId }) {
  const { rows } = await pool.query(
    `SELECT r.id, r.booking_id, r.payment_id, r.reason, r.evidence_urls,
            r.status, r.requested_amount, r.approved_amount,
            r.rejection_reason, r.requested_at, r.processed_at,
            b.user_id AS booking_user_id, b.status AS booking_status,
            b.final_amount,
            s.id AS service_id, s.title AS service_title, s.type AS service_type,
            s.partner_id
     FROM refunds r
     JOIN bookings b ON b.id = r.booking_id
     JOIN services s ON s.id = b.service_id
     WHERE r.id = $1`,
    [refundId]
  );

  if (!rows.length) {
    const err = new Error('Yêu cầu hoàn tiền không tồn tại');
    err.statusCode = 404;
    throw err;
  }

  const refund = rows[0];

  const isOwner           = refund.booking_user_id === userId;
  const isServicePartner  = refund.partner_id && refund.partner_id === partnerId;
  const isManagerOrAdmin  = role === 'manager' || role === 'super_admin';

  if (!isOwner && !isServicePartner && !isManagerOrAdmin) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }

  return {
    refundId:        refund.id,
    bookingId:       refund.booking_id,
    paymentId:       refund.payment_id,
    reason:          refund.reason,
    evidenceUrls:    refund.evidence_urls || [],
    status:          refund.status,
    requestedAmount: Number(refund.requested_amount),
    approvedAmount:  refund.approved_amount !== null ? Number(refund.approved_amount) : null,
    rejectionReason: refund.rejection_reason,
    requestedAt:     refund.requested_at,
    processedAt:     refund.processed_at,
    booking: {
      status:      refund.booking_status,
      finalAmount: Number(refund.final_amount),
    },
    service: {
      id:    refund.service_id,
      title: refund.service_title,
      type:  refund.service_type,
    },
  };
}

// ---------------------------------------------------------------------------
// Partner-facing mutations
// ---------------------------------------------------------------------------

/**
 * List refund requests for all services owned by this partner.
 * Paginated; most-recent first. Optionally filter by status.
 */
async function listPartnerRefunds({ partnerId, status, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  // Build optional status filter
  const conditions = ['s.partner_id = $1'];
  const params = [partnerId];

  if (status) {
    params.push(status);
    conditions.push(`r.status = $${params.length}`);
  }

  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT r.id, r.booking_id, r.status, r.requested_amount, r.approved_amount,
            r.rejection_reason, r.reason, r.requested_at, r.processed_at,
            b.user_id AS customer_id,
            s.id AS service_id, s.title AS service_title, s.type AS service_type,
            COUNT(*) OVER() AS total_count
     FROM refunds r
     JOIN bookings b ON b.id = r.booking_id
     JOIN services s ON s.id = b.service_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.requested_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  return {
    data: rows.map((r) => ({
      refundId:        r.id,
      bookingId:       r.booking_id,
      customerId:      r.customer_id,
      serviceId:       r.service_id,
      serviceTitle:    r.service_title,
      serviceType:     r.service_type,
      status:          r.status,
      requestedAmount: Number(r.requested_amount),
      approvedAmount:  r.approved_amount !== null ? Number(r.approved_amount) : null,
      rejectionReason: r.rejection_reason,
      reason:          r.reason,
      requestedAt:     r.requested_at,
      processedAt:     r.processed_at,
    })),
    meta: { page, limit, total },
  };
}

/**
 * Approve or reject a pending refund request.
 * Only the partner who owns the service may call this.
 *
 * action === 'approve': approvedAmount required, must be ≤ requestedAmount
 * action === 'reject':  rejectionReason required
 *
 * Uses SELECT FOR UPDATE to prevent double-processing on concurrent requests.
 */
async function processRefund({ refundId, partnerId, action, approvedAmount, rejectionReason }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the refund row and verify ownership in one query
    const { rows } = await client.query(
      `SELECT r.id, r.status, r.requested_amount,
              s.partner_id
       FROM refunds r
       JOIN bookings b ON b.id = r.booking_id
       JOIN services s ON s.id = b.service_id
       WHERE r.id = $1
       FOR UPDATE`,
      [refundId]
    );

    if (!rows.length) {
      const err = new Error('Yêu cầu hoàn tiền không tồn tại'); err.statusCode = 404; throw err;
    }

    const refund = rows[0];

    if (refund.partner_id !== partnerId) {
      const err = new Error('Forbidden'); err.statusCode = 403; throw err;
    }

    if (refund.status !== 'pending') {
      const err = new Error('Chỉ có thể xử lý yêu cầu hoàn tiền đang chờ duyệt');
      err.statusCode = 422; err.code = 'REFUND_NOT_PENDING'; throw err;
    }

    let updateQuery, updateParams;

    if (action === 'approve') {
      const amount = Number(approvedAmount);
      if (amount > Number(refund.requested_amount)) {
        const err = new Error('Số tiền duyệt không được vượt quá số tiền yêu cầu');
        err.statusCode = 422; err.code = 'AMOUNT_EXCEEDS_REQUESTED'; throw err;
      }
      updateQuery = `
        UPDATE refunds
        SET status = 'approved', approved_amount = $1, processed_at = NOW()
        WHERE id = $2
        RETURNING id, status, approved_amount, processed_at`;
      updateParams = [amount, refundId];
    } else {
      // reject
      updateQuery = `
        UPDATE refunds
        SET status = 'rejected', rejection_reason = $1, processed_at = NOW()
        WHERE id = $2
        RETURNING id, status, rejection_reason, processed_at`;
      updateParams = [rejectionReason, refundId];
    }

    const { rows: updated } = await client.query(updateQuery, updateParams);
    await client.query('COMMIT');

    const r = updated[0];
    return {
      refundId:        r.id,
      status:          r.status,
      approvedAmount:  r.approved_amount !== null ? Number(r.approved_amount) : null,
      rejectionReason: r.rejection_reason || null,
      processedAt:     r.processed_at,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { calculateRefundAmount, listMyRefunds, getRefundDetail, listPartnerRefunds, processRefund };
