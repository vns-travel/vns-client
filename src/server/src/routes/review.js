const router           = require('express').Router();
const reviewController = require('../controllers/reviewController');
const auth             = require('../middlewares/auth');

router.post('/',              auth, reviewController.createReview);
router.get('/:serviceId',          reviewController.getServiceReviews); // public

module.exports = router;
