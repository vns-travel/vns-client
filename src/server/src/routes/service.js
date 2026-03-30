const router            = require('express').Router();
const serviceController = require('../controllers/serviceController');

// Public routes
router.get('/',    serviceController.getAll);
router.get('/:id', serviceController.getById);

module.exports = router;
