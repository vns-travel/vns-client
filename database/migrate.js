// Run from the project root: node database/migrate.js
// Reads all .sql files in database/migrations/ in filename order and executes each
// in its own transaction. Logs success or failure per file.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { Pool } = require('pg');
const fs       = require('fs');
const path     = require('path');

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Check your .env file.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const migrationsDir = path.join(__dirname, 'migrations');

  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // lexicographic order — relies on numeric prefix (001_, 002_, ...)

  if (files.length === 0) {
    console.log('No migration files found in database/migrations/');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  let failed = false;

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`  ✓  ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  ✗  ${file}: ${err.message}`);
        failed = true;
        break; // stop on first failure — later files may depend on earlier ones
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log('\nAll migrations applied successfully.');
  }
}

migrate();
