CREATE TABLE IF NOT EXISTS tours (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id          UUID        NOT NULL UNIQUE REFERENCES services(id),
  duration_hours      INT,
  max_capacity        INT,
  meeting_point       TEXT,
  cancellation_policy TEXT,
  highlights          TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tour_schedules (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id         UUID        NOT NULL REFERENCES tours(id),
  tour_date       DATE        NOT NULL,
  start_time      TIME,
  end_time        TIME,
  available_slots INT         NOT NULL,
  booked_slots    INT         DEFAULT 0,
  price           NUMERIC(12,2) NOT NULL,
  is_active       BOOLEAN     DEFAULT true,
  guide_id        UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tour_itineraries (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id          UUID        NOT NULL REFERENCES tours(id),
  step_order       INT         NOT NULL,
  location         TEXT,
  activity         TEXT,
  duration_minutes INT,
  description      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
