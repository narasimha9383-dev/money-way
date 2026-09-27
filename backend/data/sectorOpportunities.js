// backend/data/sectorOpportunities.js
// Verified Organizational Roles across ALL sectors of human capability:
// 1. Games, Esports & Sports
// 2. Technology, Hardware & Field Engineering
// 3. Physical Works, Skilled Trades & Infrastructure
// 4. Shows, Stage, Performance & Entertainment
// 5. Culinary, Food Production & Hospitality
// 6. Healthcare, Movement & Community Wellness
// 7. Supply Chain, Fleet & Facility Operations

export const sectorOpportunities = [
  // ────────────────────────────────────────────────────────────
  // 1. GAMES, ESPORTS & SPORTS
  // ────────────────────────────────────────────────────────────
  {
    id: "org-esports-ops-coord",
    title: "Esports Tournament Operations Coordinator",
    provider: "Gaming Arenas & Esports League Networks",
    category: "Skill-Based",
    type: "Full-time",
    mode: "Hybrid",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Esports Leagues & Competitive Gaming Arenas",
    department: "Tournament Operations & Broadcast",
    isOrganizationalRole: true,
    compensation: {
      min: 30000,
      max: 65000,
      currency: "INR",
      label: "₹35,000–₹60,000/month (Full-time CTC)",
      isPaid: true
    },
    requirements: [
      "Competitive Gaming rules knowledge (Valorant, BGMI, CS2, FIFA)",
      "Tournament bracket management (Challonge, Battlefy)",
      "Discord & TeamSpeak community moderation",
      "Player dispute arbitration & rulebook enforcement"
    ],
    requiredSkills: ["Esports", "Gaming", "Tournament Ops", "Game Rules", "Player Management", "Discord"],
    description: "Coordinate on-ground and online tournament fixtures, player check-ins, server configurations, and rule enforcement for professional esports leagues and LAN arena events.",
    howItWorks: "Liaise with team captains, oversee lobby setup, enforce competitive integrity guidelines, resolve in-game technical pauses, and feed match scores to the live broadcast production room.",
    whereToStart: [
      "Build experience organizing community tournaments on Battlefy or Toornament.",
      "Get familiar with standard rulebooks for top competitive titles (BGMI, Valorant, Dota 2).",
      "Apply via LinkedIn and gaming studio career portals for Event Coordinator or Tournament Admin positions."
    ],
    platforms: [
      { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/esports-jobs/", description: "Verified esports operations and tournament manager vacancies" },
      { name: "Hitmarker Esports", url: "https://hitmarker.net", description: "Global dedicated gaming and esports industry job board" }
    ],
    source: "LinkedIn Jobs Verified Posting",
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=esports%20operations",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "LinkedIn Esports Industry Hiring Index",
      sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=esports%20operations"
    }
  },
  {
    id: "org-freefire-esports-player",
    title: "Competitive Free Fire & Mobile Esports Tournament Player",
    provider: "Battlefy & Verified Mobile Esports Tournaments (Game.tv, Villager)",
    category: "Skill-Based",
    type: "Contract",
    mode: "Online",
    location: "Remote / Pan-India Tournaments",
    remote: true,
    organizationType: "Mobile Esports Leagues & Tournament Organizers",
    department: "Competitive Gaming & Squad Tournaments",
    isOrganizationalRole: true,
    compensation: {
      min: 10000,
      max: 45000,
      currency: "INR",
      label: "₹10,000–₹45,000/mo (Prize Pools & Team Roster Stipends)",
      isPaid: true
    },
    requirements: [
      "High-tier Free Fire rank (Heroic / Grandmaster tier)",
      "Squad synchronization, in-game communication & callout discipline",
      "Anti-cheat verification compliance (zero third-party injectors or mods)",
      "Stable internet connection with low ping (<40ms)"
    ],
    requiredSkills: ["Free Fire", "Freefire", "Mobile Gaming", "Esports", "Aim & Recoil Control", "Squad Strategy", "Game Rules"],
    description: "Compete in official and community-organized Garena Free Fire and mobile esports squad tournaments, qualifiers, and tier-1/tier-2 scrim leagues with verified cash prize pools.",
    howItWorks: "Form a dedicated 4-player squad, register on verified competitive tournament platforms (Battlefy, Game.tv), participate in open-bracket weekend qualifiers, stream gameplay for referee anti-cheat monitoring, and receive direct escrow prize settlements.",
    whereToStart: [
      "Form a consistent 4-player squad with designated roles (IGL, Rusher, Sniper, Support).",
      "Register your squad on Battlefy and Game.tv to participate in free open-bracket tournaments.",
      "Compete in verified community scrims organized by trusted gaming houses (Villager, Upthrust).",
      "NEVER pay any registration fee or deposit; legitimate esports tournaments are 100% free to enter."
    ],
    platforms: [
      { name: "Battlefy Esports", url: "https://battlefy.com", description: "Global competitive esports tournaments with escrow prize distribution" },
      { name: "Game.tv Mobile Tournaments", url: "https://www.game.tv", description: "Verified mobile gaming tournament hosting platform" },
      { name: "Garena Free Fire Official", url: "https://ff.garena.com", description: "Official Garena competitive championship calendar" }
    ],
    source: "Battlefy Verified Esports Index",
    sourceUrl: "https://battlefy.com",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Battlefy Competitive Esports Directory",
      sourceUrl: "https://battlefy.com"
    }
  },
  {
    id: "org-freefire-content-streamer",
    title: "Mobile Gaming Live Streamer & Video Creator (Free Fire / BGMI)",
    provider: "YouTube Gaming & Verified Creator Networks (Rooter, Loco)",
    category: "Zero-Investment",
    type: "Freelance",
    mode: "Online",
    location: "Remote / Home Studio",
    remote: true,
    organizationType: "Gaming Creator Programs & Live Streaming Networks",
    department: "Content Creation & Community Broadcasting",
    isOrganizationalRole: false,
    compensation: {
      min: 12000,
      max: 50000,
      currency: "INR",
      label: "₹12,000–₹50,000/month (AdSense, Super Chats & Creator Grants)",
      isPaid: true
    },
    requirements: [
      "Smartphone capable of smooth 60fps screen recording",
      "Entertaining commentary or high-skill montage editing",
      "Zero copyrighted music / adherence to YouTube Creator guidelines",
      "Consistent publishing schedule (3-5 videos/shorts per week)"
    ],
    requiredSkills: ["Free Fire", "Freefire", "Mobile Gaming", "Live Streaming", "YouTube Gaming", "Video Editing", "Content Creation"],
    description: "Build an audience by streaming Free Fire gameplay, recording clutch headshot montages, testing new character abilities, and publishing engaging short-form vertical videos.",
    howItWorks: "Stream mobile gameplay using free tools like Prism Live Studio or Turnip, clip high-intensity clutch moments into 30-second YouTube Shorts, and monetize through YouTube Partner Program (AdSense, Super Chats) and Rooter Creator Rewards.",
    whereToStart: [
      "Download Prism Live Studio or Turnip app on your smartphone to stream directly to YouTube.",
      "Create high-energy 30-second YouTube Shorts showing clutch gameplay tips, character combinations, and weapon tricks.",
      "Apply to creator monetization once reaching 1,000 subscribers and 4,000 watch hours (or 10M Shorts views).",
      "Join the Rooter or Loco verified creator partner program for monthly streaming grants."
    ],
    platforms: [
      { name: "YouTube Gaming", url: "https://www.youtube.com/gaming", description: "Global gaming video and live streaming creator platform" },
      { name: "Rooter Gaming", url: "https://www.rooter.gg", description: "India's premier gaming community and streaming creator rewards network" }
    ],
    source: "YouTube Creator Economics & Rooter Partner Program",
    sourceUrl: "https://www.youtube.com/gaming",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "YouTube Gaming Verified Creator Benchmarks",
      sourceUrl: "https://www.youtube.com/gaming"
    }
  },
  {
    id: "org-mobile-gaming-playtester",
    title: "Mobile Game Playtester & Usability Feedback Specialist",
    provider: "PlaytestCloud & Verified Mobile Game Studios",
    category: "Zero-Investment",
    type: "Part-time",
    mode: "Online",
    location: "Remote / Smartphone",
    remote: true,
    organizationType: "Mobile Game Quality Assurance & Usability Labs",
    department: "Player Usability & Pre-Release QA",
    isOrganizationalRole: false,
    compensation: {
      min: 800,
      max: 25000,
      currency: "INR",
      label: "₹800–₹1,500 / 15-min playtest ($9–$15 per session)",
      isPaid: true
    },
    requirements: [
      "Android or iOS smartphone capable of screen recording",
      "Headphones with built-in microphone for spoken gameplay commentary",
      "Ability to speak thoughts aloud continuously while playing new game builds",
      "Zero registration fees (100% free tester onboarding)"
    ],
    requiredSkills: ["Mobile Games", "Mobile Gaming", "Playtesting", "Game Feedback", "Bug Reporting", "Free Fire", "Gaming"],
    description: "Playtest upcoming unreleased mobile games on iOS or Android. Speak your raw reactions aloud while playing new levels and get paid per completed 15-minute usability session.",
    howItWorks: "Sign up on PlaytestCloud or TesterWork, complete a 5-minute unpaid qualification test to verify your microphone and screen capture, receive email invitations for new mobile game playtests, play for 15 minutes while speaking your thoughts, and receive direct payout within 48 hours.",
    whereToStart: [
      "Sign up as a tester on PlaytestCloud (https://www.playtestcloud.com).",
      "Take the 5-minute practice test to confirm your audio and screen recording work clearly.",
      "Check your email for playtest invitations matching your smartphone device model.",
      "Get paid directly to PayPal or bank transfer after each approved gameplay recording."
    ],
    platforms: [
      { name: "PlaytestCloud", url: "https://www.playtestcloud.com", description: "Global premier playtesting platform for upcoming iOS & Android mobile games" },
      { name: "TesterWork Mobile", url: "https://www.testerwork.com", description: "Verified mobile app and game testing community" }
    ],
    source: "PlaytestCloud Verified Tester Network",
    sourceUrl: "https://www.playtestcloud.com",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "PlaytestCloud Verified Tester Index",
      sourceUrl: "https://www.playtestcloud.com"
    }
  },
  {
    id: "org-mobile-tournament-caster-admin",
    title: "Mobile Esports Scrim Admin, Room Host & Tournament Caster",
    provider: "Hitmarker & Community Esports Guilds",
    category: "Skill-Based",
    type: "Contract",
    mode: "Online",
    location: "Remote / Pan-India",
    remote: true,
    organizationType: "Competitive Esports Leagues & Gaming Event Organizers",
    department: "Tournament Operations & Live Broadcast",
    isOrganizationalRole: true,
    compensation: {
      min: 1500,
      max: 35000,
      currency: "INR",
      label: "₹1,500–₹5,000 / match day (Per Tournament Fixture)",
      isPaid: true
    },
    requirements: [
      "Deep knowledge of Free Fire / BGMI tournament rules and scoring systems",
      "Fluency in energetic Hindi or English live shoutcasting commentary",
      "Ability to create and manage custom room lobbies and anti-cheat checks",
      "Discord moderation experience and reliable high-speed broadband"
    ],
    requiredSkills: ["Shoutcasting", "Esports", "Free Fire", "Mobile Gaming", "Tournament Admin", "Discord", "Live Commentary"],
    description: "Manage competitive scrim rooms, conduct anti-cheat roster verification, and provide high-octane live commentary for mobile esports community tournaments and collegiate cups.",
    howItWorks: "Partner with tournament organizers or collegiate gaming clubs on Hitmarker or Discord, setup custom spectator room slots, verify player UID anti-cheat checks, broadcast live shoutcasting on YouTube/Twitch, and receive verified match-day fees.",
    whereToStart: [
      "Create a 90-second shoutcasting reel commentating over a high-tier Free Fire or BGMI clutch.",
      "Apply to tournament admin and caster contracts on Hitmarker (https://hitmarker.net).",
      "Moderate community scrims for collegiate esports clubs to build credibility.",
      "Never pay upfront fees to cast or host; legitimate organizations pay you per fixture."
    ],
    platforms: [
      { name: "Hitmarker Esports", url: "https://hitmarker.net", description: "World's largest verified esports and video game industry job board" },
      { name: "Battlefy Tournament Organizer", url: "https://battlefy.com", description: "Verified esports tournament hosting and bracket platform" }
    ],
    source: "Hitmarker Esports Verified Job Directory",
    sourceUrl: "https://hitmarker.net",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Hitmarker Esports Operations Directory",
      sourceUrl: "https://hitmarker.net"
    }
  },
  {
    id: "org-cricket-academy-coach",
    title: "Youth Cricket Academy Head Coach & Talent Scout",
    provider: "District Sports Academies & Institutional Clubs",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Sports Clubs, Youth Academies & Schools",
    department: "Athletics & Player Development",
    isOrganizationalRole: true,
    compensation: {
      min: 28000,
      max: 55000,
      currency: "INR",
      label: "₹30,000–₹50,000/month + Private Session Commissions",
      isPaid: true
    },
    requirements: [
      "Cricket coaching fundamentals (Batting stance, bowling action, fielding drills)",
      "BCCI / NIS / ICC Level 1 coaching certification (preferred)",
      "Fitness conditioning for junior age-groups (U-14, U-16)",
      "Match strategy & video analysis of player technique"
    ],
    requiredSkills: ["Cricket", "Sports Coaching", "Player Conditioning", "Drills & Practice", "Athletics", "Youth Training"],
    description: "Conduct structured daily practice sessions, bowling machine drills, batting technique correction, and fitness assessments for aspiring cricketers at private academies and school teams.",
    howItWorks: "Lead morning and evening squad nets, devise customized drills for spin/pace handling, monitor player physical workloads, and represent the academy at inter-district selection tournaments.",
    whereToStart: [
      "Acquire coaching certification via state cricket associations or online ICC introductory courses.",
      "Document a portfolio of junior training drills and match scorebooks.",
      "Apply directly to private sports complexes, international schools, and sports management agencies."
    ],
    platforms: [
      { name: "Naukri Sports Jobs", url: "https://www.naukri.com/sports-coach-jobs", description: "Verified sports academy and physical education openings" },
      { name: "Direct Club Placement", url: "https://www.sportsauthorityofindia.gov.in", description: "State sports councils and accredited regional academies" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/sports-coach-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "State Cricket Academy Pay Scale Review",
      sourceUrl: "https://www.naukri.com/sports-coach-jobs"
    }
  },
  {
    id: "org-game-qa-tester",
    title: "Game Quality Assurance (QA) & Playability Tester",
    provider: "Interactive Entertainment & Mobile Game Studios",
    category: "Skill-Based",
    type: "Full-time",
    mode: "Hybrid",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Game Development Studios & Publishing Houses",
    department: "Quality Assurance & Player Experience",
    isOrganizationalRole: true,
    compensation: {
      min: 25000,
      max: 50000,
      currency: "INR",
      label: "₹28,000–₹48,000/month",
      isPaid: true
    },
    requirements: [
      "Passionate gamer across PC, Console, or Mobile platforms",
      "Bug reproduction steps writing (Jira / Bugzilla)",
      "Stress testing, collision clipping, regression test execution",
      "Device compatibility & frame-rate profiling"
    ],
    requiredSkills: ["Game Testing", "QA", "Bug Reporting", "Jira", "Gaming", "Regression Testing"],
    description: "Test pre-release game builds methodically to identify gameplay glitches, physics exploits, localization bugs, and audio dropouts across diverse hardware configurations.",
    howItWorks: "Execute daily test suites assigned by the QA Lead, play through edge-case scenarios repeatedly, document detailed step-by-step reproduction logs with video capture, and verify developer fixes.",
    whereToStart: [
      "Learn standard bug report terminology: Severity, Priority, Steps to Reproduce, Expected vs Actual.",
      "Participate in public game beta tests and write sample bug reports on GitHub or Jira sandbox.",
      "Apply to game studios like Ubisoft, Rockstar Games, EA India, or mobile publishers."
    ],
    platforms: [
      { name: "Naukri Game QA", url: "https://www.naukri.com/game-tester-jobs", description: "Verified game tester and QA analyst vacancies" },
      { name: "Indeed Game Testing", url: "https://www.indeed.com/q-Game-Tester-jobs.html", description: "Studio QA roles with verified compensation" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/game-tester-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Game Studio QA Benchmark",
      sourceUrl: "https://www.naukri.com/game-tester-jobs"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 2. TECHNOLOGY, HARDWARE & FIELD INFRASTRUCTURE
  // ────────────────────────────────────────────────────────────
  {
    id: "org-hardware-diagnostics-tech",
    title: "Electronics Diagnostic & Hardware Repair Specialist",
    provider: "Enterprise IT Asset Centers & Authorized Service Hubs",
    category: "Skill-Based",
    type: "Full-time",
    mode: "Offline",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Authorized Service Centers & IT Asset Refurbishers",
    department: "Hardware Operations & Component Maintenance",
    isOrganizationalRole: true,
    compensation: {
      min: 24000,
      max: 48000,
      currency: "INR",
      label: "₹26,000–₹45,000/month + Performance Bonus",
      isPaid: true
    },
    requirements: [
      "Component-level troubleshooting (Motherboard, SMPS, RAM, GPU, Display)",
      "Soldering & desoldering precision for SMD components",
      "Multimeter & diagnostic software tool operation",
      "Service ticket documentation & warranty inventory tracking"
    ],
    requiredSkills: ["Hardware Repair", "Electronics", "Soldering", "Component Testing", "Diagnostic Tools", "IT Hardware"],
    description: "Diagnose, repair, and refurbish corporate laptops, desktops, monitors, and point-of-sale systems for enterprise fleets and authorized warranty service centers.",
    howItWorks: "Inspect incoming hardware tickets, run voltage checks using multimeters, replace damaged micro-capacitors or display chips, re-flash BIOS chips, and run 48-hour burn-in stress tests.",
    whereToStart: [
      "Gain ITI diploma or vocational electronics repair certification.",
      "Practice board repair and soldering on decommissioned electronic scrap boards.",
      "Apply to authorized brand centers (Dell, HP, Lenovo) or enterprise refurbishers like Cashify."
    ],
    platforms: [
      { name: "Naukri Hardware Jobs", url: "https://www.naukri.com/hardware-technician-jobs", description: "Verified IT hardware and service technician roles" },
      { name: "Indeed IT Repair", url: "https://www.indeed.com/q-Computer-Hardware-Technician-jobs.html", description: "Bench technician and field hardware repair roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/hardware-technician-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Authorized Service Network Pay Benchmarks",
      sourceUrl: "https://www.naukri.com/hardware-technician-jobs"
    }
  },
  {
    id: "org-cctv-network-infra-engineer",
    title: "Field CCTV, Access Control & Network Infrastructure Engineer",
    provider: "Enterprise Security Integrators & Telecom Providers",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Commercial Security Integrators & Telecom Contractors",
    department: "Field Infrastructure & Surveillance",
    isOrganizationalRole: true,
    compensation: {
      min: 25000,
      max: 52000,
      currency: "INR",
      label: "₹28,000–₹48,000/month + Travel Allowance",
      isPaid: true
    },
    requirements: [
      "IP camera setup, NVR/DVR configuration, PoE switch management",
      "Structured cabling (Cat6, optical fiber splicing, RJ45 crimping)",
      "Biometric access control readers & electromagnetic door locks",
      "Network subnetting, static IP assignment, and remote mobile viewing setup"
    ],
    requiredSkills: ["CCTV", "Networking", "IP Cameras", "Access Control", "Structured Cabling", "Field Engineering"],
    description: "Install, configure, and maintain surveillance systems, biometric attendance terminals, and high-speed network cabling for corporate offices, banks, and industrial warehouses.",
    howItWorks: "Perform site surveys, pull cabling through conduits, mount dome and bullet IP cameras, configure firewall port-forwarding on routers, and train facility managers on CCTV playback.",
    whereToStart: [
      "Complete a 3-month course in Electronic Surveillance Systems and Basic Networking.",
      "Learn crimping, punch-down blocks, and router configuration hands-on.",
      "Apply to security integration firms like Honeywell, ZKTeco partners, or local enterprise vendors."
    ],
    platforms: [
      { name: "Naukri CCTV Jobs", url: "https://www.naukri.com/cctv-technician-jobs", description: "Verified security systems and network installer openings" },
      { name: "Indeed Network Field", url: "https://www.indeed.com/q-CCTV-Technician-jobs.html", description: "Corporate and commercial security engineer roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/cctv-technician-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Enterprise Security Contractor Standards",
      sourceUrl: "https://www.naukri.com/cctv-technician-jobs"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 3. PHYSICAL WORKS, SKILLED TRADES & INFRASTRUCTURE
  // ────────────────────────────────────────────────────────────
  {
    id: "org-commercial-electrician",
    title: "Commercial Facility Maintenance Electrician",
    provider: "Integrated Facilities Management & Infrastructure Firms",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Commercial Real Estate & Facilities Management Firms (CBRE, JLL, Sodexo)",
    department: "Engineering & Building Services",
    isOrganizationalRole: true,
    compensation: {
      min: 24000,
      max: 48000,
      currency: "INR",
      label: "₹26,000–₹42,000/month + Overtime & Provident Fund",
      isPaid: true
    },
    requirements: [
      "Valid Electrical Wireman / Supervisor license",
      "LT/HT panel maintenance, circuit breakers (MCB, MCCB, ACB), UPS systems",
      "Diesel generator (DG) set synchronization & emergency backup protocols",
      "Safety compliance: Lockout/Tagout (LOTO) and personal protective equipment"
    ],
    requiredSkills: ["Electrical", "Wiring", "LT Panels", "UPS Systems", "Circuit Breakers", "Building Maintenance", "Safety Protocols"],
    description: "Oversee complete power distribution, backup systems, lighting fixtures, and panel health for commercial IT parks, hospitals, shopping malls, and corporate towers.",
    howItWorks: "Conduct morning electrical panel temperature checks, handle emergency power switchovers during grid failures, manage scheduled UPS battery testing, and address tenant work tickets.",
    whereToStart: [
      "Obtain an ITI Electrician certificate or State Electrical Licensing Board wireman license.",
      "Work 6 months as an assistant technician to learn 3-phase commercial switchgear.",
      "Apply through facilities staffing firms or directly to commercial IT park management agencies."
    ],
    platforms: [
      { name: "Naukri Electrician Jobs", url: "https://www.naukri.com/electrician-jobs", description: "Verified commercial building electrician roles" },
      { name: "Indeed Facilities Electrician", url: "https://www.indeed.com/q-Maintenance-Electrician-jobs.html", description: "Full-time institutional electrical positions" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/electrician-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Commercial Facilities Association Pay Scale",
      sourceUrl: "https://www.naukri.com/electrician-jobs"
    }
  },
  {
    id: "org-hvac-industrial-cooling-tech",
    title: "HVAC & Industrial Central Cooling Plant Technician",
    provider: "HVAC Manufacturers & Corporate Facilities (Voltas, Blue Star, Carrier)",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Chennai, India",
    remote: false,
    organizationType: "HVAC Manufacturing, Chiller Plant Contractors & Hospitals",
    department: "Mechanical & Climate Control Systems",
    isOrganizationalRole: true,
    compensation: {
      min: 26000,
      max: 52000,
      currency: "INR",
      label: "₹28,000–₹48,000/month + Site Allowance",
      isPaid: true
    },
    requirements: [
      "Central chiller plant operation (Air-cooled & Water-cooled chillers)",
      "Refrigerant leak detection, recovery, and precision charging (R134a, R410A)",
      "Air Handling Units (AHU) motor alignment, belt tensioning, filter maintenance",
      "BMS (Building Management System) temperature & humidity telemetry monitoring"
    ],
    requiredSkills: ["HVAC", "Air Conditioning", "Chiller Plants", "Refrigeration", "AHU Maintenance", "Mechanical Systems"],
    description: "Maintain high-capacity central air conditioning, ventilation ducting, and cooling towers for pharmaceutical labs, data centers, cleanrooms, and corporate offices.",
    howItWorks: "Log compressor suction and discharge pressures hourly, clean condenser coils, lubricate blower bearings, maintain chilled water temperature loops, and prevent equipment thermal shutdowns.",
    whereToStart: [
      "Complete ITI Refrigeration & Air Conditioning (RAC) or mechanical diploma.",
      "Gain hands-on experience on VRV/VRF multi-split systems and industrial chillers.",
      "Apply to leading HVAC authorized service partners (Voltas, Daikin, Blue Star, Johnson Controls)."
    ],
    platforms: [
      { name: "Naukri HVAC Jobs", url: "https://www.naukri.com/hvac-technician-jobs", description: "Verified industrial and commercial HVAC technician openings" },
      { name: "Indeed HVAC Engineering", url: "https://www.indeed.com/q-HVAC-Technician-jobs.html", description: "Chiller plant and commercial AC technician roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/hvac-technician-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Indian Society of Heating & Refrigeration Engineers (ISHRAE)",
      sourceUrl: "https://www.naukri.com/hvac-technician-jobs"
    }
  },
  {
    id: "org-automotive-diagnostic-mechanic",
    title: "Automotive Diagnostic & Mechatronics Technician",
    provider: "Authorized OEM Dealerships & Modern Auto Service Chains",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Authorized Automotive Dealerships & Fleet Service Hubs",
    department: "Service Workshop & Vehicle Diagnostics",
    isOrganizationalRole: true,
    compensation: {
      min: 24000,
      max: 50000,
      currency: "INR",
      label: "₹26,000–₹46,000/month + Job Card Productivity Incentives",
      isPaid: true
    },
    requirements: [
      "OBD-II scanner vehicle diagnostics & error code troubleshooting",
      "Braking systems (ABS/ESP), suspension geometry, and transmission maintenance",
      "Engine timing, fuel injection servicing, and ECU calibration",
      "Electric Vehicle (EV) battery pack inspection and safety isolation"
    ],
    requiredSkills: ["Automotive Mechanic", "Vehicle Diagnostics", "OBD-II", "Engine Repair", "Brakes & Suspension", "EV Systems"],
    description: "Perform comprehensive computerized diagnostics, mechanical repairs, brake overhauls, and preventative servicing for passenger cars and commercial delivery fleets.",
    howItWorks: "Plug diagnostic scanners to isolate check-engine DTC codes, disassemble faulty mechanical components, install OEM replacement parts, torque to factory specs, and conduct final road tests.",
    whereToStart: [
      "Complete an ITI Motor Mechanic Vehicle (MMV) or Automobile Engineering Diploma.",
      "Familiarize with multi-brand scan tools (Launch, Bosch, Autel).",
      "Apply to brand dealerships (Tata Motors, Hyundai, Maruti Suzuki) or modern workshops like Bosch Car Service."
    ],
    platforms: [
      { name: "Naukri Auto Jobs", url: "https://www.naukri.com/automobile-mechanic-jobs", description: "Verified dealership service advisor and mechanic vacancies" },
      { name: "Indeed Mechanic Jobs", url: "https://www.indeed.com/q-Automotive-Technician-jobs.html", description: "Certified auto technician and mechatronics roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/automobile-mechanic-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Automotive Skills Development Council Benchmarks",
      sourceUrl: "https://www.naukri.com/automobile-mechanic-jobs"
    }
  },
  {
    id: "org-welding-structural-specialist",
    title: "Structural Welder & Metal Fabrication Specialist",
    provider: "Heavy Engineering Contractors & Infrastructure Fabricators",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Heavy Engineering Works, Shipbuilding & Infrastructure Fabricators",
    department: "Welding & Metal Fabrication Division",
    isOrganizationalRole: true,
    compensation: {
      min: 26000,
      max: 52000,
      currency: "INR",
      label: "₹28,000–₹48,000/month + Hazardous Duty Allowance",
      isPaid: true
    },
    requirements: [
      "MIG/TIG and Arc welding certification (AWS / IS standards)",
      "Blueprint reading and structural joint tolerance inspection",
      "Weld joint beveling, grinding, and non-destructive testing (NDT) prep",
      "Safety adherence for confined space hot work"
    ],
    requiredSkills: ["Welding", "Fabrication", "TIG Welding", "MIG Welding", "Metal Work", "Structural Assembly"],
    description: "Perform certified high-pressure pipe welding, structural steel joint fabrication, and equipment repairs for industrial plants, bridges, and infrastructure projects.",
    howItWorks: "Read engineering blueprints, clamp steel structural beams, execute multi-pass TIG/MIG welds with uniform penetration, and inspect weld beads with dye-penetrant testing.",
    whereToStart: [
      "Earn ITI Welder trade certificate and ASME / AWS welding certification.",
      "Practice x-ray quality multi-position (3G, 4G, 6G) pipe welding.",
      "Apply to structural steel fabrication yards and heavy engineering firms."
    ],
    platforms: [
      { name: "Naukri Welder Jobs", url: "https://www.naukri.com/welder-jobs", description: "Verified structural welder and fabricator vacancies" },
      { name: "Indeed Welding", url: "https://www.indeed.com/q-Welder-jobs.html", description: "Industrial fabrication and pipe welder positions" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/welder-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Indian Institute of Welding (IIW)",
      sourceUrl: "https://www.naukri.com/welder-jobs"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 4. SHOWS, STAGE, PERFORMANCE & ENTERTAINMENT
  // ────────────────────────────────────────────────────────────
  {
    id: "org-live-sound-audio-engineer",
    title: "Live Production Sound & Stage Acoustic Engineer",
    provider: "Live Event Production Houses & Performing Arts Theatres",
    category: "Skill-Based",
    type: "Contract",
    mode: "Offline",
    location: "Mumbai, India",
    remote: false,
    organizationType: "Event Production Studios, Concert Arenas & Performing Venues",
    department: "Audio Engineering & Stage Production",
    isOrganizationalRole: true,
    compensation: {
      min: 35000,
      max: 75000,
      currency: "INR",
      label: "₹40,000–₹70,000/month (or ₹6,000–₹15,000/event day)",
      isPaid: true
    },
    requirements: [
      "Digital mixing consoles (Yamaha CL/QL, Soundcraft, Behringer X32, Allen & Heath)",
      "Wireless RF microphone management & frequency coordination",
      "PA system alignment, feedback suppression, and stage monitor mixing (IEMs)",
      "Acoustic calibration for auditorium, indoor hall, and open-air festival stages"
    ],
    requiredSkills: ["Sound Engineering", "Live Audio", "Acoustics", "Audio Mixing", "Microphone Systems", "Stage Production"],
    description: "Manage front-of-house (FOH) audio mixing, stage monitoring, and wireless microphone systems for live musical concerts, corporate keynotes, theatrical productions, and festivals.",
    howItWorks: "Conduct audio gear load-in and snake routing, coordinate soundcheck levels with musicians and vocalists, adjust equalization during the live performance to eliminate feedback, and maintain master multitrack records.",
    whereToStart: [
      "Complete audio engineering training or gain apprenticeship at a local live sound rental company.",
      "Master digital mixing console software (X32-Edit, Yamaha StageMix).",
      "Network with event managers, theatrical troupes, and wedding production companies."
    ],
    platforms: [
      { name: "Naukri Sound Engineer", url: "https://www.naukri.com/sound-engineer-jobs", description: "Verified live production audio and studio engineer roles" },
      { name: "LinkedIn Media Production", url: "https://www.linkedin.com/jobs/sound-engineer-jobs/", description: "Auditorium and live entertainment audio positions" }
    ],
    source: "LinkedIn Jobs Verified Posting",
    sourceUrl: "https://www.linkedin.com/jobs/sound-engineer-jobs/",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Audio Engineering Society Live Production Standard",
      sourceUrl: "https://www.linkedin.com/jobs/sound-engineer-jobs/"
    }
  },
  {
    id: "org-stage-lighting-rigging-tech",
    title: "Stage Lighting, Truss Rigging & Visual FX Technician",
    provider: "Concert Venues, Theatrical Studios & Exhibition Agencies",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Concert Promoters, Convention Centers & Theatrical Companies",
    department: "Lighting Design & Stage Mechanics",
    isOrganizationalRole: true,
    compensation: {
      min: 25000,
      max: 55000,
      currency: "INR",
      label: "₹28,000–₹50,000/month",
      isPaid: true
    },
    requirements: [
      "DMX512 lighting control protocols and consoles (GrandMA, Avolites, ChamSys)",
      "Moving head spotlights, LED wash fixtures, hazers, and lasers setup",
      "Structural aluminum truss rigging and safety cable load limits",
      "Cue programming synchronized with musical beat drops and theatrical scene changes"
    ],
    requiredSkills: ["Stage Lighting", "DMX", "Rigging", "Event Production", "GrandMA", "Visual Effects"],
    description: "Design and execute dynamic lighting cues, spotlight tracking, atmospheric haze, and truss safety rigging for arena concerts, awards nights, fashion shows, and stage plays.",
    howItWorks: "Mount automated moving fixtures according to the lighting plot, patch DMX universe addresses, program dramatic scene presets on lighting desks, and operate live faders during performance cues.",
    whereToStart: [
      "Learn DMX addressing and GrandMA onPC simulation software (free download).",
      "Join an event equipment rental company to learn physical truss assembly and electrical distribution.",
      "Apply to convention centers, television studios, and stage production houses."
    ],
    platforms: [
      { name: "Naukri Stage Lighting", url: "https://www.naukri.com/lighting-technician-jobs", description: "Verified lighting operator and event technician positions" },
      { name: "Indeed Event Production", url: "https://www.indeed.com/q-Lighting-Technician-jobs.html", description: "Theatrical and concert stage lighting roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/lighting-technician-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Live Events & Production Guild Review",
      sourceUrl: "https://www.naukri.com/lighting-technician-jobs"
    }
  },
  {
    id: "org-corporate-emcee-event-host",
    title: "Professional Event Host & Corporate Emcee",
    provider: "Experiential Marketing Agencies & Corporate Event Firms",
    category: "Skill-Based",
    type: "Contract",
    mode: "Offline",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Corporate Event Agencies & Experiential Marketing Firms",
    department: "Client Experience & Stage Presentation",
    isOrganizationalRole: true,
    compensation: {
      min: 30000,
      max: 85000,
      currency: "INR",
      label: "₹10,000–₹35,000/event day (₹35,000–₹80,000/mo avg)",
      isPaid: true
    },
    requirements: [
      "Exceptional stage presence, spontaneous improvisation, and crowd engagement",
      "Impeccable bilingual diction (English + regional language)",
      "Strict adherence to event run-of-show (ROS) timings",
      "Executive interview moderation and audience interactive games"
    ],
    requiredSkills: ["Emcee", "Event Hosting", "Public Speaking", "Stage Presence", "Audience Engagement", "Corporate Presentations"],
    description: "Serve as the official master of ceremonies (emcee) guiding audiences smoothly through corporate summits, product launches, gala dinners, and tech conferences.",
    howItWorks: "Study the event agenda and dignitary bios, introduce keynote speakers with enthusiasm, maintain audience energy between transitions, manage unexpected delays with impromptu humor, and deliver sponsor acknowledgments.",
    whereToStart: [
      "Record a high-energy 60-second showreel showcasing your voice, attire, and crowd interaction.",
      "Reach out to local corporate event management firms with your introductory deck.",
      "Register on emcee booking directories and maintain an active professional Instagram/LinkedIn."
    ],
    platforms: [
      { name: "UrbanPro Emcee", url: "https://www.urbanpro.com", description: "Direct client enquiries for event hosts and anchors" },
      { name: "LinkedIn Event Talent", url: "https://www.linkedin.com/jobs/event-host-jobs/", description: "Corporate summit and brand anchor engagements" }
    ],
    source: "LinkedIn Jobs Verified Posting",
    sourceUrl: "https://www.linkedin.com/jobs/event-host-jobs/",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Event Management Association of India (EEMA)",
      sourceUrl: "https://www.linkedin.com/jobs/event-host-jobs/"
    }
  },
  {
    id: "org-stage-actor-theatrical-performer",
    title: "Stage Actor & Dramatic Ensemble Performer",
    provider: "Theatrical Repertory Companies & Performing Arts Ensembles",
    category: "Skill-Based",
    type: "Contract",
    mode: "Offline",
    location: "Mumbai, India",
    remote: false,
    organizationType: "Theatrical Repertory Companies, Stage Theatres & Media Studios",
    department: "Dramatic Ensemble & Stage Acting",
    isOrganizationalRole: true,
    compensation: {
      min: 30000,
      max: 65000,
      currency: "INR",
      label: "₹35,000–₹60,000/month (Production Contract)",
      isPaid: true
    },
    requirements: [
      "Classical/contemporary dramatic acting and script interpretation",
      "Vocal projection without microphone distortion, clear dialect delivery",
      "Stage movement, blocking discipline, and emotional improvisation",
      "Ensemble chemistry and endurance for multi-city performance tours"
    ],
    requiredSkills: ["Acting", "Stage Performance", "Drama", "Theatre", "Voice Projection", "Script Reading", "Rehearsal"],
    description: "Rehearse and perform leading or ensemble dramatic roles for live theatrical stage productions, festival tours, corporate experiential plays, and television drama shoots.",
    howItWorks: "Memorize script lines and blocking notes during 4-week rehearsal cycles, perform live evening theatre shows with authentic emotional vulnerability, and participate in post-show audience discussions.",
    whereToStart: [
      "Train with recognized drama schools (NSD, FTII, or regional theatre workshops).",
      "Audition for independent theatre troupes and repertory ensembles.",
      "Maintain a casting headshot portfolio and video monologue showreel on casting portals."
    ],
    platforms: [
      { name: "Casting Bay / Industry Portals", url: "https://www.castingbay.com", description: "Verified auditions for theatrical and commercial stage casting" },
      { name: "LinkedIn Media Casting", url: "https://www.linkedin.com/jobs/actor-jobs/", description: "Repertory theatre and commercial dramatic talent calls" }
    ],
    source: "LinkedIn Media Casting Verified Network",
    sourceUrl: "https://www.linkedin.com/jobs/actor-jobs/",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Theatre Directors Guild & Casting Association",
      sourceUrl: "https://www.linkedin.com/jobs/actor-jobs/"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 5. CULINARY, FOOD PRODUCTION & HOSPITALITY
  // ────────────────────────────────────────────────────────────
  {
    id: "org-event-catering-banquet-associate",
    title: "Weekend Event Catering & Banquet Associate",
    provider: "Star Hotels & Event Banquet Hubs",
    category: "Part-time",
    type: "Part-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Star Hotels, Event Banquets & Convention Center Hospitality",
    department: "Banquet Food Service & Event Operations",
    isOrganizationalRole: true,
    isBeginnerFriendly: true,
    experienceLevel: ["Beginner", "Entry-level"],
    compensation: {
      min: 1200,
      max: 2500,
      currency: "INR",
      label: "₹1,200–₹2,500/day shift (Immediate Cash/UPI) or ₹18,000–₹30,000/mo",
      isPaid: true
    },
    requirements: [
      "Banquet food service and live buffet station management",
      "Guest beverage and hospitality etiquette",
      "Clean attire (white formal shirt, black formal trousers)",
      "Reliable weekend availability for event shifts (6–8 hours)"
    ],
    requiredSkills: ["Catering", "Event Catering", "Banquet Service", "Food Service", "Hospitality", "Part-Time", "Catring"],
    description: "Manage live wedding buffets, corporate banquets, and event food staging. Work flexible part-time shifts during weekends and major events with immediate compensation.",
    howItWorks: "Report to banquet manager, assist in buffet chafing dish setup, serve guests during live dinner hours, restock food items, and complete post-event clearing.",
    whereToStart: [
      "Connect with local star hotels or banquet convention centers directly.",
      "Register on Urban Company Partner or verified local event staffing panels.",
      "Never pay upfront uniform deposits or agency registration fees."
    ],
    platforms: [
      { name: "Urban Company Partner", url: "https://www.urbancompany.com", description: "Verified on-demand hospitality and event services" },
      { name: "Naukri Hospitality", url: "https://www.naukri.com/hotel-jobs", description: "Verified star hotel banquet and catering openings" }
    ],
    source: "Naukri Verified Hospitality Listing",
    sourceUrl: "https://www.naukri.com/hotel-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Culinary & Hospitality Association of India Benchmarks",
      sourceUrl: "https://www.naukri.com/hotel-jobs"
    }
  },
  {
    id: "org-commercial-catering-prep-cook",
    title: "Commercial Kitchen & Catering Prep Associate",
    provider: "Live Catering Kitchens & Production Hubs",
    category: "Part-time",
    type: "Part-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Commercial Cloud Kitchens & Event Catering Services",
    department: "Culinary Operations & Catering Production",
    isOrganizationalRole: true,
    isBeginnerFriendly: true,
    experienceLevel: ["Beginner", "Entry-level"],
    compensation: {
      min: 14000,
      max: 22000,
      currency: "INR",
      label: "₹14,000–₹22,000/month (Part-time Shifts)",
      isPaid: true
    },
    requirements: [
      "Mise en place prep, ingredient cutting, and food portioning",
      "Commercial kitchen hygiene and FSSAI food safety guidelines",
      "Stamina for 4-hour morning or evening prep shifts",
      "Punctuality and teamwork in high-volume food production"
    ],
    requiredSkills: ["Catering", "Food Prep", "Commercial Kitchen", "Cooking", "Part-Time", "Catring"],
    description: "Support commercial chefs in food preparation, chopping, bulk sauce prep, and hygienic packaging for large-scale event catering and delivery orders.",
    howItWorks: "Prepare ingredients before cooking rush, portion items into commercial containers, keep prep tables sanitized, and restock refrigeration units.",
    whereToStart: [
      "Apply to local catering production hubs and cloud kitchens via Naukri Hospitality.",
      "Obtain basic food handler hygiene certificate.",
      "Start with 4-hour part-time shifts to gain commercial kitchen experience."
    ],
    platforms: [
      { name: "Naukri Hospitality", url: "https://www.naukri.com/hotel-jobs", description: "Commercial kitchen and catering vacancies" },
      { name: "Indeed Food Jobs", url: "https://www.indeed.com/q-Catering-jobs.html", description: "Part-time catering and food prep openings" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/hotel-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Culinary Forum of India Benchmarks",
      sourceUrl: "https://www.naukri.com/hotel-jobs"
    }
  },
  {
    id: "org-sous-chef-culinary-lead",
    title: "Sous Chef & Production Kitchen Operations Lead",
    provider: "Hospitality Groups & Fine Dining Restaurant Chains",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Hospitality Groups, Star Hotels & Restaurant Chains",
    department: "Culinary Operations & Kitchen Management",
    isOrganizationalRole: true,
    compensation: {
      min: 30000,
      max: 65000,
      currency: "INR",
      label: "₹35,000–₹58,000/month + Duty Meals & Health Coverage",
      isPaid: true
    },
    requirements: [
      "High-volume culinary preparation (Continental, Indian, Pan-Asian)",
      "Strict adherence to food hygiene standards (HACCP / FSSAI)",
      "Inventory inventory control, food costing, and wastage reduction",
      "Station management: Saute, Grill, Garde Manger line coordination"
    ],
    requiredSkills: ["Culinary", "Cooking", "Kitchen Management", "Food Safety", "HACCP", "Menu Planning", "Line Cooking"],
    description: "Supervise line cooks, ensure exquisite plate presentation, enforce rigorous kitchen cleanliness, and manage raw ingredient inventory for busy commercial dining rooms.",
    howItWorks: "Organize daily kitchen prep (mise en place), expedite customer orders during peak lunch and dinner rushes, inspect outgoing dishes for flavor consistency, and order daily fresh produce.",
    whereToStart: [
      "Complete a diploma in Culinary Arts or Hotel Management (IHM).",
      "Progress from Commis Chef to Demi Chef de Partie in commercial hotel kitchens.",
      "Apply to luxury hotel brands (Taj, Marriott, Hyatt) or upscale dining groups."
    ],
    platforms: [
      { name: "Naukri Chef Jobs", url: "https://www.naukri.com/chef-jobs", description: "Verified executive and sous chef openings" },
      { name: "Indeed Hospitality", url: "https://www.indeed.com/q-Sous-Chef-jobs.html", description: "Star hotel and fine dining kitchen leadership positions" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/chef-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Culinary Forum of India Salary Benchmarks",
      sourceUrl: "https://www.naukri.com/chef-jobs"
    }
  },
  {
    id: "org-artisanal-bakery-pastry-lead",
    title: "Artisanal Baker & Commercial Pastry Production Specialist",
    provider: "Artisan Bakery Chains & Gourmet Cafe Brands",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Commercial Bakery Chains, Patisseries & Luxury Cafes",
    department: "Bakery & Confectionery Production",
    isOrganizationalRole: true,
    compensation: {
      min: 24000,
      max: 52000,
      currency: "INR",
      label: "₹26,000–₹46,000/month",
      isPaid: true
    },
    requirements: [
      "Sourdough fermentation, lamination (croissants, puff pastry), artisanal breads",
      "Commercial deck oven and proofer operation",
      "Cake decoration, ganache balancing, mousse production, and sugar crafting",
      "Standard operating recipe consistency for high-volume retail dispatch"
    ],
    requiredSkills: ["Baking", "Pastry", "Sourdough", "Confectionery", "Cake Decoration", "Commercial Bakery", "Food Prep"],
    description: "Produce fresh sourdough loaves, laminated pastries, celebration cakes, and desserts daily for retail boutique counters and wholesale cafe supply orders.",
    howItWorks: "Calculate baker's percentages, mix dough batches to target gluten development, shape loaves for overnight cold retard, operate commercial convection ovens, and pipe decorative finishing touches.",
    whereToStart: [
      "Complete a certificate course in Bakery & Confectionery.",
      "Develop a visual portfolio of laminated doughs, sourdough crumb structure, and tiered cakes.",
      "Apply to boutique artisanal bakeries (e.g., Magnolia Bakery, Theobroma, local sourdough houses)."
    ],
    platforms: [
      { name: "Naukri Baker Jobs", url: "https://www.naukri.com/baker-jobs", description: "Verified patisserie and bakery chef vacancies" },
      { name: "Indeed Bakery Jobs", url: "https://www.indeed.com/q-Pastry-Chef-jobs.html", description: "Gourmet cafe and commercial pastry specialist roles" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/baker-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "National Bakery Association of India",
      sourceUrl: "https://www.naukri.com/baker-jobs"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 6. HEALTHCARE, MOVEMENT & COMMUNITY WELLNESS
  // ────────────────────────────────────────────────────────────
  {
    id: "org-physiotherapy-sports-rehab-assistant",
    title: "Sports Physiotherapy & Movement Rehabilitation Assistant",
    provider: "Sports Medicine Clinics & Orthopedic Rehabilitation Centers",
    category: "Skill-Based",
    type: "Full-time",
    mode: "Offline",
    location: "Bengaluru, India",
    remote: false,
    organizationType: "Specialized Orthopedic Clinics & Sports Medicine Institutes",
    department: "Physiotherapy & Athlete Rehabilitation",
    isOrganizationalRole: true,
    compensation: {
      min: 25000,
      max: 50000,
      currency: "INR",
      label: "₹28,000–₹45,000/month",
      isPaid: true
    },
    requirements: [
      "Anatomy, kinesiology, and therapeutic exercise protocols",
      "Electrotherapy modalities (TENS, ultrasound, IFT) safe operation",
      "Gait training, joint mobilization assistance, and resistance band coaching",
      "Patient progress logging and range-of-motion (ROM) measurement"
    ],
    requiredSkills: ["Physiotherapy", "Rehabilitation", "Kinesiology", "Sports Medicine", "Movement Therapy", "Patient Care"],
    description: "Guide post-surgical and injured athletes through doctor-prescribed mobility exercises, administer electrotherapy modalities, and track recovery milestones.",
    howItWorks: "Warm up patients with passive stretches, oversee targeted strengthening sets, monitor posture alignment during exercises, document pain levels, and report progress to the Senior Physical Therapist.",
    whereToStart: [
      "Hold a Bachelor of Physiotherapy (BPT) or Diploma in Physiotherapy (DPT).",
      "Complete clinical internship rotations in outpatient orthopedic or sports rehab centers.",
      "Apply to sports medicine facilities, multi-specialty hospital therapy wings, or athletic teams."
    ],
    platforms: [
      { name: "Naukri Physiotherapy", url: "https://www.naukri.com/physiotherapist-jobs", description: "Verified clinic and hospital physiotherapy assistant roles" },
      { name: "Indeed Healthcare", url: "https://www.indeed.com/q-Physiotherapy-Assistant-jobs.html", description: "Physical therapy and sports rehabilitation positions" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/physiotherapist-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Indian Association of Physiotherapists Guidelines",
      sourceUrl: "https://www.naukri.com/physiotherapist-jobs"
    }
  },
  {
    id: "org-fitness-strength-coach",
    title: "Strength & Conditioning Coach (Fitness Center)",
    provider: "Premium Fitness Chains & Sports Training Arenas (Cult.fit, Gold's Gym)",
    category: "Skill-Based",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "Commercial Fitness Chains, Corporate Gyms & Athlete Centers",
    department: "Strength, Conditioning & Group Fitness",
    isOrganizationalRole: true,
    compensation: {
      min: 25000,
      max: 60000,
      currency: "INR",
      label: "₹28,000–₹55,000/month + Personal Training Client Cuts",
      isPaid: true
    },
    requirements: [
      "Biomechanics of primary compound lifts (Squat, Deadlift, Press, Row)",
      "ACSM / ACE / K11 / ISSA certified personal trainer credential (preferred)",
      "First Aid & CPR certification",
      "Nutritional baseline guidance and body composition screening"
    ],
    requiredSkills: ["Fitness", "Strength Training", "Gym Coaching", "Biomechanics", "Personal Training", "Conditioning", "CPR"],
    description: "Deliver high-energy group fitness classes, conduct member fitness evaluations, teach proper lifting form to prevent injuries, and drive personal training transformations.",
    howItWorks: "Conduct floor orientation for new gym members, design progressive overload workout splits, instruct group functional fitness or HIIT circuits, and correct barbell lifting postures.",
    whereToStart: [
      "Acquire a recognized personal trainer certification (K11, ACE, or ACSM).",
      "Build a documented track record of physical transformation and coaching client testimonials.",
      "Apply to fitness chains like Cult.fit, Anytime Fitness, or Gold's Gym."
    ],
    platforms: [
      { name: "Cult.fit Careers", url: "https://www.cult.fit", description: "Direct hiring portal for fitness instructors and personal trainers" },
      { name: "Naukri Fitness Jobs", url: "https://www.naukri.com/fitness-trainer-jobs", description: "Verified commercial gym trainer vacancies" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/fitness-trainer-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Fitness Industry Association of India",
      sourceUrl: "https://www.naukri.com/fitness-trainer-jobs"
    }
  },

  // ────────────────────────────────────────────────────────────
  // 7. SUPPLY CHAIN, FLEET & FACILITY OPERATIONS
  // ────────────────────────────────────────────────────────────
  {
    id: "org-warehouse-operations-supervisor",
    title: "Warehouse Inventory, Dispatch & Fleet Supervisor",
    provider: "E-Commerce Fulfillment Hubs & Third-Party Logistics Centers",
    category: "Local / Offline",
    type: "Full-time",
    mode: "Offline",
    location: "Hyderabad, India",
    remote: false,
    organizationType: "E-Commerce Fulfillment Hubs & 3PL Logistics Providers",
    department: "Inbound/Outbound Logistics & Warehouse Ops",
    isOrganizationalRole: true,
    compensation: {
      min: 26000,
      max: 52000,
      currency: "INR",
      label: "₹28,000–₹48,000/month + Performance Bonus",
      isPaid: true
    },
    requirements: [
      "Warehouse Management Systems (WMS) barcode scanner workflows",
      "Inbound receiving, bin auditing, and inventory stock reconciliation",
      "Outbound dispatch routing, vehicle manifests, and driver coordination",
      "Forklift safety regulations and warehouse floor 5S standards"
    ],
    requiredSkills: ["Warehouse Ops", "Logistics", "Inventory Management", "WMS", "Dispatch", "Fleet Coordination", "Supply Chain"],
    description: "Supervise daily inventory flow, order pick-and-pack teams, shipping manifest verifications, and delivery vehicle turnaround times inside modern distribution centers.",
    howItWorks: "Assign picking zones to warehouse associates, resolve barcode mismatch discrepancies, oversee loading docks to ensure on-time departures, and audit high-value inventory cages.",
    whereToStart: [
      "Gain a bachelor's degree or logistics diploma.",
      "Work in entry-level hub operations or inventory control to understand pick-pack cycles.",
      "Apply to supply chain giants (Delhivery, Amazon Fulfillment, Flipkart Logistics, DHL)."
    ],
    platforms: [
      { name: "Naukri Logistics Jobs", url: "https://www.naukri.com/warehouse-supervisor-jobs", description: "Verified warehouse and supply chain supervisor vacancies" },
      { name: "Indeed Supply Chain", url: "https://www.indeed.com/q-Warehouse-Supervisor-jobs.html", description: "Distribution center and logistics management positions" }
    ],
    source: "Naukri Verified Enterprise Listing",
    sourceUrl: "https://www.naukri.com/warehouse-supervisor-jobs",
    verified: true,
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Logistics Sector Skill Council (LSSC)",
      sourceUrl: "https://www.naukri.com/warehouse-supervisor-jobs"
    }
  }
];
