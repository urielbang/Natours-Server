const express = require('express');
const authController = require('../controllers/auth.Controller');

const reviewRouter = require('./review.routes');
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

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    addTour,
  );

router
  .route('/:id')
  .get(getTourById)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour,
  );

module.exports = router;
