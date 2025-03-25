const User = require('../models/User');
const nodemailer = require('nodemailer');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
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
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hashed password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ rhodesid, email, password: hashedPassword, username });

    // Generate verification link
    const verificationLink = `http://localhost:5001/api/auth/verify?token=${rhodesid}`;

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Security bypass
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your LynxLifts Account',
      text: `Thank you for sending up to LynxLifts. Click the link to verify your account: ${verificationLink}`,
    };

    res.status(201).json({ 
      rhodesid: user.rhodesid 
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Email failed to send', details: error.toString() });
      }
      console.log('Email sent:', info.response);
      res.status(201).json({ 
        message: 'User registered. Verification email sent.'
      });
    });
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

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.'});
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.'});
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(400).json({ error: 'Email not verified. Please check your inbox.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { rhodesid: user.rhodesid, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      rhodesid: user.rhodesid,
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

module.exports = { register, verify, login };