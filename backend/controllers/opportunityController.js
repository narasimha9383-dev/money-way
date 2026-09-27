// backend/controllers/opportunityController.js
import { getAllOpportunities, getOpportunityById as fetchOppById } from '../data/store.js';
import { categoriesList } from '../data/opportunities.js';
import { Opportunity } from '../models/Opportunity.js';
import { syncRealOpportunities } from '../services/opportunityFeedService.js';
import { recommendOpportunities } from '../services/recommendationEngine.js';
import { searchOpportunitiesDatabase } from '../services/searchService.js';
import { parseAIQuery } from '../services/aiQueryService.js';
import { searchNearbyServices } from '../services/nearbyService.js';
import { 
  handleRefreshOpportunities, 
  handleAIDiscover, 
  findSimilarOpportunities 
} from '../services/discoveryService.js';

/**
 * 1. GET /api/opportunities
 * Returns normalized opportunities with dynamic querying, location, remote,
 * compensation, sort, pagination, and freshness metadata
 */
export async function getOpportunities(req, res) {
  try {
    const { 
      search = '', 
      q = '',
      category = 'all', 
      location = 'all',
      city = '',
      remote = 'all', 
      opportunityType = 'all',
      type = '',
      minPay,
      maxPay,
      paidOnly = false,
      freshness = 'any',
      sort = 'relevance',
      page = 1,
      limit = 20,
      mode = 'all',
      budget = 'all',
      skill = ''
    } = req.query;

    const searchTerm = search || q || '';
    const locationTerm = location !== 'all' ? location : (city || 'all');
    const typeTerm = opportunityType !== 'all' ? opportunityType : (type || 'all');

    // Parse remote filter
    let remoteFilter = remote;
    if (remoteFilter === 'all' && mode && mode !== 'all') {
      remoteFilter = mode.toLowerCase() === 'online' ? 'true' : (mode.toLowerCase() === 'offline' ? 'false' : 'all');
    }

    const result = await Opportunity.query({
      search: searchTerm,
      category,
      location: locationTerm,
      remote: remoteFilter,
      opportunityType: typeTerm,
      minPay,
      maxPay,
      paidOnly,
      freshness,
      sort,
      page,
      limit
    });

    return res.json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.hasMore,
      lastUpdated: result.lastUpdated,
      sources: result.sources,
      categories: result.categories,
      locations: result.locations,
      opportunities: result.opportunities
    });
  } catch (err) {
    console.error('getOpportunities error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve opportunities.',
      total: 0,
      opportunities: []
    });
  }
}

/**
 * Trigger feed refresh from legitimate sources
 */
export async function refreshFeed(req, res) {
  try {
    const syncRes = await syncRealOpportunities();
    return res.json({
      success: true,
      message: 'Opportunity feeds synced successfully.',
      total: syncRes.totalOpportunities,
      newCount: syncRes.newOpportunities,
      lastUpdated: syncRes.lastUpdated
    });
  } catch (err) {
    console.error('refreshFeed error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to refresh opportunity feeds: ' + err.message
    });
  }
}

/**
 * 2. GET /api/opportunities/search
 * Search opportunities with Standard & AI Modes
 */
export function searchOpportunities(req, res) {
  const { 
    q = '', 
    query = '', 
    searchMode = 'standard',
    budget, 
    workType, 
    mode, 
    experience, 
    time, 
    timeHours, 
    country, 
    category,
    opportunityType,
    location,
    city,
    remote,
    freshness,
    paidOnly,
    minPay,
    maxPay,
    sort,
    page,
    limit,
    profile,
    area,
    lat,
    lng,
    radiusKm,
    since,
    newOnly,
    excludeIds
  } = req.query;

  const searchTerm = q || query || '';
  const allOpps = getAllOpportunities();

  if (!allOpps || allOpps.length === 0) {
    return res.json({
      query: searchTerm,
      total: 0,
      opportunities: [],
      emptyDatabase: true,
      message: "No live opportunities found."
    });
  }

  let parsedProfile = null;
  if (profile) {
    try {
      parsedProfile = typeof profile === 'string' ? JSON.parse(profile) : profile;
    } catch {
      // ignore parse error
    }
  }

  let parsedExcludeIds = [];
  if (excludeIds) {
    try {
      parsedExcludeIds = typeof excludeIds === 'string' ? JSON.parse(excludeIds) : excludeIds;
    } catch {
      parsedExcludeIds = String(excludeIds).split(',');
    }
  }

  const searchResult = searchOpportunitiesDatabase({
    query: searchTerm,
    searchMode,
    budget,
    workType: workType || mode,
    experience,
    timeHours: timeHours || time,
    country,
    category,
    opportunityType,
    location: location || city,
    city: city || location,
    remote,
    freshness,
    paidOnly,
    minPay,
    maxPay,
    sort,
    page,
    limit,
    profile: parsedProfile,
    area,
    lat,
    lng,
    radiusKm,
    since,
    newOnly: newOnly === 'true' || newOnly === true,
    excludeIds: parsedExcludeIds,
    allOpportunities: allOpps
  });

  res.json(searchResult);
}

/**
 * 3. POST /api/opportunities/ai-search
 * AI Search Dedicated Endpoint
 */
