const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

/**
 * Authentication Middleware
 */
class AuthMiddleware {
  /**
   * Authenticate user based on JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async authenticate(req, res, next) {
    try {
      // Get token from authorization header
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      // Check if token exists
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'You are not logged in. Please log in to get access.'
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      } catch (err) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token. Please log in again.'
        });
      }

      // Check if user still exists
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'The user belonging to this token no longer exists.'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restrict access to certain roles
   * @param {...String} roles - Allowed roles
   * @returns {Function} Middleware function
   */
  restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to perform this action'
        });
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware(); 