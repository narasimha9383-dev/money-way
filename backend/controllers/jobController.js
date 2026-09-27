// backend/controllers/jobController.js
import { 
  getRealJobRecommendations, 
  parseJobQuery, 
  normalizeJobData, 
  scoreAndRankJobs, 
  deduplicateJobs 
} from '../services/realJobService.js';
import { Opportunity } from '../models/Opportunity.js';
import { getAllOpportunities } from '../data/store.js';
import { VERIFIED_PARTNER_LISTINGS } from '../services/opportunityFeedService.js';
import { 
  calculateHaversineDistance, 
  resolveCoordinates, 
  resolveCoordinatesAsync,
  dynamicGeocode,
  dynamicReverseGeocode,
  getCoordinatesForLocation 
} from '../services/locationService.js';
import { 
  getAllAlerts, 
  createAlert, 
  deleteAlert, 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  evaluateAlertsAgainstJobs,
  registerSseClient,
  triggerRealtimeNotification
} from '../services/alertNotificationService.js';
import { isValidJobUrl } from '../services/verificationService.js';
import { getOrganizationDetails, getFeaturedOrganizations } from '../services/organizationService.js';

// In-memory saved jobs per user/session
const userSavedJobsStore = new Map();

/**
 * 1. GET /api/jobs/search (Sections 1, 4, 5, 6, 7, 17, 25, 26)
 */
