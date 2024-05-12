const { User } = require('../models/userModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({ ...req.query });

  res.status(200).json({
    status: 'success',
    results: users.length,
    users: users,
  });
});
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
const deleteUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if users Posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Update user document
  const filterdBody = filterObj(req.body, 'name', 'email');
  const updatedUer = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUer,
    },
  });
});
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
module.exports = {
  deleteUser,
  updateUser,
  getUser,
  createUser,
  getAllUsers,
  updateMe,
  deleteMe,
};
