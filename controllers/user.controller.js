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

const getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);
const addUser = factory.createOne(User);

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
  getMe,
  getAllUsers,
  updateMe,
  deleteMe,
  addUser,
};
