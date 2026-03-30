const { query } = require('../config/db');

async function findAll(filters = {}) {
  const conditions = ['status = $1'];
  const params     = ['approved'];

  if (filters.city) {
    params.push(filters.city);
    conditions.push(`city ILIKE $${params.length}`);
  }
  if (filters.type) {
    params.push(filters.type);
    conditions.push(`type = $${params.length}`);
  }

  const { rows } = await query(
    `SELECT * FROM services WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM services WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const { partnerId, type, title, description, city, address, latitude, longitude } = data;
  const { rows } = await query(
    `INSERT INTO services (partner_id, type, title, description, city, address, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [partnerId, type, title, description || null, city || null, address || null, latitude || null, longitude || null]
  );
  return rows[0];
}

async function updateStatus(id, status) {
  const { rows } = await query(
    'UPDATE services SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0] || null;
}

async function updateRatings(id, avgRating, reviewCount) {
  const { rows } = await query(
    'UPDATE services SET avg_rating = $1, review_count = $2 WHERE id = $3 RETURNING id',
    [avgRating, reviewCount, id]
  );
  return rows[0] || null;
}

module.exports = { findAll, findById, create, updateStatus, updateRatings };
