module.exports = {
  schedule: '0 9 * * *',
  name: 'driver-reminder',
  run: async function () {
    console.log(`[${this.name}] started`);
    try {
      // TODO: tour/vehicle bookings where pickup date = tomorrow AND status = 'confirmed' LIMIT 100
      // Push driver/guide name + phone to the user via notificationService.send()
    } catch (err) {
      console.error(`[${this.name}] error:`, err.message);
    }
    console.log(`[${this.name}] done`);
  },
};
