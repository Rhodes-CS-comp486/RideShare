// entry point

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const statRoutes = require('./routes/stat');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stat', statRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});