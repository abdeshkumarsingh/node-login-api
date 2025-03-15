const userService = require('../services/user.service');

/**
 * User Controller
 * Handles HTTP requests for user operations
 */
class UserController {
  /**
   * Create a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      
      res.status(201).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10
      };
      
      const result = await userService.getAllUsers(options);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(); 