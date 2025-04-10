// routes/preferences.js
const express = require('express');
const router = express.Router();
const { setPreferences } = require('../controllers/setPreferenceController');

// POST endpoint to save preferences
router.post('/set-preferences', setPreferences);

module.exports = router;
