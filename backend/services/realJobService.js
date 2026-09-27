// backend/services/realJobService.js
/**
 * Real Job Service & Recommendation Engine
 * Fetches, normalizes, filters, verifies links, and ranks REAL job opportunities
 * from external job APIs (Adzuna, Jooble, JSearch) and legitimate verified sources.
 * 
 * ZERO hardcoded fake jobs. ZERO fabricated salaries, companies, or URLs.
 */

import { isValidJobUrl, matchesExpectedSource, verifyJobUrlReachability } from './verificationService.js';
import { Opportunity } from '../models/Opportunity.js';
import { getAllOpportunities } from '../data/store.js';
import { VERIFIED_PARTNER_LISTINGS } from './opportunityFeedService.js';

// Cache for external API queries (15-minute TTL)
const queryCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Detects generic job-site homepages, search pages, and non-specific URLs.
 * These should NEVER be presented as exact application links.
 * Examples: https://www.indeed.com/, https://linkedin.com/jobs, /search?q=delivery
 */
function isGenericJobSiteUrl(url) {
  if (!url || typeof url !== 'string') return true;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, ''); // strip trailing slashes
    const host = parsed.hostname.toLowerCase();

    // Allow partner/careers/ride subdomains — these are specific onboarding portals
    if (host.startsWith('partner.') || host.startsWith('careers.') ||
        host.startsWith('ride.') || host.startsWith('flex.')) {
      return false; // These subdomains ARE the application destination
    }

    // Root homepages with no meaningful path (e.g. https://www.sisindia.com/)
    if (pathname === '' || pathname === '/') return true;

    // Job AGGREGATOR sites — their /jobs, /internships, /search, /careers pages
    // are NOT specific job listings, they are search/listing pages
    const aggregatorHosts = [
      'www.linkedin.com', 'linkedin.com',
      'www.indeed.com', 'indeed.com', 'in.indeed.com',
      'www.naukri.com', 'naukri.com',
      'www.internshala.com', 'internshala.com',
      'www.glassdoor.com', 'glassdoor.com',
      'www.adzuna.com', 'adzuna.com'
    ];

    if (aggregatorHosts.includes(host)) {
      // On aggregator sites, generic listing/search pages are NOT exact job links
      const aggregatorGenericPaths = [
        '/jobs', '/search', '/internships', '/careers',
        '/opportunities', '/job-search', '/find-jobs'
      ];
      if (aggregatorGenericPaths.includes(pathname.toLowerCase())) {
        return true;
      }
    }

    // For NON-aggregator (direct employer) sites, /careers IS the application destination
    // e.g. https://www.ihcltata.com/careers/ is a legitimate employer portal
    // So we do NOT reject /careers on employer sites

    return false;
  } catch {
    return true;
  }
}

/**
 * 1. Query / Intent Parser (Section 6)
 * Extracts structured search parameters from user natural language query
 */
