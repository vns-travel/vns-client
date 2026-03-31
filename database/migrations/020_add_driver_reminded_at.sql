-- Add idempotency guard for the driver-reminder cron job.
-- When the cron fires, it sets this column to NOW() inside the same locked
-- transaction so that a second run of the cron never sends a duplicate reminder
-- for the same booking.
ALTER TABLE booking_transport_detail
  ADD COLUMN IF NOT EXISTS driver_reminded_at TIMESTAMPTZ DEFAULT NULL;

-- Partial index: the cron's WHERE clause filters on IS NULL, so only the
-- still-pending rows (a tiny fraction of the table) are ever scanned.
CREATE INDEX IF NOT EXISTS idx_transport_detail_reminder_pending
  ON booking_transport_detail (rental_start)
  WHERE driver_reminded_at IS NULL;
