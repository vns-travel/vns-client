CREATE TYPE booking_type AS ENUM ('service', 'combo');

-- Using TEXT + CHECK (not CREATE TYPE) so new statuses can be added without
-- ALTER TYPE on a live database. Matches state machine in CLAUDE.md.
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         NOT NULL REFERENCES users(id),
  service_id       UUID         REFERENCES services(id),
  combo_id         UUID         REFERENCES combos(id),
  voucher_id       UUID         REFERENCES vouchers(id),
  type             booking_type NOT NULL,
  status           TEXT         NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
  guests           INT,
  special_requests TEXT,
  original_amount  NUMERIC(12,2) NOT NULL,
  discount_amount  NUMERIC(12,2) DEFAULT 0,
  total_amount     NUMERIC(12,2) NOT NULL,
  final_amount     NUMERIC(12,2) NOT NULL,
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_homestay_detail (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   UUID          NOT NULL UNIQUE REFERENCES bookings(id),
  room_id      UUID          NOT NULL REFERENCES rooms(id),
  check_in     DATE          NOT NULL,
  check_out    DATE          NOT NULL,
  adults       INT           NOT NULL,
  children     INT           DEFAULT 0,
  cleaning_fee NUMERIC(12,2) DEFAULT 0,
  service_fee  NUMERIC(12,2) DEFAULT 0,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_tour_detail (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID        NOT NULL UNIQUE REFERENCES bookings(id),
  schedule_id     UUID        NOT NULL REFERENCES tour_schedules(id),
  participants    INT         NOT NULL,
  pickup_location TEXT,
  pickup_time     TIME,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Moved from 006: depends on both vouchers (006) and bookings (this file).
-- UNIQUE (voucher_id, user_id) enforces one-use-per-user-per-voucher.
CREATE TABLE IF NOT EXISTS voucher_usages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID        NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID        NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  used_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (voucher_id, user_id)
);
