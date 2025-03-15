const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');

/**
 * User Service
 * Contains business logic for user operations
 */
class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} User object without sensitive data
   */
  async createUser(userData) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }

    // Create user
    const user = await userRepository.createUser(userData);
    
    // Return user without password
    return this._sanitizeUser(user);
  }

  /**
   * Authenticate user and generate token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication data
   */
  async loginUser(email, password) {
    // Find user by email with password
    const user = await userRepository.findByEmail(email, true);
    
    // Check if user exists
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    // Generate token
    const token = this._generateToken(user._id);
    
    return {
      user: this._sanitizeUser(user),
      token
    };
  }

  /**
   * Get all users with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated users
   */
  async getAllUsers(options) {
    const users = await userRepository.findAll({}, options);
    const total = await userRepository.countUsers();
    
    return {
      users: users.map(user => this._sanitizeUser(user)),
      pagination: {
        total,
        page: options.page || 1,
        limit: options.limit || 10,
        pages: Math.ceil(total / (options.limit || 10))
      }
    };
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return this._sanitizeUser(user);
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updateData) {
    // Check if email already exists
    if (updateData.email) {
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== id) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
      }
    }
    
    const user = await userRepository.updateUser(id, updateData);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return this._sanitizeUser(user);
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    const user = await userRepository.deleteUser(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
  }

  /**
   * Remove sensitive data from user object
   * @param {Object} user - User object
   * @returns {Object} Sanitized user
   * @private
   */
  _sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...sanitizedUser } = userObj;
    return sanitizedUser;
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} JWT token
   * @private
   */
  _generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = new UserService(); 