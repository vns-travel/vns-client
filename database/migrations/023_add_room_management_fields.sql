-- Migration 023: add columns needed for property & room management feature.

-- homestays.amenities was TEXT (a single freetext string). Change to TEXT[] so the
-- frontend tag-input can store an ordered array of individual amenity strings.
-- The USING clause safely converts NULL/empty values — no data loss risk on a fresh schema.
ALTER TABLE homestays
  ALTER COLUMN amenities TYPE TEXT[]
  USING CASE WHEN amenities IS NULL OR amenities = '' THEN '{}' ELSE ARRAY[amenities] END;

-- rooms.is_active: soft-deactivation flag. Partners can pause a room type without
-- deleting it or losing its booking history. Defaults true so existing rows stay active.
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- rooms.amenities: was accepted by addRoom() but never stored (no column existed).
-- Using TEXT[] to match the array format sent by the frontend tag-input.
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS amenities TEXT[] NOT NULL DEFAULT '{}';

-- rooms.description: freetext room description, distinct from the property description.
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS description TEXT;
