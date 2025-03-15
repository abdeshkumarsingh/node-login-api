const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  });
});

// Mount routes
router.use('/users', userRoutes);

module.exports = router; 