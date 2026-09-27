// backend/controllers/recommendationController.js
import { getRealJobRecommendations, parseJobQuery } from '../services/realJobService.js';

/**
 * GET /api/recommendations
 * Query-based real job recommendations
 * Example: GET /api/recommendations?query=delivery jobs in Hyderabad
 */
export async function getRecommendations(req, res) {
  try {
    const { 
      query = '', 
      q = '', 
      location = '', 
      city = '', 
      page = 1, 
      limit = 12,
      profile: profileParam
    } = req.query;

    const searchTerm = query || q || '';
    const loc = location || city || '';

    let parsedProfile = {};
    if (profileParam) {
      try {
        parsedProfile = typeof profileParam === 'string' ? JSON.parse(profileParam) : profileParam;
      } catch {
        parsedProfile = {};
      }
    }

    const result = await getRealJobRecommendations({
      query: searchTerm,
      location: loc,
      profile: parsedProfile,
      page: Number(page) || 1,
      limit: Number(limit) || 12
    });

    return res.json(result);
  } catch (err) {
    console.error('getRecommendations controller error:', err);
    return res.status(500).json({
      success: false,
      total: 0,
      recommendations: [],
      error: 'Unable to fetch live job opportunities right now. Please try again.',
      message: 'Unable to fetch live job opportunities right now. Please try again.'
    });
  }
}

/**
 * POST /api/recommendations
 * Body-based real job recommendations (supports profile and query)
 */
export async function postRecommendations(req, res) {
  try {
    const body = req.body || {};
    const searchTerm = body.query || body.q || body.prompt || '';
    const loc = body.location || body.city || '';
    const profile = body.profile || {};
    const limit = body.limit || 12;
    const page = body.page || 1;

    const result = await getRealJobRecommendations({
      query: searchTerm,
      location: loc,
      profile,
      page: Number(page) || 1,
      limit: Number(limit) || 12
    });

    return res.json(result);
  } catch (err) {
    console.error('postRecommendations controller error:', err);
    return res.status(500).json({
      success: false,
      total: 0,
      recommendations: [],
      error: 'Unable to fetch live job opportunities right now. Please try again.',
      message: 'Unable to fetch live job opportunities right now. Please try again.'
    });
  }
}
