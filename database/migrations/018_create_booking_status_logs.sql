-- Audit log for booking status transitions.
-- Every time a booking's status changes (by a partner, manager, customer, or cron job),
-- a row is inserted here so the mobile app can display a full status timeline.
-- ON DELETE CASCADE keeps this table clean when a booking is hard-deleted (rare).

CREATE TABLE IF NOT EXISTS booking_status_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID        NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status TEXT,                                    -- NULL only on the initial 'pending' creation entry
  to_status   TEXT        NOT NULL,
  reason      TEXT,                                    -- cancellation / rejection reason when supplied
  changed_by  UUID        REFERENCES users(id),        -- NULL for cron / system transitions
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Most queries are "give me all logs for booking X in chronological order"
CREATE INDEX IF NOT EXISTS idx_booking_status_logs_booking_id
  ON booking_status_logs (booking_id, changed_at);
