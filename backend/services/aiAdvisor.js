// backend/services/aiAdvisor.js
import { opportunities } from '../data/opportunities.js';
import { skillsIncomeMap } from '../data/skillsMap.js';

/**
 * Call Google Gemini LLM API (gemini-1.5-flash or configured model)
 */
async function callGemini(userPrompt, systemPrompt) {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 1800
        }
      })
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[AI Advisor Gemini] API responded with ${res.status}: ${errText.slice(0, 150)}`);
      return null;
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (text && typeof text === 'string' && text.trim().length > 20) {
      return { text: text.trim(), model: `Gemini (${model})` };
    }
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[AI Advisor Gemini] Request notice:', err.message);
    return null;
  }
}

/**
 * Call OpenAI API (gpt-4o-mini or configured model)
 */
async function callOpenAI(userPrompt, systemPrompt) {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const url = 'https://api.openai.com/v1/chat/completions';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.65,
        max_tokens: 1800
      })
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[AI Advisor OpenAI] API responded with ${res.status}: ${errText.slice(0, 150)}`);
      return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (text && typeof text === 'string' && text.trim().length > 20) {
      return { text: text.trim(), model: `OpenAI (${model})` };
    }
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[AI Advisor OpenAI] Request notice:', err.message);
    return null;
  }
}

/**
 * Construct system instructions for the LLM
 */
function buildSystemPrompt(profile = {}, params = {}) {
  const ageStr = params.age ? `${params.age} years old` : (profile.age ? `${profile.age} years old` : "Not specified");
  const budgetStr = params.budgetAmount !== null ? `₹${params.budgetAmount.toLocaleString('en-IN')}` : (profile.budget || "₹0 / Free to start");
  const timeStr = params.timeHours ? `${params.timeHours} hours/day` : (profile.availableTime || "2 hours/day");
  const skillsStr = Array.isArray(profile.skills) && profile.skills.length > 0 ? profile.skills.join(", ") : "General digital skills";
  const countryStr = profile.country || "India";

  return `You are Money Way AI Advisor, an expert career mentor, financial coach, and ethical micro-income advisor.
Your mission is to provide realistic, safe, and actionable career and monetization guidance tailored to the user's exact circumstances.

USER CONTEXT:
- Age / Life Stage: ${ageStr} ${params.isUnder18 ? "(MINOR / UNDER 18)" : ""}
- Starting Capital / Budget: ${budgetStr}
- Available Time: ${timeStr}
- Known Skills: ${skillsStr}
- Target Market / Country: ${countryStr}

CRITICAL RULES & ADVISORY DIRECTIVES:
1. ZERO TOLERANCE FOR SCAMS:
   - Real jobs and clients NEVER ask workers to pay "registration fees", "training deposits", "security charges", or "account verification fees".
   - Explicitly warn against advance-fee scams, Telegram/WhatsApp video like tasks, and captcha entry deposit schemes.
2. AGE REALISM & SAFETY:
   - If the user is under 18 (e.g. 17 or student): Explain the legal reality (cannot sign formal corporate employment contracts or register independent Stripe/PayPal merchant accounts without a parent/guardian co-signing). Explain safe payment methods (parent/guardian UPI, minor savings accounts like SBI Pehla Kadam or FamPay). Recommend high-yield student niches: short-form video editing, Canva design, peer tutoring, digital Notion templates, local digital presence for neighborhood businesses.
3. BUDGET ALLOCATION:
   - If the user specifies an exact budget (e.g. ₹2,000): Provide a concrete rupee-by-rupee breakdown showing what to spend on (e.g. domain, sample prints) and ALWAYS advise keeping 30–40% in cash reserve.
4. ROLE COMPARISON & VERDICT:
   - If the user asks which role is better, provide a ranked comparison with pros/cons, startup time, earning potential, and a clear verdict based on whether they lean tech, creative, or tutoring.
5. CONCRETE BUSINESS IDEAS:
   - If asked for business or startup ideas, give realistic micro-businesses that can genuinely launch with the stated budget. No get-rich-quick hype.
6. 7-DAY ACTION PLAN:
   - Outline a clear step-by-step plan from sample creation to first client acquisition.
7. NEVER FABRICATE APPOINTMENTS OR URLs:
   - Do not invent fake job URLs or fake companies. Refer to authentic platforms (Upwork, Internshala, Preply, Superprof, Topmate, Gumroad, Canva, YouTube, etc.).

OUTPUT FORMAT:
- Use clean Markdown with headers (###), bold text, and numbered bullet points.
- Conclude your reply with a section:
SUGGESTED_PROMPTS:
- "Follow-up question 1"
- "Follow-up question 2"
- "Follow-up question 3"`;
}

