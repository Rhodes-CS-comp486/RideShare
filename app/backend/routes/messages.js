const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// Get all messages (latest first)
router.get('/', async (req, res) => {
    const { passengerrhodesid, driverid } = req.query;
    if (!passengerrhodesid || !driverid) {
      return res.status(400).json({ error: 'Missing passengerrhodesid or driverid' });
    }
    try {
      const result = await pool.query(
        'SELECT * FROM messages WHERE passengerrhodesid = $1 AND driverid = $2 ORDER BY timesent DESC',
        [passengerrhodesid, driverid]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

// Post a new message
router.post('/', async (req, res) => {
    const { passengerrhodesid, driverid, pickupdate, pickuptime, text, senderid } = req.body;
    const timesent = new Date();
    try {
      await pool.query(
        'INSERT INTO messages (passengerrhodesid, driverid, pickupdate, pickuptime, text, timesent, senderid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [passengerrhodesid, driverid, pickupdate, pickuptime, text, timesent, senderid]
      );
      res.status(201).send('Message added');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

module.exports = router;