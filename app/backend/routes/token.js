const express = require('express');
const pool = require('../db'); // Assuming db connection is in the 'db.js' file
const router = express.Router();

// Route to save FCM token
router.post('/save-token', async (req, res) => {
    const { rhodesid, fcmToken } = req.body;
  
    // Validate input data
    if (!rhodesid || !fcmToken) {
      return res.status(400).json({ message: 'rhodesid and fcmToken are required' });
    }
  
    try {
      const query = `
        UPDATE users 
        SET "fcmToken" = $2
        WHERE rhodesid = $1
        RETURNING *;
      `;
      
      const values = [rhodesid, fcmToken]; // Directly pass the values needed
      
      console.log('Running query:', query);
      console.log('With values:', values);
  
      const { rows } = await pool.query(query, values);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'FCM token saved successfully', user: rows[0] });
    } catch (err) {
      console.error('Error saving FCM token:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  module.exports = router;