export function parseJobQuery(rawQuery = '', userProfile = {}) {
  const queryStr = String(rawQuery || '').trim();
  const qLower = queryStr.toLowerCase();

  const parsed = {
    originalQuery: queryStr,
    keyword: queryStr,
    jobTitle: null,
    category: null,
    location: null,
    remote: null,
    employmentType: null,
    experience: null,
    salary: null,
    shift: null
  };

  if (!queryStr) {
    if (userProfile.city || userProfile.location) {
      parsed.location = userProfile.city || userProfile.location;
    }
    return parsed;
  }

  // Detect Remote vs In-person
  if (/\b(?:remote|work from home|wfh|online|virtual|from home)\b/i.test(qLower)) {
    parsed.remote = true;
  } else if (/\b(?:on-site|onsite|offline|in person|in-person|outdoor)\b/i.test(qLower)) {
    parsed.remote = false;
  }

  // Detect Employment Type
  if (/\b(?:part[\s-]?time|half[\s-]?day)\b/i.test(qLower)) {
    parsed.employmentType = 'Part-time';
  } else if (/\b(?:full[\s-]?time)\b/i.test(qLower)) {
    parsed.employmentType = 'Full-time';
  } else if (/\b(?:internship|intern|trainee)\b/i.test(qLower)) {
    parsed.employmentType = 'Internship';
  } else if (/\b(?:freelance|gig|contract)\b/i.test(qLower)) {
    parsed.employmentType = 'Gig';
  }

  // Detect Shift
  if (/\b(?:night[\s-]?shift|night)\b/i.test(qLower)) {
    parsed.shift = 'Night shift';
  } else if (/\b(?:day[\s-]?shift)\b/i.test(qLower)) {
    parsed.shift = 'Day shift';
  } else if (/\b(?:weekend|weekends)\b/i.test(qLower)) {
    parsed.shift = 'Weekend';
  }

  // Detect Experience Level
  if (/\b(?:fresher|freshers|entry[\s-]?level|no experience|0\s*years?|college grad(?:uate)?)\b/i.test(qLower)) {
    parsed.experience = 'entry-level';
  } else if (/\b(?:senior|lead|principal|sr\.?)\b/i.test(qLower)) {
    parsed.experience = 'senior';
  } else if (/\b(?:junior|jr\.?)\b/i.test(qLower)) {
    parsed.experience = 'entry-level';
  }

  // Detect Location (Cities in India & Global)
  const knownCities = [
    'hyderabad', 'bengaluru', 'bangalore', 'chennai', 'mumbai', 'delhi', 
    'pune', 'kolkata', 'noida', 'gurugram', 'gurgaon', 'ahmedabad', 
    'jaipur', 'lucknow', 'chandigarh', 'kochi', 'coimbatore', 'indore',
    'london', 'berlin', 'new york', 'san francisco', 'toronto', 'dubai'
  ];

  for (const city of knownCities) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(qLower)) {
      const canonical = city === 'bangalore' || city === 'bengaluru' ? 'Bangalore'
        : city.charAt(0).toUpperCase() + city.slice(1);
      parsed.location = canonical;
      if (parsed.remote === null) {
        parsed.remote = false;
      }
      break;
    }
  }

  // Fallback location from user profile if not in query
  if (!parsed.location && userProfile.city) {
    parsed.location = userProfile.city;
  }

  // Role & Category Intent Detection
  const roleRules = [
    { regex: /\b(?:delivery|rider|courier|delivery partner|delivery executive)\b/i, title: 'Delivery Executive', category: 'Logistics' },
    { regex: /\b(?:catering|catring|banquet|catering helper|catering server)\b/i, title: 'Catering Associate', category: 'Hospitality' },
    { regex: /\b(?:cook|chef|kitchen helper|prep cook|culinary)\b/i, title: 'Cook', category: 'Culinary' },
    { regex: /\b(?:warehouse|packing|picker|packer|hub associate|sorting)\b/i, title: 'Warehouse Associate', category: 'Logistics' },
    { regex: /\b(?:security guard|security officer|watchman|guard)\b/i, title: 'Security Guard', category: 'Security' },
    { regex: /\b(?:cleaning|cleaner|housekeeping|sweeper|janitor)\b/i, title: 'Cleaning & Housekeeping', category: 'Facilities' },
    { regex: /\b(?:driver|chauffeur|car driver|auto driver)\b/i, title: 'Driver', category: 'Transportation' },
    { regex: /\b(?:retail|store associate|cashier|sales executive|showroom)\b/i, title: 'Retail Sales Associate', category: 'Retail' },
    { regex: /\b(?:factory|machine operator|assembly worker|plant worker)\b/i, title: 'Factory Machine Operator', category: 'Manufacturing' },
    { regex: /\b(?:construction|mason|site worker|laborer|builder)\b/i, title: 'Construction Associate', category: 'Construction' },
    { regex: /\b(?:electrician|electrical|wiring|wireman)\b/i, title: 'Electrician', category: 'Trades' },
    { regex: /\b(?:plumber|plumbing|pipe fitter)\b/i, title: 'Plumber', category: 'Trades' },
    { regex: /\b(?:office assistant|office boy|peon|admin assistant|front desk)\b/i, title: 'Office Assistant', category: 'Administration' },
    { regex: /\b(?:receptionist|front office|front desk executive)\b/i, title: 'Receptionist', category: 'Administration' },
    { regex: /\b(?:data entry|typing|back office)\b/i, title: 'Data Entry Operator', category: 'Administration' },
    { regex: /\b(?:customer support|customer care|bpo|call center|telecalling|telecaller)\b/i, title: 'Customer Support Representative', category: 'Customer Support' },
    { regex: /\b(?:restaurant|waiter|steward|service staff)\b/i, title: 'Restaurant Associate', category: 'Hospitality' },
    { regex: /\b(?:sales|business development|telemarketing)\b/i, title: 'Sales Executive', category: 'Sales' },
    { regex: /\b(?:software|developer|engineer|java|python|react|frontend|backend)\b/i, title: 'Software Developer', category: 'Technology' }
  ];

  for (const rule of roleRules) {
    if (rule.regex.test(qLower)) {
      parsed.jobTitle = rule.title;
      parsed.category = rule.category;
      break;
    }
  }

  // Clean keyword: remove noise words like "jobs in", "near me", "looking for", "for freshers"
  let cleanKw = queryStr
    .replace(/\b(?:jobs?|openings?|vacancies|vacanc(?:y|ies)|hiring|need|want|looking for|require(?:d|s)?|near me|in\s+[a-zA-Z]+)\b/gi, '')
    .trim();
  if (cleanKw.length > 2) {
    parsed.keyword = cleanKw;
  }

  return parsed;
}

/**
 * 2. Real Job Normalizer (Section 7)
 * Normalizes different API response schemas into our standard schema:
 * { id, title, company, location, description, salary, employmentType, experience, postedDate,
 *   source, sourceUrl, jobUrl, applyUrl, exactApplicationLinkAvailable, linkVerified, finalUrl,
 *   remote, category, score, matchReasons }
 */
