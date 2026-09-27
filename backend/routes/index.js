// backend/routes/index.js
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import opportunityRoutes from './opportunityRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import adminRoutes from './adminRoutes.js';
import toolsRoutes from './toolsRoutes.js';
import jobRoutes, { alertsRouter, notificationsRouter } from './jobRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Canonical Work Discovery Endpoints (Section 25)
router.use('/jobs', jobRoutes);
router.use('/alerts', alertsRouter);
router.use('/notifications', notificationsRouter);

// Preserved existing module routes
router.use('/auth', authRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);
router.use('/', toolsRoutes);

export default router;
