const { Router } = require('express');
const { z } = require('zod');
const controller = require('./auth.controller');
const { validate }    = require('../../middleware/validate');
const { rateLimit }   = require('../../middleware/rateLimit');

// NOTE: req.ip reflects X-Forwarded-For only when app.set('trust proxy', 1)
// is configured in app.js. Enable that if the server runs behind Nginx or a
// load balancer, otherwise all requests appear to come from 127.0.0.1.
const ipKey = (req) => req.ip;

// Login: 10 attempts per IP per 15 minutes.
// Tight enough to stop password brute-force; loose enough for legitimate use.
const loginLimiter    = rateLimit({ keyFn: (req) => `login:${ipKey(req)}`,    max: 10, windowSecs: 15 * 60 });

// Register: 5 attempts per IP per hour.
// Prevents bulk account creation and email-flooding.
const registerLimiter = rateLimit({ keyFn: (req) => `register:${ipKey(req)}`, max: 5,  windowSecs: 60 * 60 });

const router = Router();

const registerSchema = z.object({
  // Normalise email to lowercase so duplicates can't sneak in via casing.
  email:        z.string().email().trim().toLowerCase(),
  // max(128): bcrypt processes only the first 72 bytes of a password; a multi-MB
  // string still forces hashing work, creating a DoS vector.
  password:     z.string().min(6).max(128),
  fullName:     z.string().trim().max(100).optional(),
  phoneNumber:  z.string().trim().max(20).optional(),
  businessName: z.string().trim().max(200).optional(),
});

const loginSchema = z.object({
  email:    z.string().email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

router.post('/register', registerLimiter, validate(registerSchema), controller.register);
router.post('/login',    loginLimiter,    validate(loginSchema),    controller.login);

module.exports = router;