export async function searchJobs(req, res) {
  try {
    const {
      q = '',
      query = '',
      location = '',
      city = '',
      area = '',
      lat,
      lng,
      radiusKm = 25,
      sector = '',
      category = '',
      employmentType = '',
      experience = '',
      remote = '',
      minPay,
      maxPay,
      sort = 'relevance',
      page = 1,
      limit = 20,
      profile: profileParam
    } = req.query;

    const rawQuery = q || query || '';

    let parsedProfile = {};
    if (profileParam) {
      try {
        parsedProfile = typeof profileParam === 'string' ? JSON.parse(profileParam) : profileParam;
      } catch {
        parsedProfile = {};
      }
    }

    // Step 1: Query Understanding & Structured Intent (Section 4)
    const locLower = String(location || city || '').toLowerCase().trim();
    const isExplicitRemoteLoc = locLower === 'remote' || locLower === 'online' || locLower === 'wfh' || locLower === 'work from home';
    const effectiveLocation = isExplicitRemoteLoc ? '' : (location || city || parsedProfile.city || '');

    const intent = parseJobQuery(rawQuery, {
      ...parsedProfile,
      city: effectiveLocation
    });

    if (isExplicitRemoteLoc) {
      intent.remote = true;
      intent.isRemote = true;
      intent.location = null;
    }

    if (sector && !intent.sector) intent.sector = sector;
    if (category && !intent.category) intent.category = category;
    if (employmentType && !intent.employmentType) intent.employmentType = employmentType;
    if (experience && !intent.experience) intent.experience = experience;
    if (remote !== '' && intent.remote === null) {
      intent.remote = remote === 'true' || remote === true;
      intent.isRemote = intent.remote;
    }
    if (minPay && !intent.salary_min) intent.salary_min = Number(minPay);

    // Step 2: Retrieve Real Jobs (Section 2)
    const recResult = await getRealJobRecommendations({
      query: rawQuery || intent.keyword || intent.sector || '',
      location: intent.location || effectiveLocation || '',
      profile: {
        ...parsedProfile,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined
      },
      page: Number(page) || 1,
      limit: 60
    });

    let jobs = recResult.recommendations || [];

    // Filter by sector if explicitly requested
    if (sector && sector !== 'all') {
      const sLower = sector.toLowerCase();
      jobs = jobs.filter(j => (j.sector && j.sector.toLowerCase().includes(sLower)) || (j.category && j.category.toLowerCase().includes(sLower)));
    }

    // Filter by employmentType if explicitly requested
    if (employmentType && employmentType !== 'all') {
      const eLower = employmentType.toLowerCase();
      jobs = jobs.filter(j => j.employmentType && j.employmentType.toLowerCase().includes(eLower));
    }

    // Filter by experience if explicitly requested
    if (experience && experience !== 'all') {
      const expLower = experience.toLowerCase();
      if (expLower === 'fresher' || expLower === 'entry-level') {
        jobs = jobs.filter(j => 
          (j.experience && j.experience.toLowerCase().includes('fresh')) ||
          (j.title && j.title.toLowerCase().includes('fresher')) ||
          (j.title && j.title.toLowerCase().includes('intern')) ||
          (j.employmentType === 'Internship')
        );
      }
    }

    // Filter by remote
    if (remote === 'true' || remote === true || isExplicitRemoteLoc || intent.isRemote) {
      jobs = jobs.filter(j => j.isRemote || j.remote);
    } else if (remote === 'false' || remote === false) {
      jobs = jobs.filter(j => !j.isRemote && !j.remote);
    }

    // Step 3: Location / Coordinates matching (Section 8)
    const targetCoords = (isExplicitRemoteLoc || intent.isRemote)
      ? null
      : resolveCoordinates({
          lat: lat ? Number(lat) : undefined,
          lng: lng ? Number(lng) : undefined,
          city: intent.location || city || location,
          area
        });

    if (targetCoords) {
      jobs = jobs.map(j => {
        let dist = j.distanceKm;
        if ((dist === null || dist === undefined) && j.latitude && j.longitude) {
          dist = calculateHaversineDistance(targetCoords.lat, targetCoords.lng, j.latitude, j.longitude);
        }
        return {
          ...j,
          distanceKm: dist,
          userLocationContext: targetCoords.displayName
        };
      });

      // Filter by radius if nearby query was explicitly triggered with a specific radius
      if (intent.isNearby && intent.radius_km) {
        const rad = Number(radiusKm) || intent.radius_km || 25;
        const withinRadius = jobs.filter(j => j.distanceKm === null || j.distanceKm <= rad);
        if (withinRadius.length > 0) {
          jobs = withinRadius;
        }
      }
    }

    // Step 4: Sorting (Section 17)
    if (sort === 'distance' && targetCoords) {
      jobs.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    } else if (intent.isNearby && targetCoords) {
      // If user searched for nearby jobs, prioritize proximity then relevance
      jobs.sort((a, b) => {
        const distA = a.distanceKm ?? 9999;
        const distB = b.distanceKm ?? 9999;
        if (distA !== distB) return distA - distB;
        return (b.matchScore || b.score || 0) - (a.matchScore || a.score || 0);
      });
    } else if (sort === 'newest') {
      jobs.sort((a, b) => new Date(b.postedAt || b.postedDate || 0) - new Date(a.postedAt || a.postedDate || 0));
    } else {
      // Relevance ranking: Prioritize local in-person opportunities in target area first, then by match score
      if (targetCoords) {
        jobs.sort((a, b) => {
          const aIsLocal = a.distanceKm !== null && a.distanceKm <= 50;
          const bIsLocal = b.distanceKm !== null && b.distanceKm <= 50;
          if (aIsLocal && !bIsLocal) return -1;
          if (!aIsLocal && bIsLocal) return 1;
          return (b.matchScore || b.score || 0) - (a.matchScore || a.score || 0);
        });
      } else {
        jobs.sort((a, b) => (b.matchScore || b.score || 0) - (a.matchScore || a.score || 0));
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const total = jobs.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const paginated = jobs.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    // Section 2: If no real jobs found, return honest empty state
    if (total === 0) {
      return res.json({
        success: true,
        total: 0,
        page: pageNum,
        totalPages: 1,
        jobs: [],
        message: 'No verified matching jobs found.',
        suggestions: [
          'Increasing your search radius or clearing local filters',
          'Searching for broader roles (e.g. "delivery", "hospitality", "software")',
          'Checking nearby metropolitan areas'
        ],
        intent
      });
    }

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      jobs: paginated,
      intent,
      sources: Array.from(new Set(jobs.map(j => j.source).filter(Boolean))),
      availableSectors: [
        'Technology',
        'Delivery / Logistics',
        'Hospitality',
        'Retail',
        'Customer Service',
        'Office',
        'Healthcare',
        'Education',
        'Skilled Work',
        'Marketing',
        'Finance'
      ]
    });
  } catch (err) {
    console.error('searchJobs API error:', err);
    return res.status(500).json({
      success: false,
      total: 0,
      jobs: [],
      error: 'Search service is currently encountering an issue. Please try again shortly.'
    });
  }
}

/**
 * 2. GET /api/jobs/nearby (Sections 8, 9, 25)
 */
