const express = require('express');
const reviewController = require('../controllers/review.Controller');
const authController = require('../controllers/auth.Controller');

const router = express.Router({ mergeParams: true });

router
  .get('/', reviewController.getAllReviews)
  .post(
    '/',
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addReview,
  );
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
