-- Add machine-readable cancellation policy to services.
-- Using JSONB on the services table (not the per-type tables) so all service
-- types (tour, homestay, car_rental) share a single, queryable policy field.
-- The existing tours.cancellation_policy and homestays.cancellation_policy TEXT
-- columns are left in place — they store human-readable partner descriptions.
--
-- Policy shape:
--   { "fullRefundDays": N, "partialRefundDays": M, "partialRefundPercent": P }
--   fullRefundDays:      cancel >= N days before service → 100% refund
--   partialRefundDays:   cancel >= M days but < N days  → P% refund
--   <partialRefundDays:  no refund
--
-- Default (flexible): full refund 7+ days out, 50% 1-6 days, nothing <24h.

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS cancellation_policy JSONB
    NOT NULL DEFAULT '{"fullRefundDays":7,"partialRefundDays":1,"partialRefundPercent":50}';
