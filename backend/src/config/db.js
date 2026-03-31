const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // If a real MongoDB URI is configured, use it
  if (uri && !uri.includes('localhost')) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }
  }

  // Otherwise, try localhost first, then fall back to in-memory MongoDB
  try {
    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/tech-news-blog', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch {
    console.log('Local MongoDB not found. Starting in-memory MongoDB...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-memory MongoDB started: ${conn.connection.host}`);
    console.log('Note: Data will not persist after server restart.');
    console.log('For persistent data, set MONGODB_URI in .env to a MongoDB Atlas URI.');
  }
};

module.exports = connectDB;
