-- Allow a single car-rental service to own multiple vehicles (fleet model).
-- The original schema had UNIQUE on service_id making it 1-to-1.
-- We drop that constraint so one service (the rental company) can have many vehicles.
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_service_id_key;