export async function getNearbyJobs(req, res) {
  try {
    const {
      lat,
      lng,
      city = '',
      location = '',
      area = '',
      sector = '',
      q = '',
      pincode = '',
      radiusKm = 25,
      limit = 40
    } = req.query;

    const targetLocation = city || location || '';

    // Dynamically resolve coordinates without any hardcoded city defaults
    const coords = await resolveCoordinatesAsync({
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      city: targetLocation,
      area,
      pincode
    });

    const maxRadius = Number(radiusKm) || 25;
    const queryTerm = String(q || '').toLowerCase().trim();
    const sectorFilter = String(sector || '').toLowerCase().trim();

    // 1. Gather candidates from verified store & partner network (strictly physical/local, exclude remote guides)
    const allStoreJobs = getAllOpportunities();
    const localStoreJobs = allStoreJobs
      .filter(item => {
        if (item.remote === true || item.isRemote === true) return false;
        const loc = String(item.location || '').toLowerCase();
        if (loc.includes('remote') || loc.includes('online') || loc.includes('anywhere') || !loc || loc === 'location not specified') return false;
        return true;
      })
      .map(o => normalizeJobData(o, o.source || 'Verified Partner Network'))
      .filter(Boolean);

    const partnerListings = VERIFIED_PARTNER_LISTINGS.map(p => normalizeJobData(p, p.source || 'Verified Partner Network')).filter(Boolean);

    // Also fetch live jobs matching query if provided
    let liveJobs = [];
    if (queryTerm || sectorFilter || targetLocation) {
      try {
        const liveResult = await getRealJobRecommendations({
          query: queryTerm || sectorFilter || 'delivery retail technician associate',
          location: targetLocation,
          limit: 30
        });
        liveJobs = (liveResult.recommendations || []).filter(j => !j.isRemote && !j.remote);
      } catch {
        liveJobs = [];
      }
    }

    const candidatePool = deduplicateJobs([...partnerListings, ...localStoreJobs, ...liveJobs]);

    // 2. Filter & calculate distance
    const nearbyJobs = [];
    for (const job of candidatePool) {
      // Sector filter check
      if (sectorFilter && sectorFilter !== 'all') {
        const jobSector = String(job.sector || job.category || '').toLowerCase();
        if (!jobSector.includes(sectorFilter)) continue;
      }

      // Keyword query check
      if (queryTerm) {
        const text = `${job.title} ${job.company} ${job.description} ${job.sector} ${(job.skills || []).join(' ')}`.toLowerCase();
        const terms = queryTerm.split(/\s+/).filter(Boolean);
        const matchesQuery = terms.every(t => text.includes(t)) || terms.some(t => text.includes(t) && t.length > 3);
        if (!matchesQuery) continue;
      }

      // Coordinates resolution
      let jLat = job.latitude;
      let jLng = job.longitude;
      if (!jLat || !jLng) {
        const found = getCoordinatesForLocation(job.location);
        if (found) {
          jLat = found.lat;
          jLng = found.lng;
        }
      }

      let distanceKm = null;
      if (coords && jLat && jLng) {
        distanceKm = calculateHaversineDistance(coords.lat, coords.lng, jLat, jLng);
      }

      const jobLocLower = String(job.location || '').toLowerCase();
      const cityLower = String(targetLocation || '').toLowerCase();
      const areaLower = String(area || '').toLowerCase();
      const isInSameCity = cityLower && (jobLocLower.includes(cityLower) || cityLower.includes(jobLocLower));
      const isInSameArea = areaLower && jobLocLower.includes(areaLower);

      if (coords) {
        // If user coordinates exist, filter by radius or city match
        if (distanceKm !== null && distanceKm <= maxRadius) {
          nearbyJobs.push({
            ...job,
            latitude: jLat,
            longitude: jLng,
            distanceKm
          });
        } else if (isInSameArea || isInSameCity) {
          nearbyJobs.push({
            ...job,
            latitude: jLat || coords.lat,
            longitude: jLng || coords.lng,
            distanceKm: distanceKm ?? null
          });
        }
      } else {
        // If user hasn't specified coordinates or GPS, show all candidate physical jobs without fake distances
        nearbyJobs.push({
          ...job,
          latitude: jLat || null,
          longitude: jLng || null,
          distanceKm: null
        });
      }
    }

    // Sort: if distance is known, nearest first
    nearbyJobs.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;
      return 0;
    });

    const finalJobs = nearbyJobs.slice(0, Number(limit) || 40);

    return res.json({
      success: true,
      total: finalJobs.length,
      userLocation: coords,
      locationSet: Boolean(coords),
      radiusKm: maxRadius,
      jobs: finalJobs
    });
  } catch (err) {
    console.error('getNearbyJobs error:', err);
    return res.status(500).json({
      success: false,
      total: 0,
      jobs: [],
      error: 'Failed to retrieve nearby jobs.'
    });
  }
}

