const { Pool }   = require('pg');
const mongoose   = require('mongoose');
const Redis      = require('ioredis');
const env        = require('./env');

// ---------------------------------------------------------------------------
// PostgreSQL — shared pool, exported query wrapper used by all repositories
// ---------------------------------------------------------------------------
const pool = new Pool({ connectionString: env.DATABASE_URL });

pool.on('error', (err) => console.error('[DB] Unexpected pg client error:', err.message));

async function connectPostgres() {
  const client = await pool.connect();
  client.release();
  console.log('[DB] PostgreSQL connected');
}

/** Thin wrapper so repositories don't import pool directly */
async function query(text, params) {
  return pool.query(text, params);
}

// ---------------------------------------------------------------------------
// MongoDB
// ---------------------------------------------------------------------------
async function connectMongo() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('[DB] MongoDB connected');
}

// ---------------------------------------------------------------------------
// Redis — used for distributed locks and caching
// ---------------------------------------------------------------------------
const redis = new Redis(env.REDIS_URL, { lazyConnect: true });

redis.on('connect', () => console.log('[DB] Redis connected'));
redis.on('error',   (err) => console.error('[DB] Redis error:', err.message));

module.exports = { pool, query, connectPostgres, connectMongo, redis };
