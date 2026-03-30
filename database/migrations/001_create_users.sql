CREATE TYPE user_role AS ENUM ('customer', 'partner', 'manager', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');

CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  role          user_role   NOT NULL DEFAULT 'customer',
  status        user_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
