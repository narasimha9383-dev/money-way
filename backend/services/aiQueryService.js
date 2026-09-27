// backend/services/aiQueryService.js
/**
 * AI Query Understanding Service (Sections 1, 2, 3, 8, 22)
 * Converts natural-language requests into validated structured search parameters.
 * Factual constraint extraction ONLY — never invents opportunities or facts.
 */

// Recognizable skill keywords mapped to canonical labels
const SKILL_KEYWORDS = {
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'java': 'Java',
  'python': 'Python',
  'react': 'React',
  'html': 'HTML/CSS',
  'css': 'HTML/CSS',
  'html/css': 'HTML/CSS',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'web development': 'Web development',
  'frontend': 'Web development',
  'coding': 'Programming',
  'programming': 'Programming',
  'video editing': 'Video Editing',
  'video editor': 'Video Editing',
  'premiere': 'Video Editing',
  'reels': 'Video Editing',
  'content creation': 'Content Creation',
  'graphic design': 'Graphic Design',
  'canva': 'Graphic Design',
  'photoshop': 'Graphic Design',
  'ui/ux': 'UI/UX',
  'figma': 'UI/UX',
  'writing': 'Writing',
  'content writing': 'Writing',
  'technical writing': 'Technical Writing',
  'copywriting': 'Writing',
  'tutor': 'Teaching',
  'tutoring': 'Teaching',
  'teaching': 'Teaching',
  'math': 'Mathematics',
  'mathematics': 'Mathematics',
  'science': 'Science',
  'stem': 'STEM',
  'translation': 'Translation',
  'data analysis': 'Data Analysis',
  'excel': 'Excel',
  'sql': 'SQL',
  'testing': 'Software Testing',
  'qa': 'Software Testing',
  'software testing': 'Software Testing',
  'user testing': 'User Testing',
  'photography': 'Photography',
  'photo': 'Photography',
  'tech repair': 'Tech Repair',
  'smartphone repair': 'Tech Repair',
  'electronics repair': 'Tech Repair',
  'delivery': 'Delivery',
  'logistics': 'Delivery',
  'pet care': 'Pet Care',
  'dog walking': 'Pet Care',
  'virtual assistant': 'Virtual Assistance',
  'social media': 'Social Media',
  // Music & Vocals
  'music': 'Music',
  'musician': 'Music',
  'singing': 'Singing',
  'singer': 'Singing',
  'vocal': 'Vocals',
  'vocals': 'Vocals',
  'guitar': 'Guitar',
  'guitarist': 'Guitar',
  'piano': 'Piano',
  'pianist': 'Piano',
  'violin': 'Music',
  'drums': 'Music',
  'voice': 'Voice Over',
  'voiceover': 'Voice Over',
  'voice over': 'Voice Over',
  'voice acting': 'Voice Acting',
  // Culinary & Food
  'cooking': 'Cooking',
  'cook': 'Cooking',
  'baking': 'Baking',
  'baker': 'Baking',
  'chef': 'Cooking',
  'food': 'Food Preparation',
  'pastry': 'Baking',
  'culinary': 'Cooking',
  'catering': 'Catering',
  'catring': 'Catering',
  'caterer': 'Catering',
  'caterers': 'Catering',
  'cattering': 'Catering',
  'banquet': 'Catering',
  'food service': 'Food Service',
  // Dance & Movement
  'dance': 'Dance',
  'dancing': 'Dance',
  'dancer': 'Dance',
  'choreography': 'Choreography',
  'choreographer': 'Choreography',
  'zumba': 'Dance',
  // Fitness & Wellness
  'fitness': 'Fitness',
  'yoga': 'Yoga',
  'workout': 'Fitness',
  'trainer': 'Personal Training',
  'personal trainer': 'Personal Training',
  'gym': 'Fitness',
  'pilates': 'Fitness',
  // Visual Arts & Drawing
  'drawing': 'Drawing',
  'draw': 'Drawing',
  'art': 'Art',
  'artist': 'Art',
  'painting': 'Painting',
  'painter': 'Painting',
  'sketching': 'Drawing',
  'illustration': 'Illustration',
  'illustrator': 'Illustration',
  // Intellectual & Strategy
  'chess': 'Chess',
  'gaming': 'Gaming',
  'esports': 'Gaming',
  // Crafts & Handiwork
  'crafts': 'Crafts',
  'crafting': 'Crafts',
  'pottery': 'Crafts',
  'handmade': 'Handmade',
  'calligraphy': 'Calligraphy',
  'diy': 'Crafts',
  // Storytelling & Writing
  'creative writing': 'Creative Writing',
  'storytelling': 'Storytelling',
  'scriptwriting': 'Scriptwriting',
  // Performing Arts
  'acting': 'Acting',
  'actor': 'Acting',
  'actress': 'Acting',
  'drama': 'Acting',
  'theatre': 'Acting',
  'anchor': 'Public Speaking',
  'emcee': 'Public Speaking',
  'host': 'Public Speaking',
  'public speaking': 'Public Speaking',
  // Plants & Gardening
  'gardening': 'Gardening',
  'plants': 'Gardening',
  'plant care': 'Gardening',
  // Finance & Accounts
  'accounting': 'Accounting',
  'accountant': 'Accounting',
  'bookkeeping': 'Bookkeeping',
  'bookkeeper': 'Bookkeeping',
  'finance': 'Finance',
  'tally': 'Accounting',
  'gst': 'Accounting',
  // Sports & Games
  'cricket': 'Cricket',
  'football': 'Sports Coaching',
  'badminton': 'Sports Coaching',
  'tennis': 'Sports Coaching',
  'athletics': 'Athletics',
  'referee': 'Sports Officiating',
  'umpire': 'Sports Officiating',
  'sports coach': 'Sports Coaching',
  'game testing': 'Game Testing',
  'game tester': 'Game Testing',
  // Physical Works, Trades & Maintenance
  'electrician': 'Electrical',
  'electrical': 'Electrical',
  'wiring': 'Electrical',
  'plumber': 'Plumbing',
  'plumbing': 'Plumbing',
  'hvac': 'HVAC',
  'air conditioning': 'HVAC',
  'chiller': 'HVAC',
  'welder': 'Welding',
  'welding': 'Welding',
  'carpenter': 'Carpentry',
  'carpentry': 'Carpentry',
  'mechanic': 'Automotive Mechanic',
  'automotive': 'Automotive Mechanic',
  'technician': 'Technical Maintenance',
  'construction': 'Construction Works',
  // Stage & Shows
  'sound engineer': 'Sound Engineering',
  'sound engineering': 'Sound Engineering',
  'audio engineer': 'Sound Engineering',
  'stage lighting': 'Stage Lighting',
  'lighting technician': 'Stage Lighting',
  'rigging': 'Stage Rigging',
  'event host': 'Event Hosting',
  // Hardware & Networking
  'hardware': 'Hardware Repair',
  'hardware repair': 'Hardware Repair',
  'cctv': 'CCTV & Security',
  'networking': 'Networking',
  'soldering': 'Electronics',
  // Healthcare & Wellness
  'physiotherapy': 'Physiotherapy',
  'physiotherapist': 'Physiotherapy',
  'rehabilitation': 'Rehabilitation',
  'elder care': 'Elder Care',
  // Logistics & Operations
  'warehouse': 'Warehouse Ops',
  'dispatch': 'Dispatch Operations',
  'inventory': 'Inventory Management',
  'fleet': 'Fleet Operations'
};

