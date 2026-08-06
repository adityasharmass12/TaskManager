require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    let srv = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    srv.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Stop the other server or change PORT.`);
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed');
    console.log(err.message);
    process.exit(1);
  });
