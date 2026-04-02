-- services.updated_at is referenced in submitHomestay() but was never added to the schema
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- rooms.room_type: doc §1.1 specifies a fixed dropdown, not freetext
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS room_type TEXT
    CHECK (room_type IN ('single', 'double', 'twin', 'suite', 'dormitory'));

-- rooms.min_nights: doc §1.1 lists this as a room-level default (availability rows can override)
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS min_nights INT NOT NULL DEFAULT 1;

-- rooms.bed_type: doc §1.1 specifies a fixed dropdown — enforce at DB level
-- Note: ADD CONSTRAINT IF NOT EXISTS is not valid syntax; use DO block instead
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rooms_bed_type_check'
  ) THEN
    ALTER TABLE rooms
      ADD CONSTRAINT rooms_bed_type_check
        CHECK (bed_type IN ('King', 'Queen', 'Twin', 'Single', 'Bunk', 'Sofa'));
  END IF;
END
$$;
