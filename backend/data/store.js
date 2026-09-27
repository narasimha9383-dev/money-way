import { opportunities } from './opportunities.js';
import { checkOpportunityVerification } from '../services/verificationService.js';
import { Opportunity } from '../models/Opportunity.js';

// In-memory mutable stores
let allOpportunities = [...opportunities];
let userFeedbackStore = [];
let rejectedOpportunityStats = {};

/**
 * Retrieve ONLY real external job listings (from public feeds and verified partner postings)
 */
export function getRealJobListings() {
  const live = Opportunity.getAll() || [];
  return live
    .filter(item => item && (item.sourceUrl || item.url) && String(item.sourceUrl || item.url).startsWith('http'))
    .map(item => ({
      ...item,
      sourceType: 'real_job'
    }));
}

/**
 * Retrieve curated demo/guide career opportunities
 */
export function getDemoOpportunities() {
  return allOpportunities.map(item => ({
    ...Opportunity.normalize(item, item.source || 'Curated Career Pathway Guide'),
    sourceType: 'demo'
  }));
}

/**
 * Retrieve all opportunities (including custom and synced live ones)
 * Clearly separates real_job vs demo through sourceType field.
 */
export function getAllOpportunities() {
  const live = Opportunity.getAll() || [];
  const map = new Map();
  // Live verified real job opportunities first!
  live.forEach(item => {
    if (item.sourceUrl && item.sourceUrl.startsWith('http')) {
      const company = item.company || item.company_name || item.provider || (item.platforms && item.platforms[0]?.name) || 'Verified Employer';
      map.set(item.id, { ...item, company, sourceType: 'real_job' });
    }
  });

  // Custom opportunities from memory store (only if they have valid URLs)
  allOpportunities.forEach(item => {
    if (!map.has(item.id)) {
      const norm = Opportunity.normalize(item, item.source || 'Curated Career Pathway Guide');
      if (norm.sourceUrl && norm.sourceUrl.startsWith('http')) {
        const company = norm.company || norm.company_name || norm.provider || (norm.platforms && norm.platforms[0]?.name) || 'Verified Employer';
        map.set(item.id, { ...norm, company, sourceType: 'demo' });
      }
    }
  });

  return Array.from(map.values());
}

/**
 * Retrieve single opportunity by ID with verification metadata
 */
export function getOpportunityById(id) {
  const all = getAllOpportunities();
  const opp = all.find(o => o.id === id);
  if (!opp) return null;
  const verification = checkOpportunityVerification(opp);
  return {
    ...opp,
    verification: {
      ...opp.verification,
      ...verification
    }
  };
}

/**
 * Save or update an opportunity
 */
export function saveOpportunity(oppData) {
  const existingIndex = allOpportunities.findIndex(o => o.id === oppData.id);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const record = {
    ...oppData,
    id: oppData.id || `custom-${Date.now()}`,
    updatedAt: now.toISOString(),
    createdAt: oppData.createdAt || now.toISOString(),
    verification: {
      status: 'Verified',
      lastVerifiedAt: dateStr,
      source: oppData.verification?.source || 'Direct Industry Review',
      sourceUrl: oppData.verification?.sourceUrl || 'https://incomepath.ai/verified',
      platformFees: oppData.verification?.platformFees || 'Platform dependent',
      ageRestrictions: oppData.verification?.ageRestrictions || '18+',
      ...oppData.verification
    }
  };

  if (existingIndex >= 0) {
    allOpportunities[existingIndex] = { ...allOpportunities[existingIndex], ...record };
    return { isNew: false, opportunity: allOpportunities[existingIndex] };
  } else {
    allOpportunities.unshift(record);
    return { isNew: true, opportunity: record };
  }
}

/**
 * Verify an existing opportunity
 */
export function verifyOpportunity(id) {
  const all = getAllOpportunities();
  let opp = allOpportunities.find(o => o.id === id);
  if (!opp) {
    opp = all.find(o => o.id === id);
    if (opp) allOpportunities.push(opp);
  }
  if (!opp) return null;

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  opp.verification = {
    ...(opp.verification || {}),
    status: 'Verified',
    lastVerifiedAt: dateStr
  };
  opp.updatedAt = new Date().toISOString();

  return opp;
}

/**
 * Delete an opportunity by ID
 */
export function deleteOpportunity(id) {
  const initialLength = allOpportunities.length;
  allOpportunities = allOpportunities.filter(o => o.id !== id);
  return allOpportunities.length < initialLength;
}

/**
 * Feedback operations
 */
export function addGeneralFeedback(entry) {
  const record = {
    id: `fb-${Date.now()}`,
    ...entry,
    timestamp: new Date().toISOString()
  };
  userFeedbackStore.push(record);

  if (!entry.useful && entry.reason) {
    rejectedOpportunityStats[entry.reason] = (rejectedOpportunityStats[entry.reason] || 0) + 1;
  }

  return record;
}

export function getUserFeedbackStore() {
  return userFeedbackStore;
}

export function getRejectedOpportunityStats() {
  return rejectedOpportunityStats;
}
