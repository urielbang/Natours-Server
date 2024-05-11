const express = require('express');
const reviewController = require('../controllers/review.Controller');

const router = express.Router();
const {
  deleteTour,
  updateTour,
  addTour,
  getTourById,
  getAllTours,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tour.controller');
const authController = require('../controllers/auth.Controller');

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-pan/:year').get(getMonthlyPlan);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(authController.protect, getAllTours).post(addTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour,
  );

// POST /tour/245sdfw/reviews
// GET /tour/245sdfw/reviews
// GET /tour/245sdfw/reviews/6544SDCSD

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addReview,
  );

module.exports = router;
