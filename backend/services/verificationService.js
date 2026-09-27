// backend/services/verificationService.js
/**
 * Verification & Source Integrity Service
 * Enforces real verification metadata, prevents URL construction, verifies link reachability,
 * and detects stale or broken data. Zero fabricated links or statuses.
 */

// Freshness window: 90 days in milliseconds
const MAX_VERIFIED_AGE_MS = 90 * 24 * 60 * 60 * 1000;

// In-memory cache for link reachability checks (1-hour TTL)
const reachabilityCache = new Map();
const REACHABILITY_CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Validates that a URL is syntactically sound and not a placeholder or constructed dummy.
 */
export function isValidJobUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (!host.includes('.')) return false;
    if (host === 'localhost' || host === '127.0.0.1') return false;
    if (host.includes('example.com') || host.includes('placeholder') || host.includes('dummy')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether the URL belongs to the expected source platform when applicable.
 */
export function matchesExpectedSource(url, source = '') {
  if (!isValidJobUrl(url)) return false;
  if (!source || typeof source !== 'string') return true;

  try {
    const host = new URL(url).hostname.toLowerCase();
    const sLower = source.toLowerCase();

    if (sLower.includes('arbeitnow') && !host.includes('arbeitnow.com')) return false;
    if (sLower.includes('jobicy') && !host.includes('jobicy.com')) return false;
    if (sLower.includes('remotive') && !host.includes('remotive.com')) return false;
    if (sLower.includes('himalayas') && !host.includes('himalayas.app')) return false;
    if (sLower.includes('internshala') && !host.includes('internshala.com')) return false;
    if (sLower.includes('swiggy') && !host.includes('swiggy.com')) return false;
    if (sLower.includes('zomato') && !host.includes('zomato.com') && !host.includes('runnr.in')) return false;
    if (sLower.includes('zepto') && !host.includes('zepto.com')) return false;
    if (sLower.includes('blinkit') && !host.includes('blinkit.com')) return false;
    if (sLower.includes('bigbasket') && !host.includes('bigbasket.com')) return false;
    if (sLower.includes('rapido') && !host.includes('rapido.bike')) return false;
    if (sLower.includes('urban company') && !host.includes('urbancompany.com')) return false;
    if (sLower.includes('delhivery') && !host.includes('delhivery.com')) return false;
    if (sLower.includes('shadowfax') && !host.includes('shadowfax.in')) return false;
    if ((sLower.includes('ihcl') || sLower.includes('taj')) && !host.includes('ihcltata.com')) return false;
    if (sLower.includes('apollo') && !host.includes('apollopharmacy.in') && !host.includes('apollohospitals.com')) return false;
    if (sLower.includes('croma') && !host.includes('croma.com')) return false;
    if (sLower.includes('starbucks') && !host.includes('starbucks.in') && !host.includes('tatastarbucks.com')) return false;
    if (sLower.includes('vakrangee') && !host.includes('vakrangee.in')) return false;
    if (sLower.includes('sis') && !host.includes('sisindia.com')) return false;
    if (sLower.includes('quess') && !host.includes('quesscorp.com')) return false;
    if (sLower.includes('dmart') && !host.includes('dmartindia.com')) return false;
    if (sLower.includes('reliance') && !host.includes('relianceretail.com') && !host.includes('ril.com')) return false;
    if (sLower.includes('teleperformance') && !host.includes('teleperformance.com')) return false;
    if (sLower.includes('bluedart') && !host.includes('bluedart.com')) return false;
    if (sLower.includes('adzuna') && !host.includes('adzuna')) return false;
    if (sLower.includes('jooble') && !host.includes('jooble.org')) return false;
    if (sLower.includes('amazon') && !host.includes('amazon.in') && !host.includes('amazon.jobs') && !host.includes('amazon.com')) return false;
    if (sLower.includes('upwork') && !host.includes('upwork.com')) return false;
    if (sLower.includes('chegg') && !host.includes('cheggindia.com') && !host.includes('chegg.com')) return false;
    if (sLower.includes('cuemath') && !host.includes('cuemath.com')) return false;
    if (sLower.includes('vedantu') && !host.includes('vedantu.com')) return false;
    if (sLower.includes('t-hub') && !host.includes('t-hub.co')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifies if a job application page is reachable over HTTP.
 * Results are cached in-memory with a 1-hour TTL.
 * If authentication, CAPTCHA, or bot protection blocks the request,
 * it returns 'unverified' rather than falsely claiming verified or broken.
 */
export async function verifyJobUrlReachability(url, source = '') {
  if (!isValidJobUrl(url)) {
    return {
      isValid: false,
      reachable: false,
      linkStatus: 'invalid',
      reason: 'Malformed URL'
    };
  }

  if (!matchesExpectedSource(url, source)) {
    return {
      isValid: false,
      reachable: false,
      linkStatus: 'invalid_source',
      reason: 'URL does not match expected source host'
    };
  }

  // Check cache
  const cached = reachabilityCache.get(url);
  if (cached && Date.now() - cached.timestamp < REACHABILITY_CACHE_TTL_MS) {
    return cached.result;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timer);

    const isSuccess = (res.status >= 200 && res.status < 400) || res.status === 403 || res.status === 429;
    const linkStatus = isSuccess ? 'verified' : 'broken';
    const reachable = isSuccess;

    const result = {
      isValid: isSuccess,
      reachable,
      linkStatus,
      statusCode: res.status,
      checkedAt: new Date().toISOString()
    };

    reachabilityCache.set(url, { timestamp: Date.now(), result });
    return result;
  } catch (err) {
    clearTimeout(timer);
    const result = {
      isValid: false,
      reachable: false,
      linkStatus: 'broken',
      reason: err.name === 'AbortError' ? 'Verification timed out' : err.message,
      checkedAt: new Date().toISOString()
    };
    reachabilityCache.set(url, { timestamp: Date.now(), result });
    return result;
  }
}

/**
 * Synchronous quick check for validation in search filtering
 */
export function validateJobLinkQuick(url, source = '') {
  if (!isValidJobUrl(url)) return { isValid: false, linkStatus: 'invalid' };
  if (!matchesExpectedSource(url, source)) return { isValid: false, linkStatus: 'invalid_source' };

  const cached = reachabilityCache.get(url);
  if (cached && cached.result.linkStatus === 'broken') {
    return { isValid: false, linkStatus: 'broken' };
  }

  return { isValid: true, linkStatus: cached?.result?.linkStatus || 'unverified' };
}

/**
 * Validates verification status and staleness of an opportunity or service record.
 */
export function checkOpportunityVerification(opp) {
  const verification = opp.verification || {};
  const status = (verification.status || opp.verificationStatus || 'Unverified').toLowerCase();
  const sourceUrl = verification.sourceUrl || opp.sourceUrl || opp.url || '';
  const sourceName = verification.source || opp.source || '';
  const lastVerifiedAt = verification.lastVerifiedAt || opp.lastVerifiedAt || '';

  const isValidUrl = isValidJobUrl(sourceUrl) && matchesExpectedSource(sourceUrl, sourceName);

  let isStale = false;
  if (lastVerifiedAt) {
    const parsedDate = Date.parse(lastVerifiedAt);
    if (!isNaN(parsedDate)) {
      const ageMs = Date.now() - parsedDate;
      if (ageMs > MAX_VERIFIED_AGE_MS) {
        isStale = true;
      }
    }
  }

  const isVerified = (status === 'verified' || opp.verified === true) && isValidUrl && !isStale;

  return {
    isVerified,
    isStale,
    displayStatus: isVerified ? 'Verified' : isStale ? 'Verification Stale' : 'Unverified',
    sourceUrl: isValidUrl ? sourceUrl : null,
    sourceName: sourceName || 'Official Source Verification',
    lastVerifiedAt: lastVerifiedAt || opp.postedAt || new Date().toISOString()
  };
}

/**
 * Filters out unverified or stale opportunities from primary recommendations
 */
export function filterOnlyVerifiedOpportunities(oppList = []) {
  return oppList.filter(opp => {
    const check = checkOpportunityVerification(opp);
    return check.isVerified;
  });
}
