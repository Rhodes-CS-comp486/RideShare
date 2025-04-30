const pool = require('../db');

class User {
  static async create({ rhodesid, email, password, username, fcmtoken }) {
    const query = `
      INSERT INTO users (rhodesid, email, password, username, fcmtoken)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [rhodesid, email, password, username, fcmtoken];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT rhodesid, email, password, username, is_verified FROM users WHERE email = $1;';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

module.exports = User;