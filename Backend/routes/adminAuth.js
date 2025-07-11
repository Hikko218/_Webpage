// /routes/adminAuth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const ADMIN = {
  username: process.env.ADMIN_USER,
  passwordHash: process.env.ADMIN_PASS_HASH
};


// Login route for admin authentication
router.post('/login', async (req, res) => {
  try{ 
  const { username, password } = req.body;

  const comparedPassword = await bcrypt.compare(password, ADMIN.passwordHash);

  if (username === ADMIN.username && comparedPassword) {
    req.session.admin = { username };
    return res.json({ message: 'Logged in with session' });
  }
  } catch (err) {
    console.error('Error during login:', err);
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

// Middleware to check if user is logged in as admin
router.get('/check', (req, res) => {
  if (req.session?.admin) {
    return res.json({ loggedIn: true, username: req.session.admin.username });
  }
  res.json({ loggedIn: false });
});


module.exports = router;
