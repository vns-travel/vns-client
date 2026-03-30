const router            = require('express').Router();
const paymentController = require('../controllers/paymentController');

// Public — gateway webhooks must not require auth
router.post('/callback/:gateway', paymentController.handleCallback);

module.exports = router;
