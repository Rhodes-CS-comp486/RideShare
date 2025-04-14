const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all active drivers (status = true)
router.get('/browse-drivers', async (req, res) => {
  try {
    const query = 'SELECT driverid, radius, time FROM driver WHERE status = true;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching active drivers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;