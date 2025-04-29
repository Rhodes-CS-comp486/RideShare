const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// route to get all feed posts
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, estimatedpayment, pickupdate, distance, duration, driverid, pickuptimestamp " +
            "FROM feed ORDER BY timeposted DESC");
          
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching feed:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// route to add a new feed post
router.post("/", async (req, res) => {
  const client = await pool.connect(); 
    try {
        const { passengerrhodesid, pickuptime, pickuplocation, 
                dropofflocation, ridestate, payment, pickupdate, 
                distance, duration, timeposted, estimatedpayment, 
                pickuptimestamp
              } = req.body; 

        await client.query('BEGIN');

        //Insert into feed table
        const result = await client.query(
            "INSERT INTO feed (passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, pickuptimestamp) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, pickuptimestamp]
        );

        //Insert into notifications table 
        await client.query(
            `INSERT INTO notification (passengerrhodesid, pickuptime, pickuplocation, dropofflocation, pickuptimestamp, beennotified)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                passengerrhodesid,
                pickuptime,
                pickuplocation,
                dropofflocation,
                pickuptimestamp,
                false // start as false
            ]
        );

      await client.query('COMMIT'); // commit transaction

        res.json(result.rows[0])
    } catch (err) {
        console.error("Error inserting post and notification:", err);
        if (client) {
            try { await client.query('ROLLBACK'); } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }
        } 

        res.status(500).json({ error: "Server error" });
    }
      finally {
        client.release(); // release the client back to the pool
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

module.exports = router;