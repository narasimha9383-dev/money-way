// backend/controllers/toolsController.js
import { getAllOpportunities } from '../data/store.js';
import { skillsIncomeMap } from '../data/skillsMap.js';
import { getSurpriseOpportunity, explainWhyNot, recommendOpportunities } from '../services/recommendationEngine.js';
import { analyzeOpportunityText } from '../services/scamAnalyzer.js';
import { handleAdvisorChat } from '../services/aiAdvisor.js';

/**
 * POST /api/surprise
 * Returns a serendipitous verified opportunity matching user constraints
 */
export function surpriseMe(req, res) {
  const { profile, currentIds = [], rejectedIds = [] } = req.body || {};
  if (!profile) {
    return res.status(400).json({ error: "Profile required" });
  }

  const allOpps = getAllOpportunities();
  const surprise = getSurpriseOpportunity(profile, currentIds, rejectedIds, allOpps);

  if (!surprise) {
    return res.json({ 
      found: false, 
      message: "No additional distinct surprise opportunities match your hard constraints." 
    });
  }
  res.json({ found: true, opportunity: surprise });
}

/**
 * POST /api/why-not
 * Explains eligibility and mismatch reasons for an opportunity
 */
export function whyNot(req, res) {
  const { opportunityId, profile } = req.body || {};
  if (!opportunityId || !profile) {
    return res.status(400).json({ error: "opportunityId and profile are required" });
  }

  const allOpps = getAllOpportunities();
  const result = explainWhyNot(opportunityId, profile, allOpps);
  res.json(result);
}

/**
 * GET /api/skills-explorer
 * Returns all skills monetization maps
 */
export function getSkillsMap(req, res) {
  res.json(skillsIncomeMap);
}

/**
 * GET /api/skills-explorer/:skill
 * Returns pathways for a specific skill (with fallback for unlisted skills)
 */
export function getSkillPathways(req, res) {
  const skillParam = req.params.skill;
  const key = Object.keys(skillsIncomeMap).find(k => k.toLowerCase() === skillParam.toLowerCase());
  
  if (key) {
    res.json({ skill: key, pathways: skillsIncomeMap[key] });
  } else {
    res.json({
      skill: skillParam,
      pathways: [
        {
          path: `1-on-1 ${skillParam} Coaching & Tutoring`,
          difficulty: "Beginner-Friendly",
          incomeModel: "Per hour / session",
          startupTime: "3–5 days",
          requirements: `${skillParam} expertise, Zoom/Meet, payment link`,
          targetClients: "Beginners wanting personalized guidance",
          firstStep: `Create a simple booking page on Superprof or Topmate for ${skillParam}`,
          verifiedPlatforms: ["Superprof", "Topmate.io", "Preply"]
        },
        {
          path: `Freelance ${skillParam} Project Services`,
          difficulty: "Intermediate",
          incomeModel: "Per project / milestone",
          startupTime: "1–2 weeks",
          requirements: `Portfolio demonstrating practical ${skillParam} applications`,
          targetClients: "Businesses needing contract assistance with ${skillParam}",
          firstStep: `Package 2 specific deliverables on Upwork or Fiverr around ${skillParam}`,
          verifiedPlatforms: ["Upwork", "Contra", "Fiverr"]
        }
      ]
    });
  }
}

/**
 * POST /api/scam-analyzer
 * Analyzes text for common employment and advance-fee scam signals
 */
export function runScamAnalyzer(req, res) {
  const { text } = req.body || {};
  const analysis = analyzeOpportunityText(text);
  res.json(analysis);
}

/**
 * POST /api/advisor/chat
 * AI Income Advisor Chat
 */
export async function advisorChat(req, res) {
  try {
    const { message, profile } = req.body || {};
    const allOpps = getAllOpportunities();
    const response = await handleAdvisorChat(message, profile, allOpps);
    res.json(response);
  } catch (err) {
    console.error('Advisor chat error:', err);
    res.status(500).json({ error: 'Failed to process advisor chat request: ' + err.message });
  }
}

/**
 * POST /api/recommendations (Legacy backward compatibility)
 */
export function legacyRecommendations(req, res) {
  const { profile, rejectedIds = [], excludeIds = [], viewedIds = [], modeFilter = "Both", complexityMode = "all", limit = 12 } = req.body || {};
  const allOpps = getAllOpportunities();
  if (!profile || Object.keys(profile).length === 0) {
    const starters = allOpps.filter(o => o.verified && (o.experienceLevel === 'entry-level' || o.isBeginnerFriendly || o.type === 'Freelance' || o.type === 'Internship')).slice(0, limit);
    return res.json({
      total: starters.length,
      count: starters.length,
      recommendations: starters,
      isStarter: true
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
