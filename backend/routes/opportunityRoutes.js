// backend/routes/opportunityRoutes.js
import { Router } from 'express';
import {
  getOpportunities,
  refreshFeed,
  searchOpportunities,
  executeAISearch,
  recommend,
  getRecommendationsQuery,
  getNearby,
  refresh,
  aiDiscover,
  getSimilar,
  getOpportunityDetail
} from '../controllers/opportunityController.js';

const router = Router();

// Primary opportunities list and filtering
router.get('/', getOpportunities);
router.post('/refresh-feed', refreshFeed);
router.get('/refresh-feed', refreshFeed);

// Search endpoints
router.get('/search', searchOpportunities);
router.post('/ai-search', executeAISearch);

// Recommendation endpoints
router.post('/recommend', recommend);
router.get('/recommendations', getRecommendationsQuery);

// Nearby services
router.get('/nearby', getNearby);

// Refresh & AI discovery
router.post('/refresh', refresh);
router.post('/ai-discover', aiDiscover);

// Similar opportunities
router.get('/similar/:id', getSimilar);
router.post('/similar/:id', getSimilar);

// Opportunity detail
router.get('/:id', getOpportunityDetail);

export default router;
