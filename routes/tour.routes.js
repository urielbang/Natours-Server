const express = require('express');

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

module.exports = router;
