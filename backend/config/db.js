const mongoose = require('mongoose');
let memoryServer;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri);
    console.log('MongoDB connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.log('Falling back to in-memory MongoDB');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const conn = await mongoose.connect(memoryServer.getUri());
    console.log('MongoDB memory server connected:', conn.connection.host);
    return conn;
  }
};

module.exports = connectDB;
