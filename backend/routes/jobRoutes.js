// backend/routes/jobRoutes.js
import { Router } from 'express';
import {
  searchJobs,
  getNearbyJobs,
  getRecentJobs,
  getRecommendedJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getAlertsList,
  createJobAlert,
  deleteJobAlert,
  getNotificationsList,
  markAsRead,
  markAllRead,
  streamNotifications,
  testNotification,
  handleGeocode,
  handleReverseGeocode,
  handleGetOrganizationDetails,
  handleGetOrganizationsList
} from '../controllers/jobController.js';

const router = Router();

// 1. Job Discovery & Exploration Endpoints (Section 25)
router.get('/search', searchJobs);
router.get('/nearby', getNearbyJobs);
router.get('/geocode', handleGeocode);
router.get('/reverse-geocode', handleReverseGeocode);
router.get('/recent', getRecentJobs);
router.get('/recommended', getRecommendedJobs);
router.get('/saved', getSavedJobs);

// Organization Details & Explorer Endpoints
router.get('/organization/details', handleGetOrganizationDetails);
router.get('/organizations', handleGetOrganizationsList);

// Job Detail & Bookmarking
router.get('/:id', getJobById);
router.post('/:id/save', saveJob);
router.delete('/:id/save', unsaveJob);

export default router;

// Alerts & Notification sub-routers
export const alertsRouter = Router();
alertsRouter.get('/', getAlertsList);
alertsRouter.post('/', createJobAlert);
alertsRouter.delete('/:id', deleteJobAlert);

export const notificationsRouter = Router();
notificationsRouter.get('/stream', streamNotifications);
notificationsRouter.post('/test', testNotification);
notificationsRouter.get('/', getNotificationsList);
notificationsRouter.patch('/:id/read', markAsRead);
notificationsRouter.post('/:id/read', markAsRead);
notificationsRouter.post('/read-all', markAllRead);
