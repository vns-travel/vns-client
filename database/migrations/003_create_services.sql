-- Using TEXT + CHECK instead of CREATE TYPE so adding new service types
-- (e.g. 'activity') never requires ALTER TYPE on a live database.
CREATE TYPE service_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'suspended');

CREATE TABLE IF NOT EXISTS services (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id   UUID           NOT NULL REFERENCES partner_profiles(id),
  type         TEXT           NOT NULL CHECK (type IN ('tour', 'homestay', 'car_rental', 'other')),
  title        TEXT           NOT NULL,
  description  TEXT,
  city         TEXT,
  address      TEXT,
  latitude     FLOAT,
  longitude    FLOAT,
  status       service_status NOT NULL DEFAULT 'draft',
  avg_rating   NUMERIC(3,2)   DEFAULT 0,
  review_count INT            DEFAULT 0,
  created_at   TIMESTAMPTZ    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_images (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID        NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  url        TEXT        NOT NULL,
  sort_order INT         DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
