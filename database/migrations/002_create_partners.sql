CREATE TYPE partner_verify_status AS ENUM ('pending', 'reviewing', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS partner_profiles (
  id               UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID                 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name    TEXT,
  business_type    TEXT,
  tax_code         TEXT,
  address          TEXT,
  city             TEXT,
  description      TEXT,
  verify_status    partner_verify_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ          DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partner_documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  UUID        NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  doc_type    TEXT        NOT NULL,
  file_url    TEXT        NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
