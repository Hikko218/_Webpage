/**
 * @swagger
 * components:
 *   schemas:
 *     HomeContent:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         heading:
 *           type: string
 *         text:
 *           type: string
 *           
 *
 *     Skill:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         icon:
 *           type: string
 *         description:
 *           type: string
 *            
 *     AboutContent:
 *       type: object
 *       properties:
 *         heading:
 *           type: string
 *         text:
 *           type: string
 *         image:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *
 *     Project:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *
 *     Review:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         text:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *
 *     Contact:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         message:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 */

const dotenv = require('dotenv');
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const isTestEnv = process.env.NODE_ENV === 'test';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const debug = require('debug')('app:error');

// Swagger setup
if (!isTestEnv) {
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Backend API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


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
const mongoURI = isTestEnv ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

mongoose.connect(mongoURI)
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
  debug(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  debug('500 Error', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server only if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server runs at ${PORT}`));
}
// Export for testing
module.exports = {app, mongoose};

