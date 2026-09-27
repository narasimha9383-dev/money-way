// backend/routes/adminRoutes.js
import { Router } from 'express';
import {
  getAdminFeedback,
  adminVerifyOpportunity,
  adminSaveOpportunity,
  getAdminOpportunities,
  adminDeleteOpportunity
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect ALL admin routes with requireAuth -> requireAdmin
router.use(requireAuth, requireAdmin);

// Feedback and logs overview
router.get('/feedback', getAdminFeedback);

// Verification endpoint
router.post('/verify/:id', adminVerifyOpportunity);

// Opportunities CRUD
router.get('/opportunities', getAdminOpportunities);
router.post('/opportunities', adminSaveOpportunity);
router.delete('/opportunities/:id', adminDeleteOpportunity);

export default router;
