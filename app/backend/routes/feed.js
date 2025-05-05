const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// route to get all feed posts
router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          f.passengerrhodesid, f.pickuptime, f.pickuplocation, f.dropofflocation, 
          f.ridestate, f.payment, f.estimatedpayment, f.pickupdate, f.distance, f.duration, 
          f.driverid, pickuptimestamp, f.addcomments, f.pickuptimestamp, 
          f.drivercomplete, f.driverdescription, f.passengercomplete, f.passengerdescription,
          u.profile_picture AS passenger_profile_picture,
          u2.profile_picture AS driver_profile_picture
        FROM feed f 
        LEFT JOIN users u ON f.passengerrhodesid = u.rhodesid
        LEFT JOIN users u2 ON f.driverid = u2.rhodesid
        ORDER BY f.timeposted DESC
      `);      
        
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
              , addcomments, drivercomplete = false, passengercomplete = false, driverdescription = null, passengerdescription = null } = req.body; 

        await client.query('BEGIN');

        //Insert into feed table
        const result = await client.query(
            "INSERT INTO feed (passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, pickuptimestamp, addcomments, pickuptimestamp, drivercomplete, passengercomplete, driverdescription, passengerdescription) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12, $13, $14, $15, $16, $17) RETURNING *",
            [passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate, distance, duration, timeposted, estimatedpayment, pickuptimestamp, addcomments, pickuptimestamp, drivercomplete, passengercomplete, driverdescription, passengerdescription]
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