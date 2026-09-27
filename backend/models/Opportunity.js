// backend/models/Opportunity.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'opportunitiesStore.json');

let storeCache = [];
let lastSyncTimestamp = null;
let isInitialized = false;

/**
 * Remove HTML tags from descriptions or snippets
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Normalize location string into clean format
 */
function normalizeLocation(loc, isRemote = false) {
  if (isRemote && (!loc || loc.toLowerCase().includes('remote') || loc.toLowerCase() === 'anywhere' || loc.toLowerCase().includes('not provided'))) {
    return 'Remote';
  }
  if (!loc || typeof loc !== 'string' || loc.trim() === '') {
    return isRemote ? 'Remote' : 'Location not provided';
  }
  const clean = loc.trim();
  if (clean.toLowerCase().includes('remote')) return 'Remote';
  return clean;
}

/**
 * Normalize categories into standardized platform taxonomy
 */
function normalizeCategory(cat = '', title = '', tags = []) {
  const combined = `${cat} ${title} ${Array.isArray(tags) ? tags.join(' ') : ''}`.toLowerCase();
  
  if (combined.includes('intern') || combined.includes('student') || combined.includes('trainee')) {
    return 'Internship';
  }
  if (combined.includes('delivery') || combined.includes('driver') || combined.includes('courier') || combined.includes('task')) {
    return 'Gig';
  }
  if (combined.includes('freelance') || combined.includes('contract') || combined.includes('consultant')) {
    return 'Freelance';
  }
  if (combined.includes('part-time') || combined.includes('part time')) {
    return 'Part-time';
  }
  if (combined.includes('service') || combined.includes('cleaning') || combined.includes('repair') || combined.includes('technician')) {
    return 'Local service';
  }
  if (combined.includes('developer') || combined.includes('engineer') || combined.includes('software') || combined.includes('tech') || combined.includes('data')) {
    return 'Skill-Based';
  }
  if (combined.includes('remote') || combined.includes('work from home')) {
    return 'Remote';
  }
  return 'Part-time';
}

/**
 * Normalize opportunity type
 */
function normalizeType(type = '', isRemote = false, category = '') {
  const t = String(type).toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('freelance') || t.includes('contract')) return 'Freelance';
  if (t.includes('part-time') || t.includes('part time')) return 'Part-time';
  if (t.includes('gig')) return 'Gig';
  if (category === 'Gig') return 'Gig';
  if (t.includes('full-time') || t.includes('full time')) return 'Full-time';
  if (isRemote) return 'Remote';
  return 'Part-time';
}

