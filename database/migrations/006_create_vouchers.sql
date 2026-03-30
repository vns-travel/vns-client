CREATE TYPE voucher_type AS ENUM ('percent', 'fixed');

CREATE TABLE IF NOT EXISTS vouchers (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  code                     TEXT         NOT NULL UNIQUE,
  type                     voucher_type NOT NULL,
  value                    NUMERIC(10,2) NOT NULL,
  min_spend                NUMERIC(12,2) DEFAULT 0,
  max_discount             NUMERIC(12,2),
  max_uses                 INT,
  used_count               INT          DEFAULT 0,
  is_active                BOOLEAN      DEFAULT true,
  valid_from               TIMESTAMPTZ,
  valid_to                 TIMESTAMPTZ,
  -- nullable: when set, this voucher is locked to a specific user
  user_id                  UUID         REFERENCES users(id) ON DELETE SET NULL,
  -- empty array = applies to all service types; otherwise restrict by type
  applicable_service_types TEXT[]       DEFAULT '{}',
  created_at               TIMESTAMPTZ  DEFAULT NOW()
);
