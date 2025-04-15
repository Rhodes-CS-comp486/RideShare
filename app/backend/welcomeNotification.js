const pool = require('./db'); 
const admin = require('./firebaseAdmin');

async function welcomeNotification() {
  try {
    // Query to fetch all users who have a C in thier username
    const query = `
      SELECT u.fcmtoken, u.username
      FROM users u
      WHERE u.username ILIKE '%C%' AND u.username IS NOT NULL;
    `;
    
    const { rows } = await pool.query(query);

    // Loop through users and send notification if they have a username
    for (const user of rows) {
      if (!user.fcmtoken) continue;  // Skip users without an FCM token

      const message = {
        token: user.fcmtoken,
        notification: {
          title: 'Welcome!',
          body: `Hello ${user.username}, welcome to the app!`,
        },
      };

      await admin.messaging().send(message);
      //console.log(`Sent welcome notification to ${user.username}`);
    }
  } catch (err) {
    console.error('Error sending welcome notifications:', err);
  }
}

module.exports = welcomeNotification;