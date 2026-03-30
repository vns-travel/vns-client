const { z } = require('zod');

const registerSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1),
  phone:    z.string().optional(),
  role:     z.enum(['customer', 'partner']).default('customer'),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token:       z.string().min(1),
  newPassword: z.string().min(8),
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
