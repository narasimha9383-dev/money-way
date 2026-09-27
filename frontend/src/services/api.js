// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'incomepath_auth_token';

/**
 * Token management helpers
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Centralized fetch with Authorization Bearer header attachment and safe error parsing
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(url, config);

    if (res.status === 401) {
      // If unauthorized, token might be expired
      const errorData = await res.json().catch(() => ({}));
      if (errorData.code === 'TOKEN_EXPIRED' || errorData.code === 'TOKEN_INVALID') {
        removeStoredToken();
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      const err = new Error(errorData.error || 'Authentication required.');
      err.status = 401;
      err.code = errorData.code;
      throw err;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const err = new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.code = errorData.code;
      err.data = errorData;
      throw err;
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

/* ==========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================== */

export async function signupApi({ name, email, password }) {
  return await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function loginApi({ email, password }) {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function googleAuthApi({ idToken }) {
  return await apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken })
  });
}

export async function linkGoogleApi({ email, password, idToken }) {
  return await apiFetch('/auth/link-google', {
    method: 'POST',
    body: JSON.stringify({ email, password, idToken })
  });
}

export async function getMeApi() {
  return await apiFetch('/auth/me');
}

export async function logoutApi() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    removeStoredToken();
  }
}

export async function updateUserProfileApi({ name, profileData }) {
  return await apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name, profileData })
  });
}

export async function fetchSavedOpportunitiesApi() {
  return await apiFetch('/auth/saved');
}

export async function toggleSavedOpportunityApi(opportunityId) {
  return await apiFetch(`/auth/saved/${encodeURIComponent(opportunityId)}`, {
    method: 'POST'
  });
}

export async function fetchActionPlansApi() {
  return await apiFetch('/auth/plans');
}

export async function saveActionPlansApi(actionPlans) {
  return await apiFetch('/auth/plans', {
    method: 'POST',
    body: JSON.stringify({ actionPlans })
  });
}

/* ==========================================================================
   OPPORTUNITY & PLATFORM ENDPOINTS
   ========================================================================== */

export async function fetchOpportunities(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    return await apiFetch(`/opportunities?${query.toString()}`);
  } catch (err) {
    console.error('API fetchOpportunities error:', err);
    throw err;
  }
}

export async function refreshOpportunitiesFeedApi() {
  try {
    return await apiFetch('/opportunities/refresh-feed', { method: 'POST' });
  } catch (err) {
    console.error('API refreshOpportunitiesFeedApi error:', err);
    throw err;
  }
}

export async function searchOpportunities(params = {}) {
  try {
    const query = new URLSearchParams();
    if (typeof params === 'string') {
      query.append('q', params);
    } else {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          if (typeof val === 'object') {
            query.append(key, JSON.stringify(val));
          } else {
            query.append(key, String(val));
          }
        }
      });
    }
    return await apiFetch(`/opportunities/search?${query.toString()}`);
  } catch (err) {
    console.error('API searchOpportunities error:', err);
    throw err;
  }
}

export async function executeAISearch(payload = {}) {
  try {
    return await apiFetch('/opportunities/ai-search', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('API executeAISearch error:', err);
    throw err;
  }
}

export async function fetchOpportunityById(id) {
  return await apiFetch(`/opportunities/${id}`);
}

export async function fetchRecommendations(profile, options = {}) {
  try {
    return await apiFetch('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ profile, ...options })
    });
  } catch {
    return await apiFetch('/opportunities/recommend', {
      method: 'POST',
      body: JSON.stringify({ profile, ...options })
    });
  }
}

/**
 * Fetch real-world job recommendations with query parsing, link verification,
 * and live external sources (Sections 3, 4, 19)
 */
export async function fetchRealRecommendations({ query = '', location = '', profile = {}, page = 1, limit = 12 } = {}) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (location) params.append('location', location);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));
  if (profile && Object.keys(profile).length > 0) {
    params.append('profile', JSON.stringify(profile));
  }
  return await apiFetch(`/recommendations?${params.toString()}`);
}

export async function fetchNearbyServices(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (typeof val === 'object') {
          query.append(key, JSON.stringify(val));
        } else {
          query.append(key, String(val));
        }
      }
    });
    return await apiFetch(`/opportunities/nearby?${query.toString()}`);
  } catch (err) {
    console.error('API fetchNearbyServices error:', err);
    throw err;
  }
}

export async function refreshOpportunities(payload = {}) {
  try {
    return await apiFetch('/opportunities/refresh', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('API refreshOpportunities error:', err);
    throw err;
  }
}

export async function aiDiscoverOpportunities(payload = {}) {
  try {
    return await apiFetch('/opportunities/ai-discover', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('API aiDiscoverOpportunities error:', err);
    throw err;
  }
}

export async function fetchSimilarOpportunities(id, options = {}) {
  try {
    return await apiFetch(`/opportunities/similar/${id}`, {
      method: 'POST',
      body: JSON.stringify(options)
    });
  } catch (err) {
    console.error('API fetchSimilarOpportunities error:', err);
    throw err;
  }
}

export async function reportNotInterested(payload = {}) {
  try {
    return await apiFetch('/feedback/not-interested', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('API reportNotInterested error:', err);
    throw err;
  }
}

export async function undoNotInterested(payload = {}) {
  try {
    return await apiFetch('/feedback/undo-not-interested', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('API undoNotInterested error:', err);
    throw err;
  }
}

export async function fetchSurpriseOpportunity(profile, currentIds = [], rejectedIds = []) {
  return await apiFetch('/surprise', {
    method: 'POST',
    body: JSON.stringify({ profile, currentIds, rejectedIds })
  });
}

export async function explainWhyNot(opportunityId, profile) {
  return await apiFetch('/why-not', {
    method: 'POST',
    body: JSON.stringify({ opportunityId, profile })
  });
}

export async function fetchSkillsMap() {
  return await apiFetch('/skills-explorer');
}

export async function fetchSkillPathways(skill) {
  return await apiFetch(`/skills-explorer/${encodeURIComponent(skill)}`);
}

export async function analyzeScamText(text) {
  return await apiFetch('/scam-analyzer', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

export async function chatAdvisor(message, profile) {
  return await apiFetch('/advisor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, profile })
  });
}

export async function sendFeedback(payload) {
  return await apiFetch('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminFeedback() {
  return await apiFetch('/admin/feedback');
}

export async function adminVerifyOpportunity(id) {
  return await apiFetch(`/admin/verify/${id}`, {
    method: 'POST'
  });
}

export async function adminSaveOpportunity(opp) {
  return await apiFetch('/admin/opportunities', {
    method: 'POST',
    body: JSON.stringify(opp)
  });
}

export async function fetchAdminOpportunities() {
  return await apiFetch('/admin/opportunities');
}

export async function adminDeleteOpportunity(id) {
  return await apiFetch(`/admin/opportunities/${id}`, {
    method: 'DELETE'
  });
}
