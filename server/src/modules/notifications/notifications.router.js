const { Router } = require('express');
const { z }      = require('zod');
const controller = require('./notifications.controller');
const { authenticate }  = require('../../middleware/auth');
const { validateQuery } = require('../../middleware/validate');

const router = Router();

const listQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// All notification endpoints require the caller to be authenticated.
// The service layer enforces user_id ownership for every operation.

// GET /api/notifications?page=1&limit=20
router.get('/', authenticate, validateQuery(listQuerySchema), controller.list);

// PATCH /api/notifications/:id/read — mark a single notification as read
router.patch('/:id/read', authenticate, controller.markRead);

// PATCH /api/notifications/read-all — mark all as read
// Registered before /:id/read so Express does not treat "read-all" as an :id param
router.patch('/read-all', authenticate, controller.markAllRead);

module.exports = router;
