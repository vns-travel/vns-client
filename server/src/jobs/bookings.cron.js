// Cron jobs for automatic booking status transitions.
//
// Four jobs run on a schedule and advance bookings through the state machine
// without requiring manual intervention from partners or managers:
//
//  1. expireUnpaid     — pending → cancelled  (every 15 min)
//     Kills bookings that were never paid after 24 hours. Restores inventory
//     and releases vouchers so the slot and code become available again.
//     Also writes a booking_status_log entry and notifies the customer.
//
//  2. startBookings    — confirmed → in_progress  (every 10 min)
//     Kicks off bookings whose service start time has arrived.
//     Writes status log and notifies the customer.
//
//  3. completeBookings — in_progress → completed  (every 10 min)
//     Marks bookings as done once the service end time has passed.
//     Writes status log and sends a "please review" notification.
//
//  4. driverReminder   — notify partner 2 h before pickup  (every 30 min)
//     Finds confirmed car rentals starting within the next 2 hours whose
//     driver_reminded_at is still NULL, marks the column, and notifies
//     the partner so they can have a driver/vehicle ready.
//
// Each job logs a summary line on every run (even when nothing changed) so
// operators can verify the cron is running without noise from empty batches.

const cron = require('node-cron');
const {
  expirePendingBookings,
  startConfirmedBookings,
  completeInProgressBookings,
  remindDrivers,
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

  // -------------------------------------------------------------------------
  // Job 4: Send driver reminder to partners 2 hours before pickup (every 30 min)
  // The 30-minute interval fits comfortably inside the 2-hour window so at
  // least one run will catch each booking. driver_reminded_at prevents
  // duplicate notifications if multiple runs overlap the window.
  // -------------------------------------------------------------------------
  cron.schedule('*/30 * * * *', async () => {
    try {
      const { reminded } = await remindDrivers();
      console.log(`[cron:remind]   reminded=${reminded}`);
    } catch (err) {
      console.error('[cron:remind] error:', err.message);
    }
  });

  console.log('[cron] Booking cron jobs registered (expire=15m, start=10m, complete=10m, remind=30m)');
}

module.exports = { startBookingCrons };
