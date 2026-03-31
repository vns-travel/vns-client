// All business logic for the notifications domain lives here.
// Services call repositories for DB access; they must NOT send HTTP responses.
// Throw plain Error objects with a statusCode property to signal HTTP errors.

const { pool } = require('../../config/db');

// ---------------------------------------------------------------------------
// notify — fire-and-forget helper used by other services (bookings, payments,
// refunds). It intentionally never throws so a notification failure never
// rolls back the parent operation that triggered it.
//
// Usage (always call WITHOUT await so it doesn't block the response path):
//   notify(userId, { title, body, type, refId });
// ---------------------------------------------------------------------------

/**
 * Insert a single notification row.
 * type must match the DB enum: 'booking' | 'payment' | 'chat' | 'system'
 * refId is the UUID of the related entity (booking_id, payment_id, etc.) — optional.
 */
async function notify(userId, { title, body, type, refId = null }) {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, body, type, ref_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, title, body, type, refId]
    );
  } catch (err) {
    // Notification failures must never propagate — log and move on.
    console.error('[notifications] Failed to insert notification:', err.message);
  }
}

// ---------------------------------------------------------------------------
// Customer-facing read operations
// ---------------------------------------------------------------------------

/**
 * List notifications for the authenticated user, newest first.
 * Returns { data, meta } with an unread count for badge display.
 */
async function listMyNotifications({ userId, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const [listRes, unreadRes] = await Promise.all([
    pool.query(
      `SELECT id, title, body, type, ref_id, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND is_read = false`,
      [userId]
    ),
  ]);

  // Total row count for pagination — do a separate count query so we don't
  // use COUNT(*) OVER() which forces a full scan on every page.
  const totalRes = await pool.query(
    `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1`,
    [userId]
  );

  return {
    data: listRes.rows.map((n) => ({
      notificationId: n.id,
      title:          n.title,
      body:           n.body,
      type:           n.type,
      refId:          n.ref_id,
      isRead:         n.is_read,
      createdAt:      n.created_at,
    })),
    meta: {
      page,
      limit,
      total:       Number(totalRes.rows[0].count),
      unreadCount: Number(unreadRes.rows[0].count),
    },
  };
}

/**
 * Mark a single notification as read.
 * Enforces ownership — users may only mark their own notifications.
 */
async function markRead({ notificationId, userId }) {
  const { rows } = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [notificationId, userId]
  );

  if (!rows.length) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  return { notificationId: rows[0].id, isRead: true };
}

/**
 * Mark all of the user's unread notifications as read in one UPDATE.
 */
async function markAllRead({ userId }) {
  const { rowCount } = await pool.query(
    `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
    [userId]
  );

  return { updatedCount: rowCount };
}

module.exports = { notify, listMyNotifications, markRead, markAllRead };
