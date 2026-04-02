-- Migration 024: room-level images table.
-- Partners can attach photos to individual room types (distinct from the
-- property-level service_images which show the overall property).
CREATE TABLE IF NOT EXISTS room_images (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID         NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  url        TEXT         NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);