// Known cities and localities for location-aware queries
const KNOWN_CITIES = [
  'bangalore', 'bengaluru', 'mumbai', 'delhi', 'new delhi', 'hyderabad', 
  'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur', 'gurgaon', 'gurugram',
  'noida', 'indore', 'chandigarh', 'kochi', 'coimbatore'
];

const KNOWN_LOCALITIES = [
  'indiranagar', 'koramangala', 'whitefield', 'hsr layout', 'jayanagar',
  'andheri', 'bandra', 'powai', 'borivali', 'south delhi', 'connaught place',
  'hitec city', 'gachibowli', 'madhapur', 'wakad', 'baner', 'kothrud',
  'velachery', 'anna nagar', 't nagar', 'salt lake', 'park street'
];

/**
 * Main AI Query Parser
 * Transforms natural-language user requests into validated structured search parameters.
 * Extracts: role, skills, location, experience, remote.
 * Factual constraint extraction ONLY — never invents opportunities or facts.
 */
export function parseAIQuery(rawQuery = '', userProfile = null) {
  const query = (rawQuery || '').trim();
  const qLower = query.toLowerCase();

  const structured = {
    originalQuery: query,
    mode: 'Standard', // 'Standard' or 'AI'
    role: [],
    skills: [],
    location: [],
    locationDetails: {
      city: null,
      area: null,
      radiusKm: null
    },
    experience: null, // 'entry-level' | { min, max } | 'mid-level' | 'senior'
    remote: false,
    timeHours: null,
    budget: null,
    workPreference: null, // 'Online', 'Offline', 'Hybrid', 'Both'
    isNearbyIntent: false,
    equipment: [],
    incomeGoal: null,
    serviceCategory: null,
    confidence: 'high',
    clarificationPrompt: null
  };

  if (!query) {
    return structured;
  }

  // 1. Role & Associated Skills Recognition
  const roleRecognizers = [
    {
      regex: /\bjava\s+(?:backend\s+)?(?:software\s+)?(?:developer|engineer|dev|programmer)\b/i,
      role: 'Java Developer',
      skills: ['Java']
    },
    {
      regex: /\bpython\s+(?:software\s+)?(?:developer|engineer|dev|programmer|jobs?)\b/i,
      role: 'Python Developer',
      skills: ['Python']
    },
    {
      regex: /\b(?:frontend|front-end|front\s+end)\s+(?:web\s+)?(?:software\s+)?(?:developer|engineer|jobs?|dev|roles?)\b/i,
      role: 'Frontend Developer',
      skills: ['HTML', 'CSS', 'JavaScript', 'React']
    },
    {
      regex: /\breact(?:\.js)?\s+(?:frontend\s+)?(?:developer|engineer|dev|jobs?)\b/i,
      role: 'React Developer',
      skills: ['React']
    },
    {
      regex: /\b(?:backend|back-end|back\s+end)\s+(?:software\s+)?(?:developer|engineer|dev)\b/i,
      role: 'Backend Developer',
      skills: []
    },
    {
      regex: /\b(?:fullstack|full-stack|full\s+stack)\s+(?:software\s+)?(?:developer|engineer|dev)\b/i,
      role: 'Fullstack Developer',
      skills: []
    },
    {
      regex: /\bdata\s+analyst(?:ics)?\b/i,
      role: 'Data Analyst',
      skills: ['Data Analysis']
    },
    {
      regex: /\bdata\s+scientist\b/i,
      role: 'Data Scientist',
      skills: ['Data Science']
    },
    {
      regex: /\b(?:qa|quality\s+assurance)\s+(?:engineer|tester|analyst)\b|\bsoftware\s+tester\b/i,
      role: 'QA Engineer',
      skills: ['Software Testing']
    },
    {
      regex: /\b(?:ui\/ux|ui\s+ux|product)\s+designer\b/i,
      role: 'UI/UX Designer',
      skills: ['UI/UX']
    },
    {
      regex: /\bgraphic\s+designer\b/i,
      role: 'Graphic Designer',
      skills: ['Graphic Design']
    },
    {
      regex: /\b(?:technical|content)\s+writer\b/i,
      role: 'Technical Writer',
      skills: ['Technical Writing']
    },
    {
      regex: /\bsoftware\s+(?:engineer|developer|sde)\b/i,
      role: 'Software Engineer',
      skills: []
    },
    {
      regex: /\b(?:catering|catring|banquet)\s+(?:assistant|server|crew|staff|worker|associate|helper)?\b|\b(?:caterer|caterers|banquet\s+server)\b/i,
      role: 'Catering Associate',
      skills: ['Catering']
    }
  ];

  for (const r of roleRecognizers) {
    if (r.regex.test(qLower)) {
      if (!structured.role.includes(r.role)) {
        structured.role.push(r.role);
      }
      for (const s of r.skills) {
        if (!structured.skills.includes(s)) {
          structured.skills.push(s);
        }
      }
    }
  }

  // 2. Explicit Skill Extraction (Conservative)
  for (const [key, canonical] of Object.entries(SKILL_KEYWORDS)) {
    if (key === 'java' && qLower.includes('javascript') && !/\bjava\b/.test(qLower)) {
      continue;
    }
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(qLower)) {
      if (!structured.skills.includes(canonical)) {
        structured.skills.push(canonical);
      }
    }
  }

  // 3. Experience Matching & Distinction (Fresher vs 0-1 years vs Senior)
  const rangeYearMatch = qLower.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*years?(?:\s+of)?(?:\s+experience)?/i);
  const singleYearMatch = qLower.match(/(?:someone\s+with\s+|with\s+)?(\d+)\s*years?(?:\s+of)?(?:\s+experience)?/i);

  if (rangeYearMatch) {
    structured.experience = {
      min: parseInt(rangeYearMatch[1], 10),
      max: parseInt(rangeYearMatch[2], 10)
    };
  } else if (singleYearMatch) {
    structured.experience = {
      min: parseInt(singleYearMatch[1], 10),
      max: parseInt(singleYearMatch[1], 10)
    };
  } else if (/\b(?:fresher|freshers|fresh|entry-level|entry\s+level|college\s+grad(?:uate)?|graduates?|trainee|no\s+experience|0\s*years?)\b/i.test(qLower)) {
    structured.experience = 'entry-level';
  } else if (/\b(?:junior|jr\.?|associate)\b/i.test(qLower)) {
    structured.experience = 'entry-level';
  } else if (/\b(?:mid-level|mid\s+level|intermediate)\b/i.test(qLower)) {
    structured.experience = 'mid-level';
  } else if (/\b(?:senior|sr\.?|lead|principal|architect|manager|staff)\b/i.test(qLower)) {
    structured.experience = 'senior';
  }

  // 4. Remote / Work Preference
  const remoteKeywords = /\b(?:from home|work from home|remote|online|indoors?|at home|virtual|wfh)\b/i;
  const localKeywords = /\b(?:offline|local|outside|outdoor|in-person|in person|nearby|neighborhood|on-site|onsite)\b/i;

  const hasRemote = remoteKeywords.test(qLower);
  const hasLocal = localKeywords.test(qLower);

  if (hasRemote && hasLocal) {
    structured.workPreference = 'Hybrid';
    structured.remote = false;
  } else if (hasRemote) {
    structured.workPreference = 'Online';
    structured.remote = true;
  } else if (hasLocal) {
    structured.workPreference = 'Offline';
    structured.remote = false;
    structured.isNearbyIntent = true;
  }

  // 5. Location Intent & City / Locality extraction
  for (const city of KNOWN_CITIES) {
    const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cityRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (cityRegex.test(qLower)) {
      const canonicalCity = city === 'bengaluru' || city === 'bangalore' 
        ? 'Bangalore' 
        : city.charAt(0).toUpperCase() + city.slice(1);
      
      if (!structured.location.includes(canonicalCity)) {
        structured.location.push(canonicalCity);
      }
      structured.locationDetails.city = canonicalCity;
      structured.isNearbyIntent = true;
      break;
    }
  }

  for (const area of KNOWN_LOCALITIES) {
    const escaped = area.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const areaRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (areaRegex.test(qLower)) {
      const canonicalArea = area.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      structured.locationDetails.area = canonicalArea;
      structured.isNearbyIntent = true;
      break;
    }
  }

  // If a physical city is mentioned without explicit remote keywords, remote defaults to false
  if (structured.location.length > 0 && !hasRemote) {
    structured.remote = false;
  }

  // Radius extraction: "within 5km", "under 10 km", "5 km radius"
  const radiusMatch = qLower.match(/(?:within|under|in)?\s*(\d+)\s*(?:km|kms|kilometers?)\b/i);
  if (radiusMatch) {
    structured.locationDetails.radiusKm = parseInt(radiusMatch[1], 10);
    structured.isNearbyIntent = true;
  } else if (/\bnear me\b|\bnearby\b|\bclose by\b/i.test(qLower)) {
    structured.isNearbyIntent = true;
    structured.locationDetails.radiusKm = 10;
  }

  // 6. Time Extraction: "2 hours", "1-2 hours/day", "30 mins", "night", "weekends"
  const hourMatch = qLower.match(/(\d+(?:\.\d+)?)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|h)\b/i);
  if (hourMatch) {
    structured.timeHours = parseFloat(hourMatch[2] || hourMatch[1]);
  } else if (/\b(?:30|45)\s*mins?\b|\bhalf an hour\b/i.test(qLower)) {
    structured.timeHours = 0.75;
  }

  if (/\b(?:at night|night|evenings?)\b/i.test(qLower)) {
    structured.availability = 'Evening / Night';
  } else if (/\b(?:weekends?|saturday|sunday)\b/i.test(qLower)) {
    structured.availability = 'Weekends Only';
  }

  // 7. Budget Extraction: "₹0", "0 investment", "zero capital", "under ₹500"
  if (/\b(?:₹\s*0|0\s*investment|0\s*budget|0\s*capital|zero\s*investment|zero\s*capital|zero\s*cost|free\s*to\s*start|no\s*money|without\s*money|\b0\b)\b/i.test(qLower)) {
    structured.budget = 0;
  } else {
    const underBudget = qLower.match(/under\s*(?:₹|inr|rs\.?)?\s*(\d+)/i);
    if (underBudget) {
      structured.budget = parseInt(underBudget[1], 10);
    }
  }

  // 8. Equipment & Resources
  if (/\b(?:laptop|computer|pc|desktop)\b/i.test(qLower)) {
    structured.equipment.push('Laptop');
  }
  if (/\b(?:phone|smartphone|mobile)\b/i.test(qLower)) {
    structured.equipment.push('Smartphone');
  }
  if (/\b(?:bike|vehicle|scooter|motorcycle|car)\b/i.test(qLower)) {
    structured.equipment.push('Vehicle');
  }
  if (/\b(?:camera|dslr)\b/i.test(qLower)) {
    structured.equipment.push('Camera');
  }

  // 9. Service Category Intent
  if (/\b(?:tutor|tutoring|teach|coaching|classes)\b/i.test(qLower)) {
    structured.serviceCategory = 'Local Tutoring';
  } else if (/\b(?:repair|fix|setup|installation|hardware)\b/i.test(qLower)) {
    structured.serviceCategory = 'Repair & Tech Support';
  } else if (/\b(?:photo|photography|portrait|shoot|event photo)\b/i.test(qLower)) {
    structured.serviceCategory = 'Photography & Media';
  } else if (/\b(?:delivery|courier|porter|logistics)\b/i.test(qLower)) {
    structured.serviceCategory = 'Delivery & Logistics';
  } else if (/\b(?:pet|dog|cat|walking|pet sit)\b/i.test(qLower)) {
    structured.serviceCategory = 'Pet Care Services';
  }

  // 10. Clarification / Confidence Check
  if (structured.skills.length === 0 && structured.role.length === 0 && !structured.serviceCategory && !structured.budget && !structured.timeHours && structured.location.length === 0) {
    const commonTopics = [
      { trigger: ['jav', 'jva', 'spring'], suggest: 'Java' },
      { trigger: ['py', 'pythn', 'django'], suggest: 'Python' },
      { trigger: ['web', 'site', 'frontend', 'html'], suggest: 'Web Development' },
      { trigger: ['tutr', 'teac', 'maths'], suggest: 'Tutoring' },
      { trigger: ['vid', 'edit', 'film'], suggest: 'Video Editing' },
      { trigger: ['writ', 'blog', 'article'], suggest: 'Technical Writing' },
      { trigger: ['design', 'graphic', 'logo'], suggest: 'Graphic Design' },
      { trigger: ['local', 'near', 'offline'], suggest: 'Local & Offline Services' }
    ];

    const match = commonTopics.find(t => t.trigger.some(tr => qLower.includes(tr)));
    if (match) {
      structured.confidence = 'medium';
      structured.clarificationPrompt = `Did you mean opportunities related to ${match.suggest}?`;
    } else {
      structured.confidence = 'low';
    }
  }

  // 11. Augment with user profile if profile is provided and completed
  if (userProfile && userProfile.isProfileCompleted) {
    if (structured.budget === null && userProfile.budget !== undefined) {
      structured.budget = typeof userProfile.budget === 'number' 
        ? userProfile.budget 
        : userProfile.budget === '₹0' ? 0 : 2000;
    }
    if (structured.workPreference === null && userProfile.location) {
      const locStr = Array.isArray(userProfile.location) ? userProfile.location.join(' ') : String(userProfile.location);
      if (locStr.includes('Online') || locStr.includes('Remote')) {
        structured.workPreference = 'Online';
      } else if (locStr.includes('Local') || locStr.includes('Outside')) {
        structured.workPreference = 'Offline';
      }
    }
    if (structured.skills.length === 0 && Array.isArray(userProfile.skills) && userProfile.skills.length > 0) {
      const validSkills = userProfile.skills.filter(s => !s.includes("don't have"));
      if (validSkills.length > 0) {
        structured.profileSkillsFallback = validSkills;
      }
    }
  }

  return structured;
}
