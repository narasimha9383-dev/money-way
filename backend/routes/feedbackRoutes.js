// backend/routes/feedbackRoutes.js
import { Router } from 'express';
import {
  handleNotInterested,
  handleUndoNotInterested,
  handleFeedbackSubmission
} from '../controllers/feedbackController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/not-interested', optionalAuth, handleNotInterested);
router.post('/undo-not-interested', optionalAuth, handleUndoNotInterested);
router.post('/', optionalAuth, handleFeedbackSubmission);

export default router;
