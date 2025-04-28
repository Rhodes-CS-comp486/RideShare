const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Submit a report
router.post('/report', async (req, res) => {
  const { reporter, reported, reason, details, postInfo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reports (reporter, reported, reason, details, postinfo, timestamp) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [reporter, reported, reason, details, postInfo]
    );

    res.status(201).json({ message: "Report submitted successfully", report: result.rows[0] });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
