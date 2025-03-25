const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.post('/login', authController.login);

module.exports = router;