const { Tour } = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return AppError(`No document such id found`, 404);
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.guides) req.body.guides = req.body.guides.split(',');

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('no document found with that id', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.guides) req.body.guides = req.body.guides.split(',');

    const doc = await Model.create(req.body);
    if (req.params.tourId) {
      await Tour.findByIdAndUpdate(
        req.params.tourId,

        { $push: { reviews: doc._id } },
        { new: true, upsert: true },
      );
    }
    return res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('no document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET review on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .Paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });
