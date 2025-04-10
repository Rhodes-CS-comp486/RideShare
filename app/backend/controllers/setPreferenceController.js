const pool = require('../db'); 

// Save and update driver preferences for radius and time
const setPreferences = async (req, res) => {
  const { driverid, radius, time } = req.body;

  if (!driverid || !radius || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const query = `
      UPDATE driver
      SET radius = $1, time = $2
      WHERE driverid = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [radius, time, driverid]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Preferences updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  setPreferences
};