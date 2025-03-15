const mongoose = require('mongoose');

/**
 * Database connection helper
 */
class Database {
  /**
   * Connect to MongoDB
   * @returns {Promise<void>}
   */
  static async connect() {
    try {
      // Check if we're in a test/development environment and MongoDB is not available
      if (process.env.NODE_ENV === 'development' && process.env.SKIP_MONGODB === 'true') {
        console.log('Skipping MongoDB connection in development environment');
        return;
      }
      
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      console.log('Attempting to connect to MongoDB...');
      console.log(`Connection URI: ${uri.replace(/:[^:]*@/, ':****@')}`); // Hide password in logs
      
      // MongoDB connection
      const connection = await mongoose.connect(uri);
      
      console.log(`MongoDB connected: ${connection.connection.host}`);
      console.log(`Database name: ${connection.connection.name}`);
      return connection;
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      console.error(`Error type: ${error.name}`);
      console.error(`Stack trace: ${error.stack}`);
      
      if (error.message.includes('bad auth')) {
        console.error('Authentication failed. Please check your username and password in the connection string.');
        console.error('Setting SKIP_MONGODB=true in .env will allow API to run without MongoDB.');
      }
      
      // Don't exit the process if we're in development mode - allow API to run without MongoDB
      if (process.env.NODE_ENV === 'development') {
        console.log('Running API without MongoDB connection. Some features will not work correctly.');
        // Automatically enable in-memory mode
        process.env.SKIP_MONGODB = 'true';
      } else {
        process.exit(1);
      }
    }
  }
}

module.exports = Database; 