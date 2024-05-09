const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.Controller');

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.addReview);

module.exports = router;
