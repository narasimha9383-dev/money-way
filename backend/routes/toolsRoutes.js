// backend/routes/toolsRoutes.js
import { Router } from 'express';
import {
  surpriseMe,
  whyNot,
  getSkillsMap,
  getSkillPathways,
  runScamAnalyzer,
  advisorChat
} from '../controllers/toolsController.js';
import {
  getRecommendations,
  postRecommendations
} from '../controllers/recommendationController.js';

const router = Router();

router.post('/surprise', surpriseMe);
router.post('/why-not', whyNot);
router.get('/skills-explorer', getSkillsMap);
router.get('/skills-explorer/:skill', getSkillPathways);
router.post('/scam-analyzer', runScamAnalyzer);
router.post('/advisor/chat', advisorChat);

// Real Job Recommendations Endpoints (Section 3, 4)
router.get('/recommendations', getRecommendations);
router.post('/recommendations', postRecommendations);

export default router;
