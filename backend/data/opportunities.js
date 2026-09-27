// backend/data/opportunities.js
// Verified realistic income opportunities database with structured metadata
import { talentOpportunities } from './talentOpportunities.js';
import { sectorOpportunities } from './sectorOpportunities.js';

export const opportunities = [
  {
    id: "freelance-web-dev",
    title: "Freelance Web Development",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: false,
    isAdvanced: true,
    investment: {
      min: 0,
      max: 1500,
      currency: "INR",
      description: "₹0 to start with free editors (VS Code) & free hosting (Vercel/Netlify). Optional ₹500–₹1,500 for custom domain/portfolio."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["HTML/CSS", "JavaScript", "React", "Web development", "Node.js"],
    suitablePersonalities: ["Technical work", "Working alone", "Building something long-term"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Upwork & Freelance Client Contract Benchmarks",
      sourceUrl: "https://www.upwork.com/freelance-jobs/web-development/",
      platformFees: "10% service fee on Upwork, 20% on Fiverr",
      ageRestrictions: "18+ on major platforms (or parental guardian consent)"
    },
    howItWorks: "Create custom landing pages, small business websites, component fixes, and responsive web apps for clients worldwide on verified freelance platforms or via direct client outreach.",
    whereToStart: [
      "Build 2–3 clean real-world portfolio projects (e.g., local business landing page, interactive dashboard, booking portal).",
      "Deploy projects on free hosting (Vercel/GitHub Pages) and link live previews in a simple portfolio.",
      "Setup professional profiles on Upwork, Fiverr, Contra, or Freelancer.",
      "Bid specifically on small, well-defined bug-fixes or single-page builds with clear deliverables.",
      "Deliver early, communicate proactively, and gather verified 5-star ratings."
    ],
    platforms: [
      { name: "Upwork", url: "https://www.upwork.com", description: "Global freelance platform with escrow protection", feeInfo: "10% freelancer fee" },
      { name: "Fiverr", url: "https://www.fiverr.com", description: "Gig-based service marketplace", feeInfo: "20% platform commission" },
      { name: "Contra", url: "https://contra.com", description: "Commission-free freelance portfolio & client network", feeInfo: "0% commission on direct contracts" }
    ],
    pros: [
      "High global demand for modern web interfaces",
      "Work from anywhere with an internet connection",
      "Compounding portfolio: each project brings higher rates"
    ],
    challenges: [
      "Landing the first 1–2 client reviews requires persistence",
      "Requires keeping skills updated with web standards",
      "Project scope creep requires firm communication"
    ],
    sevenDayPlan: [
      { day: 1, title: "Audit & Stack Alignment", tasks: ["Audit HTML/CSS/JS knowledge", "Select niche (e.g. Tailwind landing pages or React SPAs)", "Set up GitHub profile"] },
      { day: 2, title: "Build Portfolio Project 1", tasks: ["Build a responsive modern agency or restaurant site", "Implement mobile-first design and clean CSS", "Deploy on Vercel"] },
      { day: 3, title: "Build Portfolio Project 2", tasks: ["Build a functional interactive web app (e.g., invoice generator or catalog)", "Add demo video or README"] },
      { day: 4, title: "Create Professional Profile", tasks: ["Draft concise value proposition", "Publish portfolio link", "Take professional headshot for profile"] },
      { day: 5, title: "Marketplace Setup", tasks: ["Complete Upwork & Contra profiles to 100%", "List 2 packaged services on Fiverr with realistic timelines"] },
      { day: 6, title: "Client Discovery & Proposals", tasks: ["Submit 3 targeted, custom proposals addressing specific client problems", "Avoid copy-pasting generic cover letters"] },
      { day: 7, title: "Review & Follow-ups", tasks: ["Analyze proposal views and click-throughs", "Refine portfolio samples based on market demand"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Modern frontend frameworks (React, Tailwind) & responsive design principles",
      resources: [
        { name: "The Odin Project (Full Stack JavaScript)", url: "https://www.theodinproject.com", free: true },
        { name: "freeCodeCamp Responsive Web Design", url: "https://www.freecodecamp.org", free: true },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", free: true }
      ],
      practiceProject: "Build a responsive service booking website with appointment request form & dark mode.",
      portfolioGoal: "Host 3 distinct web applications on GitHub with live preview links.",
      firstGigAction: "Target $50–$150 fixed-price landing page contracts or CSS bug fix tickets."
    },
    scamWarnings: [
      "Never accept client payments outside official platform escrow (e.g. wire transfer or check).",
      "Beware of clients asking you to purchase software or gift cards on their behalf.",
      "Do not provide free spec work before a contract is funded."
    ]
  },
  {
    id: "online-stem-tutoring",
    title: "Online STEM / Coding Tutoring",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start using free Zoom/Google Meet. Optional ₹500 for a stylus or digital whiteboard if teaching math."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per session",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Mathematics", "Programming", "Science", "Java", "Python", "Teaching", "Speaking"],
    suitablePersonalities: ["Teaching", "Working with people", "Technical work"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Preply, Superprof & Outschool Tutor Guidelines",
      sourceUrl: "https://preply.com/en/teach",
      platformFees: "Preply charges 18%–33% based on hours taught; Superprof charges student subscription",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Teach high school, college, or adult learners programming fundamentals (Python, Java), mathematics, or science through 1-on-1 scheduled video sessions.",
    whereToStart: [
      "Select your exact teaching subject (e.g., Python for Beginners, High School Algebra, or AP Computer Science).",
      "Record a warm, 2-minute introductory video demonstrating your teaching style.",
      "Register on verified tutoring platforms like Preply, Superprof, or TeacherOn.",
      "Offer a trial introductory session discount to gather initial student reviews."
    ],
    platforms: [
      { name: "Preply", url: "https://preply.com", description: "Global 1-on-1 tutoring platform for languages & STEM", feeInfo: "18-33% tiered commission" },
      { name: "Superprof", url: "https://www.superprof.co.in", description: "Direct student-tutor marketplace", feeInfo: "Free for tutors in most regions" },
      { name: "TeacherOn", url: "https://www.teacheron.com", description: "Global tutoring and assignment guidance network", feeInfo: "Coin/credit based contact model" }
    ],
    pros: [
      "Direct hourly earnings with zero upfront financial risk",
      "Reinforces your own subject mastery while helping others",
      "Flexible evening and weekend scheduling"
    ],
    challenges: [
      "Requires patience and clear communication skills",
      "Session cancellations can cause income fluctuations",
      "Time-zone coordination for international students"
    ],
    sevenDayPlan: [
      { day: 1, title: "Subject & Syllabus Definition", tasks: ["Choose 1 core subject (e.g. Python basics)", "Draft a 10-lesson modular curriculum"] },
      { day: 2, title: "Create Intro Video", tasks: ["Record 90-second intro outlining credentials & teaching philosophy", "Check audio clarity"] },
      { day: 3, title: "Platform Registration", tasks: ["Sign up on Preply and Superprof", "Upload degree / credential verification if available"] },
      { day: 4, title: "Teaching Workspace Setup", tasks: ["Set up Google Meet, digital whiteboard (Excalidraw/Miro), and code sandbox"] },
      { day: 5, title: "Student Outreach", tasks: ["Answer inquiries on TeacherOn or local student forums", "Offer free 15-minute diagnostic call"] },
      { day: 6, title: "Deliver First Lesson", tasks: ["Conduct structured 60-minute session with interactive exercises", "Provide follow-up notes"] },
      { day: 7, title: "Feedback & Repeat Bookings", tasks: ["Request honest platform review", "Schedule recurring weekly slots"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Pedagogy, lesson structure, and live debugging explanation techniques",
      resources: [
        { name: "CS50 Teaching Resources", url: "https://cs50.harvard.edu", free: true },
        { name: "Khan Academy Teacher Guides", url: "https://www.khanacademy.org", free: true }
      ],
      practiceProject: "Conduct a mock 30-minute lesson teaching loops and conditionals to a peer.",
      portfolioGoal: "2 verified student testimonials on profile.",
      firstGigAction: "Book 3 weekly recurring students at ₹400–₹1,200/hr ($15–$35/hr internationally)."
    },
    scamWarnings: [
      "Never do academic exams on behalf of students where prohibited by honor codes.",
      "Avoid clients asking for private WhatsApp payments before identity is verified."
    ]
  },
  {
    id: "notion-digital-templates",
    title: "Digital Productivity & Notion Templates",
    category: "Digital Products",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start using free Notion, Canva & Gumroad accounts. Optional ₹500 for custom domain."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 2,
      label: "1–2 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Royalty / Digital asset sales",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Smartphone", "Internet connection"],
    requiredSkills: ["UI/UX", "Graphic Design", "Writing", "Content Creation"],
    suitablePersonalities: ["Creative work", "Working alone", "Building something long-term"],
    incomeGoals: ["Small extra income", "Side income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Gumroad Creator Analytics & Notion Marketplace Standards",
      sourceUrl: "https://www.notion.so/templates",
      platformFees: "Gumroad takes 10% flat fee + payment processing; Notion marketplace handles listings directly",
      ageRestrictions: "18+ for payout accounts"
    },
    howItWorks: "Design aesthetic, useful Notion dashboards (student planners, habit trackers, freelancer CRM, project managers) or Excel/Google Sheets budget models and distribute them on Gumroad, Etsy, and Notion Template Gallery.",
    whereToStart: [
      "Identify a specific problem: e.g., a freelance project tracker or university study organizer.",
      "Build a functional, visually cohesive Notion workspace using relations, rollups, and formulas.",
      "Design 3 attractive preview mockups using free Canva templates.",
      "Publish your product on Gumroad with a 'Pay What You Want' (including free) tier to build initial users.",
      "Share valuable tips on Reddit (r/Notion), X/Twitter, or TikTok to drive organic downloads."
    ],
    platforms: [
      { name: "Gumroad", url: "https://gumroad.com", description: "Simple digital checkout for creators", feeInfo: "10% flat transaction fee" },
      { name: "Notion Marketplace", url: "https://www.notion.so/templates", description: "Official directory of verified Notion templates", feeInfo: "Direct distribution" },
      { name: "Etsy", url: "https://www.etsy.com", description: "Global marketplace with high digital planner traffic", feeInfo: "$0.20 listing fee + 6.5% transaction" }
    ],
    pros: [
      "Create once, sell repeatedly with near-zero marginal cost",
      "No inventory, shipping, or customer support complexity",
      "Builds an email audience of buyers for future templates"
    ],
    challenges: [
      "Discoverability requires consistent social sharing or niche SEO",
      "High market saturation in generic templates (requires unique specialization)"
    ],
    sevenDayPlan: [
      { day: 1, title: "Niche Research", tasks: ["Analyze top 10 bestselling templates on Gumroad & Etsy", "Pick an underserved niche (e.g. Freelance Invoicing & Tax Tracker)"] },
      { day: 2, title: "Template Architecture", tasks: ["Build databases, formulas, filtered views, and dashboard summary"] },
      { day: 3, title: "Aesthetics & Polish", tasks: ["Add curated icons, clean typography, and onboarding instructions page"] },
      { day: 4, title: "Mockup Creation", tasks: ["Generate 4 high-resolution preview graphics in Canva showing key features"] },
      { day: 5, title: "Store Setup", tasks: ["Create Gumroad product listing, write clear feature bullets, set pricing at $9–$19 (₹499–₹999)"] },
      { day: 6, title: "Launch & Community Share", tasks: ["Post a helpful walkthrough on Reddit /r/Notion and Twitter with a free trial tier"] },
      { day: 7, title: "Iterate from Feedback", tasks: ["Incorporate first user suggestions and launch V1.1 update"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Advanced Notion formulas, database relations, and digital product packaging",
      resources: [
        { name: "Notion Help & Formula 2.0 Docs", url: "https://www.notion.so/help", free: true },
        { name: "Thomas Frank Notion Tutorials", url: "https://thomasjfrank.com/notion/", free: true }
      ],
      practiceProject: "Build a comprehensive Student Exam & Assignment Tracker with automated countdowns.",
      portfolioGoal: "1 complete template approved on Notion Marketplace with 20+ downloads.",
      firstGigAction: "Promote free edition to first 50 users to collect 5-star ratings and testimonials."
    },
    scamWarnings: [
      "Never buy expensive 'guaranteed 6-figure template masterclasses'.",
      "Do not copy other creator's copyrighted templates; build original layouts."
    ]
  },
  {
    id: "usertesting-app-feedback",
    title: "App & Website User Testing",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 0,
      currency: "INR",
      description: "₹0 - Absolutely no payment required to sign up or take tests."
    },
    timeRequired: {
      minHoursPerDay: 0.5,
      maxHoursPerDay: 1.5,
      label: "30–60 min/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Smartphone", "Internet connection"],
    requiredSkills: ["Speaking", "English", "Customer Support"],
    suitablePersonalities: ["Fast/simple tasks", "Working alone"],
    incomeGoals: ["Small extra income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "UserTesting.com & IntelliZoom Contributor Terms",
      sourceUrl: "https://www.usertesting.com/get-paid-to-test",
      platformFees: "No fees to tester; payout via PayPal",
      ageRestrictions: "18+ years old, requires verified PayPal"
    },
    howItWorks: "Companies pay real users to test their new mobile apps and websites while speaking their thoughts aloud into a microphone. Tests take 10–20 minutes and pay $4–$10 each.",
    whereToStart: [
      "Sign up on legitimate user testing websites (UserTesting.com, Trymata, IntelliZoom).",
      "Pass the quick practice test by following instructions and speaking your thought process clearly.",
      "Keep the tester dashboard tab open in your browser to respond quickly to screener surveys.",
      "Provide constructive, honest feedback on UI clarity and ease of navigation."
    ],
    platforms: [
      { name: "UserTesting", url: "https://www.usertesting.com/get-paid-to-test", description: "Leading usability testing platform ($4-$60/test)", feeInfo: "Zero platform fee to tester" },
      { name: "Trymata", url: "https://www.trymata.com", description: "Website usability testing site ($10/test)", feeInfo: "Paid via PayPal weekly" },
      { name: "Userlytics", url: "https://www.userlytics.com", description: "Mobile & desktop user feedback platform", feeInfo: "Direct PayPal payments" }
    ],
    pros: [
      "Zero technical skills or upfront money required",
      "Short sessions (15–20 minutes) fitting any spare time",
      "Real exposure to upcoming tech apps and consumer products"
    ],
    challenges: [
      "Tests are not guaranteed; you must pass demographic screener questions",
      "Cannot be relied upon for full-time income (best for pocket money)",
      "Requires quiet room and clear verbal communication"
    ],
    sevenDayPlan: [
      { day: 1, title: "Platform Applications", tasks: ["Register on UserTesting and Trymata", "Connect verified PayPal email"] },
      { day: 2, title: "Practice Test", tasks: ["Take the audio check and sample test", "Ensure microphone is crisp and speak continuously"] },
      { day: 3, title: "Profile Demographic Completion", tasks: ["Fill out all device and employment profile data accurately"] },
      { day: 4, title: "First Screeners", tasks: ["Attempt 5 screeners during peak notification hours"] },
      { day: 5, title: "Complete First Paid Test", tasks: ["Follow every test prompt carefully", "Speak aloud constantly about usability"] },
      { day: 6, title: "Secondary Site Signup", tasks: ["Sign up on Userlytics to increase daily test flow"] },
      { day: 7, title: "Review Rating", tasks: ["Check tester rating score and maintain 5-star feedback"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Clear verbal articulation and constructive usability analysis",
      resources: [
        { name: "UserTesting Contributor Tips", url: "https://support.usertesting.com", free: true },
        { name: "Nielsen Norman Usability 101", url: "https://www.nngroup.com/articles/usability-101-introduction-to-usability/", free: true }
      ],
      practiceProject: "Record yourself navigating any unfamiliar shopping website for 5 minutes explaining what is confusing.",
      portfolioGoal: "Pass the initial sample test with a 5-star tester badge.",
      firstGigAction: "Complete 2 screener tests daily."
    },
    scamWarnings: [
      "Any website asking YOU to pay money to receive tests is a scam. Real platforms never charge testers.",
      "Never test unauthorized financial APKs or input real credit card info during an unmonitored test."
    ]
  },
  {
    id: "technical-writing-docs",
    title: "Technical Writing & Developer Docs",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: true,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start using free platforms (Dev.to, Hashnode, Medium). Optional ₹500 for custom domain."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Writing", "Programming", "Python", "JavaScript", "React", "AI"],
    suitablePersonalities: ["Technical work", "Working alone", "Teaching"],
    incomeGoals: ["Side income", "Replace part-time income", "Develop a valuable skill"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Community Writers Programs (LogRocket, DigitalOcean, Twilio, Draft.dev)",
      sourceUrl: "https://draft.dev/write",
      platformFees: "Zero fees; companies pay $150–$500 per approved technical guide",
      ageRestrictions: "18+ for payment processing"
    },
    howItWorks: "Write step-by-step programming tutorials, API guides, and architectural overviews for tech companies and developer publications that sponsor technical writers.",
    whereToStart: [
      "Pick a specific technical topic you recently learned or solved (e.g. 'How to integrate OAuth in Next.js').",
      "Write 2 clear, error-free tutorials on free developer blogs (Hashnode or Dev.to) with working code snippets.",
      "Apply to established paid writer programs like LogRocket Content, DigitalOcean Community Authors, or Draft.dev.",
      "Submit an outline, write the draft upon approval, address technical reviewer feedback, and get paid."
    ],
    platforms: [
      { name: "Draft.dev", url: "https://draft.dev/write", description: "Curated technical writing agency for software engineers ($300-$500/article)", feeInfo: "Direct contractor payment" },
      { name: "LogRocket Blog", url: "https://blog.logrocket.com/become-a-writer/", description: "Developer blog accepting frontend and backend tutorials ($150-$350/article)", feeInfo: "Paid upon publication" },
      { name: "FreeCodeCamp News", url: "https://www.freecodecamp.org/news/developer-news-style-guide/", description: "Open contributor community to build proven authority", feeInfo: "Editorial mentorship" }
    ],
    pros: [
      "Substantial pay per article ($150 to $500 / ₹12,000 to ₹40,000)",
      "Builds massive public technical credibility and attracts job offers",
      "Completely asynchronous schedule"
    ],
    challenges: [
      "High quality bar: code samples must run flawlessly without bugs",
      "Editorial review processes can take 1–3 weeks per article"
    ],
    sevenDayPlan: [
      { day: 1, title: "Topic Ideation", tasks: ["Identify 3 specific developer pain points with search interest", "Formulate catchy tutorial titles"] },
      { day: 2, title: "Code Working Repository", tasks: ["Build a small GitHub repo containing clean, commented working code for the tutorial"] },
      { day: 3, title: "Write Specimen Article", tasks: ["Draft 1,200-word tutorial with step-by-step screenshots and code blocks on Hashnode"] },
      { day: 4, title: "Proofread & Publish", tasks: ["Run Grammarly and Hemmingway editor check", "Publish and distribute on LinkedIn & Dev.to"] },
      { day: 5, title: "Writer Program Applications", tasks: ["Submit applications to LogRocket and Draft.dev referencing your published article"] },
      { day: 6, title: "Pitch Outline", tasks: ["Draft a formal article outline with H2 headings and target audience key takeaways"] },
      { day: 7, title: "Submit Pitch", tasks: ["Submit pitch to editor and track status in spreadsheet"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Technical documentation clarity, Markdown formatting, and developer empathy",
      resources: [
        { name: "Google Technical Writing Courses", url: "https://developers.google.com/tech-writing", free: true },
        { name: "Divio Documentation System", url: "https://documentation.divio.com", free: true }
      ],
      practiceProject: "Write an end-to-end guide on setting up a REST API with Express and automated tests.",
      portfolioGoal: "2 published articles with live GitHub repo links.",
      firstGigAction: "Pitch 2 community publications with complete article outlines."
    },
    scamWarnings: [
      "Never pay any 'listing fee' or 'editorial processing fee' to write for a company.",
      "Legitimate publications always pay the writer, never the reverse."
    ]
  },
  {
    id: "video-editing-shortform",
    title: "Video Editing for Creators & Brands",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 using free CapCut or DaVinci Resolve on existing laptop/desktop. Optional ₹500–₹1,000 for asset packs."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Video Editing", "Content Creation", "Graphic Design"],
    suitablePersonalities: ["Creative work", "Working alone", "Fast/simple tasks"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "YouTube Creator Marketplace & YunoJuno Rate Reports",
      sourceUrl: "https://www.fiverr.com/categories/video-animation/short-video-ads",
      platformFees: "20% on Fiverr, 10% on Upwork, 0% via direct creator outreach",
      ageRestrictions: "16+ (platform payment rules apply)"
    },
    howItWorks: "Turn long YouTube videos, podcasts, and webinars into dynamic, viral YouTube Shorts, Instagram Reels, and TikToks with captions, sound effects, and b-roll.",
    whereToStart: [
      "Download free CapCut Desktop or DaVinci Resolve.",
      "Take 3 copyright-free podcast snippets (e.g. Lex Fridman, Huberman) and edit them into punchy 45-second vertical clips with animated captions.",
      "Upload clips to a public Google Drive or Notion portfolio showcasing before/after comparisons.",
      "Reach out directly to growing YouTubers, podcasters, or marketing agencies offering one free test edit to prove speed and quality."
    ],
    platforms: [
      { name: "YTJobs", url: "https://ytjobs.co", description: "Job board specifically connecting video editors with top YouTubers", feeInfo: "Free for job seekers" },
      { name: "Upwork Video Editing", url: "https://www.upwork.com/freelance-jobs/video-editing/", description: "Active marketplace for ongoing monthly creator retainers", feeInfo: "10% service fee" },
      { name: "Direct Outreach (X & LinkedIn)", url: "https://twitter.com", description: "Direct pitching to business owners and creators", feeInfo: "0% commission" }
    ],
    pros: [
      "Exploding demand as every business needs short-form video presence",
      "Quick turnaround times (1–2 days per batch)",
      "High potential for monthly retainer contracts (e.g. ₹25,000–₹60,000/mo per creator)"
    ],
    challenges: [
      "Rendering large files requires a reasonably capable computer",
      "Revisions and subjective client preferences require patience"
    ],
    sevenDayPlan: [
      { day: 1, title: "Master Tooling", tasks: ["Learn keyframe pacing, auto-captions, and jump-cuts in CapCut or Premiere"] },
      { day: 2, title: "Gather Raw Footage", tasks: ["Download 3 raw podcast interviews with CC licenses", "Identify high-retention 60-second hooks"] },
      { day: 3, title: "Edit Specimen 1 & 2", tasks: ["Add dynamic typography, sound design (whooshes, pops), and contextual b-roll"] },
      { day: 4, title: "Build Notion Showcase", tasks: ["Create a 1-page Notion portfolio with embedded video players and contact links"] },
      { day: 5, title: "Targeted Creator Scouting", tasks: ["Find 10 YouTubers with 10k–100k subscribers who currently lack vertical Shorts"] },
      { day: 6, title: "Send Custom Cold Pitches", tasks: ["Send 5 personalized emails with a 15-second sample specifically made from their recent video"] },
      { day: 7, title: "Negotiate First Retainer", tasks: ["Offer a 5-reels package at an accessible initial rate to lock in recurring monthly work"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Hook retention psychology, audio leveling, and modern motion typography",
      resources: [
        { name: "Finzar Video Editing Tutorials", url: "https://www.youtube.com/@Finzar", free: true },
        { name: "DaVinci Resolve Official Training", url: "https://www.blackmagicdesign.com/products/davinciresolve/training", free: true }
      ],
      practiceProject: "Edit 3 diverse clips: 1 educational talking-head, 1 product teaser, and 1 podcast snippet.",
      portfolioGoal: "A 3-video showcase demonstrating pacing, audio cleanup, and visual hooks.",
      firstGigAction: "Pitch 5 creators offering one complimentary sample edit."
    },
    scamWarnings: [
      "Always watermark your initial sample edits before receiving contract confirmation or deposit.",
      "Beware of clients asking for dozens of free trial edits without a milestone contract."
    ]
  },
  {
    id: "virtual-assistant-ops",
    title: "Virtual Assistance & Administrative Operations",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 0,
      currency: "INR",
      description: "₹0 - Requires only your computer, reliable internet, and basic office suite software."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day",
      flexible: true,
      weekendsOnlyViable: false
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection", "Smartphone"],
    requiredSkills: ["Customer Support", "Writing", "Speaking", "English", "Data Analysis"],
    suitablePersonalities: ["Fast/simple tasks", "Working with people", "Working alone"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Upwork & Belay Remote Assistant Industry Data",
      sourceUrl: "https://www.upwork.com/freelance-jobs/virtual-assistant/",
      platformFees: "Standard platform fee on Upwork/Freelancer",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Support busy executives, small business owners, and e-commerce stores with email management, calendar scheduling, web research, data entry, and basic customer inquiries.",
    whereToStart: [
      "Identify your core operational strengths (e.g. Google Sheets organization, inbox zero management, Shopify order tracking).",
      "Create clean profiles on Upwork, PeoplePerHour, and LinkedIn highlighting organizational reliability and English fluency.",
      "Apply to entry-level virtual assistance contracts specifying your timezone availability and fast response times."
    ],
    platforms: [
      { name: "Upwork Virtual Assistance", url: "https://www.upwork.com", description: "Largest category for remote administrative contracts", feeInfo: "10% service fee" },
      { name: "OnlineJobs.ph / Remote.co", url: "https://remote.co", description: "Dedicated remote job board for ongoing assistant positions", feeInfo: "Direct employer payroll" },
      { name: "PeoplePerHour", url: "https://www.peopleperhour.com", description: "Hourly freelance marketplace for task management", feeInfo: "Tiered platform fee" }
    ],
    pros: [
      "Low barrier to entry with fundamental computer skills",
      "Stable ongoing weekly hours with single clients",
      "Gain direct visibility into how profitable online businesses operate"
    ],
    challenges: [
      "Requires strict punctuality and attention to detail",
      "May require adjusting to client timezones (US/Europe hours)"
    ],
    sevenDayPlan: [
      { day: 1, title: "Skills Inventory", tasks: ["Test typing speed (aim for 55+ WPM)", "Review Google Sheets shortcuts and calendar scheduling tools (Calendly)"] },
      { day: 2, title: "Resume & Bio Crafting", tasks: ["Draft a clear, professional VA summary focusing on reliability and communication"] },
      { day: 3, title: "Platform Setup", tasks: ["Create profiles on Upwork and Contra", "Complete verification badges"] },
      { day: 4, title: "Proposal Templates", tasks: ["Draft customized proposals for 3 common tasks: Inbox Management, Data Research, Customer Support"] },
      { day: 5, title: "Active Applications", tasks: ["Submit 4 proposals on newly posted jobs under 24 hours old"] },
      { day: 6, title: "Interview Prep", tasks: ["Prepare for 15-minute Zoom interviews with clear microphone and quiet room"] },
      { day: 7, title: "First Task Onboarding", tasks: ["Establish clear communication cadence (daily Slack or WhatsApp update)"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Executive scheduling, CRM data entry (HubSpot/Notion), and asynchronous communication",
      resources: [
        { name: "Google Workspace Learning Center", url: "https://support.google.com/a/users", free: true },
        { name: "HubSpot Academy Free Inbound & CRM", url: "https://academy.hubspot.com", free: true }
      ],
      practiceProject: "Organize a mock event schedule with calendar invites, spreadsheet budget, and email templates.",
      portfolioGoal: "A 1-page PDF outlining tools mastered, typing speed certification, and availability.",
      firstGigAction: "Apply for 5 entry-level 10-hour/week assistant positions."
    },
    scamWarnings: [
      "Never accept jobs requiring you to receive checks, deposit them into personal accounts, or wire funds back.",
      "Beware of employers offering to send you funds to buy office equipment via private checks."
    ]
  },
  {
    id: "local-home-tutoring",
    title: "Local In-Person School Tutoring",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start. Optional ₹200–₹500 for printed flyers, notebook pads, or local classified ads."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (evenings)",
      flexible: false,
      weekendsOnlyViable: true
    },
    incomeModel: "Per session",
    locationType: "Local",
    requiredEquipment: ["Vehicle", "Workspace"],
    requiredSkills: ["Mathematics", "Science", "English", "Teaching", "Speaking"],
    suitablePersonalities: ["Teaching", "Working with people", "Physical work"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Local Community Tutoring Benchmarks & Urban Company/Superprof Local",
      sourceUrl: "https://www.urbancompany.com",
      platformFees: "0% if managed independently with local neighborhood parents",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Provide neighborhood school students (Grades 5–10) with structured in-person academic support in mathematics, science, or English at their home or your own study space.",
    whereToStart: [
      "Identify the curriculum and grades you are most comfortable coaching (e.g. CBSE / ICSE / State Board 8th–10th Grade Math).",
      "Create a professional 1-page flyer detailing your educational background, grades, and teaching approach.",
      "Share with apartment society WhatsApp groups, local community notice boards, or friends and relatives.",
      "Offer a free 1-hour diagnostic session to understand the student's problem areas."
    ],
    platforms: [
      { name: "Urban Company / Local Directory", url: "https://www.urbancompany.com", description: "Local verified home service & tutoring bookings", feeInfo: "Partner commission model" },
      { name: "Neighborhood Society Groups", url: "https://web.whatsapp.com", description: "Direct parent networking via residential associations", feeInfo: "0% fee, direct payment" },
      { name: "Superprof Local Search", url: "https://www.superprof.co.in", description: "Location-based student discovery platform", feeInfo: "Direct contact" }
    ],
    pros: [
      "Immediate weekly cash flow or monthly upfront retainers (₹3,000–₹8,000/month per student)",
      "High parent loyalty and word-of-mouth referrals once exam scores improve",
      "No reliance on competitive global bidding algorithms"
    ],
    challenges: [
      "Requires physical travel to student homes or having a quiet dedicated space",
      "Fixed evening time slots (typically 4:30 PM to 8:30 PM)"
    ],
    sevenDayPlan: [
      { day: 1, title: "Syllabus Review", tasks: ["Review recent textbook chapters and question paper patterns for chosen grade"] },
      { day: 2, title: "Flyer Design", tasks: ["Create a clean digital flyer in Canva with your credentials, subjects, and phone number"] },
      { day: 3, title: "Local Distribution", tasks: ["Post in local apartment community noticeboards and verified parent groups"] },
      { day: 4, title: "Sample Test Prep", tasks: ["Prepare a 15-question diagnostic test to assess prospective students"] },
      { day: 5, title: "Host Diagnostic Session", tasks: ["Conduct a 45-minute friendly diagnostic review with student and parent"] },
      { day: 6, title: "Confirm Schedule", tasks: ["Agree on days (e.g. Mon-Wed-Fri, 1 hour each) and confirm monthly fees"] },
      { day: 7, title: "First Paid Week Kickoff", tasks: ["Begin structured teaching with daily 10-minute recap quizzes"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Interactive explanation methods and exam stress management for young learners",
      resources: [
        { name: "Khan Academy Curricula", url: "https://www.khanacademy.org", free: true },
        { name: "NCERT Official Solutions", url: "https://ncert.nic.in", free: true }
      ],
      practiceProject: "Draft a 4-week exam revision timetable for 10th grade algebra.",
      portfolioGoal: "Positive feedback from 2 neighborhood families.",
      firstGigAction: "Enroll 2 students for 3 sessions per week."
    },
    scamWarnings: [
      "Always inform family members of physical home visit addresses before first in-person sessions.",
      "Never accept payments from unfamiliar parties asking you to refund overpaid checks."
    ]
  },
  {
    id: "micro-saas-automation-tools",
    title: "Micro-SaaS & Automation Micro-Tools",
    category: "Long-Term",
    mode: "Online",
    experienceLevel: ["Advanced", "Professional"],
    isBeginnerFriendly: false,
    isAdvanced: true,
    investment: {
      min: 500,
      max: 5000,
      currency: "INR",
      description: "₹500–₹5,000 for domain, database hosting (Supabase free tier / Render), and payment gateway setup (Stripe/Razorpay)."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Subscription",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AI"],
    suitablePersonalities: ["Building something long-term", "Technical work", "Working alone"],
    incomeGoals: ["Build a business", "Long-term wealth-building", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Indie Hackers & Product Hunt Verified Launches",
      sourceUrl: "https://www.indiehackers.com",
      platformFees: "Stripe/Razorpay 2-3% transaction fee",
      ageRestrictions: "18+ for legal entity & payment gateways"
    },
    howItWorks: "Build a focused single-purpose software tool or Chrome extension that solves a repetitive headache for a specific business niche (e.g. automated PDF invoice scraper, SEO meta tag checker, or WhatsApp message scheduler).",
    whereToStart: [
      "Find pain points by reading 1-star reviews of popular SaaS tools or browsing r/SaaS and Reddit complaints.",
      "Build a Minimum Viable Product (MVP) in 1–2 weeks using standard boilerplate (Next.js/React + Supabase).",
      "Launch on Product Hunt, Hacker News, and targeted niche communities.",
      "Charge a straightforward monthly subscription ($9–$29/mo or ₹499–₹1,999/mo) with a 7-day trial."
    ],
    platforms: [
      { name: "Product Hunt", url: "https://www.producthunt.com", description: "Global product discovery launch platform", feeInfo: "Free community launch" },
      { name: "Indie Hackers", url: "https://www.indiehackers.com", description: "Community of bootstrapped founders sharing metrics", feeInfo: "Free community" },
      { name: "Acquire.com", url: "https://acquire.com", description: "Marketplace to sell profitable micro-SaaS businesses", feeInfo: "Seller escrow fee" }
    ],
    pros: [
      "Predictable recurring subscription revenue (MRR)",
      "High equity valuation if you decide to sell the business later",
      "Extreme leverage: software works 24/7 without trading time for hours"
    ],
    challenges: [
      "Requires marketing & customer acquisition skills beyond pure coding",
      "Takes several months to validate and build meaningful revenue"
    ],
    sevenDayPlan: [
      { day: 1, title: "Pain Point Validation", tasks: ["Interview 3 prospective users or scrape 50 complaints about a specific workflow"] },
      { day: 2, title: "Scope Minimal Spec", tasks: ["Define the single core feature that saves 1 hour of manual work", "Skip bloated extras"] },
      { day: 3, title: "Build Core Engine", tasks: ["Implement core API logic or browser extension script"] },
      { day: 4, title: "Auth & Payments Integration", tasks: ["Integrate Supabase Auth and Stripe/LemonSqueezy checkout"] },
      { day: 5, title: "Landing Page & Demo Video", tasks: ["Build a high-converting 1-page explanation with an animated 30-second screen capture"] },
      { day: 6, title: "Beta User Outreach", tasks: ["Give 10 community members free 3-month access in exchange for critical feedback"] },
      { day: 7, title: "Launch Day", tasks: ["Post announcement on Product Hunt, Reddit, and Twitter/X"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Rapid MVP architecture, payment webhook handling, and customer distribution",
      resources: [
        { name: "Indie Hackers Guides", url: "https://www.indiehackers.com/start", free: true },
        { name: "Supabase Official Tutorials", url: "https://supabase.com/docs", free: true }
      ],
      practiceProject: "Build a Chrome extension that extracts all email addresses from a webpage to CSV.",
      portfolioGoal: "A deployed SaaS app with live payment integration and 5 active beta users.",
      firstGigAction: "Acquire first 3 paying customers at $15/month."
    },
    scamWarnings: [
      "Avoid 'SaaS in a box' automated resell schemes promising guaranteed passive income.",
      "Ensure compliant privacy policy and terms before handling user data."
    ]
  },
  {
    id: "content-creation-niche-channel",
    title: "Niche Educational Content Creation",
    category: "Long-Term",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 2000,
      currency: "INR",
      description: "₹0 using smartphone camera & free editing tools. Optional ₹1,500 for a budget lapel microphone."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Ad-based & sponsorships",
    locationType: "Remote",
    requiredEquipment: ["Smartphone", "Internet connection", "Laptop"],
    requiredSkills: ["Speaking", "Content Creation", "Video Editing", "Teaching"],
    suitablePersonalities: ["Creative work", "Teaching", "Building something long-term"],
    incomeGoals: ["Side income", "Build a business", "Develop a valuable skill"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "YouTube Partner Program & Substack Guidelines",
      sourceUrl: "https://www.youtube.com/creators/how-things-work/getting-started/",
      platformFees: "YouTube takes 45% of AdSense; creator keeps 55%",
      ageRestrictions: "18+ for AdSense account"
    },
    howItWorks: "Create helpful, concise video tutorials or visual breakdowns around a specific topic you know (e.g. Excel tricks, coding tutorials, personal finance basics, or exam preparation) on YouTube & social platforms.",
    whereToStart: [
      "Pick a specific niche with high search intent rather than broad vlogging (e.g. 'SQL queries explained for analysts').",
      "Write scripts answering the exact 10 most common beginner search queries in that topic.",
      "Record screen tutorials using free OBS Studio or talking head with your smartphone camera.",
      "Publish consistently once per week with clean thumbnails and keyword-rich titles."
    ],
    platforms: [
      { name: "YouTube", url: "https://www.youtube.com", description: "Long-form search-driven video and Shorts distribution", feeInfo: "Ad revenue split (55% to creator)" },
      { name: "Substack", url: "https://substack.com", description: "Direct newsletter subscriptions from dedicated readers", feeInfo: "10% fee on paid subscriptions" },
      { name: "LinkedIn Creator Mode", url: "https://linkedin.com", description: "B2B professional audience building for consulting deals", feeInfo: "Free organic distribution" }
    ],
    pros: [
      "Evergreen content continues earning ad revenue and views for years",
      "Attracts inbound freelance clients, sponsorships, and book deals",
      "Zero product inventory or complex logistics"
    ],
    challenges: [
      "Requires 3–6 months of consistent output before monetization threshold is reached",
      "Requires resilience against algorithm fluctuations"
    ],
    sevenDayPlan: [
      { day: 1, title: "Niche Keyword Audit", tasks: ["Use YouTube search autocomplete to list 20 searched tutorial questions"] },
      { day: 2, title: "Script First 3 Videos", tasks: ["Write concise 5-minute outlines focusing on immediate answers without 2-minute intros"] },
      { day: 3, title: "Recording Setup", tasks: ["Test lighting (face a window), check audio with smartphone, record Video 1"] },
      { day: 4, title: "Editing & Graphics", tasks: ["Edit in CapCut, trim pauses, add zoom-ins and screen markers"] },
      { day: 5, title: "Design High-CTR Thumbnail", tasks: ["Create 1 clean thumbnail in Canva with high-contrast text and 3 key words"] },
      { day: 6, title: "Publish & SEO Setup", tasks: ["Upload video, add detailed timestamps in description, set relevant tags"] },
      { day: 7, title: "Community Interaction", tasks: ["Reply to every comment and post short teaser on LinkedIn/X"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Audience retention scripting, thumbnail psychology, and storytelling",
      resources: [
        { name: "YouTube Creator Academy", url: "https://creatoracademy.youtube.com", free: true },
        { name: "HubSpot Guide to Video Marketing", url: "https://blog.hubspot.com/marketing/video-marketing", free: true }
      ],
      practiceProject: "Record and edit a 3-minute tutorial demonstrating a single useful software tip.",
      portfolioGoal: "Upload 5 high-quality videos and achieve 100 organic subscribers.",
      firstGigAction: "Reach eligibility criteria for YouTube Partner Program (1,000 subs + 4,000 watch hours)."
    },
    scamWarnings: [
      "Never purchase fake views, watch time, or subscribers—this leads to permanent channel termination.",
      "Beware of emails offering sponsor deals that ask you to download a password-protected zip file (malware)."
    ]
  },
  {
    id: "local-delivery-logistics",
    title: "Flexible Local Logistics & Delivery Partner",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 to ₹1,000 for platform onboarding/bag deposit depending on provider. Requires owning or renting a bike/bicycle."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 6,
      label: "2–6 hours/day (flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per delivery/task",
    locationType: "Local",
    requiredEquipment: ["Smartphone", "Vehicle"],
    requiredSkills: ["Driving", "Customer Support"],
    suitablePersonalities: ["Physical work", "Working alone", "Fast/simple tasks"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Zomato, Swiggy, Zepto, Blinkit & DoorDash Delivery Partner Documentation",
      sourceUrl: "https://www.zomato.com/deliver-with-us",
      platformFees: "Direct payouts per delivery plus surge/peak incentives",
      ageRestrictions: "18+ years old with valid driving license and ID"
    },
    howItWorks: "Earn immediate daily or weekly payouts by fulfilling on-demand food, grocery, or parcel deliveries using your bicycle, bike, or car during flexible peak hours (lunch and dinner shifts).",
    whereToStart: [
      "Verify you possess valid personal ID, bank account, smartphone, and vehicle registration/license.",
      "Download delivery partner apps (Zomato Rider, Swiggy Delivery, Zepto, Blinkit, DoorDash or Uber Eats depending on country).",
      "Complete document verification and bag/onboarding setup.",
      "Go online during high-incentive peak hours (12 PM–3 PM and 7 PM–10 PM)."
    ],
    platforms: [
      { name: "Zomato / Swiggy Delivery", url: "https://www.zomato.com/deliver-with-us", description: "Food delivery partner with weekly payouts", feeInfo: "Direct per-order payout + incentives" },
      { name: "Zepto / Blinkit Quick Commerce", url: "https://www.blinkit.com", description: "Dark-store grocery delivery within tight 2-3km radius", feeInfo: "Per-order delivery fee" },
      { name: "DoorDash / Uber Eats (Global)", url: "https://www.doordash.com/dasher/signup/", description: "Leading food delivery platforms in US/UK/Canada/Australia", feeInfo: "Base pay + 100% customer tips" }
    ],
    pros: [
      "Virtually instant onboarding and prompt weekly/daily cash payouts",
      "Total control over when you turn the app on or off",
      "No client pitching, interviewing, or long sales cycles"
    ],
    challenges: [
      "Physical fatigue from city traffic and extreme weather (rain/heat)",
      "Vehicle fuel, wear-and-tear, and maintenance expenses must be factored in"
    ],
    sevenDayPlan: [
      { day: 1, title: "Document Verification", tasks: ["Gather driving license, vehicle insurance, PAN/ID, and bank details"] },
      { day: 2, title: "App Onboarding", tasks: ["Submit application on Zomato Rider or local partner app"] },
      { day: 3, title: "Safety & Equipment Check", tasks: ["Inspect bike brakes, tire pressure, phone mount, and portable power bank"] },
      { day: 4, title: "First 2 Practice Deliveries", tasks: ["Go online during quiet off-peak afternoon to learn store pickup and drop-off flow"] },
      { day: 5, title: "Peak Shift Execution", tasks: ["Work a 3-hour dinner shift (7 PM–10 PM) in a restaurant-dense commercial zone"] },
      { day: 6, title: "Incentive Tracking", tasks: ["Check milestone bonuses for completing a target batch of orders"] },
      { day: 7, title: "Weekly Net Payout Review", tasks: ["Calculate fuel expense against total earnings to determine real net profit per hour"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Efficient neighborhood route planning and safe urban navigation",
      resources: [
        { name: "Local Traffic Safety Guidelines", url: "https://morth.nic.in", free: true },
        { name: "Partner App Safety Training Modules", url: "https://www.zomato.com", free: true }
      ],
      practiceProject: "Map the top 5 high-density restaurant clusters in your 5km area.",
      portfolioGoal: "Complete 25 deliveries maintaining a 4.8+ customer rating.",
      firstGigAction: "Turn app on for your first dinner shift."
    },
    scamWarnings: [
      "Never pay unauthorized third-party 'agents' who claim to get you approved faster; always use official partner apps.",
      "Never share OTPs with customers over the phone before handing over the package."
    ]
  },
  {
    id: "remote-qa-software-testing",
    title: "Remote Quality Assurance & Software Testing",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 0,
      currency: "INR",
      description: "₹0 - Absolutely free to sign up and participate."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Smartphone", "Internet connection"],
    requiredSkills: ["Writing", "Data Analysis", "HTML/CSS", "English"],
    suitablePersonalities: ["Technical work", "Working alone", "Fast/simple tasks"],
    incomeGoals: ["Small extra income", "Side income", "Develop a valuable skill"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "uTest (Applause) & Testlio Tester Community Standards",
      sourceUrl: "https://www.utest.com",
      platformFees: "Zero fees; payouts per approved bug ($5–$50) and test case execution",
      ageRestrictions: "18+ years old, PayPal or Payoneer account"
    },
    howItWorks: "Get paid to find bugs, crash logs, and visual flaws in pre-release versions of major commercial web applications, video streaming apps, and fintech tools.",
    whereToStart: [
      "Register on uTest.com (the world's largest community of freelance software testers).",
      "Complete the free uTest Academy courses (takes 3–5 days to learn how to write high-value bug reports).",
      "Participate in practice sandbox test cycles to receive your first verified tester rating.",
      "Accept paid test cycle invitations tailored to your specific smartphone and computer models."
    ],
    platforms: [
      { name: "uTest", url: "https://www.utest.com", description: "Global QA crowdtesting platform operated by Applause", feeInfo: "Free membership, paid per valid bug/case" },
      { name: "Testlio", url: "https://testlio.com", description: "Guaranteed hourly rate testing platform for experienced QA testers", feeInfo: "Hourly compensation model ($15-$30/hr)" },
      { name: "Testbirds", url: "https://www.testbirds.com", description: "European crowdtesting network for usability & functional bugs", feeInfo: "Direct euro bank transfer / PayPal" }
    ],
    pros: [
      "Real exposure to actual commercial software testing tools (Charles Proxy, Android Logcat)",
      "Legitimate pathway into lucrative full-time Quality Assurance engineering careers",
      "Work from home at whatever hour suits you"
    ],
    challenges: [
      "Bug reports must follow rigorous formatting rules (repro steps, logs, screen recording)",
      "Duplicate bugs reported by another tester first will not be paid"
    ],
    sevenDayPlan: [
      { day: 1, title: "Account & Device Setup", tasks: ["Sign up on uTest, list all phones, laptops, and OS versions you own"] },
      { day: 2, title: "uTest Academy Course 1", tasks: ["Study how to write step-by-step reproduction steps and bug titles"] },
      { day: 3, title: "uTest Academy Course 2", tasks: ["Learn how to capture screen recordings with touch indicators and extract browser console logs"] },
      { day: 4, title: "Academy Practice Cycle", tasks: ["Join the sandbox test cycle, report 1 mock bug, and await review"] },
      { day: 5, title: "Incorporate Academy Feedback", tasks: ["Address reviewer notes to graduate with a Bronze/Silver tester rating"] },
      { day: 6, title: "First Paid Invitation", tasks: ["Accept incoming test cycle invite and review test scope instructions thoroughly"] },
      { day: 7, title: "Submit Approved Bug", tasks: ["Log your first verified bug with complete screen recording and receive payout approval"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Bug report taxonomy, network log capture, and edge-case testing methodologies",
      resources: [
        { name: "uTest Academy (Interactive)", url: "https://www.utest.com/academy", free: true },
        { name: "Ministry of Testing Community Guides", url: "https://www.ministryoftesting.com", free: true }
      ],
      practiceProject: "Test an open-source web application and document 3 visual and functional bugs.",
      portfolioGoal: "Achieve 'Rated' tester status on uTest with 3 approved bug reports.",
      firstGigAction: "Complete the uTest Academy 16 cycle."
    },
    scamWarnings: [
      "Legitimate QA platforms will never ask you to pay an application fee to join.",
      "Never install unverified root certificates on personal devices unless in a sandboxed testing environment."
    ]
  },
  {
    id: "graphic-design-branding-kits",
    title: "Graphic Design & Social Branding Kits",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 using free Figma or Canva. Optional ₹500–₹1,000 for font licenses or asset packs."
    },
    timeRequired: {
      minHoursPerDay: 1.5,
      maxHoursPerDay: 3.5,
      label: "1.5–3.5 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Graphic Design", "UI/UX", "Drawing"],
    suitablePersonalities: ["Creative work", "Working alone", "Working with people"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Behance & Dribbble Freelance Market Rates",
      sourceUrl: "https://www.behance.net/joblist",
      platformFees: "20% on Fiverr, 10% on Upwork, 0% on direct client invoices",
      ageRestrictions: "18+ for payment processing"
    },
    howItWorks: "Create cohesive visual brand packages for small businesses, startup founders, and influencers: including logo marks, color palettes, Instagram carousel templates, and slide decks in Figma or Canva.",
    whereToStart: [
      "Pick a specific design focus (e.g., modern visual brand identity for boutique coffee brands or tech startups).",
      "Build 3 comprehensive concept case studies in Figma and showcase them on Behance and Instagram.",
      "Package your offerings into transparent fixed-price tiers (e.g. Starter Logo Kit: ₹3,500 / $75; Full Brand Package: ₹12,000 / $250).",
      "Network with newly registered businesses and indie developers who need polished visuals."
    ],
    platforms: [
      { name: "Behance", url: "https://www.behance.net", description: "Adobe's global creative portfolio discovery network", feeInfo: "Free portfolio showcase" },
      { name: "Fiverr Pro Design", url: "https://www.fiverr.com", description: "Direct order marketplace for branding and logo packages", feeInfo: "20% commission" },
      { name: "Dribbble", url: "https://dribbble.com", description: "Top-tier design inspiration and inbound client inquiries", feeInfo: "Pro subscription optional" }
    ],
    pros: [
      "Highly visual portfolio instantly proves competence to clients",
      "Repeat demand: clients who love their logo return for brochures, decks, and banners",
      "Can be completed from anywhere on your own schedule"
    ],
    challenges: [
      "Subjective feedback cycles: must learn to establish revisions limits in contracts",
      "Requires developing a strong sense of typography, contrast, and color theory"
    ],
    sevenDayPlan: [
      { day: 1, title: "Tool Mastery & Inspiration", tasks: ["Master Figma components, auto-layout, and color styles", "Analyze 10 top brand identity projects on Behance"] },
      { day: 2, title: "Create Spec Project 1", tasks: ["Design complete branding kit for a fictitious eco-friendly skincare brand"] },
      { day: 3, title: "Create Spec Project 2", tasks: ["Design high-converting social media carousel pack for an AI startup in Figma"] },
      { day: 4, title: "Format Behance Case Study", tasks: ["Package mockups in realistic device frames and explain the design thinking"] },
      { day: 5, title: "Create Service Menu", tasks: ["Draft a 1-page PDF pricing sheet with 3 packaged tiers and deliverable timelines"] },
      { day: 6, title: "Outreach & Inquiries", tasks: ["Reach out to 5 local businesses whose current logos are low-resolution or outdated"] },
      { day: 7, title: "Launch Promo", tasks: ["Offer a first-order discount in exchange for a glowing video testimonial"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Vector precision, typography pairing, and client design presentation",
      resources: [
        { name: "Figma Community Tutorials", url: "https://help.figma.com", free: true },
        { name: "The Futur Design Business Guides", url: "https://thefutur.com", free: true }
      ],
      practiceProject: "Create a complete visual identity kit: logo, 5 social templates, business card, and color style guide.",
      portfolioGoal: "2 published Behance case studies with 50+ appreciations.",
      firstGigAction: "Close first ₹5,000 / $100 branding package."
    },
    scamWarnings: [
      "Always obtain a 50% non-refundable upfront deposit before starting custom vector work.",
      "Send low-resolution watermarked previews until final milestone payment is received."
    ]
  },
  {
    id: "local-tech-repair-setup",
    title: "Local Smartphone Repair & Smart Home Setup",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 1000,
      max: 3000,
      currency: "INR",
      description: "₹1,000–₹3,000 for precision electronics screwdriver set (e.g. iFixit or equivalent), pry tools, and heat pad."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 4,
      label: "1–4 hours/day (weekends/evenings)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Local",
    requiredEquipment: ["Smartphone", "Workspace"],
    requiredSkills: ["Repair", "Technical work"],
    suitablePersonalities: ["Physical work", "Technical work", "Working alone"],
    incomeGoals: ["Side income", "Replace part-time income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "iFixit Repair Industry Data & Local Service Benchmarks",
      sourceUrl: "https://www.ifixit.com",
      platformFees: "0% for independent local clients; 15-20% on Urban Company/TaskRabbit",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Provide doorstep or home-based electronics repair (screen replacement, battery swaps, data migration, thermal paste application) and smart-home Wi-Fi setups for local residents.",
    whereToStart: [
      "Acquire a standard 64-bit precision screwdriver toolkit.",
      "Practice screen and battery replacements on old family phones using iFixit video guides.",
      "List your services in neighborhood groups, society notices, or local online classifieds.",
      "Quote transparent component cost + reasonable service labor fee (e.g. ₹500–₹1,500 per job)."
    ],
    platforms: [
      { name: "Urban Company Partner", url: "https://www.urbancompany.com", description: "Verified electronics and appliance repair bookings", feeInfo: "Platform partner commission" },
      { name: "TaskRabbit (US/UK/Canada)", url: "https://www.taskrabbit.com", description: "Handyman and tech installation marketplace", feeInfo: "Client service fee model" },
      { name: "Local Community WhatsApp", url: "https://web.whatsapp.com", description: "Direct neighborhood trust-based referrals", feeInfo: "0% commission" }
    ],
    pros: [
      "High local customer urgency: people need their broken phones fixed today",
      "Immediate cash/UPI payments upon successful repair completion",
      "Very high margins on service labor"
    ],
    challenges: [
      "Risk of damaging delicate components if not patient and methodical",
      "Must source verified genuine replacement parts from reliable local suppliers"
    ],
    sevenDayPlan: [
      { day: 1, title: "Kit Assembly", tasks: ["Procure precision screwdriver kit, spudgers, suction cups, and isopropyl alcohol"] },
      { day: 2, title: "Practice Teardown", tasks: ["Disassemble and reassemble an old non-working smartphone following iFixit step-by-step"] },
      { day: 3, title: "Supplier Sourcing", tasks: ["Identify reliable wholesale supplier for replacement displays and batteries in your city"] },
      { day: 4, title: "Price List Formulation", tasks: ["Draft price menu for top 5 common models (iPhone battery, Samsung display, thermal paste)"] },
      { day: 5, title: "Community Announcement", tasks: ["Post in housing society group offering doorstep battery replacements and tech setups"] },
      { day: 6, title: "Perform First Service", tasks: ["Arrive on time, test device in front of customer, perform clean repair, and confirm full operation"] },
      { day: 7, title: "Follow-up & Referral", tasks: ["Message customer next day checking battery health and ask for a local recommendation"] }
    ],
    learningRoadmap: {
      currentSkillGap: "SMD safety, ribbon cable handling, and electrostatic discharge precautions",
      resources: [
        { name: "iFixit Free Repair Guides", url: "https://www.ifixit.com/Guide", free: true },
        { name: "Louis Rossmann Repair Tutorials", url: "https://www.youtube.com/@rossmanngroup", free: true }
      ],
      practiceProject: "Successfully replace an iPhone or Android battery and clean charge port without damaging adhesives.",
      portfolioGoal: "5 successful repairs with zero component damage and 5-star customer ratings.",
      firstGigAction: "Offer free labor on first 2 neighbor battery swaps (client pays only wholesale part cost)."
    },
    scamWarnings: [
      "Always have customer sign an intake form confirming pre-existing cosmetic flaws or water damage.",
      "Never accept stolen devices; always ensure the customer can unlock the device in your presence."
    ]
  },
  {
    id: "translation-localization-pro",
    title: "Language Translation & Localization Services",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 0,
      currency: "INR",
      description: "₹0 - Requires only your native language fluency, computer, and text editor."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Translation", "Writing", "English", "Speaking"],
    suitablePersonalities: ["Working alone", "Technical work", "Fast/simple tasks"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "ProZ & Gengo Translator Standards",
      sourceUrl: "https://www.proz.com",
      platformFees: "Gengo pays fixed per-word rates; Upwork 10% service fee",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Translate documents, app strings, marketing subtitles, and instructional manuals between English and your fluent regional or national languages (Hindi, Spanish, German, Tamil, Bengali, French, etc.).",
    whereToStart: [
      "Sign up on reputable translation platforms like Gengo, ProZ, or TranslatorsCafe.",
      "Pass the standardized language proficiency test demonstrating accurate nuance and grammar.",
      "Accept available translation jobs with per-word compensation (typically $0.03–$0.08 per word / ₹1.5–₹4 per word)."
    ],
    platforms: [
      { name: "ProZ", url: "https://www.proz.com", description: "The premier global marketplace and directory for professional translators", feeInfo: "Direct client contracts" },
      { name: "Gengo (Lionbridge)", url: "https://gengo.com/translators/", description: "On-demand translation portal with transparent per-word pay", feeInfo: "Direct PayPal payments" },
      { name: "Upwork Translation", url: "https://www.upwork.com", description: "Direct job postings for document localization and subtitles", feeInfo: "10% platform fee" }
    ],
    pros: [
      "Monetizes a natural skill (multilingual fluency) with zero software purchases",
      "Flexible schedule with clear per-word milestones",
      "Consistent global demand as businesses localize products for regional markets"
    ],
    challenges: [
      "Requires rigorous attention to grammar, tone, and cultural nuance (machine translation is insufficient)",
      "Must pass initial qualification tests to access highest paying jobs"
    ],
    sevenDayPlan: [
      { day: 1, title: "Language Pair Audit", tasks: ["Define primary language pair (e.g. English to Hindi/Spanish) and subject specialization (e.g. Tech, Legal, or Marketing)"] },
      { day: 2, title: "Platform Signups", tasks: ["Create profiles on ProZ and register for Gengo translator test"] },
      { day: 3, title: "Take Proficiency Exam", tasks: ["Complete the qualification test with careful review of punctuation and idiomatic phrasing"] },
      { day: 4, title: "Build Translation Samples", tasks: ["Translate a 500-word software landing page into your target language to use as portfolio proof"] },
      { day: 5, title: "Apply to Upwork Contracts", tasks: ["Submit 3 targeted bids for subtitle translation or document localization"] },
      { day: 6, title: "CAT Tool Familiarization", tasks: ["Explore free open-source Computer Assisted Translation tools (OmegaT)"] },
      { day: 7, title: "Deliver First Paid Job", tasks: ["Deliver translation ahead of deadline with double proofreading pass"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Localization industry terminology, glossaries, and CAT tool workflows",
      resources: [
        { name: "ProZ Translator Education Center", url: "https://www.proz.com/training", free: true },
        { name: "American Translators Association Guides", url: "https://www.atanet.org", free: true }
      ],
      practiceProject: "Translate a 1,000-word terms of service document and generate a bilingual glossary.",
      portfolioGoal: "Approved certified translator status on Gengo.",
      firstGigAction: "Complete a 1,500-word paid project."
    },
    scamWarnings: [
      "Never accept projects from clients asking you to translate 50 pages 'as a free test' before payment.",
      "Legitimate tests are short (under 250 words) and conducted on verified platform testing portals."
    ]
  },
  {
    id: "data-analysis-excel-sql",
    title: "Freelance Data Cleaning & Dashboard Building",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: true,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 using Google Sheets & free Power BI Desktop / Python. Optional ₹1,000 for Microsoft Excel license."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Data Analysis", "SQL", "Python", "HTML/CSS"],
    suitablePersonalities: ["Technical work", "Working alone", "Fast/simple tasks"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Upwork & Toptal Data Analytics Market Reports",
      sourceUrl: "https://www.upwork.com/freelance-jobs/data-analytics/",
      platformFees: "10% service fee on Upwork, 20% on Fiverr",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Help small and medium businesses clean messy spreadsheet data, write SQL queries, automate repetitive data exports, and create executive dashboards in Power BI, Tableau, or Google Looker Studio.",
    whereToStart: [
      "Master essential business formulas in Excel/Google Sheets (INDEX/MATCH, XLOOKUP, Pivot Tables, Power Query).",
      "Build 2 interactive dashboards using real public business datasets (e.g. Kaggle e-commerce sales or SaaS churn).",
      "Publish dashboards with video walkthroughs on LinkedIn and portfolio link.",
      "Bid on spreadsheet automation and data visualization projects on Upwork and Contra."
    ],
    platforms: [
      { name: "Upwork Data Analysis", url: "https://www.upwork.com", description: "High volume of ongoing spreadsheet and business intelligence contracts", feeInfo: "10% fee" },
      { name: "Fiverr Data Services", url: "https://www.fiverr.com", description: "Direct gig packages for Excel automation and dashboard design", feeInfo: "20% fee" },
      { name: "Kaggle", url: "https://www.kaggle.com", description: "Host public data notebooks to establish demonstrable technical expertise", feeInfo: "Free community" }
    ],
    pros: [
      "Almost every business has messy data they struggle to make sense of",
      "Clear deliverables: a functioning dashboard or automated script speaks for itself",
      "High hourly billing potential ($25–$75/hr / ₹2,000–₹6,000/hr as proficiency grows)"
    ],
    challenges: [
      "Client data is often unstructured and poorly documented",
      "Requires strong business acumen to understand what metrics executives actually care about"
    ],
    sevenDayPlan: [
      { day: 1, title: "Dataset Selection", tasks: ["Download clean multi-table sales dataset from Kaggle or data.gov"] },
      { day: 2, title: "Data Transformation", tasks: ["Clean nulls, standardize date formats, and model relationships in Power BI or Google Sheets"] },
      { day: 3, title: "Dashboard Design", tasks: ["Build 4 key KPI cards, sales trendline, and dynamic category filters"] },
      { day: 4, title: "Case Study Writeup", tasks: ["Write a 300-word explanation of what business decisions this dashboard enables"] },
      { day: 5, title: "Marketplace Listing", tasks: ["Create Fiverr gig 'I will build an interactive executive dashboard in Power BI / Excel'"] },
      { day: 6, title: "Direct Outreach", tasks: ["Connect with 10 marketing agency owners offering a free 15-minute audit of their reporting spreadsheets"] },
      { day: 7, title: "First Contract Delivery", tasks: ["Deliver dashboard file with documented README and video walkthrough"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Power Query ETL pipelines, DAX formulas, and visual dashboard hierarchy",
      resources: [
        { name: "Alex The Analyst Data Bootcamp", url: "https://www.youtube.com/@AlexTheAnalyst", free: true },
        { name: "Microsoft Learn Power BI", url: "https://learn.microsoft.com/en-us/power-bi/", free: true }
      ],
      practiceProject: "Build an end-to-end Financial Performance Dashboard tracking profit, margins, and customer lifetime value.",
      portfolioGoal: "A live interactive dashboard hosted on Looker Studio or Power BI Web.",
      firstGigAction: "Apply for 3 small spreadsheet cleanup contracts."
    },
    scamWarnings: [
      "Never accept data entry gigs that ask you to pay a 'security deposit' or 'stamp paper fee'. Real data jobs never charge the contractor.",
      "Ensure non-disclosure agreements (NDAs) are signed before viewing proprietary client customer data."
    ]
  },
  {
    id: "affiliate-niche-content",
    title: "Affiliate & Niche Review Content Website",
    category: "Low-Investment",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 500,
      max: 3000,
      currency: "INR",
      description: "₹500–₹3,000 for 1-year domain name (.com/.in) and budget shared hosting (Hostinger/Namecheap) or free on Substack/Medium."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 2.5,
      label: "1–2.5 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Commission / Performance",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Writing", "Content Creation", "English", "Marketing"],
    suitablePersonalities: ["Writing", "Working alone", "Building something long-term"],
    incomeGoals: ["Side income", "Build a business", "Long-term wealth-building"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Amazon Associates & ShareASale Affiliate Operating Guidelines",
      sourceUrl: "https://affiliate-program.amazon.in",
      platformFees: "Free to join affiliate programs; commission ranges 1%–15% on physical goods, 20%–40% on SaaS software",
      ageRestrictions: "18+ years old for tax forms"
    },
    howItWorks: "Write honest, thorough product comparisons, buying guides, and software reviews in a specific niche (e.g. home office setups, mechanical keyboards, coffee equipment, or developer SaaS). When readers purchase via your affiliate links, you earn a commission at no extra cost to them.",
    whereToStart: [
      "Choose a specialized product category you personally use and understand.",
      "Apply to legitimate affiliate programs (Amazon Associates, Impact.com, ShareASale, or direct SaaS partner programs).",
      "Write in-depth 'X vs Y' and 'Best [Category] for [Specific User]' review articles detailing pros, cons, and real testing observations.",
      "Comply strictly with FTC and advertising disclosure laws by placing clear disclaimers."
    ],
    platforms: [
      { name: "Amazon Associates", url: "https://affiliate-program.amazon.com", description: "Largest global physical goods affiliate network", feeInfo: "Free to join, tiered commission" },
      { name: "Impact.com", url: "https://impact.com", description: "Premier network for major brands, software, and retail partnerships", feeInfo: "Direct merchant payouts" },
      { name: "Rewardful / Direct SaaS", url: "https://www.rewardful.com", description: "Recurring 20-30% monthly commissions promoting business software", feeInfo: "Monthly recurring payouts" }
    ],
    pros: [
      "Passive recurring revenue potential once content ranks or builds organic traffic",
      "No customer support, fulfillment, or shipping headaches",
      "Scales without trading your personal hours for fixed wages"
    ],
    challenges: [
      "Takes 3–6 months for search engines to rank new articles",
      "Search algorithm updates can affect traffic volumes"
    ],
    sevenDayPlan: [
      { day: 1, title: "Niche & Keyword Discovery", tasks: ["Find 10 low-competition search queries using Google Keyword Planner or Ahrefs free tools"] },
      { day: 2, title: "Site Setup", tasks: ["Set up a lightweight WordPress blog or clean Substack publication"] },
      { day: 3, title: "Write Benchmark Review 1", tasks: ["Write 1,500-word comprehensive review of a product you own with original photos"] },
      { day: 4, title: "Affiliate Disclosures & Compliance", tasks: ["Add mandatory FTC affiliate disclaimer at top of every post and privacy policy page"] },
      { day: 5, title: "Write Comparison Article 2", tasks: ["Write 'Product A vs Product B: Which Should You Buy in 2026?' with comparison table"] },
      { day: 6, title: "Affiliate Program Signups", tasks: ["Apply to Amazon Associates and 2 direct SaaS partner programs"] },
      { day: 7, title: "Link Insertion & Social Syndication", tasks: ["Embed tracking links and share key insights on Reddit & Pinterest"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Search Intent analysis, on-page SEO, and conversion rate copywriting",
      resources: [
        { name: "Ahrefs Beginner SEO Course", url: "https://ahrefs.com/academy/seo-training-course", free: true },
        { name: "Google Search Central SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", free: true }
      ],
      practiceProject: "Write an in-depth buying guide comparing the top 3 budget microphones for remote work.",
      portfolioGoal: "5 published comprehensive review articles indexed in Google Search.",
      firstGigAction: "Generate first qualified affiliate click and sale."
    },
    scamWarnings: [
      "Never buy into 'guaranteed turnkey affiliate websites' that charge thousands of dollars for copied content.",
      "Always disclose affiliate links clearly to comply with consumer protection regulations."
    ]
  },
  {
    id: "local-event-photography",
    title: "Local Event & Portrait Photography",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 3000,
      currency: "INR",
      description: "₹0 if you already own a DSLR/Mirrorless camera. Optional ₹1,500–₹3,000 for renting a fast prime lens or flash for your first paid event."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 6,
      label: "2–6 hours/event (weekends)",
      flexible: false,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / hourly",
    locationType: "Local",
    requiredEquipment: ["Camera", "Vehicle", "Laptop"],
    requiredSkills: ["Photography", "Graphic Design"],
    suitablePersonalities: ["Creative work", "Working with people", "Physical work"],
    incomeGoals: ["Side income", "Replace part-time income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Professional Photographers Association & Local Event Benchmarks",
      sourceUrl: "https://www.ppa.com",
      platformFees: "0% for independent bookings; direct client payment",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Shoot local community events, birthday celebrations, corporate meetups, and family portrait sessions on weekends, providing edited high-resolution photo galleries to clients.",
    whereToStart: [
      "Compile your best 15–20 photographs into a simple digital portfolio (Instagram page or free Pixieset gallery).",
      "Offer to photograph a friend's family gathering or small local event for a nominal fee to build event-specific portfolio shots.",
      "Package your offerings clearly: e.g. 2-Hour Birthday Shoot + 50 Edited Photos: ₹5,000 / $150.",
      "Network with local event planners, cake artists, and venue managers who constantly refer photographers."
    ],
    platforms: [
      { name: "Pixieset", url: "https://pixieset.com", description: "Professional client gallery delivery with download tracking", feeInfo: "Free tier available" },
      { name: "Instagram / Meta Local", url: "https://instagram.com", description: "Primary visual search engine for local event photography", feeInfo: "Free organic showcase" },
      { name: "Urban Company / Bark", url: "https://www.bark.com", description: "Lead generation marketplace for local photography gigs", feeInfo: "Pay-per-lead model" }
    ],
    pros: [
      "Weekend-only work that never conflicts with weekday jobs or studies",
      "High perceived emotional value: clients gladly pay for memories",
      "Direct referrals: every party has 30–50 guests who may need a photographer soon"
    ],
    challenges: [
      "Requires owning or renting decent camera gear and mastering low-light flash",
      "Editing hundreds of raw photos in Lightroom takes discipline and time"
    ],
    sevenDayPlan: [
      { day: 1, title: "Curate Portfolio", tasks: ["Select top 20 portraits and candid shots", "Create a dedicated Instagram handle and Pixieset link"] },
      { day: 2, title: "Gear Readiness", tasks: ["Test camera sensors, clean lenses, charge dual batteries, and format dual SD cards"] },
      { day: 3, title: "Package Definition", tasks: ["Create a 1-page PDF pricing guide for Birthdays, Pre-weddings, and Corporate headshots"] },
      { day: 4, title: "Partner Outreach", tasks: ["Visit 3 local party venues and boutique bakers, offering reciprocal client referrals"] },
      { day: 5, title: "Book Specimen Shoot", tasks: ["Conduct a 1-hour outdoor golden-hour portrait session to generate fresh marketing reels"] },
      { day: 6, title: "Post-Processing Workflow", tasks: ["Batch cull in Photo Mechanic and apply consistent color grade in Lightroom"] },
      { day: 7, title: "Client Delivery Setup", tasks: ["Upload gallery to Pixieset, set up password protection, and send preview link"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Off-camera flash synchronization, event candids composition, and batch color grading",
      resources: [
        { name: "Fstoppers Photography Tutorials", url: "https://fstoppers.com/education", free: true },
        { name: "Adobe Lightroom Official Guides", url: "https://helpx.adobe.com/lightroom-classic/tutorials.html", free: true }
      ],
      practiceProject: "Photograph an indoor family dinner with changing ambient light and deliver 25 color-corrected files.",
      portfolioGoal: "A cohesive 12-image grid on Instagram demonstrating sharp focus and natural skin tones.",
      firstGigAction: "Book 1 paid weekend event shoot."
    },
    scamWarnings: [
      "Always take a 30–50% non-refundable booking retainer to reserve dates on your calendar.",
      "Beware of out-of-state checks for events; always verify local identity and accept direct UPI/bank transfers."
    ]
  },
  {
    id: "print-on-demand-merch",
    title: "Print-on-Demand Apparel & Custom Artwork",
    category: "Low-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start on marketplaces (Redbubble, TeePublic). Optional ₹500 for custom artwork fonts."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 2,
      label: "1–2 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Royalty / Digital asset sales",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Graphic Design", "Drawing", "Content Creation"],
    suitablePersonalities: ["Creative work", "Working alone", "Building something long-term"],
    incomeGoals: ["Small extra income", "Side income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Redbubble & Printify Artist Terms",
      sourceUrl: "https://www.redbubble.com/about/selling",
      platformFees: "Platform handles printing, inventory, and shipping; pays artist 15–30% royalty margin",
      ageRestrictions: "18+ years old (or guardian managed account)"
    },
    howItWorks: "Upload clever typography, niche illustrations, or humorous quotes to print-on-demand marketplaces. When a customer orders a T-shirt, mug, or sticker, the platform prints and ships it automatically and pays you a margin.",
    whereToStart: [
      "Research specific passionate micro-niches (e.g. funny retro developer jokes, specific dog breeds, botanical line art).",
      "Create high-resolution (4500x5400px, 300 DPI) transparent PNG designs in Canva or vector tools.",
      "Upload 20+ cohesive designs across Redbubble, TeePublic, or connect Printify to Etsy.",
      "Use accurate, keyword-rich tags so buyers searching the catalog can find your art."
    ],
    platforms: [
      { name: "Redbubble", url: "https://www.redbubble.com", description: "Global consumer marketplace with built-in organic search traffic", feeInfo: "Standard tier account margin fees" },
      { name: "TeePublic", url: "https://www.teepublic.com", description: "High-volume apparel and sticker storefront", feeInfo: "Fixed artist royalties per category" },
      { name: "Printify + Etsy", url: "https://printify.com", description: "Custom fulfillment network synced to Etsy for higher control", feeInfo: "Print product wholesale cost" }
    ],
    pros: [
      "Zero inventory risk: you never touch boxes or ship parcels",
      "Once uploaded, designs remain listed indefinitely earning passive royalties",
      "Fun creative outlet for hobbyists"
    ],
    challenges: [
      "Marketplaces are highly competitive; requires dozens of quality uploads to see traction",
      "Margins per sticker or shirt are modest ($1.50–$6 / ₹120–₹500 per sale)"
    ],
    sevenDayPlan: [
      { day: 1, title: "Niche Research", tasks: ["Find 3 trending subcultures with underserved design demand on Redbubble"] },
      { day: 2, title: "Design Creation Batch 1", tasks: ["Create 5 clean typography concepts with humorous or relatable slogans in Canva"] },
      { day: 3, title: "Design Creation Batch 2", tasks: ["Create 5 graphic illustrations with transparent backgrounds"] },
      { day: 4, title: "Storefront Setup", tasks: ["Set up artist profile, banner, and bio on Redbubble and TeePublic"] },
      { day: 5, title: "Batch Upload & Tagging", tasks: ["Upload 10 designs, position properly on all apparel/stickers, add 15 relevant tags each"] },
      { day: 6, title: "Social Promotion", tasks: ["Create Pinterest pins for your best sticker mockups"] },
      { day: 7, title: "Analytics Review", tasks: ["Check search impression trends and plan the next 10 designs"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Vector export standards, commercial copyright compliance, and e-commerce SEO tagging",
      resources: [
        { name: "Redbubble Artist Blog", url: "https://blog.redbubble.com", free: true },
        { name: "Printify Academy", url: "https://printify.com/academy/", free: true }
      ],
      practiceProject: "Design a 5-sticker collection around vintage coffee brewing.",
      portfolioGoal: "25 active approved designs across 2 storefronts.",
      firstGigAction: "Make your first marketplace sale."
    },
    scamWarnings: [
      "Never upload copyrighted trademarks, Disney characters, movie logos, or music lyrics (results in permanent ban).",
      "Do not buy '10,000 ready-to-upload designs' packages; they violate platform originality policies."
    ]
  },
  {
    id: "remote-customer-support",
    title: "Remote Customer Support & Live Chat Specialist",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 0,
      currency: "INR",
      description: "₹0 - Requires standard computer, headset/mic, and stable home internet."
    },
    timeRequired: {
      minHoursPerDay: 3,
      maxHoursPerDay: 6,
      label: "3–6 hours/day",
      flexible: false,
      weekendsOnlyViable: false
    },
    incomeModel: "Per project / hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop", "Desktop", "Internet connection"],
    requiredSkills: ["Customer Support", "Speaking", "Writing", "English"],
    suitablePersonalities: ["Working with people", "Fast/simple tasks"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "WeWorkRemotely & Support Driven Remote Benchmarks",
      sourceUrl: "https://weworkremotely.com/categories/remote-customer-support-jobs",
      platformFees: "Direct employer payroll; zero employee fees",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Answer incoming customer inquiries via live chat, email ticket systems (Zendesk, Freshdesk, Intercom), or phone calls for e-commerce brands, SaaS companies, and digital services.",
    whereToStart: [
      "Highlight clear written communication, empathetic problem solving, and typing speed (50+ WPM).",
      "Apply directly to remote support job boards (WeWorkRemotely, RemoteOK, Indeed Remote).",
      "Take free customer support certification courses (e.g., HubSpot Service Hub).",
      "Prepare for scenario-based interview questions on resolving frustrated customer complaints."
    ],
    platforms: [
      { name: "We Work Remotely", url: "https://weworkremotely.com", description: "Premier remote job board with active customer success listings", feeInfo: "Free for applicants" },
      { name: "ModSquad", url: "https://modsquad.com/join-the-mods/", description: "Contract customer support and moderation network", feeInfo: "Direct contractor pay" },
      { name: "Upwork Customer Service", url: "https://www.upwork.com", description: "Hourly contracts for Shopify & Zendesk live-chat operators", feeInfo: "10% service fee" }
    ],
    pros: [
      "Predictable scheduled hourly pay ($10–$22/hr internationally / ₹15,000–₹40,000/mo in India)",
      "Structured shifts with clear boundaries when logged off",
      "Opportunity to learn software tools used in global tech enterprises"
    ],
    challenges: [
      "Dealing with occasional difficult or impatient customers",
      "Strict shift adherence requirements during live chat hours"
    ],
    sevenDayPlan: [
      { day: 1, title: "Resume Polish", tasks: ["Revamp CV emphasizing empathy, typing speed, and communication"] },
      { day: 2, title: "Tool Certification", tasks: ["Complete free HubSpot Customer Support certification or Zendesk overview"] },
      { day: 3, title: "Job Board Applications", tasks: ["Apply to 5 active remote customer support roles on WeWorkRemotely and Remote.co"] },
      { day: 4, title: "Upwork Specialized Profile", tasks: ["Create 'Customer Support Specialist' profile on Upwork with test badge"] },
      { day: 5, title: "Scenario Practice", tasks: ["Draft responses to 3 difficult customer emails: late delivery, broken feature, refund request"] },
      { day: 6, title: "Screening Interview", tasks: ["Conduct initial phone/video interview in quiet space with headset"] },
      { day: 7, title: "Onboarding & Knowledge Base Review", tasks: ["Study brand FAQ documentation and ticketing rules"] }
    ],
    learningRoadmap: {
      currentSkillGap: "De-escalation tactics, ticket triage systems, and customer satisfaction metrics (CSAT/NPS)",
      resources: [
        { name: "HubSpot Academy Customer Service", url: "https://academy.hubspot.com", free: true },
        { name: "Support Driven Community Handbook", url: "https://supportdriven.com", free: true }
      ],
      practiceProject: "Write 5 polite response macros for an e-commerce refund request scenario.",
      portfolioGoal: "Pass customer support typing and empathy test with 95%+ score.",
      firstGigAction: "Submit 5 tailored applications."
    },
    scamWarnings: [
      "Scam alert: Legitimate employers NEVER send you a check to purchase home office equipment.",
      "Never pay for 'mandatory pre-employment training materials'—real companies train you on company time."
    ]
  },
  {
    id: "pet-care-dog-walking",
    title: "Neighborhood Pet Sitting & Dog Walking",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Beginner", "Some experience"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start. Optional ₹300–₹500 for treats, portable water dispenser, or waste bags."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (morning/evenings)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per session",
    locationType: "Local",
    requiredEquipment: ["Smartphone"],
    requiredSkills: ["Customer Support"],
    suitablePersonalities: ["Physical work", "Working with people", "Working alone"],
    incomeGoals: ["Small extra income", "Side income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Rover & Local Pet Care Community Standards",
      sourceUrl: "https://www.rover.com",
      platformFees: "Rover charges 20% commission; 0% for independent neighborhood clients",
      ageRestrictions: "18+ years old"
    },
    howItWorks: "Walk neighborhood dogs while owners are at work, or provide home pet-sitting when neighbors travel on holiday or weekend getaways.",
    whereToStart: [
      "Highlight your genuine experience and love for animals (caring for family pets).",
      "Join verified pet platforms (Rover in US/UK/Canada, Wag, or local residential associations in India).",
      "Offer morning (7 AM–9 AM) and evening (5 PM–7 PM) 30-minute dog walks.",
      "Send real-time photo updates and GPS walking tracks to pet parents during walks."
    ],
    platforms: [
      { name: "Rover (US/UK/Canada)", url: "https://www.rover.com", description: "Top pet sitting and dog walking platform with insurance coverage", feeInfo: "20% platform fee" },
      { name: "Neighborhood Residential Groups", url: "https://web.whatsapp.com", description: "Apartment society notices and local pet owners groups", feeInfo: "0% fee, direct cash/UPI" },
      { name: "PetBacker", url: "https://www.petbacker.com", description: "Global pet sitting and boarding network", feeInfo: "Tiered platform cut" }
    ],
    pros: [
      "Healthy outdoor exercise and zero screen time",
      "Instant trust-based recurring weekly clients",
      "Zero technical skills or startup equipment required"
    ],
    challenges: [
      "Requires being comfortable handling different animal temperaments",
      "Must adhere strictly to feeding times and medication instructions"
    ],
    sevenDayPlan: [
      { day: 1, title: "Safety & Pet First Aid", tasks: ["Read pet safety guidelines (leash control, avoiding heatstroke, safe dog introductions)"] },
      { day: 2, title: "Local Flyer Creation", tasks: ["Create a warm flyer with friendly photo and clear pricing (e.g. ₹200–₹400 per 30-min walk / $15–$25 abroad)"] },
      { day: 3, title: "Apartment Community Share", tasks: ["Share flyer in local housing society pet-lovers group or community board"] },
      { day: 4, title: "Meet & Greet 1", tasks: ["Attend a free 15-minute introductory walk with owner and dog to verify compatibility"] },
      { day: 5, title: "Perform First Solo Walk", tasks: ["Conduct safe 30-minute walk, send happy photo to owner, replenish fresh water"] },
      { day: 6, title: "Weekend Boarding Offer", tasks: ["Offer weekend cat/dog feeding check-ins for neighbors traveling"] },
      { day: 7, title: "Confirm Weekly Schedule", tasks: ["Lock in recurring Monday–Friday schedule with 2 neighborhood clients"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Canine body language reading, positive reinforcement, and emergency protocols",
      resources: [
        { name: "Red Cross Dog First Aid", url: "https://www.redcross.org", free: true },
        { name: "Rover Sitter Resources", url: "https://www.rover.com/blog/sitter-resources/", free: true }
      ],
      practiceProject: "Conduct 3 supervised walks with a friend's dog practicing emergency recall commands.",
      portfolioGoal: "2 written references from verified pet owners.",
      firstGigAction: "Book 1 recurring weekly client."
    },
    scamWarnings: [
      "Never accept foreign check payments from clients claiming they are moving to your city and need pet care.",
      "Always meet pet and owner in person before agreeing to any care arrangement."
    ]
  },
  ...talentOpportunities,
  ...sectorOpportunities
];

export const categoriesList = [
  "Zero-Investment",
  "Skill-Based",
  "Digital Products",
  "Low-Investment",
  "Local / Offline",
  "Long-Term"
];
