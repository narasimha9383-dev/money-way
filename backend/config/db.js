// backend/config/db.js
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[Money Way] MONGODB_URI environment variable is not set!');
    console.warn('[Money Way] Continuing in resilient fallback mode (in-memory/file storage active)');
    return null;
  }

  // Log partial URI for debugging (hide password)
  const safeUri = uri.replace(/:([^@]+)@/, ':***@');
  console.log(`[Money Way] Connecting to MongoDB: ${safeUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });

    console.log(`[Money Way] MongoDB Connected successfully: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Money Way] MongoDB Connection Error: ${error.message}`);
    console.warn('[Money Way] Continuing in resilient fallback mode (in-memory/file storage active)');
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
