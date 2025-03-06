const pool = require('../db');

class Status {
  static async updateStatus(driverID, status) {
    const query = `
      INSERT INTO driver (driverID, status) 
      VALUES ($1, $2)
      ON CONFLICT (driverID) 
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [driverID, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getStatus(driverID) {
    const query = 'SELECT status FROM driver WHERE driverID = $1;';
    const { rows } = await pool.query(query, [driverID]);
    return rows[0]?.status || null;
  }
}

module.exports = Status;
