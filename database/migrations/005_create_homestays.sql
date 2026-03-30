CREATE TABLE IF NOT EXISTS homestays (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id              UUID        NOT NULL UNIQUE REFERENCES services(id),
  check_in_time           TIME,
  check_out_time          TIME,
  cancellation_policy     TEXT,
  house_rules             TEXT,
  amenities               TEXT,
  host_approval_required  BOOLEAN     DEFAULT false,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  homestay_id      UUID          NOT NULL REFERENCES homestays(id),
  room_name        TEXT          NOT NULL,
  max_occupancy    INT,
  size_sqm         FLOAT,
  bed_type         TEXT,
  bed_count        INT,
  private_bathroom BOOLEAN       DEFAULT true,
  base_price       NUMERIC(12,2) NOT NULL,
  weekend_price    NUMERIC(12,2),
  holiday_price    NUMERIC(12,2),
  total_units      INT           DEFAULT 1,
  cleaning_fee     NUMERIC(12,2) DEFAULT 0,
  service_fee      NUMERIC(12,2) DEFAULT 0,
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_availability (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         UUID          NOT NULL REFERENCES rooms(id),
  date            DATE          NOT NULL,
  available_units INT           NOT NULL,
  price_override  NUMERIC(12,2),
  min_nights      INT           DEFAULT 1,
  is_blocked      BOOLEAN       DEFAULT false,
  created_at      TIMESTAMPTZ   DEFAULT NOW(),

  UNIQUE (room_id, date)
);
