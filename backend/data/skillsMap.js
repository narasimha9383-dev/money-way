// backend/data/skillsMap.js
// Maps skills to realistic, diversified monetization pathways

export const skillsIncomeMap = {
  "Java": [
    {
      path: "High-School & University Tutoring",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour / session",
      startupTime: "1–3 days",
      requirements: "AP Computer Science / Java OOP fundamentals, Zoom/Meet, code sandbox",
      targetClients: "High school students preparing for AP exams or university freshmen",
      firstStep: "List profile on Preply or Superprof with a 10-lesson modular Java curriculum",
      verifiedPlatforms: ["Preply", "Superprof", "TeacherOn"]
    },
    {
      path: "Freelance Bug Fixing & Backend Features",
      difficulty: "Intermediate",
      incomeModel: "Per project / hourly",
      startupTime: "1–2 weeks",
      requirements: "Spring Boot, Maven/Gradle, Git, REST APIs",
      targetClients: "Small business backend maintainers, enterprise contractors",
      firstStep: "Bid on fixed-price Upwork contracts tagged 'Java API bug fix' or 'Spring Boot integration'",
      verifiedPlatforms: ["Upwork", "Contra", "Freelancer"]
    },
    {
      path: "Technical Interview Coaching & Mock Interviews",
      difficulty: "Advanced",
      incomeModel: "Per 45-min mock interview",
      startupTime: "3–7 days",
      requirements: "LeetCode Data Structures & Algorithms, strong communication",
      targetClients: "Job seekers preparing for Tier-1 and FAANG tech interviews",
      firstStep: "Register as a mentor on platforms like Prepfully, Exponent, or LinkedIn mentoring",
      verifiedPlatforms: ["Prepfully", "Topmate.io", "Exponent"]
    },
    {
      path: "Technical Writing & Developer Tutorial Publishing",
      difficulty: "Intermediate",
      incomeModel: "Per published article ($150–$400)",
      startupTime: "1 week",
      requirements: "Clear writing, runnable GitHub sample repo",
      targetClients: "Developer blogs (Baeldung, DZone, Draft.dev, LogRocket)",
      firstStep: "Pitch a practical Baeldung or LogRocket tutorial explaining modern Java 21 features",
      verifiedPlatforms: ["Baeldung Authors", "Draft.dev", "LogRocket Blog"]
    },
    {
      path: "Code Review & Refactoring Services",
      difficulty: "Advanced",
      incomeModel: "Per code audit",
      startupTime: "1 week",
      requirements: "Clean architecture, SonarQube, security audit basics",
      targetClients: "Bootstrapped startups looking for pre-launch code sanity check",
      firstStep: "Offer a packaged 'Java Codebase Architecture Review' gig on Fiverr Pro",
      verifiedPlatforms: ["Fiverr Pro", "Contra"]
    }
  ],
  "Python": [
    {
      path: "Python for Beginners & Data Science Tutoring",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour ($15–$40/hr)",
      startupTime: "2–4 days",
      requirements: "Python basics (lists, loops, functions, pandas), Google Colab",
      targetClients: "Adult learners, university students, career switchers",
      firstStep: "Create a Superprof and Preply profile offering 'Python from Scratch in 10 Hours'",
      verifiedPlatforms: ["Preply", "Superprof", "Wyzant"]
    },
    {
      path: "Web Scraping & Data Extraction Automation",
      difficulty: "Intermediate",
      incomeModel: "Per project ($50–$300)",
      startupTime: "3–5 days",
      requirements: "BeautifulSoup, Playwright/Selenium, CSV/JSON export",
      targetClients: "Lead generation agencies, e-commerce price monitoring businesses",
      firstStep: "Build 2 sample scraping scripts on GitHub and bid on Upwork web-scraping jobs",
      verifiedPlatforms: ["Upwork", "Fiverr", "Contra"]
    },
    {
      path: "AI & LLM API Integration Services",
      difficulty: "Intermediate",
      incomeModel: "Per project ($200–$1,000)",
      startupTime: "1–2 weeks",
      requirements: "OpenAI / Claude / LangChain API integration, FastAPI",
      targetClients: "Small business owners wanting custom customer support bots or document query tools",
      firstStep: "Build a functioning demo bot querying a company PDF and pitch local agencies",
      verifiedPlatforms: ["Upwork", "Twitter/X Inbound", "Product Hunt"]
    },
    {
      path: "Technical Tutorial Writing",
      difficulty: "Intermediate",
      incomeModel: "Per article ($150–$350)",
      startupTime: "1 week",
      requirements: "Clear English, tested code samples",
      targetClients: "Real Python, DigitalOcean Community, Towards Data Science",
      firstStep: "Submit an outline to Real Python or DigitalOcean community author program",
      verifiedPlatforms: ["Real Python", "DigitalOcean Authors"]
    },
    {
      path: "Automation Script Marketplace / Micro-Tools",
      difficulty: "Beginner-Intermediate",
      incomeModel: "Asset sale ($5–$25/download)",
      startupTime: "1–2 weeks",
      requirements: "Packaged CLI tool or desktop GUI (Tkinter/Streamlit)",
      targetClients: "Social media managers, researchers, accountants",
      firstStep: "Publish a YouTube Shorts bulk downloader or Excel cleaner on Gumroad",
      verifiedPlatforms: ["Gumroad", "GitHub Sponsors"]
    }
  ],
  "JavaScript": [
    {
      path: "Freelance Frontend Landing Pages",
      difficulty: "Beginner-Intermediate",
      incomeModel: "Per website ($100–$500)",
      startupTime: "1 week",
      requirements: "HTML/CSS, JavaScript, Tailwind or Bootstrap, Vercel",
      targetClients: "Local restaurants, gyms, consultants, indie founders",
      firstStep: "Reach out to 5 local businesses with poorly formatted mobile sites with a live demo",
      verifiedPlatforms: ["Direct Outreach", "Contra", "Upwork"]
    },
    {
      path: "Chrome Extension Development",
      difficulty: "Intermediate",
      incomeModel: "Freemium / subscription ($3–$9/mo)",
      startupTime: "2 weeks",
      requirements: "Manifest V3, DOM manipulation, storage APIs",
      targetClients: "Productivity enthusiasts, recruiters, content creators",
      firstStep: "Build a single-purpose extension (e.g. LinkedIn formatter or Tab auto-closer) and publish on Chrome Web Store",
      verifiedPlatforms: ["Chrome Web Store", "Gumroad", "Product Hunt"]
    },
    {
      path: "Frontend Framework Tutoring (React/Vue)",
      difficulty: "Intermediate",
      incomeModel: "Per session ($20–$50/hr)",
      startupTime: "3 days",
      requirements: "Component lifecycle, state management, hooks",
      targetClients: "Bootcamp students struggling with state and API calls",
      firstStep: "Offer 1-on-1 coding mentorship on Superprof and Codementor",
      verifiedPlatforms: ["Codementor", "Superprof"]
    },
    {
      path: "Shopify & WordPress Custom Theme Scripting",
      difficulty: "Intermediate",
      incomeModel: "Per fix ($40–$150)",
      startupTime: "3–5 days",
      requirements: "Liquid, DOM scripting, CSS animations",
      targetClients: "E-commerce store owners with broken checkout banners or popups",
      firstStep: "Join Shopify community forums and answer unanswered merchant customization queries",
      verifiedPlatforms: ["Shopify Community", "Upwork", "Storetasker"]
    }
  ],
  "Writing": [
    {
      path: "B2B SaaS Case Studies & Blog Writing",
      difficulty: "Intermediate",
      incomeModel: "Per article ($100–$300)",
      startupTime: "1 week",
      requirements: "Clear business prose, research skills, basic SEO",
      targetClients: "Tech startups, marketing agencies, B2B software vendors",
      firstStep: "Publish 2 high-quality sample articles on Substack or Medium and pitch editors",
      verifiedPlatforms: ["Contently", "ClearVoice", "Upwork"]
    },
    {
      path: "SEO Copywriting for Local Businesses",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per page ($30–$80)",
      startupTime: "3–5 days",
      requirements: "Keyword research, persuasive headlines, clear calls-to-action",
      targetClients: "Dentists, realtors, plumbers, boutique shops needing new website copy",
      firstStep: "Offer a complete '5-Page Website Copy Overhaul' package on Contra",
      verifiedPlatforms: ["Contra", "Fiverr", "LinkedIn Direct"]
    },
    {
      path: "Email Newsletter Ghostwriting",
      difficulty: "Intermediate",
      incomeModel: "Per monthly retainer ($300–$800/mo)",
      startupTime: "1–2 weeks",
      requirements: "Storytelling, subject-line hook psychology, Mailchimp/Beehiiv",
      targetClients: "Busy executives, creators, podcast hosts",
      firstStep: "Write 3 sample newsletters for a creator you admire and send as a polite pitch",
      verifiedPlatforms: ["Beehiiv", "Substack", "X/Twitter"]
    },
    {
      path: "Resume & LinkedIn Profile Optimization",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per package (₹1,500–₹4,000 / $50–$120)",
      startupTime: "3 days",
      requirements: "ATS keyword understanding, modern resume formatting",
      targetClients: "Job seekers, recent college graduates",
      firstStep: "Revamp 2 friends' resumes for free and post before/after comparisons on LinkedIn",
      verifiedPlatforms: ["Topmate.io", "Fiverr", "LinkedIn"]
    }
  ],
  "Video Editing": [
    {
      path: "Short-Form Video Editor for Creators (Shorts/Reels)",
      difficulty: "Intermediate",
      incomeModel: "Per video ($20–$60) or monthly retainer ($500–$1,500)",
      startupTime: "3–7 days",
      requirements: "CapCut Desktop, Premiere or DaVinci, caption timing, sound design",
      targetClients: "YouTubers, podcasters, business influencers",
      firstStep: "Edit 3 public podcast clips into punchy vertical reels with motion captions and email to creators",
      verifiedPlatforms: ["YTJobs", "Contra", "Twitter Outreach"]
    },
    {
      path: "Corporate Webinar & Course Trimming",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour ($25–$50/hr)",
      startupTime: "3 days",
      requirements: "Audio leveling, cutting umms/pauses, chapter timestamps",
      targetClients: "Online course creators, B2B software marketing teams",
      firstStep: "Pitch course creators on Teachable/Udemy offering to clean up their raw recordings",
      verifiedPlatforms: ["Upwork", "Fiverr"]
    },
    {
      path: "Social Media Ad Creative Video Packages",
      difficulty: "Intermediate",
      incomeModel: "Per ad batch ($150–$400)",
      startupTime: "1 week",
      requirements: "Hook psychology, product callouts, kinetic typography",
      targetClients: "Shopify e-commerce brand owners running TikTok & Meta ads",
      firstStep: "Assemble 3 high-converting UGC style ad samples in CapCut",
      verifiedPlatforms: ["Fiverr", "Upwork", "Direct E-commerce outreach"]
    }
  ],
  "Graphic Design": [
    {
      path: "Logo & Brand Identity Kits",
      difficulty: "Intermediate",
      incomeModel: "Per package ($100–$400)",
      startupTime: "1 week",
      requirements: "Figma or Illustrator, color theory, typography, vector export",
      targetClients: "New startups, boutique brands, consulting businesses",
      firstStep: "Create 2 mock brand case studies on Behance and list starter package on Fiverr",
      verifiedPlatforms: ["Behance", "Fiverr Pro", "Dribbble"]
    },
    {
      path: "Social Media Carousel & Banner Packs",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per pack ($30–$100)",
      startupTime: "3 days",
      requirements: "Canva Pro or Figma, visual hierarchy, consistent palette",
      targetClients: "LinkedIn thought leaders, Instagram micro-influencers, coaches",
      firstStep: "Design 5 reusable template carousels and showcase on LinkedIn",
      verifiedPlatforms: ["Gumroad", "Contra", "Fiverr"]
    },
    {
      path: "Digital Planner & Sticker Assets",
      difficulty: "Beginner-Friendly",
      incomeModel: "Digital asset sales ($3–$15)",
      startupTime: "1 week",
      requirements: "Canva, Goodnotes formatting, transparent PNG export",
      targetClients: "iPad / digital journal users, students, planners",
      firstStep: "Open an Etsy or Gumroad shop with 3 aesthetic digital printable planners",
      verifiedPlatforms: ["Etsy", "Gumroad", "Creative Market"]
    }
  ],
  "Mathematics": [
    {
      path: "High-School & Middle-School Exam Tutoring",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour ($15–$35/hr / ₹400–₹1,000/hr)",
      startupTime: "2 days",
      requirements: "Algebra, calculus or geometry mastery, patience, digital whiteboard",
      targetClients: "Local or online school students preparing for board/SAT exams",
      firstStep: "Register on Superprof and local apartment groups",
      verifiedPlatforms: ["Superprof", "Preply", "Local Community"]
    },
    {
      path: "Step-by-Step Textbook Problem Solutions",
      difficulty: "Intermediate",
      incomeModel: "Per verified solution ($1–$4 per question)",
      startupTime: "1 week (vetting process)",
      requirements: "Accuracy, LaTeX or neat handwriting, subject qualification",
      targetClients: "Academic assistance platforms",
      firstStep: "Apply as a Q&A expert on Chegg Subject Expert or Bartleby",
      verifiedPlatforms: ["Chegg India Expert", "Bartleby Q&A"]
    },
    {
      path: "Competitive Exam Quantitative Aptitude Coaching",
      difficulty: "Advanced",
      incomeModel: "Per batch course or session",
      startupTime: "1–2 weeks",
      requirements: "Speed math shortcuts, formula sheets, mock test creation",
      targetClients: "College students preparing for CAT, GMAT, GRE, or government exams",
      firstStep: "Post 3 quantitative aptitude shortcut reels on Instagram / YouTube Shorts",
      verifiedPlatforms: ["Superprof", "UrbanPro", "YouTube"]
    }
  ],
  "Teaching": [
    {
      path: "Online Conversational English Practice Partner",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour ($10–$20/hr)",
      startupTime: "3–5 days",
      requirements: "Native or fluent English, good mic, warm conversational style",
      targetClients: "Adult professionals in non-English speaking countries wanting speaking confidence",
      firstStep: "Apply on Cambly, iTalki, or NativeCamp",
      verifiedPlatforms: ["Cambly", "iTalki", "Preply"]
    },
    {
      path: "1-on-1 Academic Subject Tuition",
      difficulty: "Intermediate",
      incomeModel: "Per monthly retainer per student",
      startupTime: "1–3 days",
      requirements: "School syllabus familiarity, structured lesson plan",
      targetClients: "Neighborhood families, online school students",
      firstStep: "Distribute flyer in local housing community offering 1 free trial session",
      verifiedPlatforms: ["Superprof", "Urban Company", "Local Groups"]
    },
    {
      path: "Micro-Course or Workshop Series",
      difficulty: "Intermediate",
      incomeModel: "Ticketed admission ($10–$25/seat)",
      startupTime: "2 weeks",
      requirements: "Clear outcome in 90 minutes (e.g., 'Excel Formulas for Accountants')",
      targetClients: "Working professionals, hobbyists",
      firstStep: "Host a 90-minute live workshop on Zoom via Topmate or Eventbrite",
      verifiedPlatforms: ["Topmate.io", "Eventbrite", "Luma"]
    }
  ],
  "Singing & Vocals": [
    {
      path: "1-on-1 Online Vocal & Breathing Lessons",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour / session (₹700–₹1,800/hr)",
      startupTime: "2–4 days",
      requirements: "Vocal pitch control, ear training, patience, Zoom/Meet",
      targetClients: "Beginner singers, public speakers, audition aspirants",
      firstStep: "List profile on Superprof and Topmate offering a 15-minute vocal assessment",
      verifiedPlatforms: ["Superprof", "Topmate.io", "TeacherOn"]
    },
    {
      path: "Commercial Voiceover & Podcast Narration",
      difficulty: "Intermediate",
      incomeModel: "Per project ($30–$150/audio file)",
      startupTime: "1 week",
      requirements: "Quiet recording space, basic USB mic, Audacity",
      targetClients: "YouTube creators, e-learning platforms, indie game developers",
      firstStep: "Record 3 sample demos and list gigs on Fiverr and Voices.com",
      verifiedPlatforms: ["Voices.com", "Fiverr", "Upwork"]
    },
    {
      path: "Custom Jingle & Vocal Topline Freelancing",
      difficulty: "Advanced",
      incomeModel: "Per milestone / royalty share",
      startupTime: "1–2 weeks",
      requirements: "DAW familiarity, harmony arrangement, export clean WAV stems",
      targetClients: "Music producers, advertising agencies, indie filmmakers",
      firstStep: "Publish a sample reel of 3 diverse vocal styles on SoundCloud / Contra",
      verifiedPlatforms: ["Contra", "SoundBetter", "Fiverr Pro"]
    },
    {
      path: "Weekend Acoustic Events & Private Gigs",
      difficulty: "Intermediate",
      incomeModel: "Per event (₹4,000–₹15,000)",
      startupTime: "1–2 weeks",
      requirements: "2-hour popular covers setlist, microphone, stage presence",
      targetClients: "Local cafes, weekend farmer markets, private parties",
      firstStep: "Reach out to 3 local acoustic-friendly cafes with a 1-minute performance reel",
      verifiedPlatforms: ["Local Venues", "Instagram", "BandMix"]
    }
  ],
  "Cooking & Baking": [
    {
      path: "Home Cloud Bakery & Custom Celebration Cakes",
      difficulty: "Intermediate",
      incomeModel: "Per order / 50% advance (₹1,000–₹4,000/cake)",
      startupTime: "3–7 days",
      requirements: "Oven, baking tools, clean kitchen, FSSAI registration",
      targetClients: "Apartment neighbors, birthday organizers, local foodies",
      firstStep: "Standardize 2 signature items and distribute sample boxes in your apartment society",
      verifiedPlatforms: ["Swiggy Minis", "Instagram Shop", "Local WhatsApp"]
    },
    {
      path: "Live Interactive Weekend Cooking Masterclasses",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per ticket (₹299–₹699 per seat)",
      startupTime: "1 week",
      requirements: "Overhead phone tripod, tested recipe sheet, Zoom",
      targetClients: "Food enthusiasts wanting specific skills (e.g. Sourdough or French Macarons)",
      firstStep: "Create a group workshop link on Topmate with a complete ingredient guide",
      verifiedPlatforms: ["Topmate.io", "Skillshare", "Eventbrite"]
    },
    {
      path: "Culinary Recipe Content & Brand Partnerships",
      difficulty: "Intermediate",
      incomeModel: "Ad revenue / sponsored reels ($50–$300/reel)",
      startupTime: "2–4 weeks",
      requirements: "Good daylight photography, 30-sec recipe editing",
      targetClients: "Cookware and spice brands, local organic food suppliers",
      firstStep: "Post 3 aesthetic ASMR recipe reels on Instagram Reels and YouTube Shorts",
      verifiedPlatforms: ["YouTube", "Instagram", "Brand Collabs"]
    }
  ],
  "Dance & Choreography": [
    {
      path: "Online Group Zumba & Dance Fitness Batches",
      difficulty: "Beginner-Friendly",
      incomeModel: "Monthly batch subscription (₹1,500/mo per student)",
      startupTime: "3–5 days",
      requirements: "Energetic movement, music playlist, web camera framing",
      targetClients: "Homemakers and desk workers wanting fun cardio from home",
      firstStep: "Host a free Saturday morning trial class and enroll 8–10 students in a weekday batch",
      verifiedPlatforms: ["UrbanPro", "Superprof", "Zoom"]
    },
    {
      path: "Wedding Sangeet & Event Choreography",
      difficulty: "Intermediate",
      incomeModel: "Per song / routine package (₹5,000–₹25,000)",
      startupTime: "1 week",
      requirements: "Step-by-step count breakdown, upbeat choreography",
      targetClients: "Bridal parties, corporate cultural teams, college festival teams",
      firstStep: "Record a 45-second routine breakdown video and connect with local wedding planners",
      verifiedPlatforms: ["Instagram", "UrbanPro", "WedMeGood"]
    },
    {
      path: "1-on-1 Classical or Hip Hop Technique Coaching",
      difficulty: "Advanced",
      incomeModel: "Hourly / exam preparation fee",
      startupTime: "3–5 days",
      requirements: "Strong technique mastery, patient corrective feedback",
      targetClients: "Serious dance learners and certification candidates",
      firstStep: "List private coaching slots on Superprof highlighting your dance credentials",
      verifiedPlatforms: ["Superprof", "TeacherOn"]
    }
  ],
  "Fitness & Yoga": [
    {
      path: "Early Morning Online Yoga & Mobility Batches",
      difficulty: "Beginner-Friendly",
      incomeModel: "Monthly pass per student (₹1,200–₹2,500/mo)",
      startupTime: "2–4 days",
      requirements: "Yoga mat, clear verbal cues, morning discipline",
      targetClients: "Corporate employees wanting desk-posture relief and breathwork",
      firstStep: "Offer 3 free trial morning sessions to colleagues and housing community members",
      verifiedPlatforms: ["Topmate.io", "Urban Company", "Cult.fit Partner"]
    },
    {
      path: "1-on-1 Personalized Bodyweight & HIIT Training",
      difficulty: "Intermediate",
      incomeModel: "Monthly 1:1 retainer (₹4,000–₹8,000/client)",
      startupTime: "1 week",
      requirements: "Movement screening, form correction, tailored weekly plans",
      targetClients: "Busy individuals wanting direct accountability and customized coaching",
      firstStep: "Offer 2 free fitness/posture assessments and sign up your first paid client",
      verifiedPlatforms: ["Topmate.io", "Instagram", "Cult.fit"]
    }
  ],
  "Drawing & Art": [
    {
      path: "Custom Pet & Couple Digital Portrait Commissions",
      difficulty: "Intermediate",
      incomeModel: "Per portrait deliverable ($25–$100)",
      startupTime: "3–5 days",
      requirements: "Drawing tablet or iPad, digital painting app, high-res export",
      targetClients: "Pet owners, couples celebrating anniversaries, gift buyers",
      firstStep: "Publish 3 sample pet portraits on Fiverr and Reddit r/HungryArtists",
      verifiedPlatforms: ["Fiverr", "Contra", "ArtStation"]
    },
    {
      path: "Kids & Beginners Online Art & Sketching Classes",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour / monthly batch",
      startupTime: "2–4 days",
      requirements: "Pencils, basic watercolors, step-by-step patient teaching",
      targetClients: "School students wanting drawing fundamentals and creative expression",
      firstStep: "List drawing classes on Superprof offering basic shapes-to-animals modules",
      verifiedPlatforms: ["Superprof", "UrbanPro"]
    }
  ],
  "Chess Coaching": [
    {
      path: "1-on-1 Tactical Coaching for Scholastic Players",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour (₹800–₹2,000/hr / $20–$35/hr abroad)",
      startupTime: "2–4 days",
      requirements: "1500+ online rating, Lichess study board, game analysis",
      targetClients: "Children and adult beginners rated 600–1400 wanting tactical clarity",
      firstStep: "Create a Lichess Study and list your coach profile on Superprof and Chess.com",
      verifiedPlatforms: ["Chess.com Coaches", "Superprof", "Lichess"]
    }
  ],
  "Handmade Crafts": [
    {
      path: "Artisanal Resin, Candles & Custom Keepsakes",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per item (3x material cost markup)",
      startupTime: "1 week",
      requirements: "Molds, resin or wax, clean daylight photos, safe bubble packaging",
      targetClients: "Gift seekers, wedding favors, seasonal holiday shoppers",
      firstStep: "Create 4 sample pieces, take daylight photos, and launch an Etsy or Instagram catalog",
      verifiedPlatforms: ["Etsy", "Amazon Karigar", "Instagram Shop"]
    }
  ],
  "Cricket & Sports": [
    {
      path: "🏢 Head Coach / Trainer at Sports Academy",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹30,000–₹55,000/mo)",
      startupTime: "1–2 weeks",
      requirements: "Cricket coaching fundamentals, fitness drills, basic BCCI/NIS accreditation",
      targetClients: "Private youth sports academies, schools, and athletic clubs",
      firstStep: "Apply to district cricket academies with your player scorebook and coaching credentials",
      verifiedPlatforms: ["Naukri Sports", "State Cricket Associations", "Direct Club Recruitment"]
    },
    {
      path: "⚡ 1-on-1 Private Batting & Bowling Net Sessions",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per hour (₹800–₹2,000/hr)",
      startupTime: "2–4 days",
      requirements: "Video analysis of batting stance, bowling action correction drills",
      targetClients: "Aspiring junior cricketers and club tournament players",
      firstStep: "Offer a free 20-minute video technique analysis to players at local practice nets",
      verifiedPlatforms: ["Superprof", "UrbanPro", "Local Cricket Clubs"]
    }
  ],
  "Free Fire & Mobile Gaming": [
    {
      path: "🏆 Competitive Esports Scrims & Tournament Brackets",
      difficulty: "Intermediate",
      incomeModel: "Prize Pools & Team Stipends (₹10,000–₹45,000/mo)",
      startupTime: "1–3 days",
      requirements: "Smartphone with smooth FPS, Heroic/Grandmaster rank, 4-player squad coordination",
      targetClients: "Competitive mobile gaming leagues, collegiate tournaments",
      firstStep: "Register your squad on Battlefy or Game.tv for free open-bracket cash qualifiers",
      verifiedPlatforms: ["Battlefy", "Game.tv", "Villager Esports"]
    },
    {
      path: "📹 YouTube Gaming Live Streaming & Highlight Shorts",
      difficulty: "Beginner-Friendly",
      incomeModel: "Ad Revenue, Super Chats & Creator Rewards (₹12,000–₹50,000/mo)",
      startupTime: "2–4 days",
      requirements: "Smartphone screen streaming tool (Turnip/Prism), 1080p highlights, engaging voice commentary",
      targetClients: "Mobile gaming viewers and Free Fire community followers",
      firstStep: "Stream 1 hour daily on YouTube Gaming and publish 30-second clutch highlight Shorts",
      verifiedPlatforms: ["YouTube Gaming", "Rooter", "Loco"]
    },
    {
      path: "🎙️ Community Scrim Admin, Room Host & Tournament Caster",
      difficulty: "Beginner-Intermediate",
      incomeModel: "Per tournament day (₹1,500–₹5,000/day)",
      startupTime: "3–5 days",
      requirements: "Custom room card creation, anti-cheat player checks, Hindi/English shoutcasting",
      targetClients: "Esports organizers, gaming cafes, college festivals",
      firstStep: "Host community scrim rooms on Discord and list casting services on Hitmarker",
      verifiedPlatforms: ["Hitmarker", "Discord Gaming", "Battlefy Organizer"]
    },
    {
      path: "🎮 Mobile Game Pre-Release Playtesting",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per playtest ($9–$15 per 15-minute session)",
      startupTime: "2–3 days",
      requirements: "Android or iOS smartphone, headphones, spoken English feedback during gameplay",
      targetClients: "Mobile game development studios conducting usability playtests",
      firstStep: "Sign up as a tester on PlaytestCloud and complete the 5-minute qualification test",
      verifiedPlatforms: ["PlaytestCloud", "TesterWork", "Testbirds"]
    }
  ],
  "Esports & Gaming": [
    {
      path: "🏢 Tournament Operations & League Admin",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹35,000–₹60,000/mo)",
      startupTime: "2 weeks",
      requirements: "Competitive game rules (Valorant, BGMI, CS2), Discord moderation, bracket tools",
      targetClients: "Esports league organizers, gaming arenas, and broadcast houses",
      firstStep: "Moderate community tournaments on Battlefy and apply on Hitmarker / LinkedIn",
      verifiedPlatforms: ["Hitmarker", "LinkedIn Esports", "Nodwin Gaming"]
    },
    {
      path: "🏢 Game QA & Playability Tester at Studio",
      difficulty: "Beginner-Friendly",
      incomeModel: "Full-time (₹28,000–₹48,000/mo)",
      startupTime: "1–3 weeks",
      requirements: "Systematic bug reproduction, Jira reporting, device stress profiling",
      targetClients: "Game development studios and mobile publishers",
      firstStep: "Create sample bug reproduction logs from open beta games and apply to QA positions",
      verifiedPlatforms: ["Naukri Game QA", "Indeed", "Ubisoft Careers"]
    }
  ],
  "Electrical & Maintenance": [
    {
      path: "🏢 Commercial Facility Maintenance Electrician",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹26,000–₹45,000/mo + PF/ESI)",
      startupTime: "1–2 weeks",
      requirements: "Wireman license, LT/HT panel maintenance, DG set synchronization",
      targetClients: "Facilities management firms (CBRE, JLL), commercial IT parks, hospitals",
      firstStep: "Submit ITI electrician credentials to commercial property management agencies",
      verifiedPlatforms: ["Naukri Facilities", "Indeed", "CBRE Careers"]
    },
    {
      path: "⚡ Certified Independent Electrical Contractor",
      difficulty: "Intermediate",
      incomeModel: "Per service call (₹500–₹3,000 / call)",
      startupTime: "3–5 days",
      requirements: "Own toolkit, diagnostic multimeter, prompt punctuality",
      targetClients: "Gated residential communities and commercial retail shops",
      firstStep: "Onboard as a verified partner on Urban Company and register with local RWA panels",
      verifiedPlatforms: ["Urban Company", "Local Contractor Panels", "Direct Client Referrals"]
    }
  ],
  "HVAC & Cooling Systems": [
    {
      path: "🏢 Central Chiller Plant & HVAC Technician",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹28,000–₹50,000/mo)",
      startupTime: "2 weeks",
      requirements: "Chiller plant maintenance, refrigerant charging, AHU servicing",
      targetClients: "Commercial malls, pharmaceutical facilities, corporate data centers",
      firstStep: "Apply to HVAC authorized service providers (Voltas, Daikin, Blue Star)",
      verifiedPlatforms: ["Naukri HVAC", "ISHRAE Job Board", "Voltas Careers"]
    },
    {
      path: "⚡ Commercial AC Seasonal Overhaul Contractor",
      difficulty: "Beginner-Friendly",
      incomeModel: "Per unit service (₹800–₹2,500/unit)",
      startupTime: "3–5 days",
      requirements: "Pressure washer, manifold gauge set, leak detection tools",
      targetClients: "Offices, restaurants, and apartment complexes before summer peak",
      firstStep: "Distribute preventative AC maintenance maintenance packages to local small businesses",
      verifiedPlatforms: ["Urban Company", "Direct Commercial Outreach"]
    }
  ],
  "Automotive & Mechanical": [
    {
      path: "🏢 Dealership Diagnostic & Mechatronics Tech",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹26,000–₹48,000/mo + Incentives)",
      startupTime: "1–2 weeks",
      requirements: "OBD-II scanner diagnosis, suspension/brake overhaul, ECU checks",
      targetClients: "Authorized OEM dealerships (Tata Motors, Hyundai, Maruti) and fleet centers",
      firstStep: "Apply directly to dealership service managers with ITI MMV certification",
      verifiedPlatforms: ["Naukri Automotive", "Bosch Car Service Network"]
    }
  ],
  "Live Sound & Stage Audio": [
    {
      path: "🏢 Stage Acoustic & Live Sound Engineer",
      difficulty: "Intermediate",
      incomeModel: "Monthly / Event CTC (₹40,000–₹70,000/mo or ₹8,000–₹15,000/day)",
      startupTime: "1–2 weeks",
      requirements: "Digital consoles (Yamaha, Behringer X32), RF wireless mics, feedback control",
      targetClients: "Live event production houses, auditoriums, concert venues, theatrical companies",
      firstStep: "Connect with event rental companies and audit front-of-house mixes at local concerts",
      verifiedPlatforms: ["LinkedIn Media", "Live Events Guild", "Naukri Sound Engineering"]
    }
  ],
  "Stage Lighting & Rigging": [
    {
      path: "🏢 Stage Lighting Programmer & Rigging Tech",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹28,000–₹52,000/mo)",
      startupTime: "2 weeks",
      requirements: "DMX512 protocols, GrandMA consoles, moving heads, truss rigging safety",
      targetClients: "Concert venues, convention centers, TV studios, theatrical troupes",
      firstStep: "Learn GrandMA onPC simulation software and apply to live production studios",
      verifiedPlatforms: ["Naukri Stage Lighting", "Indeed Event Tech", "EEMA Network"]
    }
  ],
  "Culinary & Kitchen Lead": [
    {
      path: "🏢 Sous Chef & Kitchen Operations Lead",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹35,000–₹60,000/mo + Meals/Benefits)",
      startupTime: "1–2 weeks",
      requirements: "Commercial recipe execution, HACCP/FSSAI hygiene, station expediting",
      targetClients: "Star hotel chains, fine dining establishments, commercial catering groups",
      firstStep: "Apply to luxury hotel culinary teams with documented portfolio of station leadership",
      verifiedPlatforms: ["Naukri Chef", "Hospitality Online", "Direct Hotel Careers"]
    }
  ],
  "Physiotherapy & Movement": [
    {
      path: "🏢 Sports Rehab Assistant at Clinic",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹28,000–₹48,000/mo)",
      startupTime: "1–2 weeks",
      requirements: "Kinesiology, electrotherapy modalities, patient movement guidance",
      targetClients: "Orthopedic clinics, sports medicine institutes, multi-specialty hospitals",
      firstStep: "Apply to sports medicine facilities with physiotherapy clinical internship records",
      verifiedPlatforms: ["Naukri Healthcare", "Indian Association of Physiotherapists", "Indeed"]
    }
  ],
  "Warehouse & Logistics": [
    {
      path: "🏢 Fulfillment Operations & Fleet Supervisor",
      difficulty: "Intermediate",
      incomeModel: "Monthly CTC (₹28,000–₹48,000/mo)",
      startupTime: "1–2 weeks",
      requirements: "WMS scanner workflows, dispatch manifest reconciliation, 5S standards",
      targetClients: "E-commerce fulfillment centers (Amazon, Flipkart), 3PL logistics hubs",
      firstStep: "Apply through logistics staffing agencies or supply chain careers portals",
      verifiedPlatforms: ["Naukri Logistics", "Delhivery Careers", "Indeed Supply Chain"]
    }
  ],
  "Event Catering & Food Service": [
    {
      path: "Weekend Event Catering & Banquet Associate",
      difficulty: "Beginner-Friendly",
      incomeModel: "Daily / Shift Payout (₹1,200–₹2,500/shift)",
      startupTime: "1–3 days",
      requirements: "Clean white/black formal attire, hospitality etiquette, weekend availability",
      targetClients: "Star hotels, wedding venues, corporate banquets, event planners",
      firstStep: "Connect directly with 2 local banquet halls or event caterers to join their on-call weekend roster",
      verifiedPlatforms: ["Direct Banquet Panels", "Urban Company Partner", "Naukri Hospitality"]
    },
    {
      path: "Commercial Kitchen & Catering Prep Associate",
      difficulty: "Beginner",
      incomeModel: "Part-time Monthly CTC (₹14,000–₹22,000/mo)",
      startupTime: "1 week",
      requirements: "Food handling hygiene, ingredient portioning, commercial knife skills",
      targetClients: "Live catering production units, cloud kitchens, wedding caterers",
      firstStep: "Apply directly to commercial catering kitchens in your city via Naukri Hospitality",
      verifiedPlatforms: ["Naukri Hospitality", "Indeed Food Jobs"]
    },
    {
      path: "Private Celebration & Small-Scale Event Catering",
      difficulty: "Intermediate",
      incomeModel: "Per Order / Event (₹5,000–₹25,000/event)",
      startupTime: "1–2 weeks",
      requirements: "Signature menu items, basic FSSAI registration, chafing dish staging",
      targetClients: "Residential apartment societies, birthday parties, small corporate gatherings",
      firstStep: "Draft a 1-page menu package with transparent per-head pricing and share in local community groups",
      verifiedPlatforms: ["Swiggy Minis", "Instagram Shop", "Local Community Networks"]
    }
  ]
};
