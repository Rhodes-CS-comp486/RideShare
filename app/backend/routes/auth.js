const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.serveResetForm);

router.get('/user/:rhodesid/profile', authController.getUserProfile);
router.put('/user/:rhodesid/profile', authController.updateUserProfile);

// Payment Option routes for driver
router.get('/driver/:rhodesid/payment', authController.getDriverPaymentInfo);
router.put('/driver/:rhodesid/payment', authController.updateDriverPaymentInfo);

module.exports = router;