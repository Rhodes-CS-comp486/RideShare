const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// Get all messages (latest first)
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

// Post a new message
router.post('/', async (req, res) => {
    const { user_id, text, createdAt } = req.body;
    try {
      await pool.query(
        'INSERT INTO messages (user_id, text, created_at) VALUES ($1, $2, $3)',
        [user_id, text, createdAt]
      );
      res.status(201).send('Message added');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

module.exports = router;