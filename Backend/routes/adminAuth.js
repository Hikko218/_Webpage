/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Endpunkte zur Admin-Authentifizierung
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const debug = require('debug')('app:auth');
const { body, validationResult } = require('express-validator');
const { loginLimiter } = require('../middleware/rateLimit');

const ADMIN = {
  username: process.env.ADMIN_USER,
  passwordHash: process.env.ADMIN_PASS_HASH
};

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login with session creation
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginLimiter, [
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const comparedPassword = await bcrypt.compare(password, ADMIN.passwordHash);

    if (username === ADMIN.username && comparedPassword) {
      req.session.admin = { username };
      return res.json({ message: 'Logged in with session' });
    }
  } catch (err) {
    debug('Login error:', err);
    console.error('Error during login:', err);
  }

  return res.status(401).json({ message: 'Unauthorized' });
});

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Logout and destroy admin session
 *     tags: [AdminAuth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Logout failed
 */
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      debug('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

/**
 * @swagger
 * /api/admin/check:
 *   get:
 *     summary: Check if admin is currently logged in
 *     tags: [AdminAuth]
 *     responses:
 *       200:
 *         description: Session status response
 */
router.get('/check', (req, res) => {
  if (req.session?.admin) {
    debug(`Admin session active: ${req.session.admin.username}`);
    return res.json({ loggedIn: true, username: req.session.admin.username });
  }
  debug('No active admin session');
  res.json({ loggedIn: false });
});

module.exports = router;

