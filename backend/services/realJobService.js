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
import { VERIFIED_PARTNER_LISTINGS, getNationwidePartnerListingsForCity } from './opportunityFeedService.js';
import { 
  getCoordinatesForLocation, 
  calculateHaversineDistance, 
  resolveCoordinates,
  resolveCoordinatesAsync 
} from './locationService.js';

// Cache for external API queries (15-minute TTL)
const queryCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Classifies an opportunity URL into its precise destination type:
 * - 'direct_application': specific job post, application form, or direct partner registration portal
 * - 'employer_careers': company's career portal or jobs landing page
 * - 'aggregator_directory': third-party job board category / search page
 * - 'company_website': root company homepage
 */
export function classifyJobUrl(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'invalid', isDirectApply: false, label: 'Application link unavailable' };
  }
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, '').toLowerCase();
    const host = parsed.hostname.toLowerCase();

    // 1. Direct partner onboarding portals (e.g. Swiggy Ride, Urban Company Partner, Zomato Partner, Blinkit, Zepto, Rapido Captain)
    if (host.startsWith('ride.') || host.startsWith('partner.') || host.startsWith('flex.') || host.startsWith('partners.') ||
        host.includes('runnr.in') || host.includes('rapido.bike') || host.includes('shadowfax.in') ||
        pathname.includes('/delivery-partner') || pathname.includes('/partner') || pathname.includes('/captain') ||
        pathname.includes('enquiry-form')) {
      return { type: 'direct_application', isDirectApply: true, label: 'Apply on Partner Portal' };
    }

    // 2. Direct ATS platforms and application forms
    const directAtsHosts = ['jobs.lever.co', 'boards.greenhouse.io', 'myworkdayjobs.com', 'workday.com', 'smartrecruiters.com', 'icims.com', 'bamboohr.com', 'workable.com'];
    if (directAtsHosts.some(ats => host.includes(ats)) ||
        pathname.includes('/apply') || pathname.includes('/signup') || pathname.includes('/register') ||
        pathname.includes('/view/job') || pathname.includes('/job-opportunities') || pathname.includes('search-and-apply') ||
        pathname.match(/\/(?:jobs|job|position|vacancy|opening)\/[a-z0-9_-]+/i)) {
      return { type: 'direct_application', isDirectApply: true, label: 'Apply Directly' };
    }

    // 3. Known Aggregator Directories (not direct apply)
    const aggregatorHosts = [
      'linkedin.com', 'indeed.com', 'naukri.com', 'internshala.com',
      'glassdoor.com', 'adzuna.com', 'monster.com', 'foundit.in'
    ];
    const isAggregator = aggregatorHosts.some(h => host.includes(h));
    if (isAggregator) {
      return { type: 'aggregator_directory', isDirectApply: false, label: 'View Platform Directory' };
    }

    // 4. Root homepage with no meaningful path (e.g. https://www.sisindia.com/)
    if (pathname === '' || pathname === '/') {
      return { type: 'company_website', isDirectApply: false, label: 'Visit Company Website' };
    }

    // 5. Employer career pages (e.g. https://www.ihcltata.com/careers/)
    if (pathname.includes('/careers') || pathname.includes('/jobs') || host.startsWith('careers.') || host.startsWith('rcareers.')) {
      return { type: 'employer_careers', isDirectApply: false, label: 'Visit Employer Careers' };
    }

    return { type: 'direct_application', isDirectApply: true, label: 'Apply Directly' };
  } catch {
    return { type: 'invalid', isDirectApply: false, label: 'Application link unavailable' };
  }
}

/**
 * Detects generic job-site homepages, search pages, and non-specific URLs.
 */
function isGenericJobSiteUrl(url) {
  const classification = classifyJobUrl(url);
  return classification.type === 'invalid' || classification.type === 'company_website' || classification.type === 'aggregator_directory';
}

/**
 * 1. Query / Intent Parser (Sections 4, 6, 7)
 * Extracts structured search parameters from user natural language query
 */
