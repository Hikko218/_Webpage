// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next(); 
  }

  return res.status(401).json({ message: 'Unauthorized: Admin session required' });
};