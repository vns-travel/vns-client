CREATE TABLE IF NOT EXISTS reviews (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID        NOT NULL UNIQUE REFERENCES bookings(id),
  user_id    UUID        NOT NULL REFERENCES users(id),
  service_id UUID        NOT NULL REFERENCES services(id),
  rating     INT         NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
