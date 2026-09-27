// backend/services/searchService.js
/**
 * Search Service
 * Supports Standard Search and AI Search with natural-language parameter decomposition,
 * strict location-aware filtering, experience-level distinction, explainable scoring,
 * freshness verification, and zero fabricated opportunities or URLs.
 */

import { parseAIQuery } from './aiQueryService.js';
import { isValidJobUrl, validateJobLinkQuick } from './verificationService.js';
import { getFeedStatus } from './opportunityFeedService.js';
import { getAllOpportunities } from '../data/store.js';

export function matchWordBoundary(text, word) {
  if (!text || !word || word.length < 2) return false;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
  return rx.test(text);
}

/**
 * Normalizes a word to its root stem to handle plurals, gerunds, etc.
 */
export function stemWord(word) {
  if (!word || word.length < 3) return word;
  return word.toLowerCase()
    .replace(/(?:ing|ers?|ed|es|s)$/i, '')
    .trim();
}

/**
 * Formats relative freshness string for UI display
 */
export function formatFreshness(dateString) {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  if (isNaN(diffMs) || diffMs < 0) return 'Just posted';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just posted';
  if (mins < 60) return `Posted ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Posted ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Posted yesterday';
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} mo ago`;
}

/**
 * Parses free-form or natural language queries into structured parameters.
 */
export function parseNaturalLanguageQuery(query = '', profile = null) {
  return parseAIQuery(query, profile);
}

/**
 * Searches the opportunities database using query string and structured filter options.
 * Never fabricates jobs, companies, salaries, or application URLs.
 */
