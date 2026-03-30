const { Router } = require('express');
const { z } = require('zod');
const controller = require('./auth.controller');
const { validate } = require('../../middleware/validate');

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