export class Opportunity {
  /**
   * Initialize in-memory cache synchronously from JSON file
   */
  static initSync() {
    if (isInitialized && storeCache.length > 0) return;
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw || '{}');
        storeCache = Array.isArray(parsed.opportunities) ? parsed.opportunities : [];
        lastSyncTimestamp = parsed.lastUpdated || new Date().toISOString();
      } else {
        storeCache = [];
        lastSyncTimestamp = new Date().toISOString();
      }
    } catch (err) {
      console.error('Error reading opportunitiesStore.json:', err.message);
      storeCache = [];
      lastSyncTimestamp = new Date().toISOString();
    }
    isInitialized = true;
  }

  /**
   * Initialize in-memory cache from JSON file
   */
  static async initialize() {
    this.initSync();
  }

  /**
   * Persist cache to disk
   */
  static saveToFile() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            lastUpdated: lastSyncTimestamp,
            totalCount: storeCache.length,
            opportunities: storeCache
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.error('Error writing opportunitiesStore.json:', err.message);
    }
  }

  /**
   * Validate that record has required legitimate fields and a valid URL
   */
  static validate(record) {
    if (!record || typeof record !== 'object') return false;
    if (!record.title || typeof record.title !== 'string' || record.title.trim().length < 3) return false;
    const prov = record.company || record.provider;
    if (!prov || typeof prov !== 'string' || prov.trim().length < 2) return false;
    const finalUrl = record.url || record.sourceUrl;
    if (!finalUrl || typeof finalUrl !== 'string') return false;

    // Must be valid HTTP or HTTPS URL (Step 8: real source URLs only)
    try {
      const parsedUrl = new URL(finalUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return false;
      const host = parsedUrl.hostname.toLowerCase();
      if (!host.includes('.')) return false;
      if (host === 'localhost' || host === '127.0.0.1') return false;
      if (host === 'example.com' || host.includes('fake') || host.includes('placeholder') || host.includes('dummy')) return false;
    } catch {
      return false;
    }

    // Exclude expired opportunities
    if (record.expiresAt) {
      const expiry = new Date(record.expiresAt).getTime();
      if (!isNaN(expiry) && expiry < Date.now()) return false;
    }

    return true;
  }

  /**
   * Normalize an incoming record
   */
  static normalize(raw, defaultSource = 'Public Opportunity Feed') {
    const isRemote = Boolean(
      raw.remote === true ||
      raw.remote === 'true' ||
      raw.isRemote === true ||
      raw.locationType === 'Remote' ||
      String(raw.mode || '').toLowerCase() === 'online' ||
      String(raw.location).toLowerCase().includes('remote') ||
      String(raw.title).toLowerCase().includes('remote')
    );

    const title = String(raw.title || '').trim();
    const provider = String(raw.company || raw.company_name || raw.provider || raw.verification?.source || (raw.platforms && raw.platforms[0]?.name) || 'Verified Organization').trim();
    const company = provider;
    const location = normalizeLocation(raw.location || raw.jobGeo, isRemote);
    const category = normalizeCategory(raw.category, title, raw.tags);
    const type = normalizeType(raw.type || raw.job_types?.[0] || raw.jobType, isRemote, category);
    
    // Compensation format: NEVER fabricate numbers or ranges
    let compensation = {
      label: 'Salary not disclosed',
      min: null,
      max: null,
      currency: 'INR',
      isPaid: false
    };

    if (raw.compensation && typeof raw.compensation === 'object') {
      const hasMin = typeof raw.compensation.min === 'number';
      const hasMax = typeof raw.compensation.max === 'number';
      compensation = {
        label: raw.compensation.label || (hasMin || hasMax ? `${raw.compensation.currency || 'INR'} ${raw.compensation.min || 0} - ${raw.compensation.max || 0}` : 'Salary not disclosed'),
        min: raw.compensation.min ?? null,
        max: raw.compensation.max ?? null,
        currency: raw.compensation.currency || 'INR',
        isPaid: Boolean(hasMin || hasMax || (raw.compensation.label && !raw.compensation.label.toLowerCase().includes('not disclosed') && !raw.compensation.label.toLowerCase().includes('not provided')))
      };
    } else if (raw.salary && typeof raw.salary === 'string' && raw.salary.trim()) {
      compensation = {
        label: raw.salary.trim(),
        min: raw.annualSalaryMin ?? null,
        max: raw.annualSalaryMax ?? null,
        currency: raw.salary.includes('$') ? 'USD' : (raw.salary.includes('€') ? 'EUR' : 'INR'),
        isPaid: true
      };
    } else if (raw.pay && typeof raw.pay === 'string' && raw.pay.trim()) {
      compensation = {
        label: raw.pay.trim(),
        min: null,
        max: null,
        currency: 'INR',
        isPaid: true
      };
    } else if (raw.incomeModel) {
      compensation = {
        label: String(raw.incomeModel).trim(),
        min: null,
        max: null,
        currency: 'INR',
        isPaid: true
      };
    }

    const description = stripHtml(raw.description || raw.howItWorks || raw.summary || `${title} at ${provider}.`);
    const source = String(raw.source || raw.verification?.source || defaultSource).trim();
    const sourceUrl = String(raw.url || raw.sourceUrl || raw.verification?.sourceUrl || (raw.platforms && raw.platforms[0]?.url) || '').trim();
    const sourceId = String(raw.sourceId || raw.id || raw.slug || `${provider}-${title}`.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();

    // Posted date - never fabricate
    let postedAt = null;
    if (raw.created_at) {
      const d = typeof raw.created_at === 'number' ? new Date(raw.created_at * 1000) : new Date(raw.created_at);
      if (!isNaN(d.getTime())) postedAt = d.toISOString();
    } else if (raw.pubDate || raw.postedAt) {
      const d = new Date(raw.pubDate || raw.postedAt);
      if (!isNaN(d.getTime())) postedAt = d.toISOString();
    } else if (raw.createdAt) {
      const d = new Date(raw.createdAt);
      if (!isNaN(d.getTime())) postedAt = d.toISOString();
    }

    const requirements = Array.isArray(raw.requirements || raw.requiredSkills || raw.tags)
      ? (raw.requirements || raw.requiredSkills || raw.tags).map(r => String(r).trim()).filter(Boolean).slice(0, 8)
      : [];

    // Experience detection (fresher / entry-level / mid / senior)
    let experienceLevel = raw.experienceLevel || null;
    let experienceYears = raw.experienceYears || null;

    if (!experienceLevel) {
      const combinedText = `${title} ${description.slice(0, 500)} ${requirements.join(' ')}`.toLowerCase();
      if (/\b(?:fresher|freshers|entry-level|entry\s+level|intern(?:ship)?|trainee|junior|jr\.?|graduate|0-1\s*years?)\b/i.test(combinedText)) {
        experienceLevel = 'entry-level';
        if (!experienceYears) experienceYears = { min: 0, max: 1 };
      } else if (/\b(?:senior|sr\.?|lead|principal|architect|manager|staff)\b/i.test(combinedText)) {
        experienceLevel = 'senior';
        if (!experienceYears) experienceYears = { min: 5, max: null };
      } else if (/\b(?:mid-level|mid\s+level|intermediate|2-4\s*years?)\b/i.test(combinedText)) {
        experienceLevel = 'mid-level';
        if (!experienceYears) experienceYears = { min: 2, max: 4 };
      } else {
        experienceLevel = 'unspecified';
      }
    }

    const verified = Boolean(raw.verified === true || raw.verification?.status === 'Verified');
    const verificationStatus = verified ? 'Source verified' : `Source: ${source}`;

    return {
      id: raw.id || `opp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title,
      company,
      provider,
      description,
      category,
      type,
      location,
      remote: isRemote,
      compensation,
      salary: compensation.label !== 'Salary not disclosed' ? compensation.label : null,
      requirements,
      source,
      url: sourceUrl,
      sourceUrl,
      sourceId,
      experienceLevel,
      experienceYears,
      postedAt,
      fetchedAt: raw.fetchedAt || raw.createdAt || new Date().toISOString(),
      expiresAt: raw.expiresAt || null,
      lastCheckedAt: new Date().toISOString(),
      linkStatus: raw.linkStatus || (verified ? 'verified' : 'unverified'),
      verified,
      verificationStatus,
      isOrganizationalRole: Boolean(raw.isOrganizationalRole),
      organizationType: raw.organizationType || null,
      department: raw.department || null,
      howItWorks: raw.howItWorks || null,
      whereToStart: Array.isArray(raw.whereToStart) ? raw.whereToStart : [],
      platforms: Array.isArray(raw.platforms) ? raw.platforms : [],
      createdAt: raw.createdAt || postedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Check if two records represent the exact same opportunity (duplicate detection)
   */
  static isDuplicate(a, b) {
    if (!a || !b) return false;
    if (a.sourceUrl && b.sourceUrl && a.sourceUrl === b.sourceUrl) return true;
    if (a.sourceId && b.sourceId && a.source === b.source && a.sourceId === b.sourceId) return true;
    
    // Normalized title and company match
    const titleA = a.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const titleB = b.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const provA = a.provider.toLowerCase().replace(/[^a-z0-9]/g, '');
    const provB = b.provider.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (titleA && titleB && provA && provB && titleA === titleB && provA === provB) {
      // If locations differ (e.g. Hyderabad vs Remote), they are separate regional job postings
      const locA = (a.location || '').toLowerCase().trim();
      const locB = (b.location || '').toLowerCase().trim();
      if (locA && locB && locA !== locB) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Insert or merge batch of records with duplicate and expiration filters
   */
  static async upsertBatch(incomingRecords, defaultSource = 'Public Opportunity Feed') {
    await this.initialize();
    let newCount = 0;

    for (const raw of incomingRecords) {
      const normalized = this.normalize(raw, defaultSource);
      if (!this.validate(normalized)) continue;

      const existingIndex = storeCache.findIndex(item => this.isDuplicate(item, normalized));
      if (existingIndex >= 0) {
        // Update existing record's lastCheckedAt and preserve ID
        storeCache[existingIndex] = {
          ...storeCache[existingIndex],
          ...normalized,
          id: storeCache[existingIndex].id,
          createdAt: storeCache[existingIndex].createdAt || normalized.createdAt,
          lastCheckedAt: new Date().toISOString()
        };
      } else {
        storeCache.push(normalized);
        newCount++;
      }
    }

    lastSyncTimestamp = new Date().toISOString();
    this.saveToFile();
    return { newCount, totalCount: storeCache.length };
  }

  /**
   * Query opportunities with complete filter, search, location, sort, and pagination support
   */
  static async query({
    search = '',
    category = 'all',
    location = 'all',
    remote = 'all',
    opportunityType = 'all',
    minPay,
    maxPay,
    paidOnly = false,
    freshness = 'any',
    sort = 'relevance',
    page = 1,
    limit = 20
  } = {}) {
    await this.initialize();

    let results = [...storeCache];

    // Filter out expired opportunities
    const nowMs = Date.now();
    results = results.filter(item => {
      if (!item.expiresAt) return true;
      const expMs = new Date(item.expiresAt).getTime();
      return isNaN(expMs) || expMs >= nowMs;
    });

    // 1. Search Query
    if (search && search.trim()) {
      const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
      results = results.filter(item => {
        const text = `${item.title} ${item.provider} ${item.description} ${item.location} ${item.category} ${item.type} ${(item.requirements || []).join(' ')}`.toLowerCase();
        return terms.every(t => text.includes(t));
      });
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      results = results.filter(item => item.category.toLowerCase() === catLower);
    }

    // 3. Location Filter
    if (location && location !== 'all') {
      const locLower = location.toLowerCase().trim();
      if (locLower === 'remote') {
        results = results.filter(item => item.remote === true || item.location.toLowerCase() === 'remote');
      } else {
        results = results.filter(item => item.location.toLowerCase().includes(locLower));
      }
    }

    // 4. Remote Filter
    if (remote !== 'all' && remote !== undefined && remote !== '') {
      const isRemoteOnly = remote === 'true' || remote === true || remote === 'remote';
      const isOnsiteOnly = remote === 'false' || remote === false || remote === 'onsite';
      if (isRemoteOnly) {
        results = results.filter(item => item.remote === true);
      } else if (isOnsiteOnly) {
        results = results.filter(item => item.remote === false);
      }
    }

    // 5. Opportunity Type Filter
    if (opportunityType && opportunityType !== 'all') {
      const typeLower = opportunityType.toLowerCase().trim();
      results = results.filter(item => item.type.toLowerCase().includes(typeLower));
    }

    // 6. Compensation Filter
    if (paidOnly === true || paidOnly === 'true') {
      results = results.filter(item => item.compensation?.isPaid === true);
    }
    if (minPay !== undefined && minPay !== null && minPay !== '') {
      const minNum = Number(minPay);
      if (!isNaN(minNum)) {
        results = results.filter(item => (item.compensation?.min ?? item.compensation?.max ?? 0) >= minNum);
      }
    }

    // 7. Freshness Filter
    if (freshness && freshness !== 'any') {
      const now = Date.now();
      let thresholdHours = 24 * 30; // default 30 days
      if (freshness === 'today' || freshness === '24h') thresholdHours = 24;
      else if (freshness === '3days' || freshness === '3d') thresholdHours = 24 * 3;
      else if (freshness === '7days' || freshness === '7d') thresholdHours = 24 * 7;

      const cutoffMs = now - (thresholdHours * 3600 * 1000);
      results = results.filter(item => {
        const itemDate = new Date(item.postedAt || item.createdAt).getTime();
        return !isNaN(itemDate) && itemDate >= cutoffMs;
      });
    }

    // 8. Sorting
    if (sort === 'newest') {
      results.sort((a, b) => new Date(b.postedAt || b.createdAt).getTime() - new Date(a.postedAt || a.createdAt).getTime());
    } else if (sort === 'compensation') {
      results.sort((a, b) => (b.compensation?.max || b.compensation?.min || 0) - (a.compensation?.max || a.compensation?.min || 0));
    } else if (sort === 'location') {
      results.sort((a, b) => a.location.localeCompare(b.location));
    } else {
      // Default: 'relevance' (verified opportunities first, then newest)
      results.sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return new Date(b.postedAt || b.createdAt).getTime() - new Date(a.postedAt || a.createdAt).getTime();
      });
    }

    const total = results.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = results.slice(startIndex, startIndex + limitNum);

    return {
      opportunities: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasMore: startIndex + limitNum < total,
      lastUpdated: lastSyncTimestamp || new Date().toISOString(),
      sources: this.getSources(),
      categories: this.getCategories(),
      locations: this.getLocations()
    };
  }

  /**
   * Find opportunity by ID
   */
  static async findById(id) {
    await this.initialize();
    return storeCache.find(item => item.id === id) || null;
  }

  /**
   * Unique sources present in dataset
   */
  static getSources() {
    const sources = new Set(storeCache.map(i => i.source).filter(Boolean));
    return Array.from(sources);
  }

  /**
   * Unique categories present in dataset
   */
  static getCategories() {
    return [
      'Part-time',
      'Remote',
      'Freelance',
      'Gig',
      'Internship',
      'Local service',
      'Skill-Based'
    ];
  }

  /**
   * Unique locations available in dataset
   */
  static getLocations() {
    const locs = new Set();
    locs.add('Remote');
    storeCache.forEach(item => {
      if (item.location && item.location !== 'Location not provided' && item.location !== 'Remote') {
        // Extract city if comma separated e.g. "Hyderabad, India" -> "Hyderabad"
        const city = item.location.split(',')[0].trim();
        if (city) locs.add(city);
      }
    });
    return Array.from(locs);
  }

  /**
   * Return ISO timestamp of last update
   */
  static getLastUpdated() {
    return lastSyncTimestamp || new Date().toISOString();
  }

  /**
   * Get all raw cached opportunities (for backwards compatibility)
   */
  static getAll() {
    if (!isInitialized || storeCache.length === 0) {
      this.initSync();
    }
    return storeCache;
  }
}

// Ensure store cache is populated immediately upon module evaluation
Opportunity.initSync();