/**
 * Parse LLM output into clean reply and suggested prompts
 */
function parseLLMResponse(rawText, pool = []) {
  if (!rawText) return null;

  let cleanReply = rawText;
  let suggestedPrompts = [];

  const promptsIndex = rawText.search(/\bSUGGESTED_PROMPTS\s*:/i);
  if (promptsIndex !== -1) {
    cleanReply = rawText.slice(0, promptsIndex).trim();
    const promptsBlock = rawText.slice(promptsIndex);
    const lines = promptsBlock.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const match = line.match(/^[-*•\d.]+\s*["'“]?([^"'”\n]+)["'”]?$/);
      if (match && match[1] && !match[1].toLowerCase().includes('suggested_prompts')) {
        suggestedPrompts.push(match[1].trim());
      }
    }
  }

  if (suggestedPrompts.length === 0) {
    suggestedPrompts = [
      "How do I land my first client?",
      "What if I only have a smartphone?",
      "Help me build a step-by-step 7-day action plan",
      "Check an opportunity for scam signals"
    ];
  }

  // Find relevant opportunity IDs from the verified store to attach
  const matchedOpportunities = pool
    .filter(o => o.isBeginnerFriendly || o.category === 'Internship' || o.type === 'Freelance')
    .slice(0, 3)
    .map(o => o.id);

  return {
    reply: cleanReply,
    suggestedPrompts: suggestedPrompts.slice(0, 4),
    matchedOpportunities
  };
}

/**
 * Extract structured user parameters from chat message and optional profile
 */
