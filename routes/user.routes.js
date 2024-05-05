const express = require('express');
const authController = require('./../controllers/auth.Controller');
const {
  deleteUser,
  updateUser,
  getUser,
  createUser,
  getAllUsers,
  updateMe,
} = require('../controllers/user.controller');
const router = express.Router();

router.post('/singup', authController.singup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, updateMe);

router.route('/').get(getAllUsers).get(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
