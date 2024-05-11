const { catchAsync } = require('../utils/catchAsync');
const { Review } = require('../models/reviewModel');
const { Tour } = require('../models/tourModel');

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  res.status(200).json({
    results: reviews.length,
    data: {
      status: 'succses',
      data: reviews,
    },
  });
});

exports.addReview = catchAsync(async (req, res) => {
  // Allow nested routes

  if (!req.body.user) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  if (req.body.tour) {
    await Tour.findByIdAndUpdate(
      req.params.tourId,

      { $push: { reviews: newReview._id } },
      { new: true, upsert: true },
    );
  }

  res.status(200).json({
    data: {
      status: 'succses',
      data: newReview,
    },
  });
});
