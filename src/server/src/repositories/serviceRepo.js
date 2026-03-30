const { query, pool } = require('../config/db');

// Shared SELECT with partner info. Used for both list and single-record reads.
const SERVICE_SELECT = `
  SELECT s.*, pp.id AS partner_profile_id, u.full_name AS partner_name
  FROM   services s
  JOIN   partner_profiles pp ON pp.id = s.partner_id
  JOIN   users u ON u.id = pp.user_id
`;

async function findAll({ city = null, serviceType = null, status = null, partnerId = null, limit = 20, offset = 0 } = {}) {
  const { rows } = await query(
    `${SERVICE_SELECT}
     WHERE ($1::text IS NULL OR s.city ILIKE $1)
       AND ($2::text IS NULL OR s.type = $2)
       AND ($3::service_status IS NULL OR s.status = $3::service_status)
       AND ($4::uuid IS NULL OR s.partner_id = $4::uuid)
     ORDER BY s.created_at DESC
     LIMIT $5 OFFSET $6`,
    [city, serviceType, status, partnerId, limit, offset]
  );
  return rows;
}

async function findById(serviceId) {
  const { rows } = await query(
    `${SERVICE_SELECT} WHERE s.id = $1 LIMIT 1`,
    [serviceId]
  );
  return rows[0] || null;
}

async function create({ partnerId, type, title, description, city, address, latitude, longitude, status = 'draft' }) {
  const { rows } = await query(
    `INSERT INTO services (id, partner_id, type, title, description, city, address, latitude, longitude, status)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [partnerId, type, title, description || null, city || null, address || null, latitude || null, longitude || null, status]
  );
  return rows[0];
}

async function updateStatus(serviceId, status, rejectionReason = null) {
  const { rows } = await query(
    `UPDATE services
     SET status = $1, rejection_reason = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, rejectionReason, serviceId]
  );
  return rows[0] || null;
}

async function addImages(serviceId, images) {
  // Replace-not-append: delete existing then bulk-insert so sort order is always clean.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM service_images WHERE service_id = $1', [serviceId]);

    if (images.length === 0) {
      await client.query('COMMIT');
      return [];
    }

    // Build multi-row INSERT with positional parameters.
    const placeholders = images.map((_, i) => {
      const b = i * 3;
      return `(gen_random_uuid(), $${b + 1}, $${b + 2}, $${b + 3})`;
    });
    const params = images.flatMap(img => [serviceId, img.url, img.sortOrder ?? 0]);

    const { rows } = await client.query(
      `INSERT INTO service_images (id, service_id, url, sort_order)
       VALUES ${placeholders.join(', ')}
       RETURNING *`,
      params
    );

    await client.query('COMMIT');
    return rows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getImages(serviceId) {
  const { rows } = await query(
    'SELECT * FROM service_images WHERE service_id = $1 ORDER BY sort_order ASC',
    [serviceId]
  );
  return rows;
}

async function verifyOwnership(serviceId, partnerId) {
  const { rows } = await query(
    'SELECT id FROM services WHERE id = $1 AND partner_id = $2 LIMIT 1',
    [serviceId, partnerId]
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

module.exports = { findAll, findById, create, updateStatus, addImages, getImages, verifyOwnership, updateRatings };
