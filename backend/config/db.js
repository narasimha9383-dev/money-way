// backend/config/db.js
import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://narasimha9383_db_user:naidux100@cluster0.sjg61rc.mongodb.net/money_way?retryWrites=true&w=majority&appName=Cluster0';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });

    console.log(`[Money Way] MongoDB Connected successfully: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Money Way] MongoDB Connection Error: ${error.message}`);
    console.warn(`[Money Way] Continuing in resilient fallback mode (in-memory/file storage active)`);
    return null;
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('[Money Way] MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Money Way] MongoDB reconnected');
});

export default connectDB;
