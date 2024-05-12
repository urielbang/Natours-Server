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
