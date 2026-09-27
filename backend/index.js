// backend/index.js
import app from './app.js';
import { PORT } from './config/constants.js';
import { connectDB } from './config/db.js';

// Connect to MongoDB
connectDB().catch(err => {
  console.error('[Money Way] Initial MongoDB connect failed:', err.message);
});

const server = app.listen(PORT, () => {
  console.log(`[Money Way] Backend API server running on port ${PORT}`);
  console.log(`[Money Way] Health check available at http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\n[Money Way] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Money Way] Server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;
