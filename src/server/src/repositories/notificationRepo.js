const { query } = require('../config/db');

async function create({ userId, title, body, type, refId }) {
  const { rows } = await query(
    `INSERT INTO notifications (id, user_id, title, body, type, ref_id)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, body, type, refId || null]
  );
  return rows[0];
}

async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  const { rows } = await query(
    `SELECT * FROM notifications
     WHERE  user_id = $1
     ORDER  BY created_at DESC
     LIMIT  $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
}

async function markRead(notificationId, userId) {
  const { rows } = await query(
    'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
    [notificationId, userId]
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