/**
 * 3. GET /api/jobs/recent (Section 11)
 */
export async function getRecentJobs(req, res) {
  try {
    const { limit = 15 } = req.query;
    const recResult = await getRealJobRecommendations({ query: '', limit: 40 });
    let jobs = recResult.recommendations || [];

    // Sort by posted date descending
    jobs.sort((a, b) => {
      const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return timeB - timeA;
    });

    return res.json({
      success: true,
      total: Math.min(jobs.length, Number(limit) || 15),
      jobs: jobs.slice(0, Number(limit) || 15)
    });
  } catch (err) {
    console.error('getRecentJobs error:', err);
    return res.status(500).json({ success: false, total: 0, jobs: [] });
  }
}

/**
 * 4. GET /api/jobs/recommended (Section 15, 16)
 */
export async function getRecommendedJobs(req, res) {
  try {
    const { profile: profileParam, limit = 15 } = req.query;
    let parsedProfile = {};
    if (profileParam) {
      try {
        parsedProfile = typeof profileParam === 'string' ? JSON.parse(profileParam) : profileParam;
      } catch {
        parsedProfile = {};
      }
    }

    const recResult = await getRealJobRecommendations({
      query: (parsedProfile.skills || []).slice(0, 3).join(' ') || parsedProfile.preferredRole || '',
      profile: parsedProfile,
      limit: Number(limit) || 15
    });

    return res.json({
      success: true,
      total: recResult.recommendations?.length || 0,
      jobs: recResult.recommendations || []
    });
  } catch (err) {
    console.error('getRecommendedJobs error:', err);
    return res.status(500).json({ success: false, total: 0, jobs: [] });
  }
}

/**
 * 5. GET /api/jobs/:id (Sections 3, 5, 14)
 */
export async function getJobById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Job ID required' });

    // 1. Search verified partner listings
    let found = VERIFIED_PARTNER_LISTINGS.find(p => p.id === id);
    if (found) {
      const normalized = normalizeJobData(found, found.source || 'Verified Partner Network');
      return res.json({ success: true, job: normalized });
    }

    // 2. Search live opportunity store
    const storeOpp = await Opportunity.findById(id);
    if (storeOpp && isValidJobUrl(storeOpp.sourceUrl || storeOpp.url)) {
      const normalized = normalizeJobData(storeOpp, storeOpp.source || 'Verified Partner Network');
      return res.json({ success: true, job: normalized });
    }

    // 3. Fallback: Search all live opportunities
    const all = Opportunity.getAll() || [];
    const opp = all.find(o => o.id === id);
    if (opp && isValidJobUrl(opp.sourceUrl || opp.url)) {
      const normalized = normalizeJobData(opp, opp.source || 'Verified Partner Network');
      return res.json({ success: true, job: normalized });
    }

    return res.status(404).json({
      success: false,
      error: 'Job opportunity not found or listing has expired.'
    });
  } catch (err) {
    console.error('getJobById error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve job details.' });
  }
}

/**
 * 6. POST /api/jobs/:id/save & DELETE /api/jobs/:id/save (Section 13)
 */
export function saveJob(req, res) {
  const { id } = req.params;
  const userId = req.user?.id || req.body?.userId || req.headers['x-client-session'] || 'guest_user';

  if (!userSavedJobsStore.has(userId)) {
    userSavedJobsStore.set(userId, new Set());
  }
  userSavedJobsStore.get(userId).add(id);

  return res.json({
    success: true,
    saved: true,
    jobId: id,
    totalSaved: userSavedJobsStore.get(userId).size
  });
}

export function unsaveJob(req, res) {
  const { id } = req.params;
  const userId = req.user?.id || req.body?.userId || req.headers['x-client-session'] || 'guest_user';

  if (userSavedJobsStore.has(userId)) {
    userSavedJobsStore.get(userId).delete(id);
  }

  return res.json({
    success: true,
    saved: false,
    jobId: id,
    totalSaved: userSavedJobsStore.get(userId)?.size || 0
  });
}

