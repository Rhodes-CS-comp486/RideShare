const pool = require('../db');


class User {
  static async create({ rhodesid, email, password, username }) {
    const query = `
      INSERT INTO users (rhodesid, email, password, username)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [rhodesid, email, password, username];
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