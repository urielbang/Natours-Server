const { catchAsync } = require('../utils/catchAsync');
const { Review } = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({});
  res.status(200).json({
    data: {
      status: 'succses',
      data: reviews,
    },
  });
});

exports.addReview = catchAsync(async (req, res) => {
  //   const { tour, user, createAt, rating, review } = req.body;
  const newReview = await Review.create(req.body);

  res.status(200).json({
    data: {
      status: 'succses',
      data: newReview,
    },
  });
});
