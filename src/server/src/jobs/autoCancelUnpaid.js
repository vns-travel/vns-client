module.exports = {
  schedule: '*/5 * * * *',
  name: 'auto-cancel-unpaid',
  run: async function () {
    console.log(`[${this.name}] started`);
    try {
      // TODO: SELECT bookings WHERE status='pending' AND created_at < NOW()-15min LIMIT 100
      // For each: update to cancelled, restore inventory (tour slots / room availability / vehicle block)
      // Decrement voucher_usages back if a voucher was applied
    } catch (err) {
      console.error(`[${this.name}] error:`, err.message);
    }
    console.log(`[${this.name}] done`);
  },
};
