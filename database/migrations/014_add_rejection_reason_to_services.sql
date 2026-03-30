-- Add rejection_reason and updated_at to services.
-- rejection_reason stores manager feedback when a service is rejected.
-- updated_at tracks the last status change for audit purposes.
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
