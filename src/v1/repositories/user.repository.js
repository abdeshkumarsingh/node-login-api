const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-memory storage for development without MongoDB
const inMemoryUsers = [];

/**
 * User Repository
 * Responsible for database operations related to users
 */
class UserRepository {
  constructor() {
    this.useInMemory = process.env.SKIP_MONGODB === 'true';
    console.log(`User repository using ${this.useInMemory ? 'in-memory storage' : 'MongoDB'}`);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   */
  async createUser(userData) {
    if (this.useInMemory) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const newUser = {
        _id: uuidv4(),
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add toObject method for compatibility
        toObject: function() {
          return { ...this };
        }
      };
      
      inMemoryUsers.push(newUser);
      return newUser;
    }
    
    try {
      return await User.create(userData);
    } catch (error) {
      console.error('Error creating user in MongoDB:', error.message);
      // If there's a MongoDB error, fall back to in-memory if in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for createUser');
        // Set useInMemory to true for all future operations
        this.useInMemory = true;
        // Retry with in-memory
        return this.createUser(userData);
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} User or null if not found
   */
  async findById(id) {
    if (this.useInMemory) {
      const user = inMemoryUsers.find(u => u._id === id);
      return user || null;
    }
    
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error finding user by ID in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for findById');
        this.useInMemory = true;
        return this.findById(id);
      }
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} includePassword - Whether to include password field
   * @returns {Promise<User|null>} User or null if not found
   */
  async findByEmail(email, includePassword = false) {
    if (this.useInMemory) {
      const user = inMemoryUsers.find(u => u.email === email);
      
      if (!user) return null;
      
      if (!includePassword) {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          toObject: function() {
            return { ...this };
          },
          isPasswordCorrect: async function(candidatePassword, userPassword) {
            return await bcrypt.compare(candidatePassword, user.password);
          }
        };
      }
      
      return {
        ...user,
        isPasswordCorrect: async function(candidatePassword, userPassword) {
          return await bcrypt.compare(candidatePassword, user.password);
        }
      };
    }
    
    try {
      const query = User.findOne({ email });
      
      if (includePassword) {
        query.select('+password');
      }
      
      return await query;
    } catch (error) {
      console.error('Error finding user by email in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for findByEmail');
        this.useInMemory = true;
        return this.findByEmail(email, includePassword);
      }
      throw error;
    }
  }

  /**
   * Get all users
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<User[]>} Array of users
   */
  async findAll(filter = {}, options = {}) {
    if (this.useInMemory) {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;
      
      // Simple implementation ignoring filters and sorting
      return inMemoryUsers
        .slice(skip, skip + limit)
        .map(user => {
          // Remove password from results
          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            toObject: function() {
              return { ...this };
            }
          };
        });
    }

    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      return await User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error finding all users in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for findAll');
        this.useInMemory = true;
        return this.findAll(filter, options);
      }
      throw error;
    }
  }

  /**
   * Count users
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} User count
   */
  async countUsers(filter = {}) {
    if (this.useInMemory) {
      return inMemoryUsers.length;
    }
    
    try {
      return await User.countDocuments(filter);
    } catch (error) {
      console.error('Error counting users in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for countUsers');
        this.useInMemory = true;
        return this.countUsers(filter);
      }
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User|null>} Updated user or null if not found
   */
  async updateUser(id, updateData) {
    if (this.useInMemory) {
      const index = inMemoryUsers.findIndex(u => u._id === id);
      
      if (index === -1) return null;
      
      // Update user data
      inMemoryUsers[index] = {
        ...inMemoryUsers[index],
        ...updateData,
        updatedAt: new Date(),
      };
      
      return {
        ...inMemoryUsers[index],
        toObject: function() {
          return { ...this };
        }
      };
    }
    
    try {
      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating user in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for updateUser');
        this.useInMemory = true;
        return this.updateUser(id, updateData);
      }
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<User|null>} Deleted user or null if not found
   */
  async deleteUser(id) {
    if (this.useInMemory) {
      const index = inMemoryUsers.findIndex(u => u._id === id);
      
      if (index === -1) return null;
      
      const deletedUser = inMemoryUsers[index];
      inMemoryUsers.splice(index, 1);
      
      return {
        ...deletedUser,
        toObject: function() {
          return { ...this };
        }
      };
    }
    
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting user in MongoDB:', error.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to in-memory storage for deleteUser');
        this.useInMemory = true;
        return this.deleteUser(id);
      }
      throw error;
    }
  }
}

module.exports = new UserRepository(); 