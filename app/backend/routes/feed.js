const express = require('express');
const pool = require('../db') // database connection
const router = express.Router();

// route to get all feed posts
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM feed");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching feed:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// route to add a new feed post
router.post("/", async (req, res) => {
    try {
        const { passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate } = req.body; 
        const result = await pool.query(
            "INSERT INTO feed (passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [passengerrhodesid, pickuptime, pickuplocation, dropofflocation, ridestate, payment, pickupdate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error inserting post:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;