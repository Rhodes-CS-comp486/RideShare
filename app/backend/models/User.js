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
    const query = `
      SELECT rhodesid, email, password, username, is_verified 
      FROM users 
      WHERE email = $1;
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async getDriverBio(rhodesid) {
    const query = `
      SELECT 
        driver_name,
        driver_class_year,
        car_make_model,
        car_color,
        license_plate,
        driver_num_passengers,
        driver_bio,
        driver_pronouns,
        pet_friendly,
        driver_profile_picture
      FROM users
      WHERE rhodesid = $1;
    `;
    const { rows } = await pool.query(query, [rhodesid]);
    return rows[0];
  }

  static async updateDriverBio(rhodesid, bio) {
    const query = `
      UPDATE users SET
        driver_name = $1,
        driver_class_year = $2,
        car_make_model = $3,
        car_color = $4,
        license_plate = $5,
        driver_num_passengers = $6,
        driver_bio = $7,
        driver_pronouns = $8,
        pet_friendly = $9,
        driver_profile_picture = $10
      WHERE rhodesid = $11
      RETURNING *;
    `;
    const values = [
      bio.driver_name,
      bio.driver_class_year,
      bio.car_make_model,
      bio.car_color,
      bio.license_plate,
      bio.driver_num_passengers,
      bio.driver_bio,
      bio.driver_pronouns,
      bio.pet_friendly,
      bio.driver_profile_picture,
      rhodesid
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getPassengerBio(rhodesid) {
    const query = `
      SELECT 
        passenger_name,
        passenger_class_year,
        passenger_major,
        passenger_pronouns,
        passenger_bio,
        passenger_profile_picture
      FROM users
      WHERE rhodesid = $1;
    `;
    const { rows } = await pool.query(query, [rhodesid]);
    return rows[0];
  }

  static async updatePassengerBio(rhodesid, bio) {
    const query = `
      UPDATE users SET
        passenger_name = $1,
        passenger_class_year = $2,
        passenger_major = $3,
        passenger_pronouns = $4,
        passenger_bio = $5,
        passenger_profile_picture = $6
      WHERE rhodesid = $7
      RETURNING *;
    `;
    const values = [
      bio.passenger_name,
      bio.passenger_class_year,
      bio.passenger_major,
      bio.passenger_pronouns,
      bio.passenger_bio,
      bio.passenger_profile_picture,
      rhodesid
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = User;