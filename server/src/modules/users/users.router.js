const { Router } = require('express');
const { z }      = require('zod');
const { authenticate } = require('../../middleware/auth');
const { validate }     = require('../../middleware/validate');
const controller       = require('./users.controller');

const router = Router();

// PATCH body: at least one of fullName / phone / avatarUrl must be present.
// Email is intentionally excluded — it is the login identity and cannot change here.
const updateProfileSchema = z.object({
  fullName:  z.string().trim().min(1).max(100).optional(),
  phone:     z.string().trim().regex(/^(\+84|0)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ').optional(),
  avatarUrl: z.string().url('URL ảnh đại diện không hợp lệ').max(2048).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Cần ít nhất một trường để cập nhật' },
);

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  // max(128): bcrypt DoS protection — same cap as register.
  newPassword:     z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự').max(128),
});

// GET /api/users/me
router.get('/me', authenticate, controller.getMe);

// PATCH /api/users/me
router.patch('/me', authenticate, validate(updateProfileSchema), controller.updateMe);

// POST /api/users/me/change-password
router.post('/me/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
