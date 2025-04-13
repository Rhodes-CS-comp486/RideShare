// entry point

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const statRoutes = require('./routes/stat');
const feedRoutes = require('./routes/feed');
const tokenRoutes = require('./routes/token');
const notifyUpcomingRides = require('./notifyUpcomingRides');
const app = express();

app.use(express.urlencoded({ extended: true })); // for HTML form body

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stat', statRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/token', tokenRoutes);

// Schedule notification every minute
setInterval(() => {
  notifyUpcomingRides();
}, 60 * 1000);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});