//Middleware for rate limiting
const rateLimit = require('express-rate-limit');

// Per IP max. 5 trys in 15 Min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 min
  max: 5,                            // 5 Requests
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,             // RateLimit-Headers activated
  legacyHeaders: false               // X-RateLimit-Headers disabled
});

module.exports = { loginLimiter };
