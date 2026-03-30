// One-off script to seed a manager account for local development.
// Run from project root: node src/server/scripts/seedManager.js
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const { Pool } = require('pg');
const bcrypt   = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email    = 'manager@vns.com';
  const password = 'Manager@123';
  const fullName = 'VNS Manager';

  const { rows: existing } = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.length > 0) {
    console.log(`Manager already exists (id: ${existing[0].id}) — skipping.`);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    `INSERT INTO users (id, email, password_hash, full_name, role, status)
     VALUES (gen_random_uuid(), $1, $2, $3, 'manager', 'active')
     RETURNING id, email, role`,
    [email, passwordHash, fullName]
  );

  console.log('Manager seeded:', rows[0]);
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
