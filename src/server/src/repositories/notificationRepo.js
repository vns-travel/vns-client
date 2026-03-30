const { query } = require('../config/db');

async function create(data) {
  const { userId, title, body, type, refId } = data;
  const { rows } = await query(
    'INSERT INTO notifications (user_id, title, body, type, ref_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [userId, title, body, type, refId || null]
  );
  return rows[0];
}

async function findByUserId(userId) {
  const { rows } = await query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return rows;
}

async function markRead(id, userId) {
  const { rows } = await query(
    'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return rows[0] || null;
}

async function markAllRead(userId) {
  await query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
    [userId]
  );
}

module.exports = { create, findByUserId, markRead, markAllRead };
