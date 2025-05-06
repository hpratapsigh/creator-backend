// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./lib/db');
const authRoutes = require('./api/auth/login');
const registerRoutes = require('./api/auth/register');
const creditsRoutes = require('./api/credits/add');
const feedRoutes = require('./api/feed/reddit');
const adminRoutes = require('./api/admin/users');
const userRoutes = require('./api/users/me');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Define API routes
app.use('/api/auth/login', authRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/api/credits/add', creditsRoutes);
app.use('/api/feed/', feedRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/users/me', userRoutes);

app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 3001; // Change port here
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

