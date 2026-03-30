/**
 * Calculate the refund amount based on a cancellation policy.
 *
 * policy shape:
 *   { fullRefundBeforeHours: number,
 *     partialRefundPercent: number,
 *     partialRefundBeforeHours: number }
 *
 * Returns 0 if the cancellation is too late for any refund.
 *
 * @param {object} booking   - { finalAmount, serviceDate }
 * @param {object} policy
 * @param {Date}   cancellationDate
 * @returns {number} refundAmount
 */
function calculateRefundAmount(booking, policy, cancellationDate) {
  // TODO: implement per-service cancellation policy logic
  // Stub returns full amount for now — replace before going to prod
  const hoursUntilService =
    (new Date(booking.serviceDate) - cancellationDate) / (1000 * 60 * 60);

  if (hoursUntilService >= (policy.fullRefundBeforeHours || 48)) {
    return booking.finalAmount;
  }
  if (hoursUntilService >= (policy.partialRefundBeforeHours || 24)) {
    return Math.round(booking.finalAmount * ((policy.partialRefundPercent || 50) / 100) * 100) / 100;
  }
  return 0;
}

module.exports = { calculateRefundAmount };
