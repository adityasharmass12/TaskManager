const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set. Add it to backend/.env before starting the server.');
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB at', uri);
    console.error(error && error.message ? error.message : error);
    console.error('Ensure MongoDB is running or set MONGO_URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
