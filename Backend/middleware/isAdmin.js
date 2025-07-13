// middlewares/isAdmin.js
const debug = require('debug')('app:auth');

// Middleware to check if the user is logged in as admin
module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    debug('Admin authenticated');
    return next(); 
  }
  debug('Unauthorized access attempt');
  return res.status(401).json({ message: 'Unauthorized: Admin session required' });
};