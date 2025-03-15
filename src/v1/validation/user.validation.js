const Joi = require('joi');

/**
 * User validation schema for creation
 */
const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be less than 50 characters',
    }),
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
    }),
  role: Joi.string().valid('user', 'admin')
});

/**
 * User validation schema for updates
 */
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be less than 50 characters',
    }),
  email: Joi.string().email()
    .messages({
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().min(8)
    .messages({
      'string.min': 'Password must be at least 8 characters',
    }),
  role: Joi.string().valid('user', 'admin')
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

/**
 * Middleware to validate user creation data
 */
const validateUser = (req, res, next) => {
  // Use different schema based on request method
  const schema = req.method === 'PATCH' ? userUpdateSchema : userCreateSchema;
  
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

/**
 * Middleware to validate login data
 */
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateUser,
  validateLogin
}; 