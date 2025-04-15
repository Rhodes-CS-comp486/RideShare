const pool = require('./db'); 
const admin = require('./firebaseAdmin');

async function notifyUpcomingRides() {
  try {
    const query = `
      SELECT u.fcmtoken, r.*
      FROM rides r
      JOIN users u ON r.rhodesid = u.rhodesid
      WHERE r.pickup_time BETWEEN NOW() AND NOW() + INTERVAL '10 minutes';
    `;

    const { rows } = await pool.query(query);

    for (const ride of rows) {
      if (!ride.fcmtoken) continue;

      const message = {
        token: ride.fcmtoken,
        notification: {
          title: 'Upcoming Ride!',
          body: `You have a ride at ${new Date(ride.pickup_time).toLocaleTimeString()}`,
        },
      };

      await admin.messaging().send(message);
      console.log(`Sent notification to ${ride.rhodesid}`);
    }
  } catch (err) {
    console.error('Error sending ride notifications:', err);
  }
}

module.exports = notifyUpcomingRides;