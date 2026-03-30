const router                  = require('express').Router();
const notificationController  = require('../controllers/notificationController');
const auth                    = require('../middlewares/auth');

router.get('/',          auth, notificationController.getUnread);
router.put('/:id/read',  auth, notificationController.markRead);

module.exports = router;
