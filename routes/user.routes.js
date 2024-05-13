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
  addUser,
} = require('../controllers/user.controller');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', getMe, getUser);
router.post('/addUser', addUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