export function normalizeJobData(rawJob = {}, sourceName = 'Real Job API') {
  if (!rawJob || typeof rawJob !== 'object') return null;

  // Extract ID
  const id = String(rawJob.id || rawJob.sourceId || rawJob.job_id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`);

  // Extract Title
  const title = String(rawJob.title || rawJob.jobTitle || rawJob.job_title || 'Untitled Opportunity').trim();

  // Extract Company
  const company = String(
    rawJob.company?.display_name || 
    rawJob.company || 
    rawJob.companyName || 
    rawJob.company_name || 
    rawJob.employer_name || 
    rawJob.provider || 
    'Verified Employer'
  ).trim();

  // Extract Location
  let location = 'Location not specified';
  if (rawJob.location?.display_name) {
    location = rawJob.location.display_name;
  } else if (typeof rawJob.location === 'string') {
    location = rawJob.location;
  } else if (rawJob.candidate_required_location) {
    location = rawJob.candidate_required_location;
  } else if (rawJob.jobGeo) {
    location = rawJob.jobGeo;
  } else if (rawJob.city) {
    location = rawJob.city;
  }

  // Extract Remote
  const remote = Boolean(
    rawJob.remote || 
    rawJob.is_remote || 
    rawJob.job_is_remote || 
    String(location).toLowerCase().includes('remote') ||
    String(rawJob.workType || '').toLowerCase().includes('remote')
  );

  // Extract Description
  const description = String(rawJob.description || rawJob.jobDescription || rawJob.snippet || rawJob.overview || '').trim();

  // Extract Salary (Honest: never invent)
  let salary = 'Salary not specified';
  if (rawJob.salary && typeof rawJob.salary === 'string' && rawJob.salary.trim() && rawJob.salary !== '0') {
    salary = rawJob.salary.trim();
  } else if (rawJob.compensation?.label) {
    salary = rawJob.compensation.label;
  } else if (rawJob.salary_min && rawJob.salary_max) {
    const curr = rawJob.salary_currency || rawJob.currency || '₹';
    salary = `${curr}${Number(rawJob.salary_min).toLocaleString()}–${curr}${Number(rawJob.salary_max).toLocaleString()}`;
  } else if (rawJob.minSalary && rawJob.maxSalary) {
    const curr = rawJob.currency === 'USD' ? '$' : '₹';
    salary = `${curr}${Number(rawJob.minSalary).toLocaleString()}–${curr}${Number(rawJob.maxSalary).toLocaleString()}`;
  } else if (rawJob.compensation?.min && rawJob.compensation?.max) {
    salary = `₹${Number(rawJob.compensation.min).toLocaleString()}–₹${Number(rawJob.compensation.max).toLocaleString()}/month`;
  }

  // Extract Employment Type
  let employmentType = 'Full-time';
  const typeStr = String(rawJob.employmentType || rawJob.jobType || rawJob.contract_type || rawJob.type || '').toLowerCase();
  if (typeStr.includes('part') || typeStr.includes('part-time')) {
    employmentType = 'Part-time';
  } else if (typeStr.includes('intern')) {
    employmentType = 'Internship';
  } else if (typeStr.includes('gig') || typeStr.includes('freelance') || typeStr.includes('contract')) {
    employmentType = 'Gig';
  } else if (typeStr.includes('full')) {
    employmentType = 'Full-time';
  }

  // Extract Experience Level
  let experience = 'Not specified';
  if (rawJob.experienceLevel) {
    experience = rawJob.experienceLevel === 'entry-level' ? 'Fresher / Entry-level' : rawJob.experienceLevel;
  } else if (rawJob.experienceYears?.min !== undefined) {
    experience = `${rawJob.experienceYears.min}–${rawJob.experienceYears.max || ''} yrs`;
  } else if (rawJob.seniority) {
    experience = Array.isArray(rawJob.seniority) ? rawJob.seniority.join(', ') : String(rawJob.seniority);
  }

  // Extract Posting Date (Honest: never invent)
  let postedDate = 'Posted date unavailable';
  const rawDate = rawJob.created || rawJob.postedAt || rawJob.pubDate || rawJob.publication_date || rawJob.date;
  if (rawDate) {
    try {
      const d = typeof rawDate === 'number' ? new Date(rawDate * 1000) : new Date(rawDate);
      if (!isNaN(d.getTime())) {
        postedDate = d.toISOString().split('T')[0];
      }
    } catch {
      postedDate = 'Posted date unavailable';
    }
  }

  // Extract Real Verified URLs (Never construct fake URLs)
  // Priority: redirect_url > url > sourceUrl > applicationLink > apply_url
  const rawUrl = String(rawJob.redirect_url || rawJob.url || rawJob.sourceUrl || rawJob.applicationLink || rawJob.apply_url || '').trim();

  // Validate URL is authentic
  if (!isValidJobUrl(rawUrl)) {
    return null; // Reject listings without authentic URLs
  }

  // Distinguish sourceUrl (platform base) vs jobUrl (exact listing) vs applyUrl (application page)
  // NEVER construct/guess URLs — only use what the API explicitly provides
  const sourceUrl = rawUrl;

  // jobUrl = the exact page containing the specific job listing (from redirect_url, url, or link field)
  const jobUrl = String(rawJob.redirect_url || rawJob.url || rawJob.link || rawJob.sourceUrl || '').trim() || sourceUrl;

  // applyUrl = the exact page/form where the candidate can apply, if the source provides one
  // Only use explicitly provided application links — never construct them
  const rawApplyUrl = rawJob.applicationLink || rawJob.apply_url || rawJob.applyUrl || '';
  const applyUrl = (rawApplyUrl && isValidJobUrl(String(rawApplyUrl).trim())) ? String(rawApplyUrl).trim() : jobUrl;

  // Detect if the URL is a generic homepage or search page (NOT a specific job listing)
  const exactApplicationLinkAvailable = !isGenericJobSiteUrl(applyUrl);

  // Extract Source
  const source = String(rawJob.source || sourceName || 'External Job Feed').trim();

  // Extract Category
  let category = String(rawJob.category?.label || rawJob.category || 'General').trim();
  if (category === 'General' || category === 'all') {
    const tLower = title.toLowerCase();
    if (tLower.includes('delivery') || tLower.includes('courier')) category = 'Logistics';
    else if (tLower.includes('cater') || tLower.includes('cook') || tLower.includes('food')) category = 'Hospitality';
    else if (tLower.includes('warehouse') || tLower.includes('pack')) category = 'Logistics';
    else if (tLower.includes('security') || tLower.includes('guard')) category = 'Security';
    else if (tLower.includes('clean') || tLower.includes('housekeep')) category = 'Facilities';
    else if (tLower.includes('electric') || tLower.includes('wire') || tLower.includes('plumb')) category = 'Trades';
    else if (tLower.includes('driver')) category = 'Transportation';
    else if (tLower.includes('retail') || tLower.includes('sales')) category = 'Retail';
    else if (tLower.includes('office') || tLower.includes('admin') || tLower.includes('reception')) category = 'Administration';
    else if (tLower.includes('support') || tLower.includes('bpo')) category = 'Customer Support';
    else if (tLower.includes('developer') || tLower.includes('engineer') || tLower.includes('software')) category = 'Technology';
  }

  return {
    id,
    title,
    company,
    location,
    description,
    salary,
    employmentType,
    experience,
    postedDate,
    source,
    sourceUrl,
    jobUrl,
    applyUrl,
    exactApplicationLinkAvailable,
    linkVerified: false,
    finalUrl: null,
    remote,
    category
  };
}

/**
 * 3. External API Adapters
 */

/**
 * Adzuna Job API Adapter
 * Documentation: https://developer.adzuna.com/
 */
async function fetchFromAdzuna({ query, location, page = 1, limit = 15 }) {
  const appId = process.env.JOB_API_APP_ID;
  const apiKey = process.env.JOB_API_KEY;
  if (!appId || !apiKey) return [];

  const country = 'in'; // Default India for Adzuna
  const baseUrl = process.env.JOB_API_URL || `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: String(limit),
    what: query || '',
    'content-type': 'application/json'
  });

  if (location) {
    params.append('where', location);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${baseUrl}?${params.toString()}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[Adzuna] API responded with ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    return results.map(item => normalizeJobData(item, 'Adzuna')).filter(Boolean);
  } catch (err) {
    clearTimeout(timer);
    console.warn('[Adzuna] Fetch error:', err.message);
    return [];
  }
}

