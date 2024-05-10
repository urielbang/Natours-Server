const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.Controller');
const authController = require('../controllers/auth.Controller');

router
  .get('/', reviewController.getAllReviews)
  .post(
    '/',
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addReview,
  );

module.exports = router;
