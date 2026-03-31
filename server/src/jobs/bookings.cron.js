// Cron jobs for automatic booking status transitions.
//
// Three jobs run on a schedule and advance bookings through the state machine
// without requiring manual intervention from partners or managers:
//
//  1. expireUnpaid   — pending → cancelled  (every 15 min)
//     Kills bookings that were never paid after 24 hours. Restores inventory
//     and releases vouchers so the slot and code become available again.
//
//  2. startBookings  — confirmed → in_progress  (every 10 min)
//     Kicks off bookings whose service start time has arrived.
//
//  3. completeBookings — in_progress → completed  (every 10 min)
//     Marks bookings as done once the service end time has passed.
//
// Each job logs a summary line on every run (even when nothing changed) so
// operators can verify the cron is running without noise from empty batches.

const cron = require('node-cron');
const {
  expirePendingBookings,
  startConfirmedBookings,
  completeInProgressBookings,
} = require('../modules/bookings/bookings.service');

function startBookingCrons() {
  // -------------------------------------------------------------------------
  // Job 1: Expire unpaid pending bookings (every 15 minutes)
  // -------------------------------------------------------------------------
  cron.schedule('*/15 * * * *', async () => {
    try {
      const { cancelled } = await expirePendingBookings();
      console.log(`[cron:expire]   cancelled=${cancelled}`);
    } catch (err) {
      console.error('[cron:expire] error:', err.message);
    }
  });

  // -------------------------------------------------------------------------
  // Job 2: Move confirmed bookings to in_progress (every 10 minutes)
  // -------------------------------------------------------------------------
  cron.schedule('*/10 * * * *', async () => {
    try {
      const { started } = await startConfirmedBookings();
      console.log(`[cron:start]    started=${started}`);
    } catch (err) {
      console.error('[cron:start] error:', err.message);
    }
  });

  // -------------------------------------------------------------------------
  // Job 3: Move in_progress bookings to completed (every 10 minutes)
  // -------------------------------------------------------------------------
  cron.schedule('*/10 * * * *', async () => {
    try {
      const { completed } = await completeInProgressBookings();
      console.log(`[cron:complete] completed=${completed}`);
    } catch (err) {
      console.error('[cron:complete] error:', err.message);
    }
  });

  console.log('[cron] Booking cron jobs registered (expire=15m, start=10m, complete=10m)');
}

module.exports = { startBookingCrons };
