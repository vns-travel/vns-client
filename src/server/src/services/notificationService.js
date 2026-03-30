const notificationRepo = require('../repositories/notificationRepo');

/**
 * Fire-and-forget notification helper.
 * Intentionally never throws — a failed notification must never break the main flow.
 */
async function send(userId, title, body, type = 'system', refId = null) {
  try {
    return await notificationRepo.create({ userId, title, body, type, refId });
  } catch (err) {
    console.error('[Notification] Failed to send notification:', err.message);
    return null;
  }
}

async function getForUser(userId, { limit = 20, offset = 0 } = {}) {
  const notifications = await notificationRepo.findByUserId(userId, { limit, offset });
  return { notifications, total: notifications.length };
}

async function markRead(notificationId, userId) {
  return notificationRepo.markRead(notificationId, userId);
}

async function markAllRead(userId) {
  return notificationRepo.markAllRead(userId);
}

module.exports = { send, getForUser, markRead, markAllRead };
