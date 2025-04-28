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

// Driver bio routes
router.get('/driver/:rhodesid/bio', authController.getDriverBio);
router.put('/driver/:rhodesid/bio', authController.updateDriverBio);

// Passenger bio routes
router.get('/passenger/:rhodesid/bio', authController.getPassengerBio);
router.put('/passenger/:rhodesid/bio', authController.updatePassengerBio);

module.exports = router;