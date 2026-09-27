// backend/controllers/adminController.js
import { 
  getAllOpportunities, 
  saveOpportunity, 
  verifyOpportunity, 
  deleteOpportunity, 
  getUserFeedbackStore, 
  getRejectedOpportunityStats 
} from '../data/store.js';
import { getFeedbackStats as getServiceFeedbackStats } from '../services/feedbackService.js';

/**
 * GET /api/admin/feedback
 * Returns aggregated user feedback analytics and recent logs
 */
export function getAdminFeedback(req, res) {
  const serviceStats = getServiceFeedbackStats();
  const userFeedbackStore = getUserFeedbackStore();
  const rejectedOpportunityStats = getRejectedOpportunityStats();

  res.json({
    totalFeedback: userFeedbackStore.length + serviceStats.totalEntries,
    recentFeedback: [...userFeedbackStore, ...serviceStats.recent].slice(-20).reverse(),
    rejectionReasonsSummary: { ...rejectedOpportunityStats, ...serviceStats.reasonBreakdown }
  });
}

/**
 * POST /api/admin/verify/:id
 * Sets opportunity verification status to 'Verified' with current month/year
 */
export function adminVerifyOpportunity(req, res) {
  const { id } = req.params;
  const opp = verifyOpportunity(id);

  if (!opp) {
    return res.status(404).json({ success: false, error: "Opportunity not found" });
  }

  res.json({
    success: true,
    message: "Opportunity verified successfully",
    opportunity: opp
  });
}

/**
 * POST /api/admin/opportunities
 * Saves a new custom opportunity or updates an existing one
 */
export function adminSaveOpportunity(req, res) {
  const oppData = req.body;
  if (!oppData || !oppData.title) {
    return res.status(400).json({ success: false, error: "Opportunity title is required" });
  }

  const { isNew, opportunity } = saveOpportunity(oppData);

  res.json({
    success: true,
    message: isNew ? "Opportunity created successfully" : "Opportunity updated successfully",
    opportunity
  });
}

/**
 * GET /api/admin/opportunities
 * Lists all opportunities for admin management
 */
export function getAdminOpportunities(req, res) {
  res.json({
    total: getAllOpportunities().length,
    opportunities: getAllOpportunities()
  });
}

/**
 * DELETE /api/admin/opportunities/:id
 * Removes an opportunity from the database
 */
export function adminDeleteOpportunity(req, res) {
  const { id } = req.params;
  const success = deleteOpportunity(id);

  if (!success) {
    return res.status(404).json({ success: false, error: "Opportunity not found" });
  }

  res.json({
    success: true,
    message: "Opportunity deleted successfully",
    id
  });
}
