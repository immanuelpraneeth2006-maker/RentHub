const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolving SRV records (ECONNREFUSED querySrv)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback to system default if setting custom dns fails
}

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('YOUR_USERNAME') || mongoURI.includes('YOUR_PASSWORD') || mongoURI.includes('YOUR_CLUSTER') || mongoURI.includes('<db_password>')) {
    console.warn('\n================================================================');
    console.warn('⚠️  MONGODB ATLAS WARNING:');
    console.warn('   No valid MongoDB Atlas connection string configured in server/.env');
    console.warn('   Expected format:');
    console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/renthub?retryWrites=true&w=majority');
    console.warn('   Please provide your Atlas credentials in server/.env to enable persistent database storage.');
    console.warn('================================================================\n');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('⚠️  Please verify your IP whitelist in MongoDB Atlas (Network Access -> Allow from anywhere 0.0.0.0/0) and credentials in server/.env');
    return false;
  }
};

const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    statusText: mongoose.connection.readyState === 1 ? 'Connected (MongoDB Atlas)' : 'Disconnected (MongoDB Atlas pending configuration)',
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null
  };
};

module.exports = { connectDB, getDBStatus };
