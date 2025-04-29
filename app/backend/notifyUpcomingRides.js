const pool = require('./db'); 
const admin = require('./firebaseAdmin');

async function notifyUpcomingRides() {
  try {
    const query = `
      SELECT u.fcmtoken, f.*
      FROM notification f
      JOIN users u ON f.passengerrhodesid = u.rhodesid
      WHERE f.pickuptimestamp BETWEEN NOW() AND NOW() + INTERVAL '30 minutes'
      AND f.beennotified = false
      AND f.pickuplocation IS NOT NULL
      AND f.dropofflocation IS NOT NULL
      AND f.pickuptime IS NOT NULL
    `;

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      console.log('No upcoming rides in the next 30 minutes.');
      return;
    }

    const sentTokens = new Set();

    for (const notification of rows) {
      // Debug full notification object
      console.log('DEBUG - Full notification row:', JSON.stringify(notification, null, 2));

      // Skip if no FCM token
      if (!notification.fcmtoken) {
        console.log(`No FCM token for ${notification.passengerrhodesid}`);
        continue;
      }

      // Skip duplicates
      if (sentTokens.has(notification.fcmtoken)) {
        console.log(`Duplicate token detected: ${notification.fcmtoken}, skipping...`);
        continue;
      }
      sentTokens.add(notification.fcmtoken);

      // Sanity check on essential fields
      if (
        !notification.pickuplocation?.trim() ||
        !notification.dropofflocation?.trim() ||
        !notification.pickuptime
      ) {
        console.log(`Incomplete ride details for ${notification.passengerrhodesid}`);
        continue;
      }

      // Compose body
      const notificationBody = `Your ride is coming up!\nPickup: ${notification.pickuplocation}\nDrop-off: ${notification.dropofflocation}\nTime: ${notification.pickuptime}`;

      // Sanity check for blank or invalid body
      if (
        !notificationBody.trim() ||
        notificationBody.includes('null') ||
        notificationBody.toLowerCase().includes('undefined')
      ) {
        console.log(`Skipping invalid notification body for ${notification.passengerrhodesid}`);
        continue;
      }

      console.log(`Sending notification: ${notificationBody}`);

      const message = {
        token: notification.fcmtoken,
        notification: {
          title: '🚗 Upcoming Ride!',
          body: notificationBody,
        },
      };

      // Send push notification
      await admin.messaging().send(message);
      console.log(`Sent notification to ${notification.passengerrhodesid}`);

      // Update DB to prevent re-notifying
      await pool.query(`
        UPDATE notification
        SET beennotified = true
        WHERE passengerrhodesid = $1 AND pickuptimestamp = $2
      `, [notification.passengerrhodesid, notification.pickuptimestamp]);

      console.log(`Updated beennotified to true for ${notification.passengerrhodesid}`);
    }
  } catch (err) {
    console.error('Error sending ride notifications:', err);
  }
}

module.exports = notifyUpcomingRides;