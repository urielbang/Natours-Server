const { Tour } = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

//! middalware

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .Paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours: tours,
  });
});
const getTourById = catchAsync(async (req, res, next) => {
  const foundTour = await Tour.findById(req.params.id);
  if (!foundTour) {
    return next(new AppError('no tour found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    tour: foundTour,
  });
});

const addTour = catchAsync(async (req, res, next) => {
  req.body.guides = req.body.guides.split(',');

  const newTour = await Tour.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
const updateTour = catchAsync(async (req, res, next) => {
  req.body.guides = req.body.guides.split(',');
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
const deleteTour = catchAsync(async (req, res, next) => {
  const tourDelted = await Tour.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      tour: tourDelted,
    },
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(201).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  console.log(year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

module.exports = {
  deleteTour,
  updateTour,
  addTour,
  getTourById,
  getAllTours,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
