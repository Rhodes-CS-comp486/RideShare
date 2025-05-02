const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.serveResetForm);

// Payment option routes
router.get('/driver/:rhodesid/payment', authController.getDriverPayment);
router.put('/driver/:rhodesid/payment', authController.updateDriverPayment);

router.get('/api/driver/:rhodesid/profile', authController.getDriverProfile);

module.exports = router;