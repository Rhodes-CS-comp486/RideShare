const pool = require('../db');

class User {
  static async create({ rhodesid, email, password, username, fcmtoken}) {
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
    const query = 'SELECT rhodesid, email, password, username, is_verified, profile_picture FROM users WHERE email = $1;';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  // Get driver payment info
  static async getDriverPaymentInfo(rhodesid) {
    const query = `
      SELECT venmo_handle, cashapp_handle, zelle_contact, paypal_handle, other_payment
      FROM users
      WHERE rhodesid = $1;
    `;
    const { rows } = await pool.query(query, [rhodesid]);
    return rows[0];
  }

  // Update driver payment info
  static async updateDriverPaymentInfo(rhodesid, paymentInfo) {
    const { venmo_handle, cashapp_handle, zelle_contact, paypal_handle, other_payment } = paymentInfo;
    const query = `
      UPDATE users
      SET venmo_handle = $1,
          cashapp_handle = $2,
          zelle_contact = $3,
          paypal_handle = $4,
          other_payment = $5
      WHERE rhodesid = $6;
    `;
    await pool.query(query, [venmo_handle, cashapp_handle, zelle_contact, paypal_handle, other_payment, rhodesid]);
  }
}

module.exports = User;
