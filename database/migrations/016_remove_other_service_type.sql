-- Remove the 'other' service type. Only 'tour', 'homestay', and 'car_rental' are supported.
-- Using ADD CONSTRAINT / DROP CONSTRAINT because the type column uses a TEXT CHECK
-- (not a CREATE TYPE enum), so we can swap the constraint in a single transaction.
BEGIN;

-- Safeguard: reclassify any orphaned 'other' rows to 'car_rental' so the new
-- constraint doesn't reject pre-existing data. In practice this is empty on a
-- fresh DB, but it makes the migration safe to run against older data too.
UPDATE services SET type = 'car_rental' WHERE type = 'other';

ALTER TABLE services DROP CONSTRAINT IF EXISTS services_type_check;
ALTER TABLE services ADD CONSTRAINT services_type_check
  CHECK (type IN ('tour', 'homestay', 'car_rental'));

COMMIT;