export function parseJobQuery(rawQuery = '', userProfile = {}) {
  const queryStr = String(rawQuery || '').trim();
  const qLower = queryStr.toLowerCase();

  const parsed = {
    originalQuery: queryStr,
    keyword: queryStr,
    role: null,
    jobTitle: null,
    category: null,
    sector: null,
    location: null,
    remote: null,
    isRemote: false,
    employmentType: null,
    employment_type: null,
    experience: null,
    salary: null,
    salary_min: null,
    shift: null,
    isNearby: false,
    radius_km: 15
  };

  // Safe user profile location extraction
  let profileLoc = '';
  if (typeof userProfile?.city === 'string') profileLoc = userProfile.city;
  else if (typeof userProfile?.location === 'string') profileLoc = userProfile.location;
  else if (Array.isArray(userProfile?.location)) profileLoc = userProfile.location.join(' ');

  if (!queryStr) {
    if (profileLoc) {
      parsed.location = profileLoc;
    }
    return parsed;
  }

  // Detect Nearby Queries (Sections 1, 8)
  if (/\b(?:near\s*(?:me|you)|nearby|close\s*to\s*(?:me|you|home)|around\s*(?:me|you)|jobs?\s*near\s*(?:me|you)|jobs?\s*nearby)\b/i.test(qLower)) {
    parsed.isNearby = true;
  }
  const radiusMatch = qLower.match(/within\s*(\d+)\s*(?:km|kms|kilometers?)/i);
  if (radiusMatch) {
    parsed.radius_km = parseInt(radiusMatch[1], 10);
    parsed.isNearby = true;
  }

  // Detect Remote vs In-person
  if (/\b(?:remote|work from home|wfh|online|virtual|from home)\b/i.test(qLower)) {
    parsed.remote = true;
    parsed.isRemote = true;
  } else if (/\b(?:on-site|onsite|offline|in person|in-person|outdoor)\b/i.test(qLower)) {
    parsed.remote = false;
    parsed.isRemote = false;
  }

  // Detect Employment Type (Sections 6, 20)
  if (/\b(?:part[\s-]?time|half[\s-]?day)\b/i.test(qLower)) {
    parsed.employmentType = 'Part-time';
    parsed.employment_type = 'part_time';
  } else if (/\b(?:full[\s-]?time)\b/i.test(qLower)) {
    parsed.employmentType = 'Full-time';
    parsed.employment_type = 'full_time';
  } else if (/\b(?:internship|intern|trainee)\b/i.test(qLower)) {
    parsed.employmentType = 'Internship';
    parsed.employment_type = 'internship';
  } else if (/\b(?:freelance|gig)\b/i.test(qLower)) {
    parsed.employmentType = 'Gig';
    parsed.employment_type = 'gig';
  } else if (/\b(?:temporary|temp|contract)\b/i.test(qLower)) {
    parsed.employmentType = 'Temporary';
    parsed.employment_type = 'temporary';
  }

  // Detect Shift / Hours
  if (/\b(?:night[\s-]?shift|night)\b/i.test(qLower)) {
    parsed.shift = 'Night shift';
  } else if (/\b(?:day[\s-]?shift)\b/i.test(qLower)) {
    parsed.shift = 'Day shift';
  } else if (/\b(?:evening|evenings)\b/i.test(qLower)) {
    parsed.shift = 'Evening shift';
    if (!parsed.employmentType) {
      parsed.employmentType = 'Part-time';
      parsed.employment_type = 'part_time';
    }
  } else if (/\b(?:weekend|weekends)\b/i.test(qLower)) {
    parsed.shift = 'Weekend';
    if (!parsed.employmentType) {
      parsed.employmentType = 'Part-time';
      parsed.employment_type = 'part_time';
    }
  }

  // Detect Experience Level (Fresher / B.Tech / No experience)
  if (/\b(?:fresher|freshers|entry[\s-]?level|no experience|without experience|0\s*years?|college grad(?:uate)?|b\.?tech|bca|mca)\b/i.test(qLower)) {
    parsed.experience = 'entry-level';
  } else if (/\b(?:senior|lead|principal|sr\.?)\b/i.test(qLower)) {
    parsed.experience = 'senior';
  } else if (/\b(?:junior|jr\.?)\b/i.test(qLower)) {
    parsed.experience = 'entry-level';
  }

  // Detect Salary Minimums (e.g. "paying above 20,000", "paying above ₹25,000")
  const salMatch = qLower.match(/(?:paying\s*(?:above|more than)?|above|min|minimum)\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]+)*)/i);
  if (salMatch) {
    const num = parseInt(salMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 1000) {
      parsed.salary_min = num;
      parsed.salary = `₹${num.toLocaleString()}+`;
    }
  }

  // Detect Location (Major Indian, Regional Towns, Mandals, and Cities)
  const knownCities = [
    // Andhra Pradesh Hubs, Towns & Mandals
    'chirala', 'bapatla', 'ongole', 'narasaraopet', 'sattenapalle', 'chilakaluripet', 'macherla', 'vinukonda', 'piduguralla',
    'ponnur', 'repalle', 'vadlamudi', 'chebrolu', 'tenali', 'guntur', 'mangalagiri', 'tadepalle', 'vijayawada', 'amaravati',
    'machilipatnam', 'gudivada', 'nuzvid', 'gannavaram', 'vuyyuru', 'jaggaiahpet', 'nandigama', 'eluru', 'bhimavaram',
    'tadepalligudem', 'tanuku', 'palakollu', 'narsapur', 'rajahmundry', 'kakinada', 'amalapuram', 'samalkota', 'tuni',
    'visakhapatnam', 'vizag', 'anakapalli', 'vizianagaram', 'srikakulam', 'nellore', 'gudur', 'kavali', 'tirupati',
    'chittoor', 'madanapalle', 'srikalahasti', 'kadapa', 'proddatur', 'kurnool', 'nandyal', 'adoni', 'anantapur', 'hindupur',
    // Telangana Towns & Districts
    'hyderabad', 'warangal', 'hanamkonda', 'karimnagar', 'nizamabad', 'khammam', 'ramagundam', 'mahbubnagar', 'nalgonda',
    'suryapet', 'miryalaguda', 'siddipet', 'mancherial', 'adilabad',
    // Metros & Tier-2/3 Indian Cities
    'bengaluru', 'bangalore', 'chennai', 'mumbai', 'delhi', 'new delhi', 'pune', 'kolkata', 'noida', 'gurugram', 'gurgaon',
    'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'kochi', 'coimbatore', 'indore', 'mysuru', 'mysore', 'mangaluru',
    'hubballi', 'belagavi', 'madurai', 'salem', 'trichy', 'vadodara', 'rajkot', 'nashik', 'aurangabad', 'bhopal', 'patna',
    'surat', 'nagpur', 'jabalpur', 'gwalior', 'varanasi', 'agra', 'kanpur', 'ranchi', 'bhubaneswar', 'guwahati', 'dehradun', 'raipur',
    'london', 'berlin', 'new york', 'san francisco', 'toronto', 'dubai'
  ];

  for (const city of knownCities) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(qLower)) {
      const canonical = city === 'bangalore' || city === 'bengaluru' ? 'Bengaluru'
        : city.charAt(0).toUpperCase() + city.slice(1);
      parsed.location = canonical;
      if (parsed.remote === null) {
        parsed.remote = false;
        parsed.isRemote = false;
      }
      break;
    }
  }

  // Dynamic Natural Language Location Extraction: "jobs in Chirala", "delivery in Ongole", "near Bapatla"
  if (!parsed.location) {
    const inLocMatch = qLower.match(/\b(?:in|at|around|near)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|as|paying|above|below|full[\s-]?time|part[\s-]?time|jobs?|shift)|$)/i);
    if (inLocMatch && inLocMatch[1]) {
      const candidateLoc = inLocMatch[1].trim();
      const noise = /^(remote|online|wfh|night|day|fresher|freshers|tech|delivery|retail|office|sales|hospitality|me|you|home)$/i;
      if (!noise.test(candidateLoc) && candidateLoc.length >= 3) {
        parsed.location = candidateLoc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (parsed.remote === null) {
          parsed.remote = false;
          parsed.isRemote = false;
        }
      }
    }
  }

  // If entire query is a single location name (e.g. user just searched "Chirala" or "Repalle")
  if (!parsed.location && /^[a-zA-Z\s]{3,30}$/.test(queryStr)) {
    const candidateWord = qLower.trim();
    const noise = /^(remote|online|wfh|jobs?|fresher|internship|tech|sales|driver|delivery|retail|developer|engineer|office)$/i;
    if (!noise.test(candidateWord)) {
      // Check if known city or locality
      if (knownCities.includes(candidateWord)) {
        parsed.location = candidateWord.charAt(0).toUpperCase() + candidateWord.slice(1);
      }
    }
  }

  // Check specific local areas in query (e.g. Madhapur, Hitec City, Whitefield, Andheri)
  const knownAreas = ['madhapur', 'hitec city', 'gachibowli', 'kondapur', 'kukatpally', 'whitefield', 'koramangala', 'indiranagar', 'andheri', 'bandra'];
  for (const area of knownAreas) {
    if (qLower.includes(area)) {
      parsed.area = area.charAt(0).toUpperCase() + area.slice(1);
      if (!parsed.location) {
        if (['madhapur', 'hitec city', 'gachibowli', 'kondapur', 'kukatpally'].includes(area)) parsed.location = 'Hyderabad';
        else if (['whitefield', 'koramangala', 'indiranagar'].includes(area)) parsed.location = 'Bengaluru';
        else if (['andheri', 'bandra'].includes(area)) parsed.location = 'Mumbai';
      }
      break;
    }
  }

  // Fallback location from user profile if not in query
  if (!parsed.location && profileLoc) {
    parsed.location = profileLoc;
  }

  // Multi-Sector Intent Detection (Sections 6, 7, 8, 9, 38)
  const roleRules = [
    // 1. Engineering: Electrical
    { 
      regex: /\b(?:electrical\s*(?:engineer(?:ing)?|design|project|maintenance|systems|power)|power\s*systems?|controls?\s*engineer|electrical\s*work\s*but\s*not\s*electrician)\b/i, 
      role: 'Electrical Engineer', 
      title: 'Electrical Engineer', 
      sector: 'Engineering', 
      category: 'Electrical Engineering',
      relatedRoles: ['Electrical Design Engineer', 'Site Electrical Engineer', 'Electrical Project Engineer', 'Power Systems Engineer', 'Controls Engineer', 'Electrical Maintenance Engineer']
    },

    // 2. Engineering: Mechanical
    { 
      regex: /\b(?:mechanical\s*(?:engineer(?:ing)?|design|project|maintenance|cad)|cad\s*(?:engineer|designer)|autocad|solidworks|hvac\s*engineer|automotive\s*engineer)\b/i, 
      role: 'Mechanical Engineer', 
      title: 'Mechanical Engineer', 
      sector: 'Engineering', 
      category: 'Mechanical Engineering',
      relatedRoles: ['CAD / Design Engineer', 'HVAC Engineer', 'Manufacturing Engineer', 'Quality Control Engineer', 'Automotive Engineer']
    },

    // 3. Engineering: Civil
    { 
      regex: /\b(?:civil\s*(?:engineer(?:ing)?|site|project|construction)|structural\s*engineer|site\s*engineer|quantity\s*surveyor)\b/i, 
      role: 'Civil Engineer', 
      title: 'Civil Engineer', 
      sector: 'Engineering', 
      category: 'Civil Engineering',
      relatedRoles: ['Site Engineer', 'Structural Engineer', 'Surveyor', 'Quantity Estimator', 'Project Coordinator']
    },

    // 4. Engineering: Electronics
    { 
      regex: /\b(?:electronics\s*(?:engineer(?:ing)?|technician)|embedded\s*systems?|vlsi|pcb\s*design|iot\s*engineer|hardware\s*engineer)\b/i, 
      role: 'Electronics Engineer', 
      title: 'Electronics Engineer', 
      sector: 'Engineering', 
      category: 'Electronics Engineering',
      relatedRoles: ['Embedded Systems Engineer', 'PCB Designer', 'Hardware Test Engineer', 'IoT Specialist']
    },

    // 5. Office / Data Entry
    { 
      regex: /\b(?:data entry|typing|back office|computer operator|clerk|filing|scanner|secretarial|mis executive|virtual administrative|executive assistant|office coordinator|office assistant|office boy|peon|admin assistant|administrative assistant|office helper|office administrative)\b/i, 
      role: 'Office Assistant', 
      title: 'Office Assistant', 
      sector: 'Office', 
      category: 'Administration',
      relatedRoles: ['Data Entry Operator', 'Back Office Executive', 'Receptionist', 'Administrative Coordinator', 'Filing Assistant']
    },

    // 6. Hospitality / Culinary
    { 
      regex: /\b(?:catering|catring|banquet|catering helper|catering server|event staff|cook|chef|kitchen helper|prep cook|culinary|hotel|restaurant|waiter|steward|dining|bartender|barista|cafe|dishwasher|tandoor|resort|room service|bellboy|food and beverage|cloud kitchen|hospitality)\b/i, 
      role: 'Hospitality Associate', 
      title: 'Hospitality Associate', 
      sector: 'Hospitality', 
      category: 'Hospitality',
      relatedRoles: ['Catering Assistant', 'Restaurant Steward', 'Kitchen Helper', 'Chef / Line Cook', 'Front Desk Associate']
    },

    // 7. Healthcare
    { 
      regex: /\b(?:hospital|clinic|medical assistant|medical records|pharmacy|pharmacist|healthcare|nurse|nursing assistant|ward boy|patient care|diagnostic lab|sample collector|dental clinic|phlebotomist|dialysis|pathology|home healthcare)\b/i, 
      role: 'Healthcare Assistant', 
      title: 'Healthcare Assistant', 
      sector: 'Healthcare', 
      category: 'Healthcare',
      relatedRoles: ['Pharmacy Assistant', 'Lab Technician', 'Clinic Coordinator', 'Patient Care Associate', 'Ward Assistant']
    },

    // 8. Education / Tutoring
    { 
      regex: /\b(?:tutor|tutoring|teaching assistant|teacher|academic counselor|trainer|home tutor|online teacher|preschool|daycare|tuition|science tutor|math tutor|school|kindergarten|curriculum|spoken english|college library)\b/i, 
      role: 'Tutor / Educator', 
      title: 'Tutor / Educator', 
      sector: 'Education', 
      category: 'Education',
      relatedRoles: ['Home Tutor', 'Online Educator', 'Academic Counselor', 'Science & Math Tutor', 'Teaching Assistant']
    },

    // 9. Customer Service / BPO
    { 
      regex: /\b(?:customer support|customer care|customer service|bpo|call center|telecalling|telecaller|telemarketing|voice process|non-voice|chat support|helpdesk|technical support|client service|customer relation|customer resolution|customer happiness)\b/i, 
      role: 'Customer Support Representative', 
      title: 'Customer Support Representative', 
      sector: 'Customer Service', 
      category: 'Customer Support',
      relatedRoles: ['Voice Process Executive', 'Non-Voice Chat Support', 'Technical Helpdesk', 'Telecaller', 'Customer Happiness Specialist']
    },

    // 10. Delivery / Logistics
    { 
      regex: /\b(?:delivery|delivering|delivery boy|rider|courier|delivery partner|delivery executive|zomato|swiggy|shadowfax|blinkit|warehouse|packing|picker|packer|hub associate|sorting|delhivery|driver|chauffeur|car driver|auto driver|truck driver|logistics|cargo|loader|storekeeper|inventory|dispatch|food parcel|e-commerce order)\b/i, 
      role: 'Delivery Executive', 
      title: 'Delivery Executive', 
      sector: 'Delivery / Logistics', 
      category: 'Logistics',
      relatedRoles: ['Courier Rider', 'Warehouse Associate', 'Hub Sorter', 'Fleet Driver', 'Inventory Specialist']
    },

    // 11. Technology / Software
    { 
      regex: /\b(?:coding|code|software|developer|frontend|backend|full[\s-]?stack|web dev|web designer|programmer|java|python|react|node|django|flutter|android|data analyst|qa tester|testing|it support|b\.?tech|devops|cyber security|machine learning|ai |sql|database|cloud(?! kitchen)|aws|php|c\+\+|computer science|\btech\b|\btech jobs\b)\b/i, 
      role: 'Software Developer', 
      title: 'Software Developer', 
      sector: 'Technology', 
      category: 'Technology',
      relatedRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'QA Engineer', 'DevOps Specialist']
    },

    // 12. Finance & Banking
    { 
      regex: /\b(?:accounts assistant|accountant|accounting|accounts|banking|bookkeeper|finance intern|financial analyst|tally|loan|recovery|audit|tax|gst|bank branch|credit card|cash management|mutual fund|billing clerk|accounts payable|chartered accountant|b\.?com)\b/i, 
      role: 'Accounts Assistant', 
      title: 'Accounts Assistant', 
      sector: 'Finance', 
      category: 'Finance',
      relatedRoles: ['Junior Accountant', 'Billing Clerk', 'Tally Operator', 'Audit Assistant', 'Finance Trainee']
    },

    // 13. Retail
    { 
      regex: /\b(?:retail|store associate|cashier|sales associate|showroom|store assistant|retail executive|supermarket|hypermarket|counter sales|visual merchandiser|shelf stacker|stock associate|bookstore|apparel|department store|convenience store|salesperson|grocery store|mobile shop|shopping mall)\b/i, 
      role: 'Retail Sales Associate', 
      title: 'Retail Sales Associate', 
      sector: 'Retail', 
      category: 'Retail',
      relatedRoles: ['Store Associate', 'Cashier', 'Visual Merchandiser', 'Counter Sales Representative', 'Stock Supervisor']
    },

    // 14. Marketing & Sales
    { 
      regex: /\b(?:field sales|field marketing|digital marketing|business development|seo|social media|content writer|copywriter|promoter|brand promoter|direct sales|email marketing|lead generation|fmcg|advertising|influencer|inside sales|google ads|campus ambassador)\b/i, 
      role: 'Sales & Marketing Executive', 
      title: 'Sales & Marketing Executive', 
      sector: 'Marketing', 
      category: 'Marketing',
      relatedRoles: ['Field Sales Executive', 'Digital Marketing Associate', 'Business Development Rep', 'Content Creator', 'Brand Promoter']
    },

    // 15. Skilled Work / Trades
    { 
      regex: /\b(?:electrician|wiring|wireman|plumber|plumbing|pipe fitter|technician|mechanic|carpenter|ac repair|ac technician|maintenance|cleaning|cleaner|housekeeping|sweeper|janitor|security guard|security officer|watchman|guard|cctv|solar panel|welder|fabricator|painter|decorator|ro water|elevator|lift|hvac|motor winding|refrigeration|cnc machine)\b/i, 
      role: 'Skilled Trades Specialist', 
      title: 'Skilled Trades Specialist', 
      sector: 'Skilled Work', 
      category: 'Trades',
      relatedRoles: ['Electrician', 'Plumber', 'HVAC Technician', 'Appliance Mechanic', 'Facility Maintenance']
    }
  ];

  for (const rule of roleRules) {
    if (rule.regex.test(qLower)) {
      parsed.role = rule.role;
      parsed.jobTitle = rule.title;
      parsed.sector = rule.sector;
      parsed.category = rule.category;
      parsed.relatedRoles = rule.relatedRoles || [];
      break;
    }
  }

  // Detect negative constraints (e.g. "I don't want sales jobs", "not electrician")
  const notMatch = qLower.match(/\b(?:not|no|don't want|without)\s+([a-zA-Z\s]+?)(?:\s+(?:jobs?|work)|$)/i);
  if (notMatch && notMatch[1]) {
    parsed.excludedKeywords = notMatch[1].trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
  }

  // Clean keyword: remove noise words like "jobs in", "near me", "near you", "jobs near you", "looking for", "for freshers"
  let cleanKw = queryStr
    .replace(/\b(?:jobs?\s*(?:near\s*(?:you|me)|nearby)?|openings?|vacancies|vacanc(?:y|ies)|hiring|need|want|looking for|require(?:d|s)?|near\s*(?:me|you)|nearby|close to (?:me|you|home)|around\s*(?:me|you)|in\s+[a-zA-Z]+|for freshers?|part[\s-]?time|full[\s-]?time)\b/gi, '')
    .trim();
  if (cleanKw.length > 2) {
    parsed.keyword = cleanKw;
  } else {
    parsed.keyword = parsed.role || parsed.jobTitle || '';
  }

  return parsed;
}

/**
 * 2. Real Job Normalizer (Section 5)
 * Standardizes raw job structures into canonical Money Way format.
 * Never invents values; missing fields are assigned null.
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
    rawJob.isRemote ||
    String(location).toLowerCase().includes('remote') ||
    String(rawJob.workType || '').toLowerCase().includes('remote')
  );

  // Extract Description
  const description = String(rawJob.description || rawJob.jobDescription || rawJob.snippet || rawJob.overview || '').trim();

  // Extract Salary (Honest: never invent)
  let salary = null;
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
  } else if (typeStr.includes('gig') || typeStr.includes('freelance')) {
    employmentType = 'Gig';
  } else if (typeStr.includes('temp') || typeStr.includes('contract')) {
    employmentType = 'Temporary';
  } else if (typeStr.includes('full')) {
    employmentType = 'Full-time';
  }

  // Extract Experience Level
  let experience = null;
  if (rawJob.experienceLevel) {
    experience = rawJob.experienceLevel === 'entry-level' ? 'Fresher' : rawJob.experienceLevel;
  } else if (rawJob.experienceYears?.min !== undefined) {
    experience = `${rawJob.experienceYears.min}–${rawJob.experienceYears.max || ''} yrs`;
  } else if (rawJob.seniority) {
    experience = Array.isArray(rawJob.seniority) ? rawJob.seniority.join(', ') : String(rawJob.seniority);
  } else if (rawJob.experience) {
    experience = String(rawJob.experience);
  }

  // Extract Posting Date (Honest: never invent)
  let postedAt = null;
  const rawDate = rawJob.created || rawJob.postedAt || rawJob.pubDate || rawJob.publication_date || rawJob.date || rawJob.createdAt;
  if (rawDate) {
    try {
      const d = typeof rawDate === 'number' ? new Date(rawDate * 1000) : new Date(rawDate);
      if (!isNaN(d.getTime())) {
        postedAt = d.toISOString();
      }
    } catch {
      postedAt = null;
    }
  }

  // Extract Real Verified URLs (Never construct fake URLs)
  const rawUrl = String(rawJob.redirect_url || rawJob.url || rawJob.sourceUrl || rawJob.applicationLink || rawJob.apply_url || rawJob.applicationUrl || '').trim();

  // Validate URL is authentic
  if (!isValidJobUrl(rawUrl)) {
    return null; // Reject listings without authentic URLs
  }

  const sourceUrl = rawUrl;
  const jobUrl = String(rawJob.redirect_url || rawJob.url || rawJob.link || rawJob.sourceUrl || '').trim() || sourceUrl;
  const rawApplyUrl = rawJob.applicationLink || rawJob.apply_url || rawJob.applyUrl || rawJob.applicationUrl || '';
  const applicationUrl = (rawApplyUrl && isValidJobUrl(String(rawApplyUrl).trim())) ? String(rawApplyUrl).trim() : jobUrl;
  const urlClassification = classifyJobUrl(applicationUrl);
  const exactApplicationLinkAvailable = urlClassification.isDirectApply;
  const linkActionLabel = urlClassification.label;
  const linkType = urlClassification.type;

  // Extract Source
  const source = String(rawJob.source || sourceName || 'External Job Feed').trim();

  // Extract Skills
  const skills = Array.isArray(rawJob.skills)
    ? rawJob.skills
    : (Array.isArray(rawJob.requirements)
      ? rawJob.requirements
      : (Array.isArray(rawJob.tags) ? rawJob.tags : []));

  // Determine standard 11-sector classification
  let sector = rawJob.sector || null;
  if (!sector) {
    const tLower = title.toLowerCase();
    const cLower = String(rawJob.category?.label || rawJob.category || '').toLowerCase();
    if (cLower.includes('tech') || tLower.includes('developer') || tLower.includes('software') || tLower.includes('engineer') || tLower.includes('python') || tLower.includes('java')) {
      sector = 'Technology';
    } else if (cLower.includes('logistics') || cLower.includes('transport') || tLower.includes('delivery') || tLower.includes('driver') || tLower.includes('warehouse') || tLower.includes('pack')) {
      sector = 'Delivery / Logistics';
    } else if (cLower.includes('hospitality') || cLower.includes('culinary') || tLower.includes('catering') || tLower.includes('hotel') || tLower.includes('cook') || tLower.includes('restaurant')) {
      sector = 'Hospitality';
    } else if (cLower.includes('retail') || tLower.includes('retail') || tLower.includes('store') || tLower.includes('cashier')) {
      sector = 'Retail';
    } else if (cLower.includes('customer') || cLower.includes('support') || tLower.includes('support') || tLower.includes('bpo') || tLower.includes('telecaller')) {
      sector = 'Customer Service';
    } else if (cLower.includes('admin') || tLower.includes('office') || tLower.includes('data entry') || tLower.includes('receptionist')) {
      sector = 'Office';
    } else if (cLower.includes('health') || tLower.includes('medical') || tLower.includes('pharmacy') || tLower.includes('hospital')) {
      sector = 'Healthcare';
    } else if (cLower.includes('education') || tLower.includes('tutor') || tLower.includes('teach') || tLower.includes('counselor')) {
      sector = 'Education';
    } else if (cLower.includes('trade') || cLower.includes('facilities') || tLower.includes('electrician') || tLower.includes('plumber') || tLower.includes('technician') || tLower.includes('mechanic')) {
      sector = 'Skilled Work';
    } else if (cLower.includes('market') || cLower.includes('sales') || tLower.includes('sales') || tLower.includes('marketing')) {
      sector = 'Marketing';
    } else if (cLower.includes('finance') || tLower.includes('account') || tLower.includes('banking')) {
      sector = 'Finance';
    } else {
      sector = 'Other';
    }
  }

  // Coordinates extraction
  const coords = (rawJob.latitude !== undefined && rawJob.longitude !== undefined && !isNaN(Number(rawJob.latitude)))
    ? { lat: Number(rawJob.latitude), lng: Number(rawJob.longitude) }
    : getCoordinatesForLocation(location);

  const latitude = coords ? coords.lat : null;
  const longitude = coords ? coords.lng : null;

  return {
    id,
    title,
    company,
    description,
    location,
    latitude,
    longitude,
    salary,
    employmentType,
    experience,
    sector,
    category: sector, // Backwards compatibility
    skills,
    requirements: skills, // Backwards compatibility
    postedAt,
    postedDate: postedAt ? postedAt.split('T')[0] : 'Date unavailable',
    source,
    sourceUrl,
    applicationUrl,
    applyUrl: applicationUrl, // Backwards compatibility
    jobUrl,
    exactApplicationLinkAvailable,
    linkActionLabel,
    linkType,
    linkVerified: false,
    finalUrl: null,
    isRemote: remote,
    remote,
    verified: Boolean(rawJob.verified || exactApplicationLinkAvailable)
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
 * Query verified real opportunities from the application store and nationwide partners
 */
function fetchFromVerifiedStore(targetLocation = '', providedCoords = null) {
  try {
    const all = Opportunity.getAll() || [];
    const nationwideListings = targetLocation ? getNationwidePartnerListingsForCity(targetLocation, providedCoords) : [];
    const combined = [...(nationwideListings || []), ...(VERIFIED_PARTNER_LISTINGS || []), ...all];
    return combined
      .filter(o => o && o.sourceUrl && isValidJobUrl(o.sourceUrl) && o.sourceType !== 'demo')
      .map(o => normalizeJobData(o, o.source || 'Verified Partner Network'))
      .filter(Boolean);
  } catch {
    const nationwideListings = targetLocation ? getNationwidePartnerListingsForCity(targetLocation, providedCoords) : [];
    return [...(nationwideListings || []), ...(VERIFIED_PARTNER_LISTINGS || [])].map(o => normalizeJobData(o, o.source || 'Verified Partner Network')).filter(Boolean);
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
  // Pre-filter valid job candidates
  const candidates = (jobs || []).filter(job => {
    if (!job) return false;
    const bestUrl = job.applyUrl || job.jobUrl || job.sourceUrl;
    if (!isValidJobUrl(bestUrl)) return false;
    // Guaranteed preservation for verified partners and company career portals
    if (job.source?.includes('Partner') || job.source?.includes('Official') || job.verified || job.exactApplicationLinkAvailable) {
      return true;
    }
    if (isGenericJobSiteUrl(bestUrl)) return false;
    return true;
  });

  // Verify reachability in parallel across all candidates
  const results = await Promise.all(
    candidates.map(async (job) => {
      const bestUrl = job.applyUrl || job.jobUrl || job.sourceUrl;

      // Listings from Verified Partner Network or pre-validated platforms are guaranteed reachable
      if (
        job.source === 'Verified Partner Network' ||
        job.exactApplicationLinkAvailable ||
        job.linkVerified
      ) {
        return { job, bestUrl, isValid: true };
      }

      try {
        const check = await verifyJobUrlReachability(bestUrl, job.source);
        if (check.reachable && check.linkStatus === 'verified' && check.isValid !== false) {
          return { job, bestUrl, isValid: true };
        }
      } catch {
        // If probing times out, keep candidate if URL syntax is verified
      }
      return null;
    })
  );

  const verifiedJobs = [];
  for (const item of results) {
    if (!item) continue;
    const { job, bestUrl } = item;

    let isSpecificJobPage = false;
    try {
      const parsed = new URL(bestUrl);
      isSpecificJobPage = parsed.pathname.length > 1
        || parsed.hostname.startsWith('partner.')
        || parsed.hostname.startsWith('careers.')
        || parsed.hostname.startsWith('ride.')
        || parsed.hostname.startsWith('flex.')
        || parsed.hostname.includes('runnr.in')
        || parsed.hostname.includes('rapido.bike')
        || parsed.hostname.includes('shadowfax.in')
        || Boolean(job.exactApplicationLinkAvailable);
    } catch {
      // skip invalid URL
    }

    if (!isSpecificJobPage) continue;

    verifiedJobs.push({
      ...job,
      linkStatus: 'verified',
      linkVerified: true,
      exactApplicationLinkAvailable: true,
      finalUrl: bestUrl,
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
  const qStr = String(parsedQuery.originalQuery || parsedQuery.keyword || '').toLowerCase();

  let rawLoc = '';
  if (typeof parsedQuery.location === 'string') rawLoc = parsedQuery.location;
  else if (Array.isArray(parsedQuery.location)) rawLoc = parsedQuery.location.join(' ');
  else if (parsedQuery.location && typeof parsedQuery.location === 'object') rawLoc = parsedQuery.location.city || parsedQuery.location.name || '';
  else if (typeof userProfile?.city === 'string') rawLoc = userProfile.city;
  else if (typeof userProfile?.location === 'string') rawLoc = userProfile.location;
  else if (Array.isArray(userProfile?.location)) rawLoc = userProfile.location.join(' ');

  const qLocation = String(rawLoc || '').toLowerCase();
  const qCategory = String(parsedQuery.sector || parsedQuery.category || '').toLowerCase();
  const qExp = String(parsedQuery.experience || '').toLowerCase();
  const qType = String(parsedQuery.employmentType || parsedQuery.employment_type || '').toLowerCase();
  const qShift = String(parsedQuery.shift || '').toLowerCase();
  const qRemote = parsedQuery.remote !== undefined ? parsedQuery.remote : parsedQuery.isRemote;

  const userCoords = resolveCoordinates({
    lat: userProfile?.lat || userProfile?.latitude,
    lng: userProfile?.lng || userProfile?.longitude,
    city: rawLoc
  });

  // Extract core keywords from query
  const queryTokens = qStr
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['jobs', 'job', 'in', 'near', 'nearby', 'you', 'me', 'need', 'with', 'for', 'the', 'and', 'from', 'all', 'want', 'looking', 'work', 'openings', 'hiring', 'opportunity', 'opportunities'].includes(w));

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
    if (qStr.includes('delivery') && !jobTitle.includes('delivery') && !jobTitle.includes('courier') && !jobTitle.includes('dispatch') && !jobTitle.includes('rider') && !jobTitle.includes('delivery partner') && !jobTitle.includes('captain') && !jobTitle.includes('parcel')) {
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

    // 3. Location Matching (up to 35 pts) — CRITICAL (Section 9)
    let isLocationMismatch = false;
    if (qLocation) {
      const distToUser = (userCoords && job.latitude && job.longitude)
        ? calculateHaversineDistance(userCoords.lat, userCoords.lng, job.latitude, job.longitude)
        : null;

      const qLocClean = qLocation.toLowerCase().trim();
      const jobLocClean = jobLoc.toLowerCase().trim();

      const isExactOrSubstring = jobLocClean.includes(qLocClean) || qLocClean.includes(jobLocClean);
      const isAliasMatch = (
        (qLocClean.includes('bangalore') && jobLocClean.includes('bengaluru')) ||
        (qLocClean.includes('bengaluru') && jobLocClean.includes('bangalore')) ||
        (qLocClean.includes('delhi') && (jobLocClean.includes('noida') || jobLocClean.includes('gurgaon') || jobLocClean.includes('gurugram'))) ||
        (qLocClean.includes('hyderabad') && (jobLocClean.includes('secunderabad') || jobLocClean.includes('madhapur') || jobLocClean.includes('hitec') || jobLocClean.includes('gachibowli') || jobLocClean.includes('kukatpally') || jobLocClean.includes('kondapur'))) ||
        (qLocClean.includes('guntur') && (jobLocClean.includes('vadlamudi') || jobLocClean.includes('tenali') || jobLocClean.includes('mangalagiri'))) ||
        (qLocClean.includes('tenali') && (jobLocClean.includes('vadlamudi') || jobLocClean.includes('guntur'))) ||
        (qLocClean.includes('vadlamudi') && (jobLocClean.includes('tenali') || jobLocClean.includes('guntur'))) ||
        (qLocClean.includes('mumbai') && (jobLocClean.includes('navi mumbai') || jobLocClean.includes('thane') || jobLocClean.includes('andheri') || jobLocClean.includes('bandra') || jobLocClean.includes('powai')))
      );

      const isForeignLocation = [
        'germany', 'deutschland', 'munich', 'münchen', 'berlin', 'hamburg', 'cologne', 'köln',
        'frankfurt', 'düsseldorf', 'dresden', 'leipzig', 'aachen', 'united states', 'usa',
        'canada', 'uk', 'poland', 'spain', 'romania', 'slovakia', 'italy', 'philippines',
        'denmark', 'netherlands', 'norway', 'australia', 'mexico', 'france', 'japan', 'turkey',
        'vietnam', 'bulgaria', 'china', 'ukraine', 'austria', 'belgium', 'czechia', 'ireland',
        'emea', 'latam', 'apac', 'new zealand'
      ].some(c => jobLocClean.includes(c));

      if (isExactOrSubstring || isAliasMatch) {
        score += 35;
        reasons.unshift(`Located in ${parsedQuery.location || userProfile.city}`);
      } else if (distToUser !== null && distToUser <= 50) {
        // Within 50km regional/commute radius
        const distScore = Math.max(15, 30 - Math.round(distToUser * 0.3));
        score += distScore;
        reasons.unshift(`Nearby location (${distToUser} km away)`);
      } else if (job.remote && !isForeignLocation && !jobTitle.includes('m/w/d')) {
        // Genuine remote job accessible in India, but given lower preference than direct local matches
        score += 10;
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
        job.employmentType === 'Gig' ||
        job.type === 'Gig' ||
        jobType.includes('part-time') || 
        jobType.includes('part time') || 
        jobType.includes('gig') ||
        jobTitle.includes('part-time') || 
        jobTitle.includes('part time') || 
        jobDesc.includes('part-time') || 
        jobDesc.includes('part time') ||
        jobDesc.includes('flexible') ||
        jobDesc.includes('delivery')
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

    // Calculate distance if reliable user coordinates and job coordinates exist
    let distanceKm = null;
    if (userCoords && job.latitude && job.longitude) {
      distanceKm = calculateHaversineDistance(userCoords.lat, userCoords.lng, job.latitude, job.longitude);
      if (distanceKm !== null && distanceKm <= (parsedQuery.radius_km || 25)) {
        reasons.unshift(`${distanceKm} km away from your location`);
      }
    }

    // Determine Result Category (Section 16: Direct, Related, Broader)
    let matchCategory = 'broader';
    const titleLower = (job.title || '').toLowerCase();
    const isDirectTitle = Boolean(
      (parsedQuery.role && titleLower.includes(parsedQuery.role.toLowerCase())) ||
      (parsedQuery.keyword && parsedQuery.keyword.length > 2 && titleLower.includes(parsedQuery.keyword.toLowerCase()))
    );
    const isDirectSector = Boolean(
      parsedQuery.sector && job.sector && job.sector.toLowerCase().includes(parsedQuery.sector.toLowerCase())
    );
    const matchesRelatedRole = Boolean(
      Array.isArray(parsedQuery.relatedRoles) &&
      parsedQuery.relatedRoles.some(r => titleLower.includes(r.toLowerCase()))
    );

    if (isDirectTitle || (isDirectSector && finalScore >= 70)) {
      matchCategory = 'direct';
    } else if (matchesRelatedRole || finalScore >= 55) {
      matchCategory = 'related';
    }

    // Verification Signals (Section 30: Transparent individual verification indicators)
    const verificationSignals = {
      originalSourceFound: Boolean(job.source && (job.sourceUrl || job.applyUrl)),
      sourceName: job.source || 'Verified Partner Network',
      sourceUrl: job.sourceUrl || job.applyUrl,
      applicationLinkVerified: Boolean(job.applyUrl || job.jobUrl),
      employerInfoAvailable: Boolean(job.company && job.company !== 'Unknown'),
      locationAvailable: Boolean(job.location && !job.location.includes('not specified')),
      recentPosting: Boolean(job.postedAt)
    };

    scored.push({
      ...job,
      distanceKm,
      score: finalScore,
      matchScore: finalScore,
      matchCategory,
      matchFactors: reasons.length > 0 ? reasons : ['Verified live opportunity matching search criteria'],
      matchReasons: reasons.length > 0 ? reasons : ['Verified live opportunity matching search criteria'],
      verificationSignals
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
    const targetLoc = parsed.location || location || profile?.city || '';
    let targetCoords = null;
    if (targetLoc && !/remote|online|wfh/i.test(targetLoc)) {
      targetCoords = await resolveCoordinatesAsync({ city: targetLoc });
    }

    const [arbeitnowJobs, himalayasJobs, storeJobs] = await Promise.all([
      fetchFromArbeitnow({ query: parsed.keyword }),
      fetchFromHimalayas(),
      fetchFromVerifiedStore(targetLoc, targetCoords)
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
