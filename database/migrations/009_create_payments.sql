CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- One booking can have multiple payment rows (deposit + balance settlement).
-- method uses TEXT + CHECK to allow adding providers without ALTER TYPE.
CREATE TABLE IF NOT EXISTS payments (
  id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id           UUID           NOT NULL REFERENCES bookings(id),
  type                 TEXT           NOT NULL DEFAULT 'full'
                                      CHECK (type IN ('full', 'deposit', 'balance', 'security_deposit')),
  method               TEXT           NOT NULL
                                      CHECK (method IN ('payos', 'zalopay', 'wallet', 'bank_transfer', 'cash')),
  status               payment_status NOT NULL DEFAULT 'pending',
  amount               NUMERIC(12,2)  NOT NULL,
  platform_fee_amount  NUMERIC(12,2)  DEFAULT 0,
  partner_payout_amount NUMERIC(12,2),
  gateway_tx_id        TEXT,
  gateway_response     JSONB,
  paid_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ    DEFAULT NOW()
);
