module.exports = {
  schedule: '0 0 * * *',
  name: 'auto-in-progress',
  run: async function () {
    console.log(`[${this.name}] started`);
    try {
      // TODO: homestay bookings where check_in = today AND status = 'confirmed' LIMIT 100
      // Transition each to 'in_progress'
    } catch (err) {
      console.error(`[${this.name}] error:`, err.message);
    }
    console.log(`[${this.name}] done`);
  },
};
