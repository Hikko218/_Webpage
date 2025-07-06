// /routes/adminAuth.js
const express = require('express');
const router = express.Router();

const ADMIN = {
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS
};

// Login route for admin authentication
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN.username && password === ADMIN.password) {
    req.session.admin = { username };
    return res.json({ message: 'Logged in with session' });
  }

  return res.status(401).json({ message: 'Unauthorized' });
});

// Logout route to destroy session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
