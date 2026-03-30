CREATE TYPE combo_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS combos (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id       UUID         NOT NULL REFERENCES partner_profiles(id),
  title            TEXT         NOT NULL,
  description      TEXT,
  original_price   NUMERIC(12,2) NOT NULL,
  discounted_price NUMERIC(12,2) NOT NULL,
  max_bookings     INT,
  current_bookings INT          DEFAULT 0,
  is_active        BOOLEAN      DEFAULT false,
  status           combo_status NOT NULL DEFAULT 'pending',
  valid_from       TIMESTAMPTZ,
  valid_to         TIMESTAMPTZ,
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS combo_services (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id          UUID        NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  service_id        UUID        NOT NULL REFERENCES services(id),
  quantity          INT         DEFAULT 1,
  sequence_order    INT,
  included_features TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
