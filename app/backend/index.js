// entry point

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const statRoutes = require('./routes/stat');
const feedRoutes = require('./routes/feed');
const tokenRoutes = require('./routes/token');
const notifyUpcomingRides = require('./notifyUpcomingRides');
const preferencesRoutes = require('./routes/preference');
const browseRoutes = require('./routes/browse');
const messagesRoutes = require('./routes/messages');;
const reportRoutes = require('./routes/report');

const app = express();

app.use(express.urlencoded({ extended: true })); // for HTML form body

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stat', statRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api', preferencesRoutes);
app.use('/api', browseRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api', reportRoutes);
app.use('/api/messages', messagesRoutes);

// Schedule notification every minute
setInterval(() => {
  notifyUpcomingRides();
}, 10000);

// Uncomment for emulatorapp.use('/api/messages', messagesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Uncomment for Physical device
//app.listen(PORT, '0.0.0.0', () => {
  //console.log(`Server running on port ${PORT}`);
//});
