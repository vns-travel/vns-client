CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'chat', 'system');

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID              NOT NULL REFERENCES users(id),
  title      TEXT              NOT NULL,
  body       TEXT              NOT NULL,
  type       notification_type NOT NULL,
  ref_id     UUID,
  is_read    BOOLEAN           DEFAULT false,
  created_at TIMESTAMPTZ       DEFAULT NOW()
);
