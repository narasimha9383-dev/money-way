// backend/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './config/constants.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// Global Middleware
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(requestLogger);

// API Routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Money Way Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'Operational'
  });
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
