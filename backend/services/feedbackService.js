// backend/services/feedbackService.js
/**
 * User Feedback & "Not Interested" Handler Service (Section 26)
 * Stores feedback, suppresses rejected opportunities, and supports Undo.
 */

const feedbackStore = [];
const rejectedOpportunityStats = {};
const userSuppressedMap = new Map(); // userId or sessionId -> Set of suppressed IDs

export function recordNotInterested(opportunityId, reason = 'Not relevant', userId = 'default_user') {
  if (!userSuppressedMap.has(userId)) {
    userSuppressedMap.set(userId, new Set());
  }
  userSuppressedMap.get(userId).add(opportunityId);

  const entry = {
    id: `fb-${Date.now()}`,
    userId,
    opportunityId,
    action: 'not_interested',
    reason,
    timestamp: new Date().toISOString()
  };
  feedbackStore.push(entry);

  if (reason) {
    rejectedOpportunityStats[reason] = (rejectedOpportunityStats[reason] || 0) + 1;
  }

  return {
    success: true,
    message: "Feedback recorded. We'll show fewer opportunities like this.",
    undoAvailable: true,
    opportunityId
  };
}

export function undoNotInterested(opportunityId, userId = 'default_user') {
  if (userSuppressedMap.has(userId)) {
    userSuppressedMap.get(userId).delete(opportunityId);
  }

  // Remove latest feedback entry for this opp
  const idx = feedbackStore.findIndex(f => f.opportunityId === opportunityId && f.userId === userId);
  if (idx >= 0) {
    feedbackStore.splice(idx, 1);
  }

  return {
    success: true,
    message: "Restored opportunity to your recommendations.",
    opportunityId
  };
}

export function getSuppressedIdsForUser(userId = 'default_user') {
  return Array.from(userSuppressedMap.get(userId) || []);
}

export function getFeedbackStats() {
  return {
    totalEntries: feedbackStore.length,
    recent: feedbackStore.slice(-20).reverse(),
    reasonBreakdown: rejectedOpportunityStats
  };
}
