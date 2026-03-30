const router         = require('express').Router();
const authController = require('../controllers/authController');
const {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  partnerRegisterSchema,
} = require('../validations/auth');

router.post('/register',          validate(registerSchema),          authController.register);
router.post('/register-partner',  validate(partnerRegisterSchema),   authController.registerPartner);
router.post('/login',             validate(loginSchema),             authController.login);
router.post('/forgot-password',   validate(forgotPasswordSchema),    authController.forgotPassword);
router.post('/reset-password',    validate(resetPasswordSchema),     authController.resetPassword);

module.exports = router;
