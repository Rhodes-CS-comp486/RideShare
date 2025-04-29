const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// route to get all feed posts
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, estimatedpayment, pickupdate, distance, duration, driverid, addcomments, pickuptimestamp, drivercomplete, driverdescription, passengercomplete, passengerdescription " +
            "FROM feed ORDER BY timeposted DESC");
          
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching feed:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// route to add a new feed post
router.post("/", async (req, res) => {
    try {
        const { passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, addcomments, pickuptimestamp, drivercomplete = false, passengercomplete = false, driverdescription = null, passengerdescription = null } = req.body; 
        const result = await pool.query(
            "INSERT INTO feed (passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, addcomments, pickuptimestamp, drivercomplete, passengercomplete, driverdescription, passengerdescription) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
            [passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, addcomments, pickuptimestamp, drivercomplete, passengercomplete, driverdescription, passengerdescription]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error inserting post:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// delete post passengerrhodesid, pickupdate, and pickuptime
router.delete("/:passengerrhodesid/:pickupdate/:pickuptime", async (req, res) => {
    const { passengerrhodesid, pickupdate, pickuptime } = req.params;
    try {
        await pool.query(
            "DELETE FROM feed WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptime = $3",
            [passengerrhodesid, pickupdate, pickuptime]
        );
        res.json({ message: "Post deleted" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/accept", async (req, res) => {
    const { passengerrhodesid, pickupdate, pickuptime, driverid } = req.body;
    try {
      const result = await pool.query(
        "UPDATE feed SET ridestate = true, driverid = $4 WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptime = $3 RETURNING *",
        [passengerrhodesid, pickupdate, pickuptime, driverid]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error accepting ride:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.put('/cancel', async (req, res) => {
    const { passengerrhodesid, pickupdate, pickuptime } = req.body;
    try {
      await pool.query(
        'UPDATE feed SET ridestate = false, driverid = NULL WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptime = $3',
        [passengerrhodesid, pickupdate, pickuptime]
      );
      res.json({ message: 'Ride canceled' });
    } catch (err) {
      console.error('Error canceling ride:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });  

  // complete status for driver
  router.put('/complete', async (req, res) => {
    const { passengerrhodesid, pickupdate, pickuptimestamp } = req.body;
    try {
      await pool.query(
        'UPDATE feed SET drivercomplete = true WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptimestamp = $3',
        [passengerrhodesid, pickupdate, pickuptimestamp]
      );
      res.json({ message: 'Ride marked as complete' });
    } catch (err) {
      console.error('Error marking ride complete:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });  

  // explain route for screen
  router.put('/explain', async (req, res) => {
    const { passengerrhodesid, pickupdate, pickuptime, driverdescription } = req.body;
    try {
      await pool.query(
        'UPDATE feed SET driverdescription = $4 WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptime = $3',
        [passengerrhodesid, pickupdate, pickuptime, driverdescription]
      );
      res.json({ message: 'Explanation saved' });
    } catch (err) {
      console.error('Error saving explanation:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // passenger complete status
  router.put('/passengercomplete', async (req, res) => {
    try {
      const { passengerrhodesid, pickupdate, pickuptimestamp } = req.body;
  
      await pool.query(
        `UPDATE feed SET passengercomplete = true WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptimestamp = $3`,
        [passengerrhodesid, pickupdate, pickuptimestamp]
      );
  
      res.json({ message: 'Ride marked as complete' });
    } catch (error) {
      console.error('Error marking ride complete:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // explain route passenger
  router.put('/passengerexplain', async (req, res) => {
    try {
      const { passengerrhodesid, pickupdate, pickuptime, passengerdescription } = req.body;
  
      await pool.query(
        `UPDATE feed SET passengerdescription = $4 WHERE passengerrhodesid = $1 AND pickupdate = $2 AND pickuptime = $3`,
        [passengerrhodesid, pickupdate, pickuptime, passengerdescription]
      );
  
      res.json({ message: 'Explanation saved' });
    } catch (error) {
      console.error('Error saving explanation:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;