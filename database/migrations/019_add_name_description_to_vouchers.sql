-- Adds human-readable name and description to vouchers so managers can label
-- vouchers beyond just the code (e.g. "Ưu đãi đặt sớm mùa hè 2026").
-- Both are nullable so existing rows are unaffected.
ALTER TABLE vouchers
  ADD COLUMN IF NOT EXISTS name        TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT;
