// backend/services/discoveryService.js
/**
 * Discovery, Refresh & Change Detection Service (Sections 13, 14, 15, 16, 17, 18, 19, 21, 25)
 * Handles deduplication, refresh with excludeIds, new-since-last-visit detection,
 * Find Similar matching, and AI Discover serendipity based strictly on verified database items.
 */

import { opportunities } from '../data/opportunities.js';
import { evaluateOpportunityMatch, normalizeProfile } from './recommendationEngine.js';
import { checkOpportunityVerification } from './verificationService.js';

/**
 * Handles the 🔄 Refresh Opportunities action (Sections 13, 16, 17)
 */
export function handleRefreshOpportunities(options = {}) {
  const {
    profile = null,
    excludeIds = [],
    rejectedIds = [],
    sinceTimestamp = null,
    filters = {},
    allOpps = opportunities
  } = options;

  const excludedSet = new Set([...excludeIds, ...rejectedIds]);

  // 1. Filter out previously displayed and rejected opportunities
  let freshPool = allOpps.filter(opp => !excludedSet.has(opp.id));

  // 2. Filter only verified opportunities
  freshPool = freshPool.filter(opp => {
    const v = checkOpportunityVerification(opp);
    return v.isVerified;
  });

  // 3. Apply active filters if present
  if (filters.budget !== undefined && filters.budget !== '' && filters.budget !== null) {
    const b = Number(filters.budget);
    freshPool = freshPool.filter(opp => (opp.investment?.min || 0) <= b);
  }

  if (filters.workType && filters.workType !== 'all') {
    freshPool = freshPool.filter(opp => {
      if (filters.workType === 'Online') return opp.mode === 'Online' || opp.locationType === 'Remote';
      if (filters.workType === 'Offline') return opp.mode === 'Offline' || opp.locationType === 'Local';
      return true;
    });
  }

  if (filters.experience && filters.experience !== 'all') {
    if (filters.experience === 'Beginner') {
      freshPool = freshPool.filter(opp => opp.isBeginnerFriendly || (Array.isArray(opp.experienceLevel) && opp.experienceLevel.includes('Beginner')));
    } else if (filters.experience === 'Advanced') {
      freshPool = freshPool.filter(opp => opp.isAdvanced || (Array.isArray(opp.experienceLevel) && opp.experienceLevel.includes('Advanced')));
    }
  }

  // 4. Check for items created or updated since last visit timestamp (Section 14 & 15)
  let newlyDetectedCount = 0;
  if (sinceTimestamp) {
    const sinceMs = Date.parse(sinceTimestamp);
    if (!isNaN(sinceMs)) {
      newlyDetectedCount = freshPool.filter(opp => {
        const cMs = opp.createdAt ? Date.parse(opp.createdAt) : 0;
        const uMs = opp.updatedAt ? Date.parse(opp.updatedAt) : 0;
        return cMs > sinceMs || uMs > sinceMs;
      }).length;
    }
  }

  // 5. Match with user profile if available
  let rankedResults = [];
  if (profile && profile.isProfileCompleted) {
    const norm = normalizeProfile(profile);
    for (const opp of freshPool) {
      const evaluation = evaluateOpportunityMatch(opp, norm);
      if (evaluation.isEligible) {
        rankedResults.push({
          ...opp,
          matchLevel: evaluation.matchLevel,
          score: evaluation.score,
          whyAppeared: evaluation.whyAppeared,
          whyMatches: evaluation.whyMatches,
          possibleMismatches: evaluation.possibleMismatches
        });
      }
    }
    rankedResults.sort((a, b) => b.score - a.score);
  } else {
    rankedResults = freshPool.map(opp => ({
      ...opp,
      matchLevel: 'Verified Opportunity',
      whyAppeared: 'Verified opportunity from database matching active filters.',
      whyMatches: [
        opp.locationType === 'Remote' ? 'Can be done 100% remotely' : 'Flexible location',
        `Startup investment: ₹${opp.investment?.min || 0} – ₹${(opp.investment?.max || 2000).toLocaleString('en-IN')}`,
        `Time required: ${opp.timeRequired?.label || 'Flexible'}`
      ]
    }));
  }

  return {
    total: rankedResults.length,
    newOpportunitiesCount: newlyDetectedCount,
    hasNewOpportunities: newlyDetectedCount > 0,
    freshOpportunities: rankedResults.slice(0, 6),
    hasMore: rankedResults.length > 6,
    emptyStateAdvice: rankedResults.length === 0 ? {
      message: "No new verified matches right now with your current filters.",
      suggestions: [
        "Continue exploring your current saved results",
        "Broaden your search or relax budget filters",
        "Try Nearby Opportunities & Services",
        "Check back later for newly verified listings"
      ]
    } : null
  };
}

