const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// Get list of conversations for a passenger
router.get('/conversations', async (req, res) => {
  const { passengerrhodesid, driverid } = req.query;

  try {
    let result;

    if (passengerrhodesid) {
      // Fetch conversations for passenger
      result = await pool.query(
        `
        SELECT DISTINCT ON (m.driverid) 
          m.driverid, 
          m.text AS lastmessage, 
          f.pickupdate, 
          f.pickuptime,
          u.profile_picture
          FROM messages m
          JOIN feed f ON f.passengerrhodesid = m.passengerrhodesid AND f.driverid = m.driverid
          JOIN users u ON m.driverid = u.rhodesid
          WHERE m.passengerrhodesid = $1
          ORDER BY m.driverid, m.timesent DESC
        `,
        [passengerrhodesid]
      );
    } else if (driverid) {
      // Fetch conversations for driver
      result = await pool.query(
        `
        SELECT DISTINCT ON (m.passengerrhodesid)
        m.passengerrhodesid,
        m.text AS lastmessage,
        f.pickupdate,
        f.pickuptime,
        u.profile_picture
        FROM messages m
        JOIN feed f ON f.passengerrhodesid = m.passengerrhodesid AND f.driverid = m.driverid
        JOIN users u ON u.rhodesid = m.passengerrhodesid
        WHERE m.driverid = $1
        ORDER BY m.passengerrhodesid, m.timesent DESC
        `,
        [driverid]
      );
    } else {
      return res.status(400).json({ error: 'Missing required query parameter: passengerrhodesid or driverid' });
    }

    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
    const { passengerrhodesid, driverid, pickupdate, pickuptime, text, senderid, pickuplocation, dropofflocation } = req.body;
    const timesent = new Date();
    try {
      // Attempt to fetch pickup date/time from feed
      const feedResult = await pool.query(
        `
        SELECT pickupdate, pickuptime 
        FROM feed 
        WHERE passengerrhodesid = $1 AND driverid = $2 
        LIMIT 1
        `,
        [passengerrhodesid, driverid]
      );
  
      let pickupdate = "not provided";
      let pickuptime = "not provided";
  
      if (feedResult.rows.length > 0) {
        pickupdate = feedResult.rows[0].pickupdate || "not provided";
        pickuptime = feedResult.rows[0].pickuptime || "not provided";
      }
  
      // Now insert the message
      await pool.query(
        `
        INSERT INTO messages (
          passengerrhodesid, driverid, pickupdate, pickuptime, text, timesent, senderid, pickuplocation, dropofflocation
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [passengerrhodesid, driverid, pickupdate, pickuptime, text, timesent, senderid, pickuplocation, dropofflocation]
      );
  
      res.status(201).send('Message added');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

module.exports = router;