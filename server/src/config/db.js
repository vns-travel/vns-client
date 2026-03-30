const { Pool } = require('pg');
const mongoose = require('mongoose');
const env = require('./env');

// PostgreSQL pool — shared across all repositories
const pool = new Pool({ connectionString: env.DATABASE_URL });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

// Call once at startup to verify the connection
async function connectPostgres() {
  const client = await pool.connect();
  client.release();
  console.log('PostgreSQL connected');
}

// MongoDB connection via Mongoose
async function connectMongo() {
  await mongoose.connect(env.MONGO_URI);
  console.log('MongoDB connected');
}

module.exports = { pool, connectPostgres, connectMongo };
