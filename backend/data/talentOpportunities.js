// backend/data/talentOpportunities.js
// Verified realistic income pathways for creative, performing, culinary, athletic, and intellectual talents

export const talentOpportunities = [
  {
    id: "talent-music-tutoring",
    title: "Online Music & Instrument Tutoring (Guitar, Piano, Vocals)",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 to start using your existing musical instrument and free video call software (Google Meet, Zoom)."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per session / Hourly",
    locationType: "Remote",
    requiredEquipment: ["Musical Instrument", "Smartphone", "Laptop", "Internet connection"],
    requiredSkills: ["Music", "Guitar", "Piano", "Vocals", "Singing", "Teaching", "Ear Training"],
    suitablePersonalities: ["Teaching", "Working with people", "Creative expression"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Superprof & Topmate Educator Rates",
      sourceUrl: "https://www.superprof.co.in/lessons/music/india/",
      platformFees: "Free listing on Superprof, 10% on Topmate",
      ageRestrictions: "18+ (or parental consent for student accounts)"
    },
    howItWorks: "Teach beginner and intermediate learners chords, vocal warmups, sheet music, or music theory via 1-on-1 scheduled video calls. Students pay per class or booking package.",
    whereToStart: [
      "Record a 1-minute intro video demonstrating your instrument/singing skills and teaching style.",
      "List your profile on Superprof, UrbanPro, and Topmate with clear hourly pricing (e.g. ₹600–₹1,500/hour).",
      "Offer a 15-minute free demo assessment for new students.",
      "Conduct structured weekly lessons with homework practice tabs or sheet music."
    ],
    platforms: [
      { name: "Superprof", url: "https://www.superprof.co.in", description: "Direct tutor marketplace with zero commission on lesson fees", feeInfo: "Free for tutors" },
      { name: "Topmate.io", url: "https://topmate.io", description: "Personal booking link for 1:1 sessions and masterclasses", feeInfo: "10% transaction fee" },
      { name: "UrbanPro", url: "https://www.urbanpro.com", description: "Local and online verified tutoring enquiries in India", feeInfo: "Coin/credit based enquiry model" }
    ],
    pros: [
      "Monetize a passion you already practice daily",
      "Immediate hourly cash flow with zero inventory",
      "High student retention (learners usually stay for 3–12 months)"
    ],
    challenges: [
      "Requires patience when explaining fundamentals to beginners",
      "Scheduling across student timezones requires organization"
    ],
    sevenDayPlan: [
      { day: 1, title: "Curriculum Outline", tasks: ["Draft an 8-week beginner syllabus (e.g. basic chords, posture, simple songs)"] },
      { day: 2, title: "Demo Video", tasks: ["Record a clean 60-second video demonstrating your playing/vocal technique on your phone"] },
      { day: 3, title: "Profile Setup", tasks: ["Publish your tutor profile on Superprof and Topmate with clear hourly pricing"] },
      { day: 4, title: "Network Announcement", tasks: ["Share your lesson availability with friends, social media, and local WhatsApp groups"] },
      { day: 5, title: "Trial Sessions", tasks: ["Host 2 free 20-minute trial lessons with initial interested contacts"] },
      { day: 6, title: "Student Onboarding", tasks: ["Convert trial learners to a paid 4-lesson monthly commitment"] },
      { day: 7, title: "First Paid Lesson", tasks: ["Deliver your first paid lesson and request a verified written review"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Online pedagogy, camera audio setup, and structured beginner lesson pacing",
      resources: [
        { name: "Superprof Tutor Best Practices Guide", url: "https://www.superprof.co.in/blog/", free: true }
      ],
      practiceProject: "Teach 1 friend a complete song from scratch in under 3 sessions.",
      portfolioGoal: "2 verified 5-star reviews on Superprof.",
      firstGigAction: "Book 1 recurring student paying weekly."
    },
    scamWarnings: [
      "Never pay any 'registration deposit' to arbitrary agencies promising bulk students.",
      "Collect lesson fees before or at the start of each month/batch."
    ]
  },
  {
    id: "talent-singing-voiceover",
    title: "Professional Voiceover & Audio Narration",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 2000,
      currency: "INR",
      description: "₹0 using a quiet room and modern smartphone mic. Optional ₹1,500 for a USB condenser mic (e.g. Fifine/Boya) for studio quality."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / Per minute of audio",
    locationType: "Remote",
    requiredEquipment: ["Smartphone or Microphone", "Laptop", "Audacity (Free Software)"],
    requiredSkills: ["Singing", "Voice Over", "Audio Narration", "Voice Acting", "Clear Diction", "English/Hindi/Regional"],
    suitablePersonalities: ["Creative expression", "Working alone", "Attention to detail"],
    incomeGoals: ["Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Voices.com & Fiverr Marketplace Benchmark",
      sourceUrl: "https://www.voices.com/",
      platformFees: "20% on Fiverr, standard membership on Voices",
      ageRestrictions: "18+ on major platforms"
    },
    howItWorks: "Narrate YouTube scripts, commercial voiceovers, audiobooks, e-learning modules, IVR phone systems, or character voices for creators and businesses worldwide.",
    whereToStart: [
      "Set up a quiet recording space (a wardrobe full of clothes provides free acoustic dampening).",
      "Record 3 sample demos: Commercial ad (30 sec), Educational narration (1 min), Story/character (1 min).",
      "Download Audacity (100% free open-source audio editor) to remove background noise.",
      "List voice gigs on Fiverr, Upwork, and Voices.com."
    ],
    platforms: [
      { name: "Voices.com", url: "https://www.voices.com", description: "World's largest marketplace for professional voice talent", feeInfo: "Free guest/standard tiers" },
      { name: "Fiverr", url: "https://www.fiverr.com", description: "Direct gig marketplace for commercial & YouTube voiceovers", feeInfo: "20% platform commission" },
      { name: "Upwork", url: "https://www.upwork.com", description: "Hourly and fixed-price contracts for audiobooks and e-learning narration", feeInfo: "10% service fee" }
    ],
    pros: [
      "Huge demand from YouTube creators and e-learning companies",
      "Fast turnaround: a 300-word voiceover takes under 15 minutes to record",
      "High payouts for regional languages (Hindi, Tamil, Telugu, Marathi, German, Spanish)"
    ],
    challenges: [
      "Requires eliminating room echo and background traffic noise",
      "Multiple takes may be needed to achieve proper emotional pacing"
    ],
    sevenDayPlan: [
      { day: 1, title: "Acoustic Setup", tasks: ["Set up a quiet corner or closet recording spot to eliminate room reverb"] },
      { day: 2, title: "Install Audacity", tasks: ["Install free Audacity software and learn 2 core tools: Noise Reduction and Normalize"] },
      { day: 3, title: "Record Samples", tasks: ["Record three 30–60 second sample scripts (Commercial, Educational, Storyteller)"] },
      { day: 4, title: "Create Portfolio", tasks: ["Export clean MP3 samples and upload to SoundCloud or Google Drive"] },
      { day: 5, title: "Launch Gigs", tasks: ["Create 2 voiceover gigs on Fiverr targeting specific niches (e.g. YouTube explainer voice)"] },
      { day: 6, title: "Submit Auditions", tasks: ["Submit 3 custom auditions on Upwork voice acting listings"] },
      { day: 7, title: "First Order Delivery", tasks: ["Fulfill first commercial order with fast 24h turnaround and clean audio"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Breath control, microphone positioning, and basic Audacity noise gating",
      resources: [
        { name: "Audacity Open Source Manual", url: "https://manual.audacityteam.org/", free: true }
      ],
      practiceProject: "Record and edit a 2-minute public domain fairy tale audiobook chapter.",
      portfolioGoal: "3 polished audio samples showcasing tone variety.",
      firstGigAction: "Book first ₹1,000–₹3,000 commercial voice gig on Fiverr."
    },
    scamWarnings: [
      "Legitimate voice casting directors never charge audition fees.",
      "Always watermark audio preview deliveries until payment is secured in escrow."
    ]
  },
  {
    id: "talent-home-bakery-cooking",
    title: "Home Bakery, Cloud Kitchen & Custom Food Orders",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Intermediate", "Advanced"],
    isBeginnerFriendly: false,
    isAdvanced: true,
    investment: {
      min: 1000,
      max: 5000,
      currency: "INR",
      description: "Low startup: ₹1,000–₹3,000 for raw ingredients, cake boxes, and free FSSAI basic registration."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (On-demand)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per item / Advance payment",
    locationType: "Local / Neighborhood",
    requiredEquipment: ["Kitchen Oven / Stove", "Baking Utensils", "Packaging Boxes", "Smartphone"],
    requiredSkills: ["Cooking", "Baking", "Pastry", "Food Preparation", "Food Safety", "Packaging"],
    suitablePersonalities: ["Hands-on creative work", "Hospitality", "Attention to detail"],
    incomeGoals: ["Side income", "Replace part-time income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "FSSAI Home Baker Regulations & Swiggy Minis",
      sourceUrl: "https://minis.swiggy.com/",
      platformFees: "0% commission on direct orders, standard payment gateway fees (2%)",
      ageRestrictions: "18+ for business registration"
    },
    howItWorks: "Bake custom birthday cakes, artisanal brownies, healthy meal prep bowls, or regional snacks from home kitchen for local apartment societies and pre-order customers.",
    whereToStart: [
      "Obtain basic FSSAI registration (costs ₹100/year online in India).",
      "Standardize 3 signature recipes with exact costing and pricing margins (aim for 50%+ profit margin).",
      "Photograph your creations under natural daylight on simple white ceramic plates.",
      "Set up a free digital storefront on Swiggy Minis or an Instagram page."
    ],
    platforms: [
      { name: "Swiggy Minis", url: "https://minis.swiggy.com", description: "Zero-commission storefront for home food creators and bakers", feeInfo: "0% marketplace commission" },
      { name: "Instagram Shop", url: "https://www.instagram.com", description: "Visual showcase for custom cakes, pastries, and local pickup orders", feeInfo: "Free organic outreach" }
    ],
    pros: [
      "Customers pay 50%–100% advance, guaranteeing zero unpaid labor",
      "Extremely loyal recurring neighborhood customer base",
      "High margins on premium customized celebration cakes"
    ],
    challenges: [
      "Requires maintaining strict kitchen cleanliness and food safety standards",
      "Perishable products require reliable same-day delivery or pickup"
    ],
    sevenDayPlan: [
      { day: 1, title: "Recipe Standardization", tasks: ["Finalize recipes for your 2 best-selling items (e.g. Belgian Chocolate Brownies and Vanilla Cupcakes)"] },
      { day: 2, title: "Cost & Margin Calculation", tasks: ["Calculate ingredient cost per batch and set selling price with at least 50% margin"] },
      { day: 3, title: "Packaging & Photography", tasks: ["Source 10 clean pastry boxes and take 5 appetizing daylight photos"] },
      { day: 4, title: "Storefront Creation", tasks: ["Create a Swiggy Minis store or Instagram catalog with clear pre-order terms"] },
      { day: 5, title: "Tasting Samples", tasks: ["Distribute 5 small sample boxes to neighborhood housing community leaders or friends"] },
      { day: 6, title: "Weekend Pre-orders", tasks: ["Open weekend order slots with 24h advance booking requirement"] },
      { day: 7, title: "Fulfill & Deliver", tasks: ["Bake, pack with a handwritten thank-you card, and collect verified customer reviews"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Food pricing formulas, packaging durability, and food safety standards",
      resources: [
        { name: "FSSAI Home Baker Registration Portal", url: "https://foscos.fssai.gov.in/", free: true }
      ],
      practiceProject: "Bake and box 3 identical cakes ensuring consistent weight and appearance.",
      portfolioGoal: "Instagram menu with 10 original appetizing photos.",
      firstGigAction: "Secure 3 orders for an upcoming weekend."
    },
    scamWarnings: [
      "Always collect at least 50% advance before starting any customized food order.",
      "Beware of QR code scams claiming to 'verify payment' by asking you to enter your UPI PIN."
    ]
  },
  {
    id: "talent-culinary-classes",
    title: "Online Cooking & Baking Masterclasses",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 using regular cooking ingredients and your smartphone mounted on a simple tripod or mug."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 2,
      label: "1–2 hours per session (Weekends)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per ticket / Workshop enrollment",
    locationType: "Remote",
    requiredEquipment: ["Kitchen & Cooking Ingredients", "Smartphone", "Zoom or Google Meet"],
    requiredSkills: ["Cooking", "Baking", "Recipe Development", "Culinary", "Teaching", "Presentation"],
    suitablePersonalities: ["Teaching", "Working with people", "Creative communication"],
    incomeGoals: ["Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Topmate & Skillshare Creator Payouts",
      sourceUrl: "https://topmate.io/",
      platformFees: "10% fee on ticket sales via Topmate",
      ageRestrictions: "18+"
    },
    howItWorks: "Host live 90-minute online workshops teaching specific culinary specialties: e.g., 'Sourdough Bread at Home', 'Authentic Biryani Secrets', or 'Eggless Desserts'. Attendees pay ₹299–₹999 per ticket.",
    whereToStart: [
      "Pick 1 high-demand, specific topic (specific workshops sell 5x better than general cooking classes).",
      "Prepare a 1-page PDF ingredient checklist to email attendees in advance.",
      "Create a paid workshop event link on Topmate or Eventbrite.",
      "Host live on Zoom with clear step-by-step overhead phone camera angles."
    ],
    platforms: [
      { name: "Topmate.io", url: "https://topmate.io", description: "Host paid live group workshops with automated ticket payouts", feeInfo: "10% platform fee" },
      { name: "Skillshare", url: "https://www.skillshare.com", description: "Publish recorded cooking masterclasses for passive monthly royalties", feeInfo: "Monthly teacher royalty pool" }
    ],
    pros: [
      "Scalable: teach 20 students in the same 90-minute window (e.g. 20 × ₹499 = ₹9,980 per workshop)",
      "Zero delivery logistics or spoilage risks",
      "Establishes personal brand as a culinary expert"
    ],
    challenges: [
      "Need good kitchen lighting and clear camera framing of the chopping board/stove",
      "Pacing the class so students can cook along in real time"
    ],
    sevenDayPlan: [
      { day: 1, title: "Topic Selection", tasks: ["Select 1 focused masterclass topic (e.g. 'Eggless French Macarons from Scratch')"] },
      { day: 2, title: "Ingredient Guide", tasks: ["Create a 1-page PDF with exact measurements and recommended grocery brands"] },
      { day: 3, title: "Ticketing Link", tasks: ["Set up a Topmate group workshop listing at an accessible introductory price (₹299–₹499)"] },
      { day: 4, title: "Promotional Reel", tasks: ["Post a 30-second teaser reel showing the finished dish and announcing the workshop date"] },
      { day: 5, title: "Community Enrollment", tasks: ["Share registration link across foodie forums and neighborhood groups"] },
      { day: 6, title: "Camera & Tech Check", tasks: ["Do a 10-minute test call checking kitchen mic audio and overhead phone angle"] },
      { day: 7, title: "Host Masterclass", tasks: ["Host the 90-minute workshop, answer questions live, and email recorded recap"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Overhead phone tripod setup and live instructional pacing",
      resources: [
        { name: "Skillshare Culinary Teacher Guide", url: "https://www.skillshare.com/teach", free: true }
      ],
      practiceProject: "Record a 5-minute mock cooking demo explaining technique clearly.",
      portfolioGoal: "15 enrolled participants in first live workshop.",
      firstGigAction: "Launch workshop date 10 days in advance."
    },
    scamWarnings: [
      "Collect all ticket fees through verified payment gateways (Razorpay/Stripe via Topmate).",
      "Never share personal bank credentials with workshop registrants."
    ]
  },
  {
    id: "talent-dance-coaching",
    title: "Online Dance Coaching & Choreography",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 to start using living room floor space, comfortable shoes, and your smartphone camera."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per batch / Monthly subscription",
    locationType: "Remote",
    requiredEquipment: ["Smartphone or Laptop with Camera", "Open Floor Space", "Bluetooth Speaker"],
    requiredSkills: ["Dance", "Dancing", "Choreography", "Hip Hop", "Classical Dance", "Zumba", "Fitness Dance", "Teaching"],
    suitablePersonalities: ["High energy", "Working with people", "Physical expression"],
    incomeGoals: ["Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "UrbanPro & Superprof Dance Tutor Benchmarks",
      sourceUrl: "https://www.urbanpro.com/dance-classes",
      platformFees: "Zero commission on direct client batches",
      ageRestrictions: "18+"
    },
    howItWorks: "Teach online group batches (Zumba fitness, wedding choreography, Bollywood/Hip-Hop, classical Bharatnatyam or Kathak) via Zoom. Students enroll in 8-class monthly passes (₹1,500–₹3,500/month per student).",
    whereToStart: [
      "Pick your specialty genre (e.g. Wedding Sangeet choreography, Kids Hip Hop, or Evening Zumba).",
      "Record a 30-second high-energy dance routine with clear steps and good lighting.",
      "List your profile on Superprof, UrbanPro, and Instagram.",
      "Offer weekend batches of 5–10 students (10 students × ₹2,000 = ₹20,000/mo for 2 hours/week)."
    ],
    platforms: [
      { name: "UrbanPro", url: "https://www.urbanpro.com", description: "Verified student leads for dance, music, and fitness classes in India", feeInfo: "Direct client connection" },
      { name: "Superprof", url: "https://www.superprof.co.in", description: "Worldwide tutor listings for dance and choreography", feeInfo: "Free for instructors" }
    ],
    pros: [
      "Batch scaling: teach 8–15 students simultaneously in a single 1-hour session",
      "Year-round wedding and festive choreography demand in India and diaspora abroad",
      "Stay physically fit and active while earning"
    ],
    challenges: [
      "Requires good room lighting and stable WiFi so video streaming doesn't lag",
      "Keeping energy consistently high throughout group classes"
    ],
    sevenDayPlan: [
      { day: 1, title: "Define Class Structure", tasks: ["Structure a 45-minute lesson plan: 10m warmup, 25m routine breakdown, 10m cooldown"] },
      { day: 2, title: "Record Routine", tasks: ["Record a clean 45-second routine showing front-view and slow-count breakdown"] },
      { day: 3, title: "Tutor Profiles", tasks: ["Publish tutor profile on Superprof and UrbanPro with your dance styles and timings"] },
      { day: 4, title: "Free Trial Class", tasks: ["Announce a free Saturday morning trial class on social media and society groups"] },
      { day: 5, title: "Deliver Trial", tasks: ["Host trial class for 6–10 participants with encouraging step-by-step guidance"] },
      { day: 6, title: "Batch Enrollment", tasks: ["Offer trial participants a discounted inaugural monthly pass (e.g. ₹1,499 for 8 sessions)"] },
      { day: 7, title: "Commence Batch", tasks: ["Launch paid monthly schedule and maintain an active WhatsApp accountability group"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Camera framing to capture whole body movement and counts delivery",
      resources: [
        { name: "UrbanPro Instructor Handbook", url: "https://www.urbanpro.com", free: true }
      ],
      practiceProject: "Break down a complex 8-count routine into 3 digestible beginner steps.",
      portfolioGoal: "5 recurring monthly students in morning or evening batch.",
      firstGigAction: "Host first free community trial workshop."
    },
    scamWarnings: [
      "Always collect monthly batch fees before the first week of classes.",
      "Be wary of fake agency calls asking you to pay listing deposits."
    ]
  },
  {
    id: "talent-fitness-yoga-coach",
    title: "Certified Online Fitness & Yoga Trainer",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 using a standard yoga mat and smartphone camera. Optional ₹1,000 for wireless earbuds with clear mic."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Monthly retainer / 1-on-1 coaching fee",
    locationType: "Remote",
    requiredEquipment: ["Yoga Mat", "Smartphone with Camera", "Stable WiFi"],
    requiredSkills: ["Fitness", "Yoga", "Personal Training", "Workout", "Health & Wellness", "Form Correction"],
    suitablePersonalities: ["Health-conscious", "Empathetic motivator", "Disciplined"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Cult.fit Partner & Urban Company Health Professional Rates",
      sourceUrl: "https://www.urbancompany.com/",
      platformFees: "Direct coaching keeps 100% of fees; platforms charge 15–20%",
      ageRestrictions: "18+"
    },
    howItWorks: "Guide busy corporate professionals and homemakers through daily morning yoga, posture correction, fat loss HIIT, or strength workouts via 1-on-1 and small group live video sessions.",
    whereToStart: [
      "Identify your core offering (e.g., 'Desk Worker Back Relief & Morning Yoga' or '30-Minute Bodyweight HIIT').",
      "Offer early morning (6:30 AM – 8:30 AM) slots which have the highest working-professional demand.",
      "Provide simple posture correction cues during live video calls.",
      "Charge ₹2,500–₹6,000/month per client for 3 sessions/week."
    ],
    platforms: [
      { name: "Urban Company", url: "https://www.urbancompany.com", description: "On-demand and online certified fitness and yoga trainer bookings", feeInfo: "Partner commission model" },
      { name: "Topmate.io", url: "https://topmate.io", description: "Personal 1:1 training consultation and monthly client packages", feeInfo: "10% transaction fee" }
    ],
    pros: [
      "Consistent recurring monthly retainers (clients typically train for 6+ months)",
      "High demand for early morning hours before normal workdays begin",
      "Healthy lifestyle alignment: you train as you guide others"
    ],
    challenges: [
      "Must watch student webcam feeds carefully to prevent improper posture and injury",
      "Early morning discipline is essential"
    ],
    sevenDayPlan: [
      { day: 1, title: "Program Design", tasks: ["Design a 4-week progressive plan (Mobility, Core Strength, Posture Alignment)"] },
      { day: 2, title: "Form Cue Checklist", tasks: ["Write concise verbal cues for 10 core movements (plank, downward dog, squat form)"] },
      { day: 3, title: "Profile & Packages", tasks: ["Set up training packages on Topmate (e.g. 12 sessions/month = ₹3,999)"] },
      { day: 4, title: "Case Study & Video", tasks: ["Record a 60-second video demonstrating correct vs incorrect desk-posture stretches"] },
      { day: 5, title: "Offer 3 Assessment Slots", tasks: ["Offer 3 free 20-minute posture/fitness assessments to corporate peers"] },
      { day: 6, title: "Convert to Monthly", tasks: ["Convert 1–2 assessment clients into paid monthly personal training slots"] },
      { day: 7, title: "First Paid Week", tasks: ["Deliver customized week 1 training and provide weekly hydration/habit check-in"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Verbal movement cueing and injury prevention protocols",
      resources: [
        { name: "ACE Fitness Exercise Library", url: "https://www.acefitness.org", free: true }
      ],
      practiceProject: "Conduct 1 free full-hour session with a peer focusing purely on verbal form corrections.",
      portfolioGoal: "2 committed recurring monthly clients.",
      firstGigAction: "Book 1 client at ₹3,000/month."
    },
    scamWarnings: [
      "Real clients pay for certified workout guidance; never pay to 'join multi-level supplement distribution schemes'.",
      "Always have clients confirm they have no unmanaged heart conditions prior to high-intensity training."
    ]
  },
  {
    id: "talent-drawing-art-commissions",
    title: "Custom Digital Illustration & Art Commissions",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1500,
      currency: "INR",
      description: "₹0 if you own a tablet or computer with free software (Krita, IbisPaint, Canva). Optional ₹1,500 for a beginner drawing tablet (Huion/XP-Pen)."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per illustration / Milestone payout",
    locationType: "Remote",
    requiredEquipment: ["Drawing Tablet or Phone/iPad", "Free Art Software (Krita, IbisPaint)", "Internet connection"],
    requiredSkills: ["Drawing", "Painting", "Digital Art", "Illustration", "Sketching", "Procreate", "Visual Storytelling"],
    suitablePersonalities: ["Artistic", "Working alone", "Visual imagination"],
    incomeGoals: ["Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Fiverr & ArtStation Creator Marketplace Benchmarks",
      sourceUrl: "https://www.fiverr.com/gigs/illustration",
      platformFees: "20% platform commission on Fiverr, 10% on Contra",
      ageRestrictions: "18+ on major freelance platforms"
    },
    howItWorks: "Create custom pet portraits, couple anniversary illustrations, digital avatars, comic characters, book covers, and Twitch emotes for international and local clients.",
    whereToStart: [
      "Select 1 profitable, specific niche: e.g., 'Custom Watercolor Pet Portraits' or 'Anime Style Couple Avatars'.",
      "Create 3 high-quality portfolio sample pieces in that exact style.",
      "List service on Fiverr and Contra with clear tiers (Sketch $15, Flat Color $30, Full Render $60).",
      "Deliver high-resolution 300 DPI printable files via platform escrow."
    ],
    platforms: [
      { name: "Fiverr", url: "https://www.fiverr.com", description: "Global demand for digital art, portraits, and commercial illustration", feeInfo: "20% platform commission" },
      { name: "Contra", url: "https://contra.com", description: "Commission-free freelance portfolio with international contracts", feeInfo: "0% commission on direct contracts" },
      { name: "ArtStation", url: "https://www.artstation.com", description: "Professional portfolio and art jobs network", feeInfo: "Free portfolio tier" }
    ],
    pros: [
      "Global client demand: international clients pay $25–$150 per digital portrait",
      "Zero shipping costs (deliver digital PNG/PDF files via email)",
      "High emotional customer satisfaction and glowing verified reviews"
    ],
    challenges: [
      "Requires establishing clear revision limits (e.g. 2 free revisions included)",
      "Balancing creative perfectionism with agreed project deadlines"
    ],
    sevenDayPlan: [
      { day: 1, title: "Niche Selection", tasks: ["Select 1 focused visual niche (e.g. Realistic Watercolor Pet Digital Art)"] },
      { day: 2, title: "Create Sample 1", tasks: ["Draw a Golden Retriever pet portrait with clean lines and soft watercolor brushwork"] },
      { day: 3, title: "Create Sample 2 & 3", tasks: ["Draw a cat portrait and a couple portrait to demonstrate range"] },
      { day: 4, title: "Setup Pricing Tiers", tasks: ["Define 3 clear packages on Fiverr: Headshot (₹1,200), Half Body (₹2,200), Full Scene (₹3,500)"] },
      { day: 5, title: "Publish Gig", tasks: ["Publish gig with 3 high-res portfolio images and 3-day turnaround time"] },
      { day: 6, title: "Promote Samples", tasks: ["Share your process speedpaint video on Instagram and Reddit r/HungryArtists"] },
      { day: 7, title: "First Order Delivery", tasks: ["Deliver draft line-art for client approval, complete final color render, and secure 5-star review"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Digital brush texturing and print-ready 300 DPI CMYK color profiles",
      resources: [
        { name: "Krita Free & Open Source Digital Painting", url: "https://krita.org", free: true }
      ],
      practiceProject: "Paint 1 pet portrait from a reference photo in under 3 hours.",
      portfolioGoal: "3 cohesive portfolio illustrations in a signature style.",
      firstGigAction: "Publish first gig on Fiverr."
    },
    scamWarnings: [
      "Never click external links from 'buyers' claiming they want to buy your art as an NFT.",
      "Keep all client communication and milestones strictly inside the platform."
    ]
  },
  {
    id: "talent-chess-coaching",
    title: "Online Chess Coaching & Tournament Mentorship",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Intermediate", "Advanced", "Professional"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 using free Lichess/Chess.com interactive analysis boards and Google Meet."
    },
    timeRequired: {
      minHoursPerDay: 1,
      maxHoursPerDay: 3,
      label: "1–3 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per hour / Weekly packages",
    locationType: "Remote",
    requiredEquipment: ["Laptop or Tablet", "Chess.com / Lichess Free Account", "Internet connection"],
    requiredSkills: ["Chess", "Chess Coaching", "Tactics", "Opening Repertoire", "Patience", "Teaching"],
    suitablePersonalities: ["Analytical", "Strategic", "Teaching", "Mentorship"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Chess.com Verified Coaches & Superprof Rates",
      sourceUrl: "https://www.chess.com/coaches",
      platformFees: "Free coaching profiles on Lichess, standard platform fees",
      ageRestrictions: "18+ for coach registration"
    },
    howItWorks: "Coach school students, club players, and chess enthusiasts (typically 600–1600 Elo) on tactical pattern recognition, opening principles, and endgame technique using interactive analysis boards.",
    whereToStart: [
      "Any player with an online rating of 1500+ (or FIDE rating) can effectively coach beginner-to-intermediate students (rating 600–1200).",
      "Create a free coach profile on Lichess.org and Superprof.",
      "Prepare 5 classic tactical puzzle themes and opening fundamentals lessons.",
      "Charge ₹700–₹2,000/hour ($15–$35/hr for students in the US/UK/Europe)."
    ],
    platforms: [
      { name: "Chess.com Coaches", url: "https://www.chess.com/coaches", description: "Official directory of rated chess coaches worldwide", feeInfo: "Direct client arrangements" },
      { name: "Superprof", url: "https://www.superprof.co.in", description: "Listing portal for private chess tutors in India and globally", feeInfo: "Free for instructors" }
    ],
    pros: [
      "Huge global demand from parents looking for cognitive mentors for kids",
      "High hourly rates: international chess students pay $20–$40/hour",
      "Play and analyze the game you love during paid working hours"
    ],
    challenges: [
      "Requires tailoring explanations to children without overwhelming them with deep engine lines",
      "Consistency in student puzzle homework tracking"
    ],
    sevenDayPlan: [
      { day: 1, title: "Syllabus Structure", tasks: ["Outline a 6-week curriculum: Opening rules, Tactical motifs (fork/pin/skewer), King & Pawn endings"] },
      { day: 2, title: "Lichess Study Setup", tasks: ["Build a clean interactive Lichess Study with 15 pedagogical tactical puzzles"] },
      { day: 3, title: "Publish Tutor Profile", tasks: ["List profile on Superprof with your peak online rating, playing accomplishments, and hourly rate"] },
      { day: 4, title: "Share Availability", tasks: ["Share your coaching availability with school parents and chess community forums"] },
      { day: 5, title: "Demo Analysis Call", tasks: ["Conduct a 20-minute trial game review with an interested beginner, identifying their key mistakes"] },
      { day: 6, title: "Book Monthly Plan", tasks: ["Book student into a 4-lesson monthly coaching slot"] },
      { day: 7, title: "Deliver Lesson 1", tasks: ["Conduct structured interactive lesson and assign a weekly tactical puzzle homework link"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Interactive Lichess Study creation and student blunder diagnosis",
      resources: [
        { name: "Lichess Free Interactive Studies", url: "https://lichess.org/study", free: true }
      ],
      practiceProject: "Annotate 1 famous classical game (e.g. Morphy's Opera Game) explaining concepts in simple terms.",
      portfolioGoal: "2 weekly private students.",
      firstGigAction: "Book first ₹800–₹1,500/hour private student."
    },
    scamWarnings: [
      "Never pay upfront fees to third-party 'academies' promising to assign students to you.",
      "Collect monthly package fees prior to starting the lesson bundle."
    ]
  },
  {
    id: "talent-handmade-crafts",
    title: "Handmade Crafts, Pottery & Custom Gifts",
    category: "Low-Investment",
    mode: "Hybrid",
    experienceLevel: ["Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 800,
      max: 3000,
      currency: "INR",
      description: "Low startup: ₹800–₹2,500 for raw crafting materials (resin, clay, candle wax, or calligraphy pens) and safe packaging."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per item / Custom order",
    locationType: "Remote / Shipped",
    requiredEquipment: ["Crafting Tools & Materials", "Smartphone Camera", "Courier Packaging Box"],
    requiredSkills: ["Crafts", "Handmade", "Pottery", "DIY", "Calligraphy", "Jewelry Making", "Candle Making", "Creative Gift Design"],
    suitablePersonalities: ["Artistic hands-on", "Detail-oriented", "Patience"],
    incomeGoals: ["Side income", "Replace part-time income", "Build a business"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Etsy India & Amazon Karigar Maker Benchmarks",
      sourceUrl: "https://www.etsy.com/in-en/sell",
      platformFees: "Etsy charges standard listing ($0.20) + 6.5% transaction fee",
      ageRestrictions: "18+"
    },
    howItWorks: "Handcraft personalized resin bookmarks, scented soy candles, handmade pottery mugs, embroidered tote bags, or custom calligraphy nameplates and sell directly online.",
    whereToStart: [
      "Choose 1 signature craft product with high perceived aesthetic value and low shipping weight.",
      "Make 5 finished pieces and photograph them in natural daylight.",
      "Open a shop on Etsy, Amazon Karigar, or a free storefront on Instagram.",
      "Price items at 3x material cost to cover packaging, shipping, and your artistic labor."
    ],
    platforms: [
      { name: "Etsy", url: "https://www.etsy.com/in-en/sell", description: "Global premier marketplace for handmade crafts and artisanal products", feeInfo: "Listing fee + 6.5% transaction commission" },
      { name: "Instagram Shop", url: "https://www.instagram.com", description: "Showcase craft creation process videos and take direct orders", feeInfo: "0% commission on direct orders" }
    ],
    pros: [
      "Turn a calming tactile hobby into a profitable e-commerce brand",
      "Massive seasonal spikes around Diwali, Christmas, Valentine's Day, and wedding seasons",
      "International buyers on Etsy pay $15–$50 for handmade Indian artisanal crafts"
    ],
    challenges: [
      "Packaging must be sturdy to prevent damage during postal courier transit",
      "Batch crafting time management"
    ],
    sevenDayPlan: [
      { day: 1, title: "Product Validation", tasks: ["Select 1 signature product (e.g. Botanical Pressed-Flower Resin Bookmarks or Scented Soy Candles)"] },
      { day: 2, title: "Craft Initial Batch", tasks: ["Create 4 high-quality pieces with consistent finish and zero defects"] },
      { day: 3, title: "Product Photography", tasks: ["Photograph items on simple wooden or linen backgrounds in soft natural morning light"] },
      { day: 4, title: "Cost & Price Calculation", tasks: ["Calculate unit cost and set price at 3x raw material expense"] },
      { day: 5, title: "Storefront Launch", tasks: ["Open Etsy shop and create an Instagram product catalog with clear descriptions"] },
      { day: 6, title: "Process Reel", tasks: ["Post a 20-second relaxing craft creation process video to Instagram Reels"] },
      { day: 7, title: "Ship First Order", tasks: ["Package first order in sturdy protective bubble-wrap with a handwritten thank-you card"] }
    ],
    learningRoadmap: {
      currentSkillGap: "E-commerce product SEO keywords and durable shipping packaging",
      resources: [
        { name: "Etsy Seller Handbook", url: "https://www.etsy.com/seller-handbook", free: true }
      ],
      practiceProject: "Ship 1 practice craft box to a friend in another city to test packaging durability.",
      portfolioGoal: "5 active listings on Etsy or Instagram.",
      firstGigAction: "Make 1st commercial sale."
    },
    scamWarnings: [
      "Never click suspicious email links pretending to be 'Etsy Payment Verification'.",
      "Always verify order payments in your official seller dashboard before shipping items."
    ]
  },
  {
    id: "talent-creative-writing-storytelling",
    title: "Creative Storytelling, Copywriting & Scriptwriting",
    category: "Zero-Investment",
    mode: "Online",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 500,
      currency: "INR",
      description: "₹0 using Google Docs or free writing software on your laptop or smartphone."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per project / Per word / Royalties",
    locationType: "Remote",
    requiredEquipment: ["Laptop or Smartphone", "Google Docs", "Internet connection"],
    requiredSkills: ["Writing", "Creative Writing", "Storytelling", "Scriptwriting", "Copywriting", "Research"],
    suitablePersonalities: ["Creative", "Working alone", "Curious"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Amazon KDP & Upwork Creative Writing Benchmarks",
      sourceUrl: "https://kdp.amazon.com/",
      platformFees: "Amazon pays 70% royalties; Upwork takes 10% fee",
      ageRestrictions: "18+"
    },
    howItWorks: "Write compelling YouTube video scripts, podcast narratives, children's storybooks, newsletter editions, or freelance marketing copy for creator channels and business brands.",
    whereToStart: [
      "Select a writing niche: e.g. 8-minute YouTube documentary scripts or high-converting email newsletters.",
      "Write 2 original sample scripts analyzing an interesting real-world story.",
      "Compile samples into a clean, read-only Google Docs portfolio link.",
      "Pitch emerging YouTube channels (10k–100k subscribers) or apply on Upwork."
    ],
    platforms: [
      { name: "Upwork", url: "https://www.upwork.com", description: "Global contracts for scriptwriters, copywriters, and creative storytellers", feeInfo: "10% freelancer fee" },
      { name: "Amazon KDP", url: "https://kdp.amazon.com", description: "Publish short stories, novellas, and ebooks with up to 70% royalty payouts", feeInfo: "Free to publish" }
    ],
    pros: [
      "Zero startup equipment required: you can write anywhere on phone or laptop",
      "Huge demand from busy video creators who need engaging scriptwriters",
      "Residual royalties on published digital books via Amazon KDP"
    ],
    challenges: [
      "Requires researching topics deeply to avoid superficial writing",
      "Iterating through feedback and maintaining audience retention hooks"
    ],
    sevenDayPlan: [
      { day: 1, title: "Script Anatomy Study", tasks: ["Study the storytelling structure of 3 top YouTube documentary channels (Hook, Conflict, Payoff)"] },
      { day: 2, title: "Write Sample 1", tasks: ["Write a gripping 1,200-word script on a fascinating historical or technology breakthrough"] },
      { day: 3, title: "Write Sample 2", tasks: ["Write a 3-part storytelling email sequence designed to engage readers"] },
      { day: 4, title: "Clean Portfolio", tasks: ["Format both samples into a Google Docs folder with professional formatting"] },
      { day: 5, title: "Targeted Outreach", tasks: ["Find 5 YouTube creators who upload consistently and email them a personalized pitch with sample"] },
      { day: 6, title: "Upwork Proposals", tasks: ["Submit 3 tailored proposals on Upwork for video scriptwriting or creative copywriting"] },
      { day: 7, title: "First Paid Script", tasks: ["Deliver first script with clear visual cues and timestamp markers for the video editor"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Hook writing, pacing, and retention-focused storytelling structures",
      resources: [
        { name: "Pixar in a Box Storytelling (Khan Academy)", url: "https://www.khanacademy.org/computing/pixar/storytelling", free: true }
      ],
      practiceProject: "Write a 3-minute video script explaining a complex topic with an irresistible narrative hook.",
      portfolioGoal: "2 polished sample scripts in Google Docs.",
      firstGigAction: "Book first ₹2,000–₹5,000 video script contract."
    },
    scamWarnings: [
      "Never pay 'reading fees' or 'publisher evaluation charges' to submit manuscripts.",
      "Ensure all freelance contracts have milestone deposits funded in escrow before writing starts."
    ]
  },
  {
    id: "talent-acting-anchoring",
    title: "Event Emcee, Host & Commercial Acting",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 500,
      max: 2000,
      currency: "INR",
      description: "Low startup: ₹500–₹1,500 for professional formal attire and a 1-minute intro showreel."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 5,
      label: "2–5 hours per event (Weekends)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per event / Day rate",
    locationType: "Local / In-person",
    requiredEquipment: ["Smart Formal Attire", "Smartphone for Showreel", "Confident Vocal Projection"],
    requiredSkills: ["Acting", "Public Speaking", "Anchor", "Emcee", "Drama", "Theatre", "Audience Engagement", "Communication"],
    suitablePersonalities: ["Extroverted", "High energy", "Quick-witted", "Hospitality"],
    incomeGoals: ["Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Event Management Association & Corporate Emcee Rates",
      sourceUrl: "https://www.linkedin.com/jobs/event-host-jobs/",
      platformFees: "Direct event bookings (100% payout to host)",
      ageRestrictions: "18+"
    },
    howItWorks: "Host corporate award nights, wedding celebrations, college festivals, product launches, or act in local commercial shoots. Hosts earn ₹4,000–₹25,000 per event.",
    whereToStart: [
      "Record a 45-second energetic showreel introducing yourself as an emcee/host with clear enunciation.",
      "Connect with 5 local event management companies and wedding planners in your city.",
      "Start by co-hosting or hosting smaller community functions to build stage confidence.",
      "Charge ₹4,000–₹8,000 for your first solo corporate or wedding engagement."
    ],
    platforms: [
      { name: "LinkedIn Events", url: "https://www.linkedin.com/jobs/event-host-jobs/", description: "Direct corporate event organizer and agency connections", feeInfo: "Direct corporate engagement" },
      { name: "Local Event Planners", url: "https://www.google.com/search?q=event+planners+near+me", description: "Direct partnerships with regional wedding and banquet event firms", feeInfo: "100% direct artist payout" }
    ],
    pros: [
      "High pay per single day or evening commitment (₹5,000–₹20,000 for 3 hours of stage work)",
      "Vibrant networking: every event puts you in front of hundreds of potential corporate clients",
      "Immediate on-the-spot bank transfer or cash honorarium"
    ],
    challenges: [
      "Requires thinking on your feet to manage unexpected stage delays or technical glitches",
      "Must maintain high positive crowd energy throughout the event"
    ],
    sevenDayPlan: [
      { day: 1, title: "Showreel Script", tasks: ["Write a 45-second energetic mock intro welcoming guests to an annual tech summit"] },
      { day: 2, title: "Film Showreel", tasks: ["Film the intro in crisp attire with good lighting and clear vocal projection"] },
      { day: 3, title: "Host Portfolio", tasks: ["Upload video to YouTube (Unlisted or Public) and create a 1-page PDF emcee profile"] },
      { day: 4, title: "Agency Outreach", tasks: ["Contact 5 local event planners on LinkedIn or WhatsApp introducing your hosting availability"] },
      { day: 5, title: "Wedding & Party Inquiries", tasks: ["Reach out to 2 local banquet halls sharing your contact details for event host requests"] },
      { day: 6, title: "Event Preparation", tasks: ["Review the schedule of activities, name pronunciations, and speaker transitions"] },
      { day: 7, title: "Host Live Event", tasks: ["Host event with enthusiasm, capture 2 stage photos for your portfolio, and collect honorarium"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Crowd ice-breakers, microphone handling, and spontaneous improvisational humor",
      resources: [
        { name: "Toastmasters Public Speaking Fundamentals", url: "https://www.toastmasters.org", free: true }
      ],
      practiceProject: "Deliver a 3-minute stage introduction without reading from notes.",
      portfolioGoal: "45-second clean showreel video.",
      firstGigAction: "Host first paid local engagement."
    },
    scamWarnings: [
      "Never pay 'audition fees' or 'portfolio photoshoot fees' to unverified modeling or casting agencies.",
      "Always confirm event timings, dress code, and payment terms in writing prior to event day."
    ]
  },
  {
    id: "talent-indoor-gardening",
    title: "Urban Gardening & Balcony Plant Care Consultant",
    category: "Local / Offline",
    mode: "Offline",
    experienceLevel: ["Beginner", "Some experience", "Intermediate"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 500,
      max: 1500,
      currency: "INR",
      description: "Low startup: ₹500–₹1,500 for basic hand pruning shears, moisture meter, and organic neem spray."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Per consultation / Monthly maintenance retainer",
    locationType: "Local / In-person",
    requiredEquipment: ["Pruning Shears", "Plant Care Kit", "Smartphone Camera"],
    requiredSkills: ["Gardening", "Plants", "Horticulture", "Landscaping", "Pest Management", "Indoor Plant Care"],
    suitablePersonalities: ["Nature lover", "Hands-on", "Patient", "Consultative"],
    incomeGoals: ["Small extra income", "Side income", "Replace part-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Urban Company & Local Apartment Community Green Services",
      sourceUrl: "https://www.urbancompany.com/",
      platformFees: "Direct neighborhood clients keep 100% of earnings",
      ageRestrictions: "18+"
    },
    howItWorks: "Help urban apartment dwellers revive dying houseplants, set up organic balcony kitchen gardens, install drip watering systems, and provide weekly plant maintenance. Charges: ₹500–₹1,500 per home consultation or monthly maintenance retainers.",
    whereToStart: [
      "Photograph healthy indoor plants and balcony setups in your own home.",
      "Create a simple flyer: 'Revive Your Dying Plants & Organic Balcony Garden Setup'.",
      "Post in your local apartment society WhatsApp groups and community portals.",
      "Offer initial 30-minute diagnostic visits to inspect plant soil, sunlight, and pest issues."
    ],
    platforms: [
      { name: "Urban Company", url: "https://www.urbancompany.com", description: "Home and garden maintenance partner listings in major metros", feeInfo: "Direct platform lead matching" },
      { name: "Local Apartment Groups", url: "https://mygate.com", description: "Direct neighborhood outreach on society notice boards (MyGate, NobrokerHood)", feeInfo: "Free neighborhood outreach" }
    ],
    pros: [
      "High density: you can service 4–6 client apartments in the exact same building",
      "Recurring monthly maintenance retainers (e.g. ₹1,500/month per apartment for bi-weekly checkups)",
      "Therapeutic, green, outdoors-friendly work"
    ],
    challenges: [
      "Need accurate plant diagnosis knowledge (identifying overwatering vs root rot vs nutrient deficiency)",
      "Requires carrying basic potting tools and organic spray supplies"
    ],
    sevenDayPlan: [
      { day: 1, title: "Diagnostic Checklist", tasks: ["Create a 1-page plant health checklist (Light exposure, Pot drainage, Soil compaction, Pest check)"] },
      { day: 2, title: "Flyer Design", tasks: ["Design a clean friendly flyer: 'Apartment Plant Doctor & Balcony Garden Setup'"] },
      { day: 3, title: "Share in Society", tasks: ["Post flyer in your residential society MyGate or community WhatsApp group"] },
      { day: 4, title: "First 2 Diagnostic Visits", tasks: ["Perform 2 free 20-minute diagnostic visits for neighbors with struggling plants"] },
      { day: 5, title: "Treatment Execution", tasks: ["Repot into proper potting mix, prune dead leaves, and apply organic neem oil spray"] },
      { day: 6, title: "Monthly Retainer Offer", tasks: ["Offer neighbors a bi-weekly maintenance package (₹1,200/month for 2 visits)"] },
      { day: 7, title: "Expand to Next Tower", tasks: ["Share a happy before/after photo with neighbor's permission to gain 3 more clients in adjacent towers"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Identifying common houseplant diseases and balcony sunlight orientation",
      resources: [
        { name: "RHS Indoor Plant Care Basics", url: "https://www.rhs.org.uk/plants/indoor", free: true }
      ],
      practiceProject: "Successfully repot and diagnose 3 different plant varieties.",
      portfolioGoal: "3 before/after plant revival photos.",
      firstGigAction: "Book 2 recurring plant care clients."
    },
    scamWarnings: [
      "Never purchase expensive wholesale nursery stock without upfront client deposit.",
      "Always inspect client plant pots before quoting to ensure fair pricing for materials."
    ]
  },
  {
    id: "talent-accounting-taxation",
    title: "Freelance Bookkeeping & Small Business Tax Support",
    category: "Skill-Based",
    mode: "Online",
    experienceLevel: ["Some experience", "Intermediate", "Advanced"],
    isBeginnerFriendly: true,
    isAdvanced: false,
    investment: {
      min: 0,
      max: 1000,
      currency: "INR",
      description: "₹0 using Google Sheets/Excel or client-provided QuickBooks/Tally licenses."
    },
    timeRequired: {
      minHoursPerDay: 2,
      maxHoursPerDay: 4,
      label: "2–4 hours/day (Flexible)",
      flexible: true,
      weekendsOnlyViable: true
    },
    incomeModel: "Monthly retainer / Hourly",
    locationType: "Remote",
    requiredEquipment: ["Laptop or Desktop", "Excel / Google Sheets", "Internet connection"],
    requiredSkills: ["Accounting", "Bookkeeping", "Tally", "GST", "Excel", "Finance", "Invoice Reconciliation"],
    suitablePersonalities: ["Analytical", "Detail-oriented", "Trustworthy", "Organized"],
    incomeGoals: ["Side income", "Replace part-time income", "Full-time income"],
    countryAvailability: ["India", "USA", "UK", "Canada", "Australia", "Other"],
    verification: {
      status: "Verified",
      lastVerifiedAt: "September 2026",
      source: "Upwork & SMB Bookkeeping Market Rates",
      sourceUrl: "https://www.upwork.com/freelance-jobs/bookkeeping/",
      platformFees: "10% on Upwork, 0% on direct local contracts",
      ageRestrictions: "18+"
    },
    howItWorks: "Reconcile monthly bank statements, categorize business expenses, generate profit & loss summaries, and prepare monthly GST filing sheets for small shops, creators, and online businesses.",
    whereToStart: [
      "Master bank reconciliation and expense categorization in Excel/Google Sheets or Tally/QuickBooks.",
      "Target small online creators, freelancers, and local retail stores who struggle to keep their receipts organized.",
      "Offer a free initial 1-month bookkeeping cleanup.",
      "Charge a monthly retainer of ₹5,000–₹15,000 per business client (3 clients = ₹15,000–₹45,000/mo)."
    ],
    platforms: [
      { name: "Upwork", url: "https://www.upwork.com", description: "Global contracts for QuickBooks, Xero, and Excel bookkeeping assistants", feeInfo: "10% service fee" },
      { name: "Local SMB Network", url: "https://www.linkedin.com", description: "Direct monthly accounting retainers for regional startups and retail stores", feeInfo: "100% direct payment" }
    ],
    pros: [
      "Rock-solid monthly retention: once a business trusts you with their books, they rarely change bookkeepers",
      "Completely remote and async: work anytime day or night",
      "Clear, mathematical rules: zero ambiguity once system is set up"
    ],
    challenges: [
      "Requires high precision and strict confidentiality regarding client financial data",
      "Following up with clients to obtain missing expense receipts"
    ],
    sevenDayPlan: [
      { day: 1, title: "Template Preparation", tasks: ["Build a clean 3-tab bookkeeping template in Google Sheets (Income, Expenses, Monthly P&L)"] },
      { day: 2, title: "Sample Reconciliation", tasks: ["Practice categorizing 50 mock transactions into standard accounting categories"] },
      { day: 3, title: "Profile Creation", tasks: ["Set up an Upwork profile highlighting Excel, QuickBooks, and Bank Reconciliation skills"] },
      { day: 4, title: "Local Business Pitch", tasks: ["Reach out to 3 local store owners or freelancer friends offering a free 1-month ledger cleanup"] },
      { day: 5, title: "Clean Ledger", tasks: ["Reconcile client bank statement against receipts and generate a clean P&L summary"] },
      { day: 6, title: "Monthly Retainer Proposal", tasks: ["Present clean ledger and propose a recurring monthly bookkeeping package (₹4,999/month)"] },
      { day: 7, title: "Retainer Onboarding", tasks: ["Set up automated shared Google Drive folder for monthly invoice and receipt uploads"] }
    ],
    learningRoadmap: {
      currentSkillGap: "Bank feed reconciliation rules and GST input tax credit calculation",
      resources: [
        { name: "Intuit QuickBooks Free Training", url: "https://quickbooks.intuit.com/accountants/training-certification/", free: true }
      ],
      practiceProject: "Reconcile a full 3-month personal or mock business bank statement to ₹0 discrepancy.",
      portfolioGoal: "1 active monthly bookkeeping client.",
      firstGigAction: "Book 1 small business monthly retainer."
    },
    scamWarnings: [
      "Never share OTPs or perform personal fund transfers for any client.",
      "Maintain read-only access to client accounting software; never take custody of client funds."
    ]
  }
];
