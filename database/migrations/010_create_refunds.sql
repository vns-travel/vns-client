CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'processed');

CREATE TABLE IF NOT EXISTS refunds (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID          NOT NULL REFERENCES bookings(id),
  payment_id       UUID          NOT NULL REFERENCES payments(id),
  reason           TEXT,
  evidence_urls    TEXT[],
  status           refund_status NOT NULL DEFAULT 'pending',
  requested_amount NUMERIC(12,2) NOT NULL,
  approved_amount  NUMERIC(12,2),
  rejection_reason TEXT,
  requested_at     TIMESTAMPTZ   DEFAULT NOW(),
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);