export async function getSavedJobs(req, res) {
  const userId = req.user?.id || req.query?.userId || req.headers['x-client-session'] || 'guest_user';
  const savedSet = userSavedJobsStore.get(userId) || new Set();
  const savedIds = Array.from(savedSet);

  if (savedIds.length === 0) {
    return res.json({ success: true, total: 0, jobs: [] });
  }

  const all = Opportunity.getAll() || [];
  const partnerList = VERIFIED_PARTNER_LISTINGS || [];
  const combined = [...partnerList, ...all];

  const jobs = savedIds
    .map(id => combined.find(item => item.id === id))
    .filter(Boolean)
    .map(item => normalizeJobData(item, item.source || 'Verified Partner Network'))
    .filter(Boolean);

  return res.json({
    success: true,
    total: jobs.length,
    jobs
  });
}

/**
 * 7. Alerts Endpoints: GET /api/alerts, POST /api/alerts, DELETE /api/alerts/:id (Section 10)
 */
export function getAlertsList(req, res) {
  const userId = req.user?.id || req.query?.userId || null;
  const alerts = getAllAlerts(userId);
  return res.json({ success: true, total: alerts.length, alerts });
}

export function createJobAlert(req, res) {
  const userId = req.user?.id || req.body?.userId || null;
  const alertData = req.body || {};
  const alert = createAlert(alertData, userId);

  // Evaluate immediately against live verified jobs
  const liveJobs = (Opportunity.getAll() || []).map(o => normalizeJobData(o)).filter(Boolean);
  evaluateAlertsAgainstJobs(liveJobs);

  return res.status(201).json({ success: true, alert });
}

export function deleteJobAlert(req, res) {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const deleted = deleteAlert(id, userId);
  return res.json({ success: deleted });
}

/**
 * 8. Notification Endpoints: GET /api/notifications, PATCH /api/notifications/:id/read (Section 24)
 */
export function getNotificationsList(req, res) {
  const userId = req.user?.id || req.query?.userId || null;
  const unreadOnly = req.query?.unread === 'true';
  const notifications = getNotifications(userId, { unreadOnly });
  return res.json({
    success: true,
    total: notifications.length,
    unreadCount: notifications.filter(n => !n.read).length,
    notifications
  });
}

export function markAsRead(req, res) {
  const { id } = req.params;
  const notif = markNotificationRead(id);
  if (!notif) return res.status(404).json({ success: false, error: 'Notification not found' });
  return res.json({ success: true, notification: notif });
}

export function markAllRead(req, res) {
  const userId = req.user?.id || null;
  markAllNotificationsRead(userId);
  return res.json({ success: true, message: 'All notifications marked as read' });
}

/**
 * 9. Real-Time Server-Sent Events Stream (SSE)
 * GET /api/notifications/stream
 */
export function streamNotifications(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);
  registerSseClient(res);
}

/**
 * 10. Test / Simulate Real-Time Notification Trigger
 * POST /api/notifications/test
 */
export function testNotification(req, res) {
  const notif = triggerRealtimeNotification(req.body || {});
  return res.json({ success: true, notification: notif });
}

/**
 * 11. Dynamic Geocoding Endpoint
 * GET /api/jobs/geocode?q=...
 */
export async function handleGeocode(req, res) {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }
    const result = await dynamicGeocode(q);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    return res.json({ success: true, location: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * 12. Dynamic Reverse Geocoding Endpoint
 * GET /api/jobs/reverse-geocode?lat=...&lng=...
 */
export async function handleReverseGeocode(req, res) {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'lat and lng parameters are required' });
    }
    const result = await dynamicReverseGeocode(Number(lat), Number(lng));
    if (!result) {
      return res.status(404).json({ success: false, error: 'Address not found' });
    }
    return res.json({ success: true, location: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * 13. Organization Details Endpoint
 * GET /api/jobs/organization/details?q=...
 */
export async function handleGetOrganizationDetails(req, res) {
  try {
    const q = req.query.q || req.query.name || '';
    if (!q.trim()) {
      return res.status(400).json({ success: false, error: 'Query parameter q or name is required' });
    }
    const result = await getOrganizationDetails(q);
    return res.json(result);
  } catch (err) {
    console.error('handleGetOrganizationDetails error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * 14. Organizations List Directory Endpoint
 * GET /api/jobs/organizations
 */
export async function handleGetOrganizationsList(req, res) {
  try {
    const orgs = getFeaturedOrganizations();
    return res.json({ success: true, count: orgs.length, organizations: orgs });
  } catch (err) {
    console.error('handleGetOrganizationsList error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