export function searchOpportunitiesDatabase(options = {}) {
  const {
    query = '',
    searchMode = 'standard', // 'standard' or 'ai'
    budget,
    workType,
    experience,
    timeHours,
    country,
    category,
    opportunityType,
    location,
    city,
    remote,
    freshness = 'any',
    paidOnly = false,
    minPay,
    maxPay,
    sort = 'relevance',
    page = 1,
    limit = 20,
    profile = null,
    excludeIds = [],
    allOpportunities = [],
    allowFallback = false
  } = options;

  const rawQuery = (query || '').trim();
  const parsedAI = parseAIQuery(rawQuery, profile);
  const qLower = rawQuery.toLowerCase();

  // Extract location parameters
  const detectedCity = parsedAI.location && parsedAI.location.length > 0 ? parsedAI.location[0] : null;
  const effectiveLocation = location || city || detectedCity || (
    qLower.includes('hyderabad') ? 'Hyderabad' :
    qLower.includes('bengaluru') || qLower.includes('bangalore') ? 'Bangalore' :
    qLower.includes('chennai') ? 'Chennai' :
    qLower.includes('pune') ? 'Pune' :
    qLower.includes('mumbai') ? 'Mumbai' :
    qLower.includes('delhi') ? 'Delhi' :
    (qLower.includes('remote') ? 'Remote' : null)
  );

  const isRemoteQuery = Boolean(
    remote === 'true' ||
    remote === true ||
    parsedAI.remote === true ||
    qLower.includes('remote') ||
    qLower.includes('work from home') ||
    qLower.includes('wfh') ||
    qLower.includes('online')
  );

  const isInternshipQuery = Boolean(
    opportunityType === 'Internship' ||
    category === 'Internship' ||
    qLower.includes('intern') ||
    qLower.includes('internship') ||
    qLower.includes('trainee')
  );

  const isPartTimeQuery = Boolean(
    opportunityType === 'Part-time' ||
    category === 'Part-time' ||
    qLower.includes('part time') ||
    qLower.includes('part-time') ||
    qLower.includes('weekend')
  );

  const isFreelanceQuery = Boolean(
    opportunityType === 'Freelance' ||
    category === 'Freelance' ||
    qLower.includes('freelance') ||
    qLower.includes('gig')
  );

  const effectiveExperience = experience || parsedAI.experience || null;
  const oppsPool = (Array.isArray(allOpportunities) && allOpportunities.length > 0)
    ? allOpportunities
    : getAllOpportunities();

  // 1. Initial Filtering: Valid, legitimate records with actual URLs only
  let candidatePool = oppsPool.filter(opp => {
    if (!opp) return false;
    const oppUrl = opp.url || opp.sourceUrl;
    if (!isValidJobUrl(oppUrl)) return false;

    // Check if known broken in verification cache
    const linkCheck = validateJobLinkQuick(oppUrl, opp.source);
    if (linkCheck.linkStatus === 'broken') return false;

    // Filter out expired opportunities
    if (opp.expiresAt) {
      const exp = new Date(opp.expiresAt).getTime();
      if (!isNaN(exp) && exp < Date.now()) return false;
    }

    return true;
  });

  // Exclude previously rejected/displayed IDs if provided
  if (Array.isArray(excludeIds) && excludeIds.length > 0) {
    const excludeSet = new Set(excludeIds);
    candidatePool = candidatePool.filter(opp => !excludeSet.has(opp.id));
  }

  // 2. Structured Criteria & Relevance Scoring
  const scored = [];

  const TYPO_MAP = {
    'catring': 'catering',
    'caterin': 'catering',
    'cattering': 'catering',
    'cater': 'catering',
    'catr': 'catering',
    'bussiness': 'business',
    'adivosier': 'advisor',
    'moobile': 'mobile',
    'gams': 'games',
    'programing': 'programming',
    'developr': 'developer',
    'internshp': 'internship',
    'freelanc': 'freelance'
  };

  const stopWords = new Set([
    'with', 'from', 'have', 'jobs', 'job', 'work', 'make', 'money', 'know', 'can', 'the', 'and', 'for', 'about', 
    'looking', 'look', 'need', 'needs', 'want', 'wants', 'in', 'at', 'to', 'on', 'under', 'near', 'within', 'or', 'as', 'be', 'is', 'a', 'an', 'someone',
    "i'm", 'im', 'i', 'me', 'my', 'find', 'get', 'doing', 'role', 'roles', 'searching', 'opportunity', 'opportunities'
  ]);
  const rawTokens = qLower
    .split(/[\s,+/]+/)
    .map(w => TYPO_MAP[w] || w)
    .filter(w => w.length > 1 && !stopWords.has(w));

  // Identify modifier tokens so they don't masquerade as primary search subjects
  const modifierWords = new Set();
  if (isPartTimeQuery) { modifierWords.add('part'); modifierWords.add('time'); modifierWords.add('weekend'); }
  if (isInternshipQuery) { modifierWords.add('intern'); modifierWords.add('internship'); modifierWords.add('trainee'); }
  if (isFreelanceQuery) { modifierWords.add('freelance'); modifierWords.add('gig'); modifierWords.add('gigs'); }
  if (isRemoteQuery) { modifierWords.add('remote'); modifierWords.add('wfh'); modifierWords.add('online'); }
  if (effectiveLocation && effectiveLocation.toLowerCase() !== 'all') {
    effectiveLocation.toLowerCase().split(/\s+/).forEach(w => modifierWords.add(w));
  }

  const subjectTokens = rawTokens.filter(tok => !modifierWords.has(tok));

  const targetRoles = parsedAI.role || [];
  const targetSkills = parsedAI.skills || [];
  const searchCity = effectiveLocation && effectiveLocation.toLowerCase() !== 'all' && effectiveLocation.toLowerCase() !== 'remote'
    ? effectiveLocation.toLowerCase()
    : null;

  for (const opp of candidatePool) {
    let score = 0;
    const matchReasons = [];
    const titleLower = (opp.title || '').toLowerCase();
    const descLower = (opp.description || opp.howItWorks || '').toLowerCase();
    const providerLower = (opp.provider || opp.company || '').toLowerCase();
    const locLower = (opp.location || '').toLowerCase();
    const oppSkills = (opp.requirements || opp.requiredSkills || opp.tags || []).map(s => String(s).toLowerCase());
    const oppType = (opp.type || opp.category || '').toLowerCase();
    const isOppRemote = Boolean(opp.remote || locLower.includes('remote'));
    const oppExp = (Array.isArray(opp.experienceLevel) ? opp.experienceLevel.join(' ') : String(opp.experienceLevel || '')).toLowerCase();
    const isSeniorJob = /\b(?:senior|sr\.?|lead|principal|architect|manager|staff|head of)\b/i.test(titleLower) ||
                        /\b(?:5\+|6\+|7\+|8\+|10\+)\s*years?\b/i.test(descLower);
    const isEntryJob = /\b(?:intern(?:ship)?|fresher|junior|jr\.?|entry|trainee|graduate|associate)\b/i.test(titleLower) ||
                       oppExp === 'entry-level' ||
                       /\b0-1\s*years?\b/i.test(descLower) ||
                       /\b(?:fresher|freshers)\b/i.test(descLower);

    // ────────────────────────────────────────────────────────────
    // A. STRICT LOCATION MATCHING (Section 5)
    // ────────────────────────────────────────────────────────────
    let locationLabel = opp.location || (isOppRemote ? 'Remote' : 'Location not disclosed');
    let locationMatchCategory = isOppRemote ? 'Remote' : 'On-site';

    if (searchCity) {
      const isExactCity = locLower.includes(searchCity);

      if (isExactCity) {
        score += 50;
        locationMatchCategory = 'Exact City';
        locationLabel = `${opp.location}`;
        matchReasons.push(`✓ Location: ${opp.location}`);
      } else if (isOppRemote) {
        // Remote job can match if user allows or query has remote intent
        if (isRemoteQuery) {
          score += 40;
          locationMatchCategory = 'Remote';
          matchReasons.push(`✓ Remote: Work from anywhere`);
        } else {
          // Secondary match for physical search
          score += 15;
          locationMatchCategory = 'Remote';
          matchReasons.push(`✓ Remote friendly`);
        }
      } else {
        // Disqualify: Physical job is in another city/country (e.g. Leipzig, Berlin, London, etc.)
        continue;
      }
    } else if (isRemoteQuery) {
      if (isOppRemote) {
        score += 50;
        locationMatchCategory = 'Remote';
        matchReasons.push(`✓ 100% Remote`);
      } else {
        // Disqualify: On-site job cannot satisfy explicit remote requirement
        continue;
      }
    }

    // ────────────────────────────────────────────────────────────
    // B. ROLE MATCHING (Section 4)
    // ────────────────────────────────────────────────────────────
    let matchedRole = false;
    if (targetRoles.length > 0) {
      for (const role of targetRoles) {
        const roleLower = role.toLowerCase();
        const roleTokens = roleLower.split(' ');
        if (titleLower.includes(roleLower)) {
          score += 60;
          matchedRole = true;
          matchReasons.push(`✓ Role: ${role}`);
          break;
        } else if (roleTokens.every(tok => titleLower.includes(tok))) {
          score += 45;
          matchedRole = true;
          matchReasons.push(`✓ Role match: ${role}`);
          break;
        }
      }
    } else if (rawTokens.length > 0) {
      // General token matching on title
      let titleTokensMatched = 0;
      for (const tok of rawTokens) {
        if (matchWordBoundary(titleLower, tok)) {
          titleTokensMatched++;
          score += 35;
        }
      }
      if (titleTokensMatched > 0) {
        matchedRole = true;
      }
    }

    // ────────────────────────────────────────────────────────────
    // C. SKILLS MATCHING (Section 4)
    // ────────────────────────────────────────────────────────────
    let matchedSkillsCount = 0;
    if (targetSkills.length > 0) {
      for (const skill of targetSkills) {
        const sLower = skill.toLowerCase();
        
        // Exact boundary matching (special protection: Java != JavaScript)
        let skillHit = false;
        if (sLower === 'java') {
          skillHit = (/\bjava\b/i.test(titleLower) && !titleLower.includes('javascript')) ||
                     oppSkills.some(s => /\bjava\b/i.test(s) && !s.includes('javascript')) ||
                     (/\bjava\b/i.test(descLower) && !descLower.includes('javascript'));
        } else if (sLower === 'catering') {
          skillHit = matchWordBoundary(titleLower, 'catering') ||
                     matchWordBoundary(titleLower, 'catring') ||
                     matchWordBoundary(titleLower, 'caterer') ||
                     matchWordBoundary(titleLower, 'banquet') ||
                     oppSkills.some(s => matchWordBoundary(s, 'catering') || matchWordBoundary(s, 'banquet') || matchWordBoundary(s, 'catring')) ||
                     (matchWordBoundary(descLower, 'catering') && !isSeniorJob) ||
                     (matchWordBoundary(descLower, 'banquet') && !isSeniorJob);
        } else {
          skillHit = matchWordBoundary(titleLower, sLower) ||
                     oppSkills.some(s => matchWordBoundary(s, sLower)) ||
                     matchWordBoundary(descLower, sLower);
        }

        if (skillHit) {
          score += 35;
          matchedSkillsCount++;
          matchReasons.push(`✓ Skill: ${skill}`);
        }
      }
    }

    // Provider match bonus
    for (const tok of rawTokens) {
      if (matchWordBoundary(providerLower, tok)) {
        score += 25;
        matchReasons.push(`✓ Provider: ${opp.provider || opp.company}`);
        break;
      }
    }

    // ────────────────────────────────────────────────────────────
    // D. EXPERIENCE-LEVEL MATCHING & DISTINCTION (Section 6)
    // ────────────────────────────────────────────────────────────
    if (effectiveExperience) {
      const isFresherSearch = typeof effectiveExperience === 'string' 
        ? effectiveExperience.toLowerCase().includes('entry') || effectiveExperience.toLowerCase().includes('fresh')
        : (effectiveExperience.min === 0 && effectiveExperience.max <= 1);

      const isSingleYearSearch = typeof effectiveExperience === 'object' && effectiveExperience.min === 1 && effectiveExperience.max === 1;

      if (isFresherSearch || isSingleYearSearch) {
        if (isSeniorJob) {
          // Strictly exclude senior jobs when searching for fresher
          continue;
        } else if (isEntryJob) {
          score += 45;
          matchReasons.push(`✓ Experience: Fresher / Entry Level (0-1 yrs)`);
        } else {
          // Unspecified experience: small penalty compared to explicit entry jobs
          score += 5;
        }
      } else if (typeof effectiveExperience === 'string' && effectiveExperience.toLowerCase().includes('senior')) {
        if (isSeniorJob) {
          score += 45;
          matchReasons.push(`✓ Experience: Senior Level`);
        } else if (isEntryJob) {
          score -= 50;
        }
      }
    } else {
      // No explicit experience in query: if entry job, show badge
      if (isEntryJob) {
        matchReasons.push(`✓ Beginner / Entry-level friendly`);
      }
    }

    // ────────────────────────────────────────────────────────────
    // E. EMPLOYMENT TYPE MATCHING
    // ────────────────────────────────────────────────────────────
    if (isInternshipQuery) {
      if (oppType.includes('intern') || titleLower.includes('intern')) {
        score += 40;
        matchReasons.push(`✓ Type: Internship`);
      } else {
        score -= 20;
      }
    }
    if (isPartTimeQuery && (oppType.includes('part') || titleLower.includes('part'))) {
      score += 30;
      matchReasons.push(`✓ Type: Part-time`);
    }
    if (isFreelanceQuery && (oppType.includes('freelance') || oppType.includes('gig'))) {
      score += 30;
      matchReasons.push(`✓ Type: Freelance / Contract`);
    }

    // ────────────────────────────────────────────────────────────
    // CANDIDATE THRESHOLD: Require genuine query match
    // ────────────────────────────────────────────────────────────
    let matchedTokenCount = 0;
    if (rawTokens.length > 0) {
      for (const tok of rawTokens) {
        if (matchWordBoundary(titleLower, tok) || matchWordBoundary(descLower, tok) || matchWordBoundary(providerLower, tok) || oppSkills.some(s => matchWordBoundary(s, tok))) {
          matchedTokenCount++;
        }
      }
    }

    let hasMeaningfulMatch = false;
    if (!rawQuery) {
      hasMeaningfulMatch = true;
    } else if (subjectTokens.length > 0) {
      // User provided explicit subject keywords (e.g., catering, python, video editing)
      // Must match at least one subject token or target role/skill
      const matchesSubject = subjectTokens.some(tok => {
        const stemmed = stemWord(tok);
        return matchWordBoundary(titleLower, tok) || 
               matchWordBoundary(titleLower, stemmed) ||
               oppSkills.some(s => matchWordBoundary(s, tok) || matchWordBoundary(s, stemmed)) ||
               matchWordBoundary(providerLower, tok) ||
               (matchWordBoundary(descLower, tok) && !isSeniorJob);
      });
      hasMeaningfulMatch = matchesSubject || matchedRole || matchedSkillsCount > 0;
    } else if (targetRoles.length > 0 || targetSkills.length > 0) {
      // If role or skill was in search, must match at least one
      hasMeaningfulMatch = matchedRole || matchedSkillsCount > 0;
    } else if (searchCity) {
      hasMeaningfulMatch = locLower.includes(searchCity) && (matchedTokenCount > 0 || rawTokens.length === 0);
    } else {
      hasMeaningfulMatch = matchedTokenCount > 0;
    }

    if (!hasMeaningfulMatch) {
      continue; // No genuine query match, do not include
    }

    // ────────────────────────────────────────────────────────────
    // F. FRESHNESS SCORING (Section 7)
    // ────────────────────────────────────────────────────────────
    const postedDate = opp.postedAt || opp.createdAt;
    let freshnessLabel = 'Posted recently';
    if (postedDate) {
      const ageMs = Date.now() - new Date(postedDate).getTime();
      const ageDays = ageMs / (1000 * 3600 * 24);
      if (!isNaN(ageDays)) {
        if (ageDays <= 7) {
          score += 15;
          matchReasons.push(`✓ Freshness: Posted recently (< 7 days)`);
        } else if (ageDays <= 30) {
          score += 8;
        }
        freshnessLabel = formatFreshness(postedDate);
      }
    }

    if (opp.verified) {
      score += 10;
    }

    if (score > 0 && hasMeaningfulMatch) {
      // Normalize salary for UI
      const displaySalary = (opp.salary && opp.salary.trim()) || 
        (opp.compensation?.label && !opp.compensation.label.toLowerCase().includes('not disclosed') ? opp.compensation.label : 'Salary not disclosed');

      const finalUrl = opp.url || opp.sourceUrl;
      const finalCompany = opp.company || opp.provider || 'Company not disclosed';

      scored.push({
        ...opp,
        url: finalUrl,
        sourceUrl: finalUrl,
        company: finalCompany,
        provider: finalCompany,
        relevanceScore: score,
        matchScore: Math.min(100, Math.max(20, Math.round(score * 0.9))),
        matchLevel: score >= 75 ? 'Strong match' : (score >= 45 ? 'Good match' : 'Moderate match'),
        matchExplanation: matchReasons.length > 0 ? matchReasons : ['✓ Relevant keywords matched'],
        locationType: locationMatchCategory,
        salary: displaySalary,
        freshness: freshnessLabel,
        lastCheckedAt: opp.lastCheckedAt || new Date().toISOString()
      });
    }
  }

  // 3. Structured User Filters (Location, Remote, Category, Type, Paid Only, Min Pay, Freshness)
  let results = scored;

  if (remote === 'true' || remote === true) {
    results = results.filter(opp => opp.remote === true || (opp.location || '').toLowerCase().includes('remote'));
  } else if (remote === 'false' || remote === false) {
    results = results.filter(opp => opp.remote === false);
  }

  if (location && location !== 'all') {
    const locLower = location.toLowerCase().trim();
    if (locLower === 'remote') {
      results = results.filter(opp => opp.remote === true || (opp.location || '').toLowerCase().includes('remote'));
    } else {
      results = results.filter(opp => (opp.location || '').toLowerCase().includes(locLower));
    }
  }

  if (category && category !== 'all') {
    const catLower = category.toLowerCase().trim();
    results = results.filter(opp => (opp.category || '').toLowerCase() === catLower);
  }

  if (opportunityType && opportunityType !== 'all') {
    const typeLower = opportunityType.toLowerCase().trim();
    results = results.filter(opp => 
      (opp.type || '').toLowerCase().includes(typeLower) || 
      (opp.category || '').toLowerCase().includes(typeLower)
    );
  }

  if (paidOnly === true || paidOnly === 'true') {
    results = results.filter(opp => opp.compensation?.isPaid === true);
  }

  if (minPay !== undefined && minPay !== null && minPay !== '') {
    const minNum = Number(minPay);
    if (!isNaN(minNum)) {
      results = results.filter(opp => (opp.compensation?.min ?? opp.compensation?.max ?? 0) >= minNum);
    }
  }

  if (freshness && freshness !== 'any') {
    const now = Date.now();
    let thresholdHours = 24 * 30;
    if (freshness === 'today' || freshness === '24h') thresholdHours = 24;
    else if (freshness === '3days' || freshness === '3d') thresholdHours = 24 * 3;
    else if (freshness === '7days' || freshness === '7d') thresholdHours = 24 * 7;
    else if (freshness === '30days' || freshness === '30d') thresholdHours = 24 * 30;

    const cutoffMs = now - (thresholdHours * 3600 * 1000);
    results = results.filter(opp => {
      const itemDate = new Date(opp.postedAt || opp.createdAt).getTime();
      return !isNaN(itemDate) && itemDate >= cutoffMs;
    });
  }

  // 4. Sorting
  if (sort === 'newest') {
    results.sort((a, b) => new Date(b.postedAt || b.createdAt || 0).getTime() - new Date(a.postedAt || a.createdAt || 0).getTime());
  } else if (sort === 'compensation') {
    results.sort((a, b) => (b.compensation?.max || b.compensation?.min || 0) - (a.compensation?.max || a.compensation?.min || 0));
  } else {
    // Default: Relevance
    results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // Deduplicate opportunities by ID or identical title + company + location
  const seenOppKeys = new Set();
  const deduplicatedResults = [];
  for (const item of results) {
    const normKey = `${(item.title || '').toLowerCase()}|${(item.company || item.provider || '').toLowerCase()}|${(item.location || '').toLowerCase()}`;
    if (!seenOppKeys.has(item.id) && !seenOppKeys.has(normKey)) {
      seenOppKeys.add(item.id);
      seenOppKeys.add(normKey);
      deduplicatedResults.push(item);
    }
  }
  results = deduplicatedResults;

  // 5. Fallback Suggestions (Zero Fabrication - Section 10)
  const fallbackSuggestions = [
    'Try remote jobs to broaden results',
    'Try nearby locations (e.g. Bangalore, Hyderabad, Chennai)',
    'Try related roles (e.g. Software Engineer, Backend Developer)',
    'Broaden your experience range'
  ];

  let didYouMean = parsedAI.clarificationPrompt;
  if (!didYouMean && results.length === 0 && rawQuery) {
    const popularMatches = [
      'Java Developer', 'Python Developer', 'React Developer', 'Frontend Developer',
      'Data Analyst', 'Software Engineer', 'QA Tester'
    ];
    const hint = popularMatches.find(p => p.toLowerCase().includes(rawQuery.toLowerCase()) || rawQuery.toLowerCase().includes(p.toLowerCase().slice(0, 4)));
    if (hint) {
      didYouMean = `Did you mean opportunities for ${hint}?`;
    }
  }

  const total = results.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = results.slice(startIndex, startIndex + limitNum);

  return {
    query: rawQuery,
    searchMode,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasMore: startIndex + limitNum < total,
    filters: {
      role: parsedAI.role || [],
      skills: parsedAI.skills || [],
      location: parsedAI.location && parsedAI.location.length > 0 ? parsedAI.location : (effectiveLocation ? [effectiveLocation] : []),
      experience: effectiveExperience,
      remote: isRemoteQuery
    },
    parsedFilters: {
      skills: parsedAI.skills || [],
      location: effectiveLocation,
      isRemote: isRemoteQuery,
      workType: isInternshipQuery ? 'Internship' : isPartTimeQuery ? 'Part-time' : isFreelanceQuery ? 'Freelance' : null,
      experience: effectiveExperience
    },
    results: paginated,
    opportunities: paginated, // Backwards compatibility for existing UI components
    sourceStatus: getFeedStatus(),
    fallbackUsed: false,
    fallbackSuggestions: results.length === 0 ? fallbackSuggestions : [],
    didYouMean,
    lastUpdated: new Date().toISOString()
  };
}