export function executeAISearch(req, res) {
  const { query = '', profile = null, filters = {}, location = {} } = req.body || {};
  const allOpps = getAllOpportunities();

  const parsedAI = parseAIQuery(query, profile);
  const searchResult = searchOpportunitiesDatabase({
    query,
    searchMode: 'ai',
    budget: filters.budget !== undefined ? filters.budget : parsedAI.budget,
    workType: filters.workType || parsedAI.workPreference,
    experience: filters.experience || parsedAI.experience,
    timeHours: filters.timeHours || parsedAI.timeHours,
    profile,
    city: location.city || parsedAI.location?.city,
    area: location.area || parsedAI.location?.area,
    lat: location.lat,
    lng: location.lng,
    radiusKm: location.radiusKm || parsedAI.location?.radiusKm,
    allOpportunities: allOpps
  });

  res.json({
    aiUnderstanding: parsedAI,
    ...searchResult
  });
}

/**
 * 4. POST /api/opportunities/recommend
 * Recommend opportunities based on user profile
 */
export function recommend(req, res) {
  const body = req.body || {};
  const profile = body.profile || body;
  const {
    rejectedIds = [],
    excludeIds = [],
    viewedIds = [],
    modeFilter = "Both",
    complexityMode = "all",
    limit = 12
  } = body;

  const hasInfo = profile && (
    profile.timeAvailable || 
    profile.availableTime || 
    profile.budget !== undefined || 
    (profile.skills && profile.skills.length > 0) ||
    profile.workType || 
    profile.location || 
    profile.resources || 
    profile.equipment
  );

  const allOpps = getAllOpportunities();

  if (!hasInfo) {
    const starters = allOpps.filter(o => o.verified && (o.experienceLevel === 'entry-level' || o.isBeginnerFriendly || o.type === 'Freelance' || o.type === 'Internship')).slice(0, limit);
    return res.json({
      total: starters.length,
      count: starters.length,
      recommendations: starters,
      isStarter: true,
      message: "Showing popular starter opportunities. Customize your profile for tailored recommendations."
    });
  }
  if (!allOpps || allOpps.length === 0) {
    return res.json({
      total: 0,
      count: 0,
      recommendations: [],
      emptyDatabase: true,
      message: "No opportunities available yet. The opportunity database hasn't been populated yet."
    });
  }

  const recommendations = recommendOpportunities(profile, {
    rejectedIds,
    excludeIds,
    viewedIds,
    modeFilter,
    complexityMode,
    limit,
    allOpportunities: allOpps
  });

  res.json({
    total: recommendations.length,
    count: recommendations.length,
    recommendations
  });
}

/**
 * GET /api/opportunities/recommendations
 * Query-param based recommendations
 */
export function getRecommendationsQuery(req, res) {
  const { profile, modeFilter = 'Both', limit = 12 } = req.query;
  let parsedProfile = null;
  if (profile) {
    try {
      parsedProfile = typeof profile === 'string' ? JSON.parse(profile) : profile;
    } catch {
      // ignore
    }
  }

  if (!parsedProfile) {
    return res.status(400).json({ error: "User profile required for recommendations" });
  }

  const allOpps = getAllOpportunities();
  const recommendations = recommendOpportunities(parsedProfile, {
    modeFilter,
    limit: Number(limit) || 12,
    allOpportunities: allOpps
  });

  res.json({
    total: recommendations.length,
    count: recommendations.length,
    recommendations
  });
}

/**
 * 5. GET /api/opportunities/nearby
 * Nearby Opportunities & Services
 */
export function getNearby(req, res) {
  const { lat, lng, city, area, radiusKm, category, profile, limit } = req.query;

  let parsedProfile = null;
  if (profile) {
    try {
      parsedProfile = typeof profile === 'string' ? JSON.parse(profile) : profile;
    } catch {
      // ignore
    }
  }

  const result = searchNearbyServices({
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    city,
    area,
    radiusKm: radiusKm ? Number(radiusKm) : 50,
    category,
    profile: parsedProfile,
    limit: limit ? Number(limit) : 20
  });

  res.json(result);
}

/**
 * 6. POST /api/opportunities/refresh
 * Refresh Opportunities action
 */
export function refresh(req, res) {
  const { profile, excludeIds = [], rejectedIds = [], sinceTimestamp, filters = {} } = req.body || {};
  const allOpps = getAllOpportunities();

  const refreshResult = handleRefreshOpportunities({
    profile,
    excludeIds,
    rejectedIds,
    sinceTimestamp,
    filters,
    allOpps
  });

  res.json(refreshResult);
}

/**
 * 7. POST /api/opportunities/ai-discover
 * AI Discover action
 */
export function aiDiscover(req, res) {
  const { profile, activeSearchQuery = '', filters = {}, viewedIds = [], rejectedIds = [] } = req.body || {};
  const allOpps = getAllOpportunities();

  const result = handleAIDiscover({
    profile,
    activeSearchQuery,
    filters,
    viewedIds,
    rejectedIds,
    allOpps
  });

  res.json(result);
}

/**
 * 8. GET /api/opportunities/similar/:id & POST /api/opportunities/similar/:id
 * Find similar opportunities
 */
export function getSimilar(req, res) {
  const { excludeIds = [], rejectedIds = [], limit = 3 } = req.body || {};
  const allOpps = getAllOpportunities();

  const result = findSimilarOpportunities(req.params.id, {
    excludeIds,
    rejectedIds,
    allOpps,
    limit
  });
  res.json(result);
}

/**
 * 9. GET /api/opportunities/:id
 * Single Opportunity Detail
 */
export function getOpportunityDetail(req, res) {
  const opp = fetchOppById(req.params.id);
  if (!opp) {
    return res.status(404).json({ error: "Opportunity not found" });
  }
  res.json({
    ...opp,
    opportunity: opp
  });
}

