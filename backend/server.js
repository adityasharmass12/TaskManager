require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Stop the other server or change PORT.`);
        process.exit(1);
      }

      throw error;
    });
  } catch (error) {
    console.log('MongoDB connection failed');
    console.log(error.message);
    process.exit(1);
  }
}

startServer();
