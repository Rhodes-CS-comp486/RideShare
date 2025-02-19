const User = require('../models/User');
const nodemailer = require('nodemailer');
const pool = require('../db');

const register = async (req, res) => {
  console.log('Request Body:', req.body);
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

    // Generate verification link
    const verificationLink = `http://localhost:5001/api/auth/verify?token=${rhodesid}`; // AHHH

    console.log('made it here 4');

    // Send verification email
    // NEED TO FIGURE OUT THIS TRAINWRECK
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('made it here 5');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your LynxLifts Account',
      text: `Click the link to verify your account: ${verificationLink}`,
    };

    console.log('made it here 6');

    await transporter.sendMail(mailOptions); // IT BREAKS HERE
    console.log('Verification email sent to:', email);

    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (error) {
    console.error('Registration Error:', error);
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