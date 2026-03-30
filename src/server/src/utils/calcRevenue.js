/**
 * Split a gross payment into platform fee and partner payout.
 * Every payment row stores both so the manager dashboard and partner
 * earnings view always have the correct breakdown without recalculating.
 *
 * @param {number} grossAmount
 * @param {number} platformFeePercent  e.g. 10 for 10%
 * @returns {{ platformFeeAmount: number, partnerPayoutAmount: number }}
 */
function splitRevenue(grossAmount, platformFeePercent) {
  const platformFeeAmount   = Math.round((grossAmount * platformFeePercent) / 100 * 100) / 100;
  const partnerPayoutAmount = Math.round((grossAmount - platformFeeAmount) * 100) / 100;
  return { platformFeeAmount, partnerPayoutAmount };
}

module.exports = { splitRevenue };