/**
 * AI Discover (Section 19): Analyzes profile, search, filters & viewed history
 * to uncover serendipitous opportunities from verified data.
 */
export function handleAIDiscover(options = {}) {
  const {
    profile = null,
    activeSearchQuery = '',
    filters = {},
    viewedIds = [],
    rejectedIds = [],
    allOpps = opportunities
  } = options;

  const excluded = new Set([...viewedIds, ...rejectedIds]);
  let pool = allOpps.filter(o => !excluded.has(o.id));

  // Ensure verified only
  pool = pool.filter(o => checkOpportunityVerification(o).isVerified);

  if (pool.length === 0) {
    // If all have been viewed, relax viewed filter but keep rejected filter
    pool = allOpps.filter(o => !rejectedIds.includes(o.id) && checkOpportunityVerification(o).isVerified);
  }

  const results = [];
  const norm = profile && profile.isProfileCompleted ? normalizeProfile(profile) : null;

  for (const opp of pool) {
    let whyDiscovered = [];

    if (norm) {
      const evaluation = evaluateOpportunityMatch(opp, norm);
      if (evaluation.isEligible) {
        whyDiscovered = [
          ...evaluation.whyMatches.slice(0, 2),
          `Discovered based on your work style & resource profile`
        ];
        results.push({
          ...opp,
          matchLevel: 'AI Discovered',
          score: evaluation.score + 10,
          whyAppeared: `AI Discovery: A complementary path aligned with your skills and time constraints.`,
          whyMatches: whyDiscovered,
          possibleMismatches: evaluation.possibleMismatches
        });
      }
    } else {
      results.push({
        ...opp,
        matchLevel: 'AI Discovered',
        score: 50,
        whyAppeared: `AI Discovery: A verified opportunity with strong growth potential.`,
        whyMatches: [
          `Verified official track record on ${opp.platforms?.[0]?.name || 'established platforms'}`,
          `Startup cost: ₹${opp.investment?.min || 0}`,
          `Flexible daily commitment`
        ]
      });
    }
  }

  // Shuffle slightly for serendipity while preserving quality
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    total: results.length,
    discoveries: results.slice(0, 4)
  };
}

/**
 * Find Similar Opportunities (Section 25):
 * Finds related opportunities with similar characteristics, excluding current ID & duplicates.
 */
export function findSimilarOpportunities(targetOppId, options = {}) {
  const {
    excludeIds = [],
    rejectedIds = [],
    allOpps = opportunities,
    limit = 3
  } = options;

  const target = allOpps.find(o => o.id === targetOppId);
  if (!target) {
    return { target: null, similar: [] };
  }

  const excluded = new Set([targetOppId, ...excludeIds, ...rejectedIds]);

  const candidates = allOpps.filter(o => !excluded.has(o.id));

  // Score similarity based on Category, Mode, Investment range, and overlapping Skills
  const scored = candidates.map(cand => {
    let simScore = 0;
    const similarityReasons = [];

    if (cand.category === target.category) {
      simScore += 40;
      similarityReasons.push(`Shares category: ${cand.category}`);
    }

    if (cand.mode === target.mode) {
      simScore += 25;
      similarityReasons.push(`Same work mode: ${cand.mode}`);
    }

    if (Math.abs((cand.investment?.min || 0) - (target.investment?.min || 0)) <= 500) {
      simScore += 20;
      similarityReasons.push(`Similar initial capital requirement`);
    }

    const candSkills = cand.requiredSkills || cand.requirements || [];
    const targetSkills = target.requiredSkills || target.requirements || [];
    const sharedSkills = candSkills.filter(s => 
      targetSkills.some(ts => String(ts).toLowerCase().includes(String(s).toLowerCase()) || String(s).toLowerCase().includes(String(ts).toLowerCase()))
    );

    if (sharedSkills.length > 0) {
      simScore += sharedSkills.length * 15;
      similarityReasons.push(`Overlapping skill requirements: ${sharedSkills.slice(0, 2).join(', ')}`);
    }

    return {
      ...cand,
      similarityScore: simScore,
      similarityReasons: similarityReasons.slice(0, 3)
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    target: { id: target.id, title: target.title, category: target.category },
    similar: scored.slice(0, limit)
  };
}
