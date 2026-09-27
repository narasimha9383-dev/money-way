// backend/routes/authRoutes.js
import { Router } from 'express';
import {
  signup,
  login,
  googleAuth,
  linkGoogle,
  getMe,
  logout,
  updateProfile,
  getSavedOpportunities,
  toggleSavedOpportunity,
  getActionPlans,
  saveActionPlans
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/link-google', linkGoogle);

// Protected user session & profile endpoints
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);
router.put('/profile', requireAuth, updateProfile);

// Protected user data endpoints
router.get('/saved', requireAuth, getSavedOpportunities);
router.post('/saved/:id', requireAuth, toggleSavedOpportunity);
router.get('/plans', requireAuth, getActionPlans);
router.post('/plans', requireAuth, saveActionPlans);

export default router;
