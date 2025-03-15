const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateUser } = require('../validation/user.validation');

const router = express.Router();

// Public routes
router.post('/', validateUser, userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(authMiddleware.authenticate);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', validateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 