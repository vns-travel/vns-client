CREATE TABLE IF NOT EXISTS vehicles (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id       UUID          NOT NULL UNIQUE REFERENCES services(id) ON DELETE CASCADE,
  make             TEXT          NOT NULL,
  model            TEXT          NOT NULL,
  year             INT,
  vehicle_type     TEXT          NOT NULL,  -- sedan / suv / van / motorbike
  capacity         INT           NOT NULL,
  pricing_model    TEXT          NOT NULL CHECK (pricing_model IN ('daily', 'hourly')),
  daily_rate       NUMERIC(12,2),
  hourly_rate      NUMERIC(12,2),
  driver_included  BOOLEAN       DEFAULT false,
  deposit_amount   NUMERIC(12,2) DEFAULT 0,
  included_features TEXT[],
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_availability (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id     UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date           DATE        NOT NULL,
  available_from TIME,
  available_to   TIME,
  is_blocked     BOOLEAN     DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (vehicle_id, date)
);

CREATE TABLE IF NOT EXISTS booking_transport_detail (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID        NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  vehicle_id      UUID        NOT NULL REFERENCES vehicles(id),
  rental_start    TIMESTAMPTZ NOT NULL,
  rental_end      TIMESTAMPTZ NOT NULL,
  pickup_location TEXT,
  return_location TEXT,
  driver_name     TEXT,
  driver_phone    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
