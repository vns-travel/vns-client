/**
 * One-time script: create a manager account for development.
 * Run: node scripts/seed-manager.js  (from the /server directory)
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = 'manager@vns.com';
  const password = '123';
  const fullName = 'manager';
  const role = 'manager';

  const hash = await bcrypt.hash(password, 10);

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    console.log('Account already exists:', email);
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role`,
    [email, hash, fullName, role]
  );

  console.log('Manager account created:', rows[0]);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => pool.end());
