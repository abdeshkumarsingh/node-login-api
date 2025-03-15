/**
 * Response Utility Class
 * Provides standardized response formatting
 */
class ResponseUtil {
  /**
   * Format success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {Object|Array} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Formatted response
   */
  static success(res, statusCode, data, message = 'Operation successful') {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  /**
   * Format error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {Object} Formatted response
   */
  static error(res, statusCode, message, errors = null) {
    const response = {
      status: 'error',
      message
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
  }

  /**
   * Format validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   * @returns {Object} Formatted response
   */
  static validationError(res, errors) {
    return this.error(res, 400, 'Validation failed', errors);
  }
}

module.exports = ResponseUtil; 