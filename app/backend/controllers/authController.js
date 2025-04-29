const User = require('../models/User');
const nodemailer = require('nodemailer');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Serve password reset form (email token-based)
const serveResetForm = async (req, res) => {
  const { token, email } = req.query;

  if (!token) {
    return res.status(400).send('Invalid reset link.');
  }

  // Serve the reset form HTML page
  res.send(`
    <html>
      <head>
        <title>Reset Password</title>
        <style>
        ::placeholder {
          color: #FAF2E6;
          opacity: 1;
        }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #80A1C2; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="padding: 20px; text-align: center;">
          <h2 style="font-size: 24px; color: #FAF2E6; font-weight: bold; margin-bottom: 20px;">Reset Your Password</h2>
          <form method="POST" action="/api/auth/reset-password?token=${token}" style="display: flex; flex-direction: column; align-items: center;">
            <input type="hidden" name="email" value="${email}" />
            <input 
              type="password" 
              name="newPassword" 
              required 
              placeholder="New Password"
              style="width: 90%; max-width: 300px; height: 40px; background-color: #BF4146; border: none; border-radius: 8px; padding: 0 15px; margin: 5px 0; color: #FAF2E6; font-size: 14px;"
            />
            <button 
              type="submit" 
              style="background-color: #A62C2C; color: #FAF2E6; font-size: 18px; font-weight: 600; border: none; border-radius: 20px; padding: 10px 20px; margin-top: 10px; cursor: pointer;">
              Reset Password
            </button>
          </form>
        </div>
      </body>
    </html>
  `);  
};

const register = async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const { password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  if (!email.endsWith('@rhodes.edu')) {
    return res.status(400).json({ error: 'Invalid email format. Must end with @rhodes.edu.' });
  }

  const rhodesid = email.split('@')[0];

  try {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ rhodesid, email, password: hashedPassword, username });

    const emailToken = jwt.sign({ rhodesid: user.rhodesid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify?token=${emailToken}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your LynxLifts Account',
      text: `Thank you for signing up to LynxLifts. Click the link to verify your account: ${verificationLink}`,
    };

    res.status(201).json({ rhodesid: user.rhodesid });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Email failed to send', details: error.toString() });
      }
      console.log('Email sent:', info.response);
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rhodesid = decoded.rhodesid;

    const query = 'UPDATE users SET is_verified = true WHERE rhodesid = $1 RETURNING *;';
    const { rows } = await pool.query(query, [rhodesid]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User verified successfully.' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!email.includes('@')) {
    email = `${email}@rhodes.edu`;
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_verified) {
      return res.status(400).json({ error: 'Email not verified. Please check your inbox.' });
    }

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({ error: 'No user found with this email.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetToken, tokenExpiry, email.toLowerCase()]
    );
    
    const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your LynxLifts Password',
      text: `Click this link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Email failed to send.' });
      }

      res.status(200).json({ success: true, message: 'Reset link sent.' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword, email } = req.body;

  if (!token || !email || !newPassword) {
    return res.status(400).send('Missing token, email, or password.');
  }

  const cleanedToken = token.trim();
  const cleanedEmail = email.trim().toLowerCase();

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND email = $2 AND reset_token_expiry > NOW()',
      [cleanedToken, cleanedEmail]
    );

    if (rows.length === 0) {
      return res.status(400).send('Reset token is invalid or expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2 AND email = $3',
      [hashedPassword, cleanedToken, cleanedEmail]
    );
    
    res.send('Your password has been successfully reset. You can now log in.');
  } catch (err) {
    res.status(500).send('Server error. Please try again.');
  }
};

// ✅ NEW: Get driver payment info
const getPaymentInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const info = await User.getPaymentInfo(id);
    res.json(info);
  } catch (error) {
    console.error('Failed to fetch payment info:', error);
    res.status(500).json({ error: 'Failed to retrieve payment info.' });
  }
};

// ✅ NEW: Update driver payment info
const updatePaymentInfo = async (req, res) => {
  const { id } = req.params;
  const { venmo_handle, cashapp_handle, zelle_contact } = req.body;

  try {
    const updated = await User.updatePaymentInfo(id, { venmo_handle, cashapp_handle, zelle_contact });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update payment info:', error);
    res.status(500).json({ error: 'Failed to update payment info.' });
  }
};

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  serveResetForm,
  getPaymentInfo,
  updatePaymentInfo
};