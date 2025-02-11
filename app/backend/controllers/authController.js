const User = require('../models/User');
const nodemailer = require('nodemailer'); // For email verification
const pool = require('../db'); 

const register = async (req, res) => {
  console.log('Request Body:', req.body); // Debug
  const { email, password, username } = req.body;

  // Check if required fields are present
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  // Validate email format
  if (!email.endsWith('@rhodes.edu')) {
    return res.status(400).json({ error: 'Invalid email format. Must end with @rhodes.edu.' });
  }

  // Extract Rhodes ID from email
  const rhodesid = email.split('@')[0];

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Create user
    const user = await User.create({ rhodesid, email, password, username });

    // Send verification email
    // NEED TO FINISH
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your LynxLifts Account',
      text: 'VERIFY ACCOUNT', // INCOMPLETE
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  const { token } = req.query;

  try {
    // Update user's verification status
    const query = 'UPDATE users SET is_verified = true WHERE rhodesid = $1 RETURNING *;';
    const { rows } = await pool.query(query, [token]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User verified successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, verify };