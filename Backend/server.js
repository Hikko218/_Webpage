const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

// This allows the frontend to communicate with the backend
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true // allow credentials to be sent
}));

// Middleware to parse JSON requests
app.use(express.json());

// Session management 
app.use(session({
  secret: process.env.SESSION_SECRET, // other secret key for session management
  resave: false,
  saveUninitialized: false,
  cookie: {
  maxAge: 1800000,
  httpOnly: true,
  secure: false,      // 'true' if using HTTPS, 'false' for development
  sameSite: 'lax'   // 'none' allows cross-site cookies, necessary for CORS
}
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Import routes
const adminAuthRoutes = require('./routes/adminAuth');
const content = require('./routes/content'); 

// Use routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/content', content);
app.use('/uploads', express.static('public/uploads'));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Backend-API!');
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server runs ${process.env.PORT || 3000}`);
});

