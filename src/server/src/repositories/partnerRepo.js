const { query, pool } = require('../config/db');

// Shared SELECT used by all profile-read queries.
// Joins users to surface email, full_name, phone without exposing password_hash.
const PROFILE_SELECT = `
  SELECT pp.*, u.email, u.full_name, u.phone
  FROM   partner_profiles pp
  JOIN   users u ON u.id = pp.user_id
`;

async function findByUserId(userId) {
  const { rows } = await query(
    `${PROFILE_SELECT} WHERE pp.user_id = $1 LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function findById(partnerId) {
  const { rows } = await query(
    `${PROFILE_SELECT} WHERE pp.id = $1 LIMIT 1`,
    [partnerId]
  );
  return rows[0] || null;
}

async function findAll({ verifyStatus = null, city = null, limit = 20, offset = 0 }) {
  const { rows } = await query(
    `${PROFILE_SELECT}
     WHERE ($1::partner_verify_status IS NULL OR pp.verify_status = $1)
       AND ($2::text IS NULL OR pp.city ILIKE $2)
     ORDER BY pp.created_at DESC
     LIMIT $3 OFFSET $4`,
    [verifyStatus, city, limit, offset]
  );
  return rows;
}

async function create({ userId, businessName }) {
  // phone lives on users.phone, not partner_profiles — no phone column in this table
  const { rows } = await query(
    `INSERT INTO partner_profiles (id, user_id, business_name)
     VALUES (gen_random_uuid(), $1, $2)
     RETURNING *`,
    [userId, businessName]
  );
  return rows[0];
}

async function updateProfile(partnerId, fields) {
  // Whitelist prevents mass-assignment. partner_profiles has no updated_at column.
  const ALLOWED = ['business_name', 'business_type', 'tax_code', 'address', 'city', 'description'];

  const entries = Object.entries(fields).filter(([col]) => ALLOWED.includes(col));
  if (entries.length === 0) return findById(partnerId);

  const setClauses = entries.map(([col], i) => `${col} = $${i + 1}`);
  const values = entries.map(([, val]) => val);
  values.push(partnerId);

  const { rows } = await query(
    `UPDATE partner_profiles SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function updateVerifyStatus(partnerId, { verifyStatus, rejectionReason = null, verifiedAt = null }) {
  const { rows } = await query(
    `UPDATE partner_profiles
     SET    verify_status    = $1,
            rejection_reason = $2,
            verified_at      = $3
     WHERE  id = $4
     RETURNING *`,
    [verifyStatus, rejectionReason, verifiedAt, partnerId]
  );
  return rows[0] || null;
}

async function addDocuments(partnerId, documents) {
  // Use a transaction: delete existing docs then bulk-insert replacements atomically.
  // Replace-not-append so partners can re-submit a corrected set.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM partner_documents WHERE partner_id = $1', [partnerId]);

    const inserted = [];
    for (const { docType, fileUrl } of documents) {
      const { rows } = await client.query(
        `INSERT INTO partner_documents (id, partner_id, doc_type, file_url)
         VALUES (gen_random_uuid(), $1, $2, $3)
         RETURNING *`,
        [partnerId, docType, fileUrl]
      );
      inserted.push(rows[0]);
    }

    await client.query('COMMIT');
    return inserted;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getDocuments(partnerId) {
  const { rows } = await query(
    'SELECT * FROM partner_documents WHERE partner_id = $1 ORDER BY uploaded_at DESC',
    [partnerId]
  );
  return rows;
}

module.exports = {
  findByUserId,
  findById,
  findAll,
  create,
  updateProfile,
  updateVerifyStatus,
  addDocuments,
  getDocuments,
};