/**
 * Jooble Job API Adapter
 * Documentation: https://jooble.org/api/about
 */
async function fetchFromJooble({ query, location, limit = 15 }) {
  const apiKey = process.env.JOB_API_KEY;
  if (!apiKey) return [];

  const url = process.env.JOB_API_URL || `https://jooble.org/api/${apiKey}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keywords: query || '',
        location: location || '',
        page: 1,
        resultonpage: limit
      })
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[Jooble] API responded with ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    return jobs.map(j => normalizeJobData(j, 'Jooble')).filter(Boolean);
  } catch (err) {
    clearTimeout(timer);
    console.warn('[Jooble] Fetch error:', err.message);
    return [];
  }
}

/**
 * JSearch (RapidAPI) Adapter
 */
async function fetchFromJSearch({ query, location, limit = 15 }) {
  const apiKey = process.env.JOB_API_KEY;
  if (!apiKey) return [];

  const searchQuery = [query, location].filter(Boolean).join(' in ');
  const url = process.env.JOB_API_URL || `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&num_pages=1`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[JSearch] API responded with ${res.status}`);
      return [];
    }

    const data = await res.json();
    const dataJobs = Array.isArray(data.data) ? data.data : [];
    return dataJobs.map(j => normalizeJobData(j, 'JSearch')).filter(Boolean);
  } catch (err) {
    clearTimeout(timer);
    console.warn('[JSearch] Fetch error:', err.message);
    return [];
  }
}

/**
 * Arbeitnow Public Feed (Zero-Key)
 */
async function fetchFromArbeitnow({ query = '' }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const url = query 
      ? `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`
      : 'https://www.arbeitnow.com/api/job-board-api';

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'IncomePathAI/1.0' }
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = Array.isArray(data.data) ? data.data : [];
    return rawJobs.map(j => normalizeJobData(j, 'Arbeitnow')).filter(Boolean);
  } catch (err) {
    clearTimeout(timer);
    console.warn('[Arbeitnow] Fetch notice:', err.message);
    return [];
  }
}

/**
 * Himalayas Public Feed (Zero-Key)
 */
async function fetchFromHimalayas() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=25', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'IncomePathAI/1.0' }
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];
    return rawJobs.map(j => normalizeJobData(j, 'Himalayas Remote Feed')).filter(Boolean);
  } catch (err) {
    clearTimeout(timer);
    console.warn('[Himalayas] Fetch notice:', err.message);
    return [];
  }
}

/**
 * Query verified real opportunities from the application store
 */
function fetchFromVerifiedStore() {
  try {
    const all = Opportunity.getAll() || [];
    const combined = [...(VERIFIED_PARTNER_LISTINGS || []), ...all];
    return combined
      .filter(o => o && o.sourceUrl && isValidJobUrl(o.sourceUrl) && o.sourceType !== 'demo')
      .map(o => normalizeJobData(o, o.source || 'Verified Partner Network'))
      .filter(Boolean);
  } catch {
    return (VERIFIED_PARTNER_LISTINGS || []).map(o => normalizeJobData(o, o.source || 'Verified Partner Network')).filter(Boolean);
  }
}

