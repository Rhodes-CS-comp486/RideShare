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

  static async findByRhodesId(rhodesid) {
    const query = 'SELECT * FROM users WHERE rhodesid = $1';
    const { rows } = await pool.query(query, [rhodesid]);
    return rows[0];
  }

  // ===================== Payment Info =====================
  static async getDriverPaymentInfo(rhodesid) {
    const query = `
      SELECT venmo_handle, cashapp_handle, zelle_contact, paypal_link, cash_other_notes
      FROM users
      WHERE rhodesid = $1;
    `;
    const { rows } = await pool.query(query, [rhodesid]);
    return rows[0];
  }

  static async updateDriverPaymentInfo(rhodesid, paymentInfo) {
    const { venmo_handle, cashapp_handle, zelle_contact, paypal_link, cash_other_notes } = paymentInfo;

    const query = `
      UPDATE users
      SET venmo_handle = $1,
          cashapp_handle = $2,
          zelle_contact = $3,
          paypal_link = $4,
          cash_other_notes = $5
      WHERE rhodesid = $6
      RETURNING *;
    `;
    const values = [venmo_handle, cashapp_handle, zelle_contact, paypal_link, cash_other_notes, rhodesid];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = User;
