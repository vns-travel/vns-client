const notificationRepo = require('../repositories/notificationRepo');
const partnerRepo      = require('../repositories/partnerRepo');

async function send(userId, title, body, type, refId = null) {
  return notificationRepo.create({ userId, title, body, type, refId });
}

async function sendToPartner(partnerId, title, body, type, refId = null) {
  // partnerId here is partner_profiles.id — look up the user_id
  const profile = await partnerRepo.findByUserId(partnerId);
  if (!profile) return null;
  return send(profile.user_id, title, body, type, refId);
}

async function getUnread(userId) {
  const notifications = await notificationRepo.findByUserId(userId);
  return notifications.filter((n) => !n.is_read);
}

module.exports = { send, sendToPartner, getUnread };
