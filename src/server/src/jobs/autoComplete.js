module.exports = {
  schedule: '5 0 * * *',
  name: 'auto-complete',
  run: async function () {
    console.log(`[${this.name}] started`);
    try {
      // TODO (homestay): check_out = yesterday AND status = 'in_progress' → 'completed' LIMIT 100
      // TODO (tour):     tour_date = yesterday AND status = 'confirmed'   → 'completed' LIMIT 100
      // Completing a booking unlocks the review flow for the user
    } catch (err) {
      console.error(`[${this.name}] error:`, err.message);
    }
    console.log(`[${this.name}] done`);
  },
};
