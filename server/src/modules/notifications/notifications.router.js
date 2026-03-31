const { Router } = require('express');
const controller = require('./notifications.controller');
const { authenticate } = require('../../middleware/auth');

const router = Router();

// All notification endpoints require the caller to be authenticated.
// The service layer enforces user_id ownership for every operation.

// GET /api/notifications?page=1&limit=20
router.get('/', authenticate, controller.list);

// PATCH /api/notifications/:id/read — mark a single notification as read
router.patch('/:id/read', authenticate, controller.markRead);

// PATCH /api/notifications/read-all — mark all as read
// Registered before /:id/read so Express does not treat "read-all" as an :id param
router.patch('/read-all', authenticate, controller.markAllRead);

module.exports = router;
