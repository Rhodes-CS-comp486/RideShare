const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

router.post('/update-status', statusController.updateStatus);
router.get('/get-status/:driverID', statusController.getStatus);

module.exports = router;