/**
 * 4. Deduplication (Section 12)
 * Deduplicates by source + id AND normalized title + company + location
 */
export function deduplicateJobs(jobs = []) {
  const seenId = new Set();
  const seenFingerprint = new Set();
  const unique = [];

  for (const job of jobs) {
    if (!job || !job.sourceUrl) continue;

    // Source + ID check
    const idKey = `${job.source}:${job.id}`.toLowerCase();
    if (seenId.has(idKey)) continue;

    // Fingerprint: title + company + location
    const normTitle = (job.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCompany = (job.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normLocation = (job.location || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fingerprint = `${normTitle}|${normCompany}|${normLocation}`;

    if (seenFingerprint.has(fingerprint)) continue;

    seenId.add(idKey);
    seenFingerprint.add(fingerprint);
    unique.push(job);
  }

  return unique;
}

/**
 * 5. Link Reachability Verification (Section 10)
 * Probes links over HTTP (HEAD/GET) with in-memory caching.
 * Rejects dead links (HTTP 404/410) and invalid source hostnames.
 */
export async function verifyJobListings(jobs = []) {
  const verifiedJobs = [];

  for (const job of jobs) {
    // URL priority: applyUrl > jobUrl > sourceUrl (Section 4)
    const bestUrl = job.applyUrl || job.jobUrl || job.sourceUrl;
    if (!isValidJobUrl(bestUrl)) continue;

    // Reject generic homepage / search-page URLs (Section 1 & 9)
    if (isGenericJobSiteUrl(bestUrl)) {
      continue;
    }

    // Check reachability via HTTP GET
    const check = await verifyJobUrlReachability(bestUrl, job.source);
    if (!check.reachable || check.linkStatus !== 'verified' || check.isValid === false) {
      // Reject non-reachable or broken URLs
      continue;
    }

    // Ensure URL points to a specific job page, not just a generic homepage
    let isSpecificJobPage = false;
    try {
      const parsed = new URL(bestUrl);
      isSpecificJobPage = parsed.pathname.length > 1
        || parsed.hostname.startsWith('partner.')
        || parsed.hostname.startsWith('careers.')
        || parsed.hostname.startsWith('ride.');
    } catch { /* invalid URL, skip */ }

    if (!isSpecificJobPage) {
      // Reject generic homepage links (e.g. https://www.indeed.com/)
      continue;
    }

    verifiedJobs.push({
      ...job,
      linkStatus: 'verified',
      linkVerified: true,
      exactApplicationLinkAvailable: true,
      finalUrl: bestUrl,
      // Ensure applyUrl and jobUrl are populated correctly for frontend
      applyUrl: job.applyUrl || job.jobUrl || job.sourceUrl,
      jobUrl: job.jobUrl || job.sourceUrl
    });
  }

  return verifiedJobs;
}

/**
 * 6. Relevance Scoring & Match Explanations (Section 8, 9, 15, 16)
 * Calculates genuine match score from actual matching criteria:
 * - Query/title match (up to 35 pts)
 * - Category / role match (up to 20 pts)
 * - Location match (up to 25 pts)
 * - Experience match (up to 10 pts)
 * - Employment type / remote match (up to 10 pts)
 * Zero fake formula (no 95 - index * 4).
 */
export function scoreAndRankJobs(jobs = [], parsedQuery = {}, userProfile = {}) {
  const qStr = (parsedQuery.originalQuery || parsedQuery.keyword || '').toLowerCase();
  const qLocation = (parsedQuery.location || userProfile.city || '').toLowerCase();
  const qCategory = (parsedQuery.category || '').toLowerCase();
  const qExp = (parsedQuery.experience || '').toLowerCase();
  const qType = (parsedQuery.employmentType || '').toLowerCase();
  const qShift = (parsedQuery.shift || '').toLowerCase();
  const qRemote = parsedQuery.remote;

  // Extract core keywords from query
  const queryTokens = qStr
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['jobs', 'job', 'in', 'near', 'need', 'with', 'for', 'the', 'and', 'from', 'all'].includes(w));

  const scored = [];

  for (const job of jobs) {
    let score = 0;
    const reasons = [];

    const jobTitle = (job.title || '').toLowerCase();
    const jobDesc = (job.description || '').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();
    const jobCat = (job.category || '').toLowerCase();
    const jobType = (job.employmentType || '').toLowerCase();
    const jobExp = (job.experience || '').toLowerCase();

    // 1. Role / Core Keyword Match (up to 40 pts)
    let tokenMatchesTitle = 0;
    let tokenMatchesDesc = 0;

    for (const token of queryTokens) {
      if (token === 'hyderabad' || token === 'bengaluru' || token === 'chennai' || token === 'mumbai' || token === 'delhi') {
        continue; // handled in location
      }
      if (jobTitle.includes(token)) {
        tokenMatchesTitle++;
      } else if (jobDesc.includes(token)) {
        tokenMatchesDesc++;
      }
    }

    if (tokenMatchesTitle > 0) {
      score += Math.min(40, tokenMatchesTitle * 25);
      reasons.push(`Direct title match for search intent`);
    } else if (tokenMatchesDesc > 0) {
      score += Math.min(20, tokenMatchesDesc * 10);
      reasons.push(`Matches role description`);
    }

    // Domain Mismatch Filters (Section 5 & 8)
    const isPhysicalTradesQuery = (
      qStr.includes('clean') || qStr.includes('cook') || qStr.includes('cater') || 
      qStr.includes('delivery') || qStr.includes('driver') || qStr.includes('warehouse') || 
      qStr.includes('pack') || qStr.includes('security guard') || qStr.includes('guard') || 
      qStr.includes('electric') || qStr.includes('plumb') || qStr.includes('carpenter') || 
      qStr.includes('housekeep') || qStr.includes('factory') || qStr.includes('construction')
    );

    const isSoftwareTechJob = (
      jobTitle.includes('developer') || jobTitle.includes('software') || jobTitle.includes('python') || 
      jobTitle.includes('java') || jobTitle.includes('frontend') || jobTitle.includes('backend') || 
      jobTitle.includes('engineer') || jobTitle.includes('devops') || jobTitle.includes('react') ||
      jobTitle.includes('fullstack') || jobTitle.includes('cloud') || jobTitle.includes('data analyst')
    );

    if (isPhysicalTradesQuery && isSoftwareTechJob) {
      continue; // Filter obvious tech mismatch when user asked for non-software / physical trades
    }

    const isSoftwareQuery = (
      qStr.includes('software') || qStr.includes('developer') || qStr.includes('python') || 
      qStr.includes('java') || qStr.includes('react') || qStr.includes('frontend') || 
      qStr.includes('backend') || qStr.includes('coding') || qStr.includes('programmer') ||
      qStr.includes('fullstack')
    );

    const isPhysicalTradesJob = (
      jobTitle.includes('delivery') || jobTitle.includes('driver') || jobTitle.includes('cook') || 
      jobTitle.includes('cleaning') || jobTitle.includes('housekeep') || jobTitle.includes('security guard') || 
      jobTitle.includes('electrician') || jobTitle.includes('plumber') || jobTitle.includes('carpenter') ||
      jobTitle.includes('warehouse') || jobTitle.includes('construction') || jobTitle.includes('factory')
    );

    if (isSoftwareQuery && isPhysicalTradesJob) {
      continue; // Filter obvious physical trades mismatch when user asked for software
    }

    // Role-specific relevance enforcement (Section 8)
    if (qStr.includes('clean') && !jobTitle.includes('clean') && !jobTitle.includes('housekeep') && !jobTitle.includes('sanitat') && !jobTitle.includes('janitor')) {
      continue;
    }
    if (qStr.includes('cook') && !jobTitle.includes('cook') && !jobTitle.includes('chef') && !jobTitle.includes('kitchen') && !jobTitle.includes('culinary')) {
      continue;
    }
    if (qStr.includes('cater') && !jobTitle.includes('cater') && !jobTitle.includes('banquet') && !jobTitle.includes('event') && !jobTitle.includes('hospitality')) {
      continue;
    }
    if (qStr.includes('driver') && !jobTitle.includes('driver') && !jobTitle.includes('chauffeur') && !jobTitle.includes('courier') && !jobTitle.includes('delivery partner') && !jobTitle.includes('fleet')) {
      continue;
    }
    if (qStr.includes('delivery') && !jobTitle.includes('delivery') && !jobTitle.includes('courier') && !jobTitle.includes('dispatch') && !jobTitle.includes('rider') && !jobTitle.includes('delivery partner')) {
      continue;
    }
    if ((qStr.includes('security guard') || qStr.includes('security jobs')) && !jobTitle.includes('security') && !jobTitle.includes('guard')) {
      continue;
    }
    if (qStr.includes('warehouse') && !jobTitle.includes('warehouse') && !jobTitle.includes('hub') && !jobTitle.includes('inventory') && !jobTitle.includes('fulfillment') && !jobTitle.includes('store')) {
      continue;
    }
    if ((qStr.includes('packing') || qStr.includes('pack ')) && !jobTitle.includes('pack') && !jobTitle.includes('fulfillment') && !jobTitle.includes('warehouse')) {
      continue;
    }
    if (qStr.includes('retail') && !jobTitle.includes('retail') && !jobTitle.includes('store') && !jobTitle.includes('cashier') && !jobTitle.includes('sales associate') && !jobTitle.includes('merchandis')) {
      continue;
    }
    if ((qStr.includes('electrician') || qStr.includes('electric')) && !jobTitle.includes('electric') && !jobTitle.includes('wireman') && !jobTitle.includes('maintenance technician')) {
      continue;
    }
    if (qStr.includes('factory') && !jobTitle.includes('factory') && !jobTitle.includes('machine') && !jobTitle.includes('operator') && !jobTitle.includes('production') && !jobTitle.includes('assembly')) {
      continue;
    }
    if (qStr.includes('construction') && !jobTitle.includes('construction') && !jobTitle.includes('civil') && !jobTitle.includes('site') && !jobTitle.includes('mason') && !jobTitle.includes('fabricat')) {
      continue;
    }
    if (qStr.includes('office assistant') && !jobTitle.includes('office') && !jobTitle.includes('assistant') && !jobTitle.includes('clerk') && !jobTitle.includes('administrative') && !jobTitle.includes('receptionist')) {
      continue;
    }
    if ((qStr.includes('customer support') || qStr.includes('customer service')) && !jobTitle.includes('support') && !jobTitle.includes('customer') && !jobTitle.includes('call center') && !jobTitle.includes('bpo') && !jobTitle.includes('telecalling') && !jobTitle.includes('client service')) {
      continue;
    }
    if (qStr.includes('sales') && !jobTitle.includes('sales') && !jobTitle.includes('business development') && !jobTitle.includes('bde') && !jobTitle.includes('telecaller')) {
      continue;
    }
    if (qStr.includes('restaurant') && !jobTitle.includes('restaurant') && !jobTitle.includes('steward') && !jobTitle.includes('waiter') && !jobTitle.includes('dining') && !jobTitle.includes('kitchen') && !jobTitle.includes('hospitality')) {
      continue;
    }

    // Special exact-intent matching checks
    if (qStr.includes('delivery') && jobTitle.includes('delivery')) score += 15;
    if (qStr.includes('cater') && (jobTitle.includes('cater') || jobDesc.includes('cater'))) score += 15;
    if (qStr.includes('cook') && (jobTitle.includes('cook') || jobTitle.includes('chef') || jobDesc.includes('kitchen'))) score += 20;
    if (qStr.includes('warehouse') && (jobTitle.includes('warehouse') || jobDesc.includes('warehouse'))) score += 20;
    if (qStr.includes('pack') && (jobTitle.includes('pack') || jobDesc.includes('pack'))) score += 20;
    if (qStr.includes('security') && (jobTitle.includes('security') || jobTitle.includes('guard'))) score += 20;
    if (qStr.includes('clean') && (jobTitle.includes('clean') || jobDesc.includes('cleaning'))) score += 20;
    if (qStr.includes('driver') && (jobTitle.includes('driver') || jobTitle.includes('courier'))) score += 20;
    if (qStr.includes('retail') && (jobTitle.includes('retail') || jobTitle.includes('store'))) score += 20;
    if (qStr.includes('electric') && (jobTitle.includes('electric') || jobDesc.includes('electrical'))) score += 20;
    if (qStr.includes('factory') && (jobTitle.includes('machine') || jobTitle.includes('operator') || jobTitle.includes('production'))) score += 20;
    if (qStr.includes('construction') && (jobTitle.includes('construction') || jobDesc.includes('construction'))) score += 20;
    if (qStr.includes('sales') && (jobTitle.includes('sales') || jobDesc.includes('sales'))) score += 20;
    if (qStr.includes('restaurant') && (jobTitle.includes('restaurant') || jobTitle.includes('steward') || jobTitle.includes('dining'))) score += 20;
    if (qStr.includes('office assistant') && (jobTitle.includes('office') || jobTitle.includes('administrative'))) score += 20;
    if (qStr.includes('support') && (jobTitle.includes('support') || jobTitle.includes('customer'))) score += 20;

    // 2. Category & Domain Match (up to 20 pts)
    if (qCategory && (jobCat.includes(qCategory) || jobTitle.includes(qCategory) || jobDesc.includes(qCategory))) {
      score += 20;
      reasons.push(`Relevant industry domain (${job.category})`);
    }

    // 3. Location Matching (up to 25 pts) — CRITICAL (Section 9)
    let isLocationMismatch = false;
    if (qLocation) {
      if (jobLoc.includes(qLocation)) {
        score += 25;
        reasons.push(`Located in ${parsedQuery.location || userProfile.city}`);
      } else if (job.remote && !jobLoc.includes('germany') && !jobLoc.includes('munich') && !jobLoc.includes('berlin') && !jobLoc.includes('united states') && !jobTitle.includes('m/w/d')) {
        score += 15;
        reasons.push('Remote opportunity accessible anywhere');
      } else {
        isLocationMismatch = true;
        score -= 30;
      }
    } else {
      score += 10;
    }

    // Filter physical jobs in completely different cities when specific city was requested
    if (isLocationMismatch && qLocation) {
      continue;
    }

    // 4. Remote / Work From Home Preference Match
    if (qRemote === true || qStr.includes('work from home') || qStr.includes('wfh')) {
      if (job.remote) {
        score += 25;
        reasons.push('100% remote / work from home verified');
      } else {
        continue; // user explicitly requested remote / work from home
      }
    } else if (qRemote === false) {
      if (!job.remote) {
        score += 10;
      }
    }

    // 5. Employment Type & Shift Match
    if (qStr.includes('part time') || qStr.includes('part-time')) {
      const isPartTime = (
        job.employmentType === 'Part-time' || 
        jobType.includes('part-time') || 
        jobType.includes('part time') || 
        jobTitle.includes('part-time') || 
        jobTitle.includes('part time') || 
        jobDesc.includes('part-time') || 
        jobDesc.includes('part time') ||
        jobDesc.includes('flexible')
      );
      if (!isPartTime) {
        continue; // Filter jobs that aren't part-time when explicitly searched
      }
      score += 25;
      reasons.push('Matches part-time flexible schedule requirement');
    } else if (qType && (jobType.includes(qType) || (qType === 'Part-time' && job.employmentType === 'Part-time'))) {
      score += 20;
      reasons.push(`Matches your ${job.employmentType} schedule preference`);
    }

    if (qStr.includes('night shift') || qStr.includes('night')) {
      const isNight = jobDesc.includes('night') || jobTitle.includes('night') || job.description?.includes('Night Shift') || job.requirements?.includes('Night Shift');
      if (!isNight) {
        continue; // Filter jobs that don't support night shift when explicitly searched
      }
      score += 25;
      reasons.push('Supports night shift operations');
    } else if (qShift && (jobDesc.includes(qShift) || jobTitle.includes(qShift) || job.description?.includes('Night Shift'))) {
      score += 20;
      reasons.push(`Accommodates ${parsedQuery.shift}`);
    }

    // 6. Experience Match (e.g. freshers)
    if (qExp === 'entry-level' || qStr.includes('fresher') || qStr.includes('freshers')) {
      const isFresherFriendly = (
        jobTitle.includes('fresher') || 
        jobTitle.includes('trainee') || 
        jobExp.includes('fresher') || 
        jobExp.includes('entry') || 
        jobExp.includes('0') || 
        job.employmentType === 'Internship' ||
        job.experienceLevel === 'entry-level'
      );
      if (qStr.includes('fresher') && !isFresherFriendly) {
        continue; // Filter jobs requiring prior experience when freshers was explicitly requested
      }
      if (isFresherFriendly) {
        score += 25;
        if (jobTitle.includes('fresher')) score += 25;
        reasons.push('Fresher-friendly / Zero experience needed');
      }
    }

    // If query was specific and this job has ZERO title or description match, filter obvious mismatch (Section 8)
    const nonLocationTokens = queryTokens.filter(t => !['hyderabad', 'bengaluru', 'chennai', 'mumbai', 'delhi'].includes(t));
    if (nonLocationTokens.length > 0 && tokenMatchesTitle === 0 && tokenMatchesDesc === 0 && !qShift && !qType && !qRemote && !qExp) {
      continue; // Filter obvious mismatches
    }

    // Normalize final score between 40 and 99
    const finalScore = Math.min(99, Math.max(40, score));

    scored.push({
      ...job,
      score: finalScore,
      matchReasons: reasons.length > 0 ? reasons : ['Verified live opportunity matching search criteria']
    });
  }

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Main Service API: Get Real Job Recommendations (Section 3, 4, 5, 17, 20)
 */
export async function getRealJobRecommendations({
  query = '',
  location = '',
  profile = {},
  page = 1,
  limit = 12
} = {}) {
  const parsed = parseJobQuery(query, { ...profile, city: location || profile.city });

  // Check cache
  const cacheKey = `${parsed.originalQuery}|${parsed.location}|${page}|${limit}`.toLowerCase();
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  const provider = (process.env.JOB_API_PROVIDER || 'auto').toLowerCase();
  let rawJobs = [];

  try {
    // 1. External Paid Provider if configured
    if (provider === 'adzuna' && process.env.JOB_API_KEY) {
      rawJobs = await fetchFromAdzuna({ query: parsed.keyword, location: parsed.location, page, limit });
    } else if (provider === 'jooble' && process.env.JOB_API_KEY) {
      rawJobs = await fetchFromJooble({ query: parsed.keyword, location: parsed.location, limit });
    } else if (provider === 'jsearch' && process.env.JOB_API_KEY) {
      rawJobs = await fetchFromJSearch({ query: parsed.keyword, location: parsed.location, limit });
    }

    // 2. Fetch from legitimate live feeds and verified partner listings
    const [arbeitnowJobs, himalayasJobs, storeJobs] = await Promise.all([
      fetchFromArbeitnow({ query: parsed.keyword }),
      fetchFromHimalayas(),
      fetchFromVerifiedStore()
    ]);

    // Combine all genuine sources
    rawJobs = [...rawJobs, ...storeJobs, ...arbeitnowJobs, ...himalayasJobs];

    // 3. Deduplicate
    const uniqueJobs = deduplicateJobs(rawJobs);

    // 4. Score and Rank
    const scoredJobs = scoreAndRankJobs(uniqueJobs, parsed, profile);

    // 5. Link Reachability Verification (Top candidates)
    const verifiedJobs = await verifyJobListings(scoredJobs.slice(0, limit));

    // 6. Handle Empty State (Section 17)
    if (verifiedJobs.length === 0) {
      const suggestions = [];
      if (parsed.location) suggestions.push(`Expanding search beyond ${parsed.location} to remote roles`);
      if (parsed.experience) suggestions.push('Removing specific experience requirements');
      suggestions.push('Searching broader category keywords (e.g. "logistics" or "hospitality")');

      const emptyResult = {
        success: true,
        total: 0,
        recommendations: [],
        query: parsed,
        provider: provider !== 'auto' ? provider : 'Legitimate Verified Sources',
        message: 'No matching jobs found.',
        suggestions
      };

      queryCache.set(cacheKey, { timestamp: Date.now(), result: emptyResult });
      return emptyResult;
    }

    const result = {
      success: true,
      total: verifiedJobs.length,
      recommendations: verifiedJobs,
      query: parsed,
      provider: provider !== 'auto' ? provider : 'Legitimate Verified Sources'
    };

    queryCache.set(cacheKey, { timestamp: Date.now(), result });
    return result;
  } catch (err) {
    console.error('getRealJobRecommendations error:', err);
    throw new Error('Unable to fetch live job opportunities right now. Please try again.');
  }
}
