const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development, use in-memory database
    if (process.env.NODE_ENV === 'development' && !process.env.MONGO_URI.includes('mongodb+srv')) {
      console.log('Using in-memory database for development');
      return; // Skip connection for in-memory
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Continuing with in-memory database for development...');
    // Don't exit process, continue with limited functionality
  }
};

module.exports = connectDB;