function extractUserParameters(message = "", profile = {}) {
  const q = message.toLowerCase().trim();

  // 1. Age extraction
  let age = null;
  const ageMatch = q.match(/(?:i am|i'm|im|age|aged|am)\s*(\d{1,2})\b/i) || 
                   q.match(/\b(\d{1,2})\s*(?:years?|yrs?|yr)\s*old\b/i) ||
                   q.match(/\baged?\s*(\d{1,2})\b/i);
  if (ageMatch && ageMatch[1]) {
    const parsedAge = parseInt(ageMatch[1], 10);
    if (parsedAge >= 10 && parsedAge <= 90) {
      age = parsedAge;
    }
  }
  if (age === null && profile.age) {
    age = parseInt(profile.age, 10) || null;
  }

  const isUnder18 = age !== null && age < 18;
  const isStudent = isUnder18 || 
                    q.includes("student") || 
                    q.includes("college") || 
                    q.includes("school") || 
                    q.includes("teen") ||
                    q.includes("teenager") ||
                    q.includes("under 18");

  // 2. Budget extraction
  let budgetAmount = null;
  let isZeroBudget = false;

  if (/\b(?:₹\s*0|0\s*(?:rupees?|rs\.?|inr))\b/i.test(q) || q.includes("no money") || q.includes("no investment") || q.includes("zero budget") || q.includes("free to start")) {
    budgetAmount = 0;
    isZeroBudget = true;
  } else {
    const budgetMatch = q.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i) || 
                        q.match(/(\d[\d,]*)\s*(?:₹|rs\.?|inr|rupees?|bucks?)/i) ||
                        q.match(/\b(\d+)\s*k\s*(?:rs|inr|rupees)?\b/i);
    if (budgetMatch && budgetMatch[1]) {
      const cleaned = budgetMatch[1].replace(/,/g, '');
      budgetAmount = parseInt(cleaned, 10);
      if (budgetMatch[0].includes('k') && budgetAmount < 1000) {
        budgetAmount *= 1000;
      }
    }
  }

  if (budgetAmount === null && profile.budget) {
    const pBudgetStr = String(profile.budget).toLowerCase();
    if (pBudgetStr.includes("0") || pBudgetStr.includes("free")) {
      budgetAmount = 0;
      isZeroBudget = true;
    } else {
      const match = pBudgetStr.match(/(\d+)/);
      if (match) budgetAmount = parseInt(match[1], 10);
    }
  }

  // 3. Time extraction
  let timeHours = null;
  const timeMatch = q.match(/(\d+)\s*(?:hours?|hrs?)/i);
  if (timeMatch && timeMatch[1]) {
    timeHours = parseInt(timeMatch[1], 10);
  } else if (profile.timeHours || profile.availableTime) {
    const match = String(profile.availableTime || profile.timeHours).match(/(\d+)/);
    if (match) timeHours = parseInt(match[1], 10);
  }

  // 4. Intent detection
  const hasRoleIntent = /(?:which|what)\s*role|better\s*role|best\s*role|which\s*job|role\s*is\s*better|roles?\b/i.test(q);
  const hasBusinessIntent = /\bbusiness\b|\bbussiness\b|\bstartup\b|\bideas?\b|\bhustle\b|\bmicro-business\b/i.test(q);
  const isIntrovert = q.includes("don't want to talk to customers") || 
                      q.includes("no customers") || 
                      q.includes("work alone") || 
                      q.includes("introvert") ||
                      q.includes("without talking");
  const isQuickStart = q.includes("start this week") || q.includes("quick") || q.includes("fast") || q.includes("immediate") || q.includes("today");
  const isScamQuery = q.includes("scam") || q.includes("legit") || q.includes("registration fee") || q.includes("telegram task") || q.includes("typing job");

  // Gaming intent
  const isGamingQuery = 
    q.includes("freefire") || q.includes("free fire") || q === "ff" ||
    q.includes("mobile game") || q.includes("bgmi") || q.includes("pubg") || 
    q.includes("codm") || q.includes("valorant") || q.includes("esport") || 
    q.includes("gamer") || q.includes("gaming");

  // Specific skill matching
  let matchedSkill = null;
  for (const skillName of Object.keys(skillsIncomeMap)) {
    const sLower = skillName.toLowerCase();
    if (q.includes(sLower) || 
       (sLower.includes('catering') && (q.includes('cater') || q.includes('catring') || q.includes('banquet') || q.includes('food service'))) ||
       (sLower.includes('cricket') && q.includes('cricket')) ||
       (sLower.includes('cooking') && (q.includes('cook') || q.includes('baking') || q.includes('chef'))) ||
       (sLower.includes('fitness') && (q.includes('fitness') || q.includes('gym') || q.includes('yoga'))) ||
       (sLower.includes('electrical') && q.includes('electr')) ||
       (sLower.includes('sound') && q.includes('sound')) ||
       (sLower.includes('editing') && (q.includes('edit') || q.includes('video')))) {
      matchedSkill = skillName;
      break;
    }
  }

  // Intent for guarantees or specific closing dates
  const isGuaranteeQuery = /\b(guarantee|guaranteed|promise|zero risk|no risk)\b/i.test(q);
  const isClosingDateQuery = /\b(when will.*close|closing date|last date to apply|application deadline|hiring deadline|when will.*applications)\b/i.test(q);

  return {
    age,
    isUnder18,
    isStudent,
    budgetAmount,
    isZeroBudget,
    timeHours,
    hasRoleIntent,
    hasBusinessIntent,
    isIntrovert,
    isQuickStart,
    isScamQuery,
    isGamingQuery,
    isGuaranteeQuery,
    isClosingDateQuery,
    matchedSkill
  };
}

/**
 * Handle AI Advisor Chat with LLM (Gemini / OpenAI) and seamless rule engine fallback
 */
export async function handleAdvisorChat(message, profile = {}, opps = opportunities) {
  const query = (message || "").toLowerCase().trim();
  const pool = Array.isArray(opps) && opps.length > 0 ? opps : opportunities;

  // Short prompt fallback
  if (query.length < 3) {
    return {
      reply: "Hello! I am your Money Way AI Advisor. Tell me your age, starting budget, available time, and skills or interests, and I will recommend realistic, verified pathways suited to your situation.",
      suggestedPrompts: [
        "I'm 17 years old with ₹2,000 budget — what role and business is best?",
        "I have ₹0 budget and 2 hours a day",
        "I know Python and want to work from home",
        "What can I start this week with just a smartphone?"
      ]
    };
  }

  const params = extractUserParameters(message, profile);

  // ────────────────────────────────────────────────────────────
  // 1. LLM ENGINE (Google Gemini or OpenAI if API key configured)
  // ────────────────────────────────────────────────────────────
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (hasGemini || hasOpenAI) {
    try {
      const systemPrompt = buildSystemPrompt(profile, params);
      let llmRes = null;

      if (hasGemini) {
        llmRes = await callGemini(message, systemPrompt);
      }
      if (!llmRes && hasOpenAI) {
        llmRes = await callOpenAI(message, systemPrompt);
      }

      if (llmRes && llmRes.text) {
        const parsed = parseLLMResponse(llmRes.text, pool);
        if (parsed && parsed.reply) {
          return {
            ...parsed,
            source: llmRes.model,
            isLlmPowered: true
          };
        }
      }
    } catch (err) {
      console.warn('[AI Advisor] LLM processing error, falling back to rule engine:', err.message);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 2. BUILT-IN EXPERT RULE ENGINE (Reliable, Zero-Failure Fallback)
  // ────────────────────────────────────────────────────────────

  // CASE 0A: GUARANTEE OR ZERO-RISK DEMAND
  if (params.isGuaranteeQuery) {
    return {
      reply: `### Ethical & Realistic Income Reality:
**There are NO legitimate guarantees of fixed or risk-free income in freelance work or self-employment.**

Here is the honest reality about career monetization:
1. **No Free Lunch:** Anyone promising "guaranteed ₹50,000 without risk" is almost certainly operating an advance-fee scam, a Ponzi scheme, or a fake prepaid task trap.
2. **What Actually Governs Your Earnings:** Your income is directly tied to the commercial value of the skills you offer, the quality of your portfolio, and your consistency in pitching clients.
3. **Realistic Timeline:** Most skilled beginners in video editing, web development, or tutoring take 2 to 4 weeks of consistent work to secure their first ₹2,000–₹10,000, which compounds as they build verified client reviews.

If someone asks you to deposit money in exchange for a "guaranteed job" or "guaranteed return", decline immediately.`,
      suggestedPrompts: [
        "What are realistic monthly earnings for a beginner video editor?",
        "How do I spot fake job guarantees and scams?",
        "What skills can I learn in 30 days to start freelancing?"
      ]
    };
  }

  // CASE 0B: SPECIFIC APPLICATION DEADLINE / CLOSING DATE QUERY
  if (params.isClosingDateQuery) {
    return {
      reply: `### Application Deadlines & Corporate Hiring Windows:
Application deadlines for companies like Google, Microsoft, Amazon, or Indian tech startups **vary widely by individual team, position, and requisition ID**.

**To verify the accurate deadline:**
1. **Always check the official corporate portal directly** (e.g., careers.google.com).
2. Most tech roles in India hire on a rolling basis and close as soon as candidate pools are filled.
3. **We never fabricate unverified application closing dates.** Please rely only on direct listings from the hiring organization.`,
      suggestedPrompts: [
        "How do I prepare for tech startup interviews in Hyderabad?",
        "Search fresher software jobs in Hyderabad",
        "How to build a standout engineering resume"
      ]
    };
  }

  // CASE A: TEENAGER / STUDENT (<18 or 17-21) WITH LOW BUDGET (e.g. ₹2,000)
  if ((params.isUnder18 || params.isStudent) && (params.hasRoleIntent || params.hasBusinessIntent || params.budgetAmount !== null)) {
    const userAge = params.age || 17;
    const budgetDisplay = params.budgetAmount !== null ? `₹${params.budgetAmount.toLocaleString('en-IN')}` : "₹2,000";

    const matched = pool.filter(o => {
      const isLowCost = (o.investment?.min ?? 0) <= (params.budgetAmount || 2000);
      const isEntry = o.experienceLevel === 'entry-level' || o.isBeginnerFriendly || String(o.category).includes('Intern') || String(o.type).includes('Freelance');
      return isLowCost && isEntry;
    }).slice(0, 3);

    return {
      reply: `Here is your direct, actionable guidance as a **${userAge}-year-old** with a **${budgetDisplay} budget**:

---

### 1. Legal & Practical Reality for Age ${userAge}:
- **KYC & Legal Contracts:** At ${userAge}, you cannot legally sign corporate employment contracts or open independent merchant payment gateways (like Stripe or PayPal) without a parent or legal guardian.
- **How to Receive Payments:** You can freely receive payments for freelance or local services using a parent/guardian's UPI, or a minor savings bank account (such as SBI Pehla Kadam or FamPay).
- **Your Edge:** Zero overhead expenses, high digital agility, and direct daily access to school/college student networks.

---

### 2. Which Role is Better for You? (Top 3 Roles Ranked)

1. **Short-Form Video Editor & Reels Repurposer (Top Creative Pick)**
   - **Why it fits:** Massive demand from content creators, coaching institutes, and local brands needing 30–60 second Reels and Shorts. You can start completely free using CapCut, DaVinci Resolve, or VN Editor on your existing phone or laptop.
   - **Earning Potential:** ₹500–₹1,500 per pack of 3–5 edited Reels.
   - **Time to First Rupee:** 3–5 days to build 3 sample edits.

2. **Junior Frontend / No-Code Web Designer (Top Tech Pick)**
   - **Why it fits:** Local businesses constantly need clean single-page websites or mobile-friendly catalogs. Learning HTML/CSS, Tailwind, or Carrd builds high-value engineering skills before you turn 18.
   - **Earning Potential:** ₹2,500–₹6,000 per landing page.
   - **Time to First Rupee:** 1–2 weeks.

3. **Academic & Skills Peer Tutor (Fastest Cashflow Pick)**
   - **Why it fits:** Teach Class 8–10 math/science, junior coding, or spoken English to students in your building or school. Requires zero startup equipment.
   - **Earning Potential:** ₹250–₹500 per hour session.
   - **Time to First Rupee:** 24–48 hours.

**Verdict on Roles:**
• Choose **Video Editing** if you enjoy storytelling, social media, and visual pacing.
• Choose **Web Design / Tech** if you want to build a long-term software career.
• Choose **Peer Tutoring** if you need guaranteed cashflow this weekend without client pitching.

---

### 3. Best Micro-Business Ideas to Launch with Your ${budgetDisplay}:

#### 💡 Idea A: Local Digital Presence Agency for Small Businesses
- **The Opportunity:** Most local bakeries, dental clinics, salons, and tutors in your area have outdated Google Maps listings, broken phone numbers, and no digital menu.
- **How to Allocate Your ${budgetDisplay}:**
  * **₹800:** Register a professional \`.in\` domain + single-page portfolio (on Carrd or Hostinger).
  * **₹400:** Print 50 high-quality introductory flyers/business cards to show shop owners.
  * **₹800:** Keep strictly in cash reserve (never spend 100% of your starting capital).
- **How to Execute:** Visit 5 local shops with a 2-minute audit of their Google Business Profile. Offer to optimize their photos, fix opening hours, and create a WhatsApp ordering link for ₹1,500–₹2,500.

#### 💡 Idea B: Curated Exam Revision Kits & Digital Notion Templates
- **The Opportunity:** Students pay for organized, aesthetic revision notes, formula cheat-sheets, and study trackers during exam prep seasons.
- **Budget Allocation:** ₹0–₹500 for Canva Pro student access / Topmate link; keep ₹1,500 saved.
- **How to Execute:** Create high-yield chapter summaries for Class 10/11 boards or entrance exams. Distribute free 2-page sample PDFs on WhatsApp/Instagram student groups, and sell the complete bundle for ₹99–₹199 via UPI.

#### 💡 Idea C: Student Project Formatting & Presentation Design
- **The Opportunity:** Many busy students struggle to format Word assignments, convert citations, or build attractive PowerPoint slide decks.
- **Budget Allocation:** ₹0–₹300; keep the rest in savings.
- **How to Execute:** Post in campus/batch groups offering neat document layout and presentation cleanup for ₹200–₹500 per assignment.

---

### 4. Step-by-Step 7-Day Launch Plan:
- **Day 1:** Pick ONE service (e.g. Reels Editing or Google Profile Optimization).
- **Day 2–3:** Create 3 free sample portfolio pieces demonstrating your work (proof of skill always beats age).
- **Day 4–5:** Pitch to 10 prospective clients (local shops or creator DMs) offering 1 free sample or trial audit.
- **Day 6–7:** Complete your first paid project, collect a written testimonial, and reinvest 50% into better equipment.

---

### 🛡️ Critical Anti-Scam Rule for Students:
Never pay anyone for "registration fees", "data entry security deposits", or "Telegram task schemes". Real businesses pay you for your work; they never ask you to pay them first.`,
      matchedOpportunities: matched.map(o => o.id),
      opportunities: matched,
      suggestedPrompts: [
        "How do I pitch my first client as a 17-year-old?",
        "Explain the local business website agency step-by-step",
        "How do I set up a free portfolio on Carrd?",
        "What can I do if I only have a smartphone?"
      ]
    };
  }

  // CASE B: GENERAL BUSINESS IDEA / STARTUP QUERY
  if (params.hasBusinessIntent) {
    return {
      reply: `Here are the top high-margin, low-capital micro-business models feasible with **${params.budgetAmount !== null ? `₹${params.budgetAmount.toLocaleString('en-IN')}` : "under ₹2,000"}**:

1. **Digital Micro-Agency (Local Lead Generation & Social Media Catalogs)**
   - **Capital Required:** ₹500–₹1,000 (portfolio domain & Canva).
   - **Model:** Help neighborhood businesses (gyms, dentists, cafes) run basic WhatsApp promotions, design weekly Instagram posts, and optimize their Google Maps SEO.
   - **Revenue:** ₹3,000–₹8,000/month per client retainer.

2. **Digital Product Publishing (Templates & Formula Sheets)**
   - **Capital Required:** ₹0–₹500.
   - **Model:** Design Notion workspaces, budget spreadsheets, or resume templates. Host on Gumroad or Topmate with zero inventory cost.
   - **Revenue:** ₹99–₹499 per digital download.

3. **Hyperlocal Equipment or Skill Rental / Service Brokerage**
   - **Capital Required:** ₹1,000–₹2,000 for deposit or marketing.
   - **Model:** Match local service providers (sound technicians, electricians, caterers) with nearby event clients and keep a 15–20% coordination fee.

**First Step:** Pick one problem you already know how to solve and validate demand with 3 prospective clients before spending a single rupee of your budget.`,
      suggestedPrompts: [
        "How do I find my first 3 local business clients?",
        "What are the best free tools to build a portfolio?",
        "How do I create and sell Notion templates?"
      ]
    };
  }

  // CASE C: NO CUSTOMER INTERACTION / INTROVERT
  if (params.isIntrovert) {
    const soloOpps = pool.filter(o => 
      o.suitablePersonalities?.includes("Working alone") || 
      o.title?.includes("Writing") || 
      o.title?.includes("Testing") || 
      o.title?.includes("Templates") ||
      o.title?.includes("Data")
    ).slice(0, 3);

    return {
      reply: `I completely understand. Not everyone wants a client-facing or sales-heavy role. Here are 3 proven remote opportunities where you work largely independently without continuous customer calls:

1. **${soloOpps[0]?.title || "App & Website User Testing"}**: Asynchronous usability testing where you record your screen and speak thoughts aloud without live clients.
2. **${soloOpps[1]?.title || "Digital Productivity & Notion Templates"}**: Design templates once in Notion or Canva and sell digitally on Gumroad or Etsy.
3. **${soloOpps[2]?.title || "Technical Writing & Developer Docs"}**: Draft in-depth technical guides or tutorials for developer blogs on your own schedule.

**Immediate Next Step:** Which of these three aligns best with your existing tools: writing, usability testing, or visual template design?`,
      matchedOpportunities: soloOpps.map(o => o.id),
      suggestedPrompts: [
        "Tell me more about Notion templates",
        "How do I start with website user testing?",
        "I have a laptop and ₹0 budget"
      ]
    };
  }

  // CASE D: ZERO INVESTMENT (₹0)
  if (params.isZeroBudget || query.includes("₹0") || query.includes("no money")) {
    const freeOpps = pool.filter(o => (o.investment?.min ?? 0) === 0).slice(0, 3);
    const opp1 = freeOpps[0];
    const opp2 = freeOpps[1];
    const opp3 = freeOpps[2];

    return {
      reply: `Starting with ₹0 is completely realistic and financially sound. In fact, we recommend beginners start with zero financial risk.

Here are verified zero-investment opportunities:
1. **${opp1?.title || "Online Freelance Services"}**: ${(opp1?.howItWorks || "Deliver services remotely with zero startup equipment fees.").slice(0, 140)}...
2. **${opp2?.title || "Website & App Usability Testing"}**: ${(opp2?.howItWorks || "Record your screen and feedback for web developers with no upfront cost.").slice(0, 140)}...
3. **${opp3?.title || "Digital Content & Writing"}**: ${(opp3?.howItWorks || "Write tutorials and guides on free platforms with direct payments.").slice(0, 140)}...

**Remember:** Never pay a 'registration fee' or 'training deposit' to start an online job. Real opportunities never charge you upfront.

Do you have a laptop or will you be using your smartphone primarily?`,
      matchedOpportunities: freeOpps.map(o => o.id),
      suggestedPrompts: [
        "I have a laptop and internet",
        "I only have a smartphone",
        "I have 1 hour per day"
      ]
    };
  }

  // CASE E: MOBILE GAMING & ESPORTS
  if (params.isGamingQuery) {
    const isFreeFire = query.includes("freefire") || query.includes("free fire") || query === "ff";
    const gameLabel = isFreeFire ? "Free Fire" : "Mobile Gaming & Esports";

    const gamingOpps = pool.filter(o => 
      (o.title && /free fire|gaming|streamer|esports|game tester/i.test(o.title)) ||
      (o.requiredSkills && o.requiredSkills.some(s => /gaming|esports|free fire/i.test(s)))
    ).slice(0, 3);

    return {
      reply: `Here is the verified truth on earning legitimate income from **${gameLabel}**:

### 🎯 3 Legitimate Ways to Monetize:
1. **Competitive Tournaments & Open Scrims (₹10,000–₹45,000/mo prize pools)**
   - Compete on verified tournament platforms: [Battlefy](https://battlefy.com) and [Game.tv](https://www.game.tv).
   - Enter open community brackets and collegiate leagues. Payouts are protected in escrow and paid directly to your UPI/bank.
2. **Live Streaming & Clutch Shorts (₹12,000–₹50,000/mo)**
   - Stream matches or upload 30-second clutch highlight Shorts on [YouTube Gaming](https://www.youtube.com/gaming) and [Rooter](https://www.rooter.gg).
   - Monetize via YouTube AdSense, viewer Super Chats, and Rooter streamer creator grants.
3. **Tournament Scrim Admin, Room Host & Shoutcasting (₹1,500–₹5,000/day)**
   - Host custom rooms, verify anti-cheat player checks, or provide Hindi/English live commentary for community tournaments on [Hitmarker](https://hitmarker.net).

---
### 🛡️ CRITICAL ANTI-SCAM WARNING (Protect Your Money):
- ❌ **Zero Diamond Hacks:** Anyone claiming to offer "free diamonds", "money generators", or modded APKs is running a phishing scam to steal your account or phone data.
- ❌ **Never Pay Room Entry Fees:** Never pay unverified WhatsApp/Telegram admins for "paid custom room entries" or "guaranteed squad selection".
- ✅ **Legitimate tournaments on Battlefy and Game.tv are ALWAYS 100% free to enter with guaranteed prize pools.**

Which path would you like to explore first: **Competitive Tournaments**, **Live Streaming**, or **Tournament Hosting**?`,
      matchedOpportunities: gamingOpps.map(o => o.id),
      opportunities: gamingOpps,
      suggestedPrompts: [
        `How do I enter free tournaments on Battlefy?`,
        `What gear do I need to stream ${isFreeFire ? "Free Fire" : "mobile games"} on YouTube?`,
        `How can I become a verified tournament room host?`
      ]
    };
  }

  // CASE F: SPECIFIC SKILL MENTIONED
  if (params.matchedSkill) {
    const skillName = params.matchedSkill;
    const pathways = skillsIncomeMap[skillName] || [];
    const topPaths = pathways.slice(0, 3);
    const sFirst = skillName.toLowerCase().split(' ')[0];
    const matchingOpps = pool.filter(o => 
      (o.title && o.title.toLowerCase().includes(sFirst)) ||
      (o.requiredSkills && o.requiredSkills.some(s => s.toLowerCase().includes(sFirst)))
    ).slice(0, 3);

    return {
      reply: `Because you have interest or experience in **${skillName}**, you don't have to limit yourself to standard employment. Here are 3 distinct monetization paths:

${topPaths.map((p, i) => `${i + 1}. **${p.path}** (${p.difficulty})\n   - *Model:* ${p.incomeModel}\n   - *Prerequisites:* ${p.requirements}\n   - *First Step:* ${p.firstStep}`).join('\n\n')}

**Key Rule:** Choose ONE path to focus on for 14 days before attempting others. Which of these appeals to you most?`,
      matchedOpportunities: matchingOpps.map(o => o.id),
      opportunities: matchingOpps,
      suggestedPrompts: [
        `Show me verified platforms for ${skillName}`,
        `How much time does ${topPaths[0]?.path || 'this path'} take?`,
        "What if I'm only a beginner?"
      ]
    };
  }

  // CASE G: START THIS WEEK / QUICK START
  if (params.isQuickStart) {
    const quickOpps = pool.filter(o => o.isBeginnerFriendly && (o.investment?.min ?? 0) === 0).slice(0, 3);

    return {
      reply: `If you need to start within the next few days with minimal setup friction, here are the most accessible options:

1. **${quickOpps[0]?.title || "Website Usability Testing"}**: Rapid onboarding. You can create an account and take initial qualification tests today.
2. **${quickOpps[1]?.title || "Online Tutoring / Coaching"}**: Can be started using your existing smartphone or computer in under 48 hours.
3. **Local Logistics / Delivery** (if 18+ with transport): Partner apps approve verified riders in 24–48 hours for immediate daily payouts.

**Caution:** Beware of any scheme promising ₹5,000+ per day instantly with no effort. Legitimate quick-start options yield modest pocket money at first while you build credibility.`,
      matchedOpportunities: quickOpps.map(o => o.id),
      suggestedPrompts: [
        "Show me how to sign up for user testing",
        "What are the equipment requirements?",
        "Help me build a 7-day action plan"
      ]
    };
  }

  // CASE H: SCAM CHECK
  if (params.isScamQuery) {
    return {
      reply: `### 🛡️ Employment & Side Hustle Scam Alert
Legitimate opportunities NEVER require you to pay upfront fees. Here are red flags to watch out for:

1. **Registration / Training / Kit Fees:** If they ask for ₹500–₹2,000 to "activate your account" or "ship work materials", it is 100% a scam.
2. **Telegram / WhatsApp Video Tasks:** "Like YouTube videos or rate Google Maps hotels for ₹50/task" is an advance-fee pyramid scheme. They pay ₹150 first, then demand ₹5,000 to unlock higher payouts.
3. **Captcha / Data Entry Security Deposits:** Fake software will deliberately fail your entries and confiscate your deposit.

If you have a specific job offer, paste the exact message or URL and I will analyze it for risk indicators.`,
      suggestedPrompts: [
        "Analyze a suspicious WhatsApp job message",
        "How do I verify if a company is real?",
        "Show me verified zero-fee jobs"
      ]
    };
  }

  // CASE I: CONTEXT-AWARE INTELLIGENT FALLBACK
  const userTime = params.timeHours ? `${params.timeHours} hours/day` : (profile.availableTime || "2 hours/day");
  const userBudget = params.budgetAmount !== null ? `₹${params.budgetAmount.toLocaleString('en-IN')}` : (profile.budget || "₹0");
  const userSkills = Array.isArray(profile.skills) && profile.skills.length > 0 ? profile.skills.join(", ") : "general digital skills";

  return {
    reply: `Based on your situation (Time: **${userTime}**, Budget: **${userBudget}**, Skills: **${userSkills}**):

To build a reliable income stream, match what you already possess with clear commercial demand:
- **Skill-Based Freelancing:** If you know graphic design, writing, or web development, offering packaged services on Upwork or Contra gives the highest hourly return.
- **Zero-Capital Testing:** If you have zero capital and prefer simple tasks, **usability testing on UserTesting or uTest** provides instant entry with no client pitching.
- **Digital Asset Publishing:** If you want recurring revenue, creating **digital Notion templates or Canva graphics** on Gumroad has zero marginal fulfillment cost.

Tell me which domain you feel most comfortable starting in: **Tech/Coding**, **Creative/Video Editing**, **Academic Tutoring**, or **Local Services**?`,
    suggestedPrompts: [
      "I want to explore freelance video editing",
      "Explain the Notion templates roadmap",
      "I want to check a suspicious job offer for scams"
    ]
  };
}
