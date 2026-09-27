// backend/controllers/feedbackController.js
import { recordNotInterested, undoNotInterested } from '../services/feedbackService.js';
import { addGeneralFeedback } from '../data/store.js';

export function handleNotInterested(req, res) {
  const { opportunityId, reason = 'Not relevant' } = req.body || {};
  const userId = req.user?.userId || 'anonymous_user';
  if (!opportunityId) {
    return res.status(400).json({ error: "opportunityId is required" });
  }
  const result = recordNotInterested(opportunityId, reason, userId);
  res.json(result);
}

export function handleUndoNotInterested(req, res) {
  const { opportunityId } = req.body || {};
  const userId = req.user?.userId || 'anonymous_user';
  if (!opportunityId) {
    return res.status(400).json({ error: "opportunityId is required" });
  }
  const result = undoNotInterested(opportunityId, userId);
  res.json(result);
}

export function handleFeedbackSubmission(req, res) {
  const { opportunityId, useful, reason = '', feedbackNote = '' } = req.body || {};
  const userId = req.user?.userId || null;
  addGeneralFeedback({
    userId,
    opportunityId,
    useful,
    reason,
    feedbackNote
  });

  res.json({ success: true, message: "Feedback recorded to improve future recommendations." });
}
