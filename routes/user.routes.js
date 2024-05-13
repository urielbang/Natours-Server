const express = require('express');
const authController = require('./../controllers/auth.Controller');
const {
  deleteUser,
  updateUser,
  getUser,
  getMe,
  getAllUsers,
  updateMe,
  deleteMe,
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

router.get('/me', authController.protect, getMe, getUser);
router.patch('/updateMe', authController.protect, updateMe);
router.delete('/deleteMe', authController.protect, deleteMe);

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
