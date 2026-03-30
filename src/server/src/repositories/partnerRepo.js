const { query } = require('../config/db');

async function findByUserId(userId) {
  const { rows } = await query(
    'SELECT * FROM partner_profiles WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

async function create(data) {
  const { userId, businessName, businessType, taxCode, address, city, description } = data;
  const { rows } = await query(
    `INSERT INTO partner_profiles (user_id, business_name, business_type, tax_code, address, city, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, businessName, businessType, taxCode || null, address || null, city || null, description || null]
  );
  return rows[0];
}

async function updateVerifyStatus(id, status, rejectionReason = null) {
  const { rows } = await query(
    `UPDATE partner_profiles
     SET verify_status = $1, rejection_reason = $2, verified_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END
     WHERE id = $3 RETURNING *`,
    [status, rejectionReason, id]
  );
  return rows[0] || null;
}

async function addDocument(data) {
  const { partnerId, docType, fileUrl } = data;
  const { rows } = await query(
    'INSERT INTO partner_documents (partner_id, doc_type, file_url) VALUES ($1, $2, $3) RETURNING *',
    [partnerId, docType, fileUrl]
  );
  return rows[0];
}

module.exports = { findByUserId, create, updateVerifyStatus, addDocument };
