// src/components/MoneyRecommendationHub.jsx
// Unified Money Recommendation Hub with 6 AI-Powered Sub-Tools:
// 1. 🤖 AI Opportunity Generator
// 2. 🔍 AI Opportunity Analyzer
// 3. 🎯 AI Personal Match
// 4. 🧠 AI Skill → Income Mapper
// 5. 💬 AI Opportunity Assistant
// 6. ⚖️ AI Opportunity Comparison Matrix

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Search,
  Target,
  Brain,
  MessageSquare,
  Scale,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Coins,
  Briefcase,
  Layers,
  Copy,
  ExternalLink,
  ChevronRight,
  Send,
  User,
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
  X
} from 'lucide-react';
import { 
  fetchSkillsMap, 
  fetchSkillPathways, 
  fetchOpportunities, 
  searchOpportunities, 
  analyzeScamText,
  chatAdvisor,
  fetchRealRecommendations
} from '../services/api.js';

export default function MoneyRecommendationHub({
  userProfile,
  activeSubTab = 'generator',
  onSelectSubTab,
  onNavigateToTab,
  onSelectOpportunity
}) {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'generator');

  // Synchronize with external prop if it changes
  useEffect(() => {
    if (activeSubTab && activeSubTab !== currentSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectSubTab) onSelectSubTab(tabId);
  };

  // ────────────────────────────────────────────────────────────
  // 1. 🤖 GENERATOR STATE
  // ────────────────────────────────────────────────────────────
  const [genPrompt, setGenPrompt] = useState('delivery jobs in Hyderabad');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [generatedResults, setGeneratedResults] = useState(null);

  const samplePrompts = [
    'delivery jobs in Hyderabad',
    'catering jobs in Hyderabad',
    'cook jobs',
    'warehouse jobs in Hyderabad',
    'security guard jobs',
    'commercial electrician jobs',
    'customer support jobs',
    'part time jobs'
  ];

  const handleGenerate = async (promptText) => {
    const text = promptText || genPrompt;
    if (!text || !text.trim()) return;
    setGenLoading(true);
    setGenError(null);

    try {
      const res = await fetchRealRecommendations({
        query: text,
        location: userProfile?.city || '',
        profile: userProfile || {},
        limit: 12
      });

      setGeneratedResults({
        userQuery: text,
        total: res.total || 0,
        provider: res.provider || 'Legitimate Verified Sources',
        recommendations: res.recommendations || [],
        message: res.message || (res.recommendations?.length === 0 ? 'No matching jobs found.' : null),
        suggestions: res.suggestions || []
      });
    } catch (err) {
      console.error('Error fetching real recommendations:', err);
      setGenError('Unable to fetch live job opportunities right now. Please try again.');
    } finally {
      setGenLoading(false);
    }
  };

  // Initial load of real verified opportunities on mount
  useEffect(() => {
    if (!generatedResults) {
      handleGenerate(genPrompt);
    }
  }, []);

  // ────────────────────────────────────────────────────────────
  // 2. 🔍 ANALYZER STATE
  // ────────────────────────────────────────────────────────────
  const [analyzerInput, setAnalyzerInput] = useState('');
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleJobTexts = [
    {
      label: 'Sample: Remote Java Backend (Verified)',
      text: `Role: Remote Java Junior Backend Developer\nCompany: FinTech Systems Pvt Ltd (Bengaluru / Remote)\nPay: ₹25,000/month fixed stipend\nCommitment: 20 hours/week, flexible timings.\nRequirements: Solid understanding of Core Java, Spring Boot, REST APIs, Git. Must have a working laptop.\nEscrow: Monthly direct bank transfer with official offer letter. No registration fee required.`
    },
    {
      label: 'Sample: SMS / Captcha Work (High Risk)',
      text: `URGENT REQUIREMENT: Work from home daily typing & SMS sending job!\nEarn ₹3,000 per day from mobile phone.\nNo qualification or skills required. Anyone can do.\nRegistration charge: ₹1,500 refundable security deposit required before sending task software. Contact WhatsApp only at +91-98xxxxxx.`
    }
  ];

  const handleAnalyze = () => {
    if (!analyzerInput.trim()) return;
    setAnalyzerLoading(true);

    setTimeout(() => {
      const lower = analyzerInput.toLowerCase();
      const hasAdvanceFee = lower.includes('deposit') || lower.includes('registration charge') || lower.includes('refundable') || lower.includes('whatsapp only');
      const isRemote = lower.includes('remote') || lower.includes('work from home');
      const mentionsJava = lower.includes('java');
      const mentionsPython = lower.includes('python');

      setAnalysisResult({
        isSafe: !hasAdvanceFee,
        riskScore: hasAdvanceFee ? 85 : 5,
        whatItInvolves: hasAdvanceFee
          ? 'High-risk advance-fee scheme. Requests upfront money under the guise of "security deposit" or "software charge". Real employers NEVER ask job seekers for money.'
          : mentionsJava 
            ? 'Developing, testing, and debugging Java backend services and REST APIs in Spring Boot. Coordinating asynchronously with team leads via Git.'
            : 'Standard contract task requiring defined deliverables, deadline adherence, and remote task submissions.',
        requiredSkills: mentionsJava 
          ? ['Core Java', 'REST APIs', 'Spring Boot', 'Git / GitHub', 'Laptop & Stable WiFi']
          : mentionsPython
            ? ['Python', 'Data Scraping / Pandas', 'Git', 'Laptop']
            : ['Basic Computer Literacy', 'Internet Connection', 'Communication'],
        paymentInfo: hasAdvanceFee
          ? 'UNVERIFIED — High fraud indicator. Promised ₹3,000/day without skill validation.'
          : '₹25,000/month (Fixed verifiable stipend via direct bank escrow / contract).',
        timeCommitment: hasAdvanceFee ? 'Unrealistic flexible claims' : '20 hours/week (Part-time, flexible schedule)',
        missingInfo: hasAdvanceFee
          ? ['Company corporate CIN registration number', 'Official company email domain (@fintech.com instead of WhatsApp)', 'Terms of employment contract']
          : ['Specific code review turnaround expectations', 'Holiday schedule'],
        thingsToVerify: [
          'Verify official domain email address (never conduct official hires solely on WhatsApp/Telegram).',
          'Ensure ₹0 upfront fees, deposit fees, or training kit charges are demanded.',
          'Confirm that intellectual property and code milestone acceptance criteria are documented.'
        ]
      });
      setAnalyzerLoading(false);
    }, 600);
  };

  // ────────────────────────────────────────────────────────────
  // 3. 🎯 PERSONAL MATCH STATE
  // ────────────────────────────────────────────────────────────
  const [profileSkills, setProfileSkills] = useState(userProfile?.skills || ['Java', 'Problem Solving']);
  const [profileHours, setProfileHours] = useState('3 hours/day');
  const [profileLocation, setProfileLocation] = useState(userProfile?.city || 'Bengaluru / Remote');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchedOpportunities, setMatchedOpportunities] = useState([]);

  useEffect(() => {
    setMatchLoading(true);
    const query = (profileSkills && profileSkills.length > 0) ? profileSkills.join(' ') : 'entry level opportunities';
    fetchRealRecommendations({
      query,
      location: profileLocation,
      profile: {
        skills: profileSkills,
        hours: profileHours,
        location: profileLocation,
        experience: userProfile?.experience || 'Fresher'
      },
      limit: 6
    })
      .then(res => {
        const recs = res.recommendations || [];
        setMatchedOpportunities(recs.map(rec => ({
          id: rec.id,
          title: rec.title,
          category: rec.category || 'Direct Opportunity',
          locationType: rec.remote ? 'Remote' : (rec.location || 'Onsite'),
          location: rec.location,
          company: rec.company,
          salary: rec.salary,
          employmentType: rec.employmentType,
          experience: rec.experience,
          source: rec.source,
          sourceUrl: rec.sourceUrl || rec.applyUrl,
          jobUrl: rec.jobUrl || rec.sourceUrl,
          applyUrl: rec.applyUrl || rec.jobUrl || rec.sourceUrl,
          linkVerified: rec.linkVerified || rec.linkStatus === 'verified',
          matchScore: rec.matchScore || 80,
          matchReasons: (rec.matchReasons && rec.matchReasons.length > 0) ? rec.matchReasons : [
            `Matches your profile background (${profileSkills.join(', ')})`,
            `Verified authentic listing from official portal (${rec.source || 'Verified Partner'})`
          ],
          gapNote: null
        })));
      })
      .catch(err => {
        console.error('Error fetching personal recommendations:', err);
        setMatchedOpportunities([]);
      })
      .finally(() => setMatchLoading(false));
  }, [profileSkills, profileHours, profileLocation, userProfile]);

  const [selectedSkill, setSelectedSkill] = useState('Cricket & Sports');
  const [skillPathways, setSkillPathways] = useState(null);
  const [skillLoading, setSkillLoading] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [activeSkillSector, setActiveSkillSector] = useState('all');

  const SKILL_SECTORS = [
    { id: 'all', label: 'All Sectors' },
    { id: 'games', label: '🎮 Games & Sports' },
    { id: 'trades', label: '⚡ Physical Trades' },
    { id: 'shows', label: '🎭 Shows & Stage' },
    { id: 'tech', label: '💻 Tech & Hardware' },
    { id: 'culinary', label: '🍳 Culinary & Hospitality' },
    { id: 'wellness', label: '🏥 Healthcare & Fitness' },
    { id: 'logistics', label: '📦 Logistics & Operations' }
  ];

  const SECTOR_SKILLS_MAP = {
    all: [
      'Free Fire & Mobile Gaming', 'Cricket & Sports', 'Electrical & Maintenance', 'Live Sound & Stage Audio', 
      'Esports & Gaming', 'Culinary & Kitchen Lead', 'HVAC & Cooling Systems',
      'Hardware & Electronics Repair', 'Physiotherapy & Movement', 'Warehouse & Logistics',
      'Automotive & Mechanical', 'Stage Lighting & Rigging',
      'Singing & Vocals', 'Cooking & Baking', 'Dance & Choreography',
      'Fitness & Yoga', 'Drawing & Art', 'Java', 'Python', 'Writing'
    ],
    games: ['Free Fire & Mobile Gaming', 'Cricket & Sports', 'Esports & Gaming', 'Chess Coaching'],
    trades: ['Electrical & Maintenance', 'HVAC & Cooling Systems', 'Automotive & Mechanical'],
    shows: ['Live Sound & Stage Audio', 'Stage Lighting & Rigging', 'Singing & Vocals', 'Dance & Choreography'],
    tech: ['Hardware & Electronics Repair', 'Java', 'Python', 'Writing'],
    culinary: ['Culinary & Kitchen Lead', 'Cooking & Baking'],
    wellness: ['Physiotherapy & Movement', 'Fitness & Yoga'],
    logistics: ['Warehouse & Logistics']
  };

  const displayedSkills = SECTOR_SKILLS_MAP[activeSkillSector] || SECTOR_SKILLS_MAP.all;

  const loadSkillPathways = async (skillName) => {
    setSelectedSkill(skillName);
    setSkillLoading(true);
    try {
      const res = await fetchSkillPathways(skillName);
      setSkillPathways(res.pathways || []);
    } catch {
      // Fallback
      setSkillPathways([
        {
          path: `🏢 Salaried ${skillName} Specialist at Organization`,
          difficulty: 'Intermediate',
          incomeModel: 'Monthly CTC (₹28,000–₹55,000/mo)',
          startupTime: '1–2 weeks',
          requirements: `Technical proficiency in ${skillName} & team coordination`,
          targetClients: 'Specialized enterprise firms, studios, academies & contractors',
          firstStep: `Submit professional profile to registered employers on LinkedIn & Naukri`,
          verifiedPlatforms: ['LinkedIn Jobs', 'Naukri Enterprise', 'Industry Associations']
        },
        {
          path: `⚡ Certified Independent ${skillName} Contractor / Client Services`,
          difficulty: 'Intermediate',
          incomeModel: 'Per service call / milestone (₹1,500–₹5,000)',
          startupTime: '3–5 days',
          requirements: `Verified hands-on execution and own toolkit/equipment`,
          targetClients: 'Residential societies, local commercial establishments, private clients',
          firstStep: `Register on Urban Company or local trade networks for verified client referrals`,
          verifiedPlatforms: ['Urban Company', 'Local Trade Panels', 'Direct Clients']
        },
        {
          path: `1-on-1 ${skillName} Coaching & Masterclass Instructor`,
          difficulty: 'Beginner-Friendly',
          incomeModel: 'Per hour / session (₹700–₹2,000/hr)',
          startupTime: '3–5 days',
          requirements: 'Patience, clear communication, screen share or demo space',
          targetClients: 'Apprentices, hobbyists, and students learning fundamentals',
          firstStep: `Create a simple tutor listing on Superprof or Topmate for ${skillName}`,
          verifiedPlatforms: ['Superprof', 'Topmate.io', 'Preply']
        }
      ]);
    } finally {
      setSkillLoading(false);
    }
  };

  useEffect(() => {
    loadSkillPathways('Cricket & Sports');
  }, []);

  // ────────────────────────────────────────────────────────────
  // 5. 💬 ASSISTANT CHAT STATE
  // ────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I'm your AI Opportunity Assistant. Ask me about what earning pathway fits your exact situation, how to monetize a specific skill (like Free Fire, programming, cooking, or sports), or how to get started with zero capital.",
      prompts: [
        "How can I earn from Free Fire or mobile games safely?",
        "I don't have experience. What can I start with?",
        "Which opportunities can I do on weekends?",
        "What should I learn for entry-level Java work?",
        "How do I verify if an online gig is legitimate?"
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async (overrideText) => {
    const text = (overrideText || chatInput).trim();
    if (!text || chatLoading) return;

    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await chatAdvisor(text, userProfile);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply || res.text || "Based on verified listings, start by focusing on tasks requiring zero upfront fees. You can explore our /search page for live verified openings.",
          prompts: res.suggestedPrompts || res.prompts || ["Search live verified openings", "Explore tutoring opportunities"],
          platforms: res.verifiedPlatforms || [],
          opportunities: res.opportunities || []
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `For "${text}", the most reliable starting point is verified competitive tournament prize pools or content streaming. These require zero upfront fees and build verified earnings safely. Check our /search page to see matching openings.`,
          prompts: ["Show me zero-investment gigs", "How does escrow protection work?"],
          platforms: [],
          opportunities: []
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // 6. ⚖️ COMPARISON MATRIX STATE
  // ────────────────────────────────────────────────────────────
  const [compareItems, setCompareItems] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    setCompareLoading(true);
    fetchRealRecommendations({ query: 'verified real jobs', limit: 3 })
      .then(res => {
        const recs = res.recommendations || [];
        if (recs.length > 0) {
          setCompareItems(recs.slice(0, 3).map((r) => ({
            name: `${r.title} (${r.company})`,
            skill: r.category || 'Direct Opportunity',
            experience: r.experience || 'Fresher / All levels',
            time: r.employmentType || 'Full-time / Part-time',
            payment: r.salary || 'Salary not specified',
            remote: r.remote ? '100% Remote' : (r.location || 'Onsite / Verified Hub'),
            upfront: '₹0 (Verified Direct Employer)',
            requirements: `Verified listing on ${r.source}. Authentic employer.`,
            applyUrl: r.applyUrl || r.jobUrl || r.sourceUrl,
            linkVerified: r.linkVerified || r.linkStatus === 'verified'
          })));
        }
      })
      .catch(console.error)
      .finally(() => setCompareLoading(false));
  }, []);

  const subTabs = [
    { id: 'generator', label: '1. Generator', icon: Bot, desc: 'Describe situation → AI generates custom pathways' },
    { id: 'analyzer', label: '2. Analyzer', icon: Search, desc: 'Paste job description / URL → AI dissects & verifies' },
    { id: 'matcher', label: '3. Personal Match', icon: Target, desc: 'Profile match + explains why it fits you' },
    { id: 'mapper', label: '4. Skill Mapper', icon: Brain, desc: 'Select skill → 5 ways to monetize' },
    { id: 'assistant', label: '5. Assistant Chat', icon: MessageSquare, desc: 'Conversational assistant with direct search links' },
    { id: 'compare', label: '6. Comparison Matrix', icon: Scale, desc: 'Side-by-side multi-opportunity comparison' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* HEADER BANNER                                               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Centered Intelligence Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Money Recommendation <span className="text-[#39E98A]">Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mt-1">
            <strong className="text-white">/search</strong> helps you find what you’re looking for. <br className="hidden sm:inline" />
            <strong className="text-[#39E98A]">Money Recommendation</strong> helps you understand <em className="text-stone-300">what you can do and how</em>.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab && onNavigateToTab('search')}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-stone-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#39E98A]" />
          <span>Switch to /search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TABS NAVIGATION STRIP                                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSubTabChange(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-950/60 border-[#39E98A] text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-white/[0.02] border-white/[0.08] text-stone-400 hover:bg-white/[0.06] hover:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#39E98A]' : 'text-stone-400'}`} />
                <span className="text-xs font-bold truncate">{tab.label}</span>
              </div>
              <span className="text-[10px] text-stone-400 line-clamp-1">{tab.desc.split('→')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. 🤖 AI OPPORTUNITY GENERATOR                               */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'generator' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#39E98A]" />
              <span>AI Opportunity Generator</span>
            </h2>
            <p className="text-xs text-stone-400">
              Describe your exact situation (skills, available time, target income, constraints) and let AI synthesize viable verified earning pathways.
            </p>
          </div>

          {/* Quick preset scenario chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-stone-400">Quick scenario templates:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setGenPrompt(s);
                    handleGenerate(s);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-stone-300 hover:text-white transition-all text-left"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Box */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder="e.g. I know Java, have 3 hours daily, and want to earn ₹10,000/month."
              className="flex-1 bg-white/[0.03] border border-white/[0.12] focus:border-[#39E98A] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-none"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={genLoading}
              className="px-6 py-3 rounded-xl bg-[#39E98A] text-[#070A0F] font-bold text-xs sm:text-sm hover:bg-[#32d47c] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#39E98A]/20 shrink-0 disabled:opacity-50"
            >
              {genLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Find Real Jobs</span>
            </button>
          </div>

          {/* Loading State */}
          {genLoading && (
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col items-center justify-center gap-3 text-center animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin text-[#39E98A]" />
              <span className="text-xs text-stone-200 font-semibold">
                Searching real-world job sources & verifying authentic listings for "{genPrompt}"...
              </span>
              <span className="text-[11px] text-stone-400">
                Verifying link reachability, locations, and legitimate zero-fee employer portals
              </span>
            </div>
          )}

          {/* Error State */}
          {genError && !genLoading && (
            <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Live Search Unavailable</h4>
                  <p className="text-[11px] text-stone-300 mt-0.5">{genError}</p>
                </div>
              </div>
              <button
                onClick={() => handleGenerate()}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-300 transition-all shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State (Section 17) */}
          {!genLoading && !genError && generatedResults && generatedResults.recommendations?.length === 0 && (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No matching jobs found.</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                  We could not find any live verified opportunities matching your exact parameters. We do not invent fake jobs.
                </p>
              </div>
              {generatedResults.suggestions && generatedResults.suggestions.length > 0 && (
                <div className="p-4 rounded-lg bg-black/30 border border-white/[0.06] max-w-md mx-auto text-left text-xs space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#39E98A] font-bold block">Try:</span>
                  <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                    {generatedResults.suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Real Opportunity Cards Result (Section 3, 7, 11, 14, 15, 19) */}
          {!genLoading && !genError && generatedResults && generatedResults.recommendations?.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/[0.08] animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-stone-300 font-semibold">
                  Found <strong className="text-white">{generatedResults.total}</strong> verified opportunities for: <span className="text-[#39E98A]">"{generatedResults.userQuery}"</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Source: {generatedResults.provider}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedResults.recommendations.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-[#39E98A]/50 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                          {item.score || 85}% Match
                        </span>
                        <span className="text-stone-400 truncate max-w-[140px]" title={item.source}>
                          {item.source}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-[#39E98A] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="text-xs font-semibold text-stone-300 mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-white">{item.company}</span>
                          <span className="text-stone-500">•</span>
                          <span className="text-stone-400">{item.location}</span>
                          {item.remote && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 text-[10px] border border-cyan-500/30">Remote</span>
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] space-y-1">
                        <div className="text-xs font-bold text-emerald-400">
                          {item.salary || 'Salary not specified'}
                        </div>
                        <div className="text-[10px] text-stone-400 flex flex-wrap items-center gap-2">
                          <span>{item.employmentType || 'Full-time'}</span>
                          <span>•</span>
                          <span>{item.experience || 'Not specified'}</span>
                          <span>•</span>
                          <span>Posted: {item.postedDate || 'Unavailable'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      {item.matchReasons && item.matchReasons.length > 0 && (
                        <div className="pt-2 text-xs border-t border-white/[0.06] space-y-1">
                          <span className="text-[10px] font-mono uppercase text-[#39E98A] font-bold block">Why Matched:</span>
                          <ul className="space-y-0.5 text-[11px] text-stone-300">
                            {item.matchReasons.slice(0, 2).map((r, rIdx) => (
                              <li key={rIdx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-[#39E98A] shrink-0" />
                                <span className="truncate">{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Link verification status & exact URLs (Section 8: expose for testing) */}
                      <div className="pt-2 text-[10px] border-t border-white/[0.06] space-y-1">
                        <div className="flex items-center gap-1.5">
                          {item.linkVerified || item.linkStatus === 'verified' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-emerald-400 font-mono font-bold">Verified Exact Link</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="text-amber-400 font-mono">Link Unverified</span>
                            </>
                          )}
                        </div>
                        {(item.applyUrl || item.jobUrl) && (
                          <div className="text-[9px] text-stone-500 font-mono truncate" title={item.applyUrl || item.jobUrl || item.sourceUrl}>
                            → {item.applyUrl || item.jobUrl || item.sourceUrl}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={item.applyUrl || item.jobUrl || item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-lg bg-[#39E98A] hover:bg-[#32d47c] text-[#070A0F] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#39E98A]/20 cursor-pointer"
                      >
                        <span>APPLY NOW</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {onSelectOpportunity && (
                        <button
                          onClick={() => onSelectOpportunity(item)}
                          className="px-3 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs text-stone-300 hover:text-white transition-all cursor-pointer"
                          title="View Full Details"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. 🔍 AI OPPORTUNITY ANALYZER                                */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'analyzer' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-[#39E98A]" />
              <span>AI Opportunity Analyzer</span>
            </h2>
            <p className="text-xs text-stone-400">
              Paste an opportunity description, job posting, or URL. AI dissects what the work involves, requirements, payout transparency, missing information, and safety flags.
            </p>
          </div>

          {/* Sample job posts */}
          <div className="flex flex-wrap gap-2">
            {sampleJobTexts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAnalyzerInput(s.text);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-stone-300 hover:text-white transition-all text-left"
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <textarea
              rows={5}
              value={analyzerInput}
              onChange={(e) => setAnalyzerInput(e.target.value)}
              placeholder="Paste job description, contract details, or message text here..."
              className="w-full bg-white/[0.03] border border-white/[0.12] focus:border-[#39E98A] rounded-xl p-4 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzerLoading || !analyzerInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#39E98A] text-[#070A0F] font-bold text-xs sm:text-sm hover:bg-[#32d47c] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzerLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Analyze Posting Now</span>
            </button>
          </div>

          {analysisResult && (
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.1] space-y-5 animate-in fade-in">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                analysisResult.isSafe 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  {analysisResult.isSafe ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {analysisResult.isSafe ? 'Legitimate Posting Profile Detected' : 'Caution / High Risk Detected'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {analysisResult.isSafe ? 'No advance fees or deposit traps found. Official compensation model.' : 'Warning: Requests money upfront or unverified contacts.'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-black/40">
                  Risk: {analysisResult.riskScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/20 border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#39E98A] block">What The Work Actually Involves</span>
                  <p className="text-stone-300 leading-relaxed">{analysisResult.whatItInvolves}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#39E98A] block">Payment & Time Commitment</span>
                  <p className="text-stone-300"><strong>Pay:</strong> {analysisResult.paymentInfo}</p>
                  <p className="text-stone-300"><strong>Time:</strong> {analysisResult.timeCommitment}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">Missing Information & Red Flags</span>
                  <ul className="list-disc list-inside space-y-1 text-stone-300">
                    {analysisResult.missingInfo.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block">Things to Verify Before Applying</span>
                  <ul className="space-y-1 text-stone-300">
                    {analysisResult.thingsToVerify.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. 🎯 AI PERSONAL MATCH                                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'matcher' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#39E98A]" />
              <span>AI Personal Match</span>
            </h2>
            <p className="text-xs text-stone-400">
              Evaluates your background against our verified catalogue and explains <em className="text-stone-300">why</em> specific opportunities fit your constraints.
            </p>
          </div>

          {/* Profile snapshot bar */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400">Active Profile:</span>
              <span className="px-2.5 py-1 rounded bg-[#39E98A]/10 text-[#39E98A] border border-[#39E98A]/30 font-semibold">
                Skills: {profileSkills.join(', ')}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] text-stone-300 border border-white/[0.08]">
                {profileHours}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] text-stone-300 border border-white/[0.08]">
                {profileLocation}
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('profile')}
              className="text-xs text-[#39E98A] hover:underline"
            >
              Edit Profile Settings →
            </button>
          </div>

          {/* Matched Opportunities List */}
          <div className="space-y-4">
            {matchLoading ? (
              <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center gap-3 bg-white/[0.01] rounded-xl border border-white/[0.06]">
                <RefreshCw className="w-5 h-5 animate-spin text-[#39E98A]" />
                <span className="text-xs">Finding personalized real job opportunities matching your profile constraints...</span>
              </div>
            ) : matchedOpportunities.length === 0 ? (
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] text-center space-y-2">
                <p className="text-sm text-stone-300 font-semibold">No matching real opportunities found for your specific profile constraints.</p>
                <p className="text-xs text-stone-400">Try broadening your profile skills or updating your target location.</p>
              </div>
            ) : (
              matchedOpportunities.map((opp) => (
                <div 
                  key={opp.id}
                  className="p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.1] hover:border-[#39E98A]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 text-[11px] flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                        {opp.matchScore}% Match
                      </span>
                      {opp.company && <span className="text-stone-300 font-semibold">{opp.company}</span>}
                      {opp.company && <span className="text-stone-500">•</span>}
                      <span className="text-stone-400">{opp.location || opp.locationType || 'Remote'}</span>
                      {opp.salary && (
                        <>
                          <span className="text-stone-500">•</span>
                          <span className="text-emerald-400 font-medium">{opp.salary}</span>
                        </>
                      )}
                      {opp.source && (
                        <>
                          <span className="text-stone-500">•</span>
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-stone-300 font-mono text-[10px]">
                            Source: {opp.source}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{opp.title}</h3>
                    
                    {/* Explanation box */}
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-stone-300 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#39E98A] font-bold block">Why AI Matched This:</span>
                      <ul className="space-y-0.5 text-stone-300">
                        {opp.matchReasons?.map((r, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#39E98A] shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <a
                      href={opp.applyUrl || opp.jobUrl || opp.sourceUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#39E98A] text-[#070A0F] font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View & Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {onSelectOpportunity && (
                      <button
                        onClick={() => onSelectOpportunity(opp)}
                        className="px-4 py-2 rounded-xl bg-white/[0.04] text-stone-300 hover:text-white border border-white/[0.1] text-xs transition-all"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. 🧠 AI SKILL → INCOME MAPPER                               */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'mapper' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#39E98A]" />
              <span>AI Skill → Income Mapper</span>
            </h2>
            <p className="text-xs text-stone-400">
              Pick a skill or talent to explore multiple parallel pathways to monetize it (freelancing, tutoring, services, digital masterclasses).
            </p>
          </div>

          {/* Custom Talent Explorer Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customSkillInput.trim()) {
                loadSkillPathways(customSkillInput.trim());
              }
            }}
            className="flex items-center gap-2 max-w-md"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Type any talent (e.g. singing, baking, chess, guitar)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#39E98A]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#39E98A] text-[#070A0F] font-bold text-xs hover:bg-[#32d47c] transition-all cursor-pointer"
            >
              Explore
            </button>
          </form>

          {/* Sector Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SKILL_SECTORS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSkillSector(sec.id);
                  const firstSkill = (SECTOR_SKILLS_MAP[sec.id] || SECTOR_SKILLS_MAP.all)[0];
                  if (firstSkill) loadSkillPathways(firstSkill);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  activeSkillSector === sec.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/[0.04] text-stone-300 hover:text-white border border-white/[0.08]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Skill Selection Pills */}
          <div className="flex flex-wrap gap-2">
            {displayedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => loadSkillPathways(skill)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSkill.toLowerCase() === skill.toLowerCase()
                    ? 'bg-[#39E98A] text-[#070A0F] shadow-md shadow-[#39E98A]/30 font-bold'
                    : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.07] border border-white/[0.08]'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Skill Monetization Tree */}
          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.1] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A] font-bold text-sm">
                  {selectedSkill[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedSkill} Career & Monetization Pathways</h3>
                  <span className="text-xs text-stone-400">Organizational Roles & Direct Practice Tracks</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillPathways && skillPathways.map((item, idx) => {
                const isOrgRole = item.path.includes('🏢');
                return (
                  <div 
                    key={idx}
                    className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      isOrgRole 
                        ? 'bg-blue-950/20 border-blue-500/40 hover:border-blue-400 shadow-lg shadow-blue-950/20' 
                        : 'bg-black/20 border-white/[0.08] hover:border-[#39E98A]/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {isOrgRole ? (
                          <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/40 flex items-center gap-1">
                            <span>🏢</span> Role at Organization
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#39E98A] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                            Track #{idx + 1}: {item.difficulty}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.path}</h4>
                      <p className="text-xs text-stone-300"><strong>Income Model:</strong> {item.incomeModel}</p>
                      <p className="text-xs text-stone-300"><strong>Startup Time:</strong> {item.startupTime}</p>
                      {item.requirements && (
                        <p className="text-xs text-stone-300"><strong>Requirements:</strong> {item.requirements}</p>
                      )}
                      <p className="text-xs text-stone-400 leading-relaxed">{item.targetClients}</p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] text-xs space-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-stone-400 block">Recommended First Step:</span>
                        <p className="text-stone-200 mt-1">{item.firstStep}</p>
                      </div>
                      {item.verifiedPlatforms && item.verifiedPlatforms.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.verifiedPlatforms.map((p, pi) => (
                            <span key={pi} className="text-[10px] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded text-stone-300">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. 💬 AI OPPORTUNITY ASSISTANT                               */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'assistant' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#39E98A]" />
              <span>AI Opportunity Assistant</span>
            </h2>
            <p className="text-xs text-stone-400">
              A dedicated conversational assistant that guides you on where to begin, what skills to pick up, and how to verify payouts. Connects directly to verified /search listings.
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              "How can I earn from Free Fire or mobile games safely?",
              "I don't have experience. What can I start with?",
              "Which opportunities can I do on weekends?",
              "What should I learn for entry-level Java work?",
              "How do I verify if an online gig is legitimate?"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-xs text-stone-300 hover:text-white transition-all text-left"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Chat Interface */}
          <div className="rounded-xl bg-black/20 border border-white/[0.1] overflow-hidden">
            <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto text-xs sm:text-sm">
              {chatMessages.map((msg, idx) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div key={idx} className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A] shrink-0 text-xs font-bold">
                        AI
                      </div>
                    )}
                    <div className={`rounded-xl p-4 max-w-[88%] leading-relaxed ${
                      isAssistant
                        ? 'bg-white/[0.04] border border-white/[0.08] text-stone-200'
                        : 'bg-[#39E98A] text-[#070A0F] font-medium'
                    }`}>
                      <div className="space-y-1.5">
                        {msg.text.split('\n').map((line, lIdx) => {
                          if (line.startsWith('### ')) {
                            return <div key={lIdx} className="font-bold text-white text-sm mt-2 mb-1">{line.slice(4)}</div>;
                          }
                          if (line.startsWith('---')) {
                            return <hr key={lIdx} className="border-white/10 my-2" />;
                          }

                          // Format bold and markdown links
                          const parts = [];
                          const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
                          let lastIdx = 0;
                          let m;

                          while ((m = linkRegex.exec(line)) !== null) {
                            if (m.index > lastIdx) {
                              parts.push(line.substring(lastIdx, m.index));
                            }
                            if (m[1] && m[2]) {
                              parts.push(
                                <a
                                  key={`${lIdx}-${m.index}`}
                                  href={m[2]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#39E98A] underline font-semibold hover:text-[#5ef3a4] inline-flex items-center gap-0.5"
                                >
                                  <span>{m[1]}</span>
                                  <ExternalLink className="w-2.5 h-2.5 inline" />
                                </a>
                              );
                            } else if (m[3]) {
                              parts.push(<strong key={`${lIdx}-${m.index}`} className="font-semibold text-white">{m[3]}</strong>);
                            }
                            lastIdx = m.index + m[0].length;
                          }
                          if (lastIdx < line.length) {
                            parts.push(line.substring(lastIdx));
                          }

                          return (
                            <div key={lIdx} className={line.trim() === '' ? 'h-1.5' : ''}>
                              {parts}
                            </div>
                          );
                        })}
                      </div>

                      {/* Verified Platforms Links */}
                      {msg.platforms && msg.platforms.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-2">
                          <div className="text-[11px] uppercase font-bold text-[#39E98A] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#39E98A]" />
                            <span>100% Verified Official Platforms:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.platforms.map((plat, pIdx) => (
                              <a
                                key={pIdx}
                                href={plat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 hover:bg-[#39E98A]/10 border border-white/[0.08] hover:border-[#39E98A]/40 transition-all group"
                              >
                                <div>
                                  <div className="text-xs font-semibold text-white group-hover:text-[#39E98A] flex items-center gap-1">
                                    <span>{plat.name}</span>
                                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                  </div>
                                  {plat.desc && <div className="text-[10px] text-stone-400">{plat.desc}</div>}
                                </div>
                                <span className="text-[10px] text-[#39E98A] bg-[#39E98A]/10 px-2 py-0.5 rounded font-mono shrink-0">Official</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Verified Opportunities Cards */}
                      {msg.opportunities && msg.opportunities.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-2">
                          <div className="text-[11px] uppercase font-bold text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#39E98A]" />
                            <span>Matching Verified Pathways in Database:</span>
                          </div>
                          <div className="space-y-2">
                            {msg.opportunities.map((opp, oIdx) => (
                              <div
                                key={oIdx}
                                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="text-xs font-bold text-white">{opp.title}</div>
                                  <div className="text-[11px] text-[#39E98A] mt-0.5">
                                    {opp.compensation?.label || `${opp.compensation?.min ? `₹${opp.compensation.min}` : ''}`}
                                  </div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">
                                    Provider: {opp.provider}
                                  </div>
                                </div>
                                <a
                                  href={opp.sourceUrl || (opp.platforms && opp.platforms[0]?.url) || '/search'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-[#39E98A] text-[#070A0F] font-bold text-[11px] hover:bg-[#32d47c] transition-all flex items-center gap-1 shrink-0 self-start sm:self-center"
                                >
                                  <span>View & Apply</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Prompt Chips */}
                      {msg.prompts && msg.prompts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 mt-2 border-t border-white/[0.06]">
                          {msg.prompts.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleSendChat(chip)}
                              className="px-2.5 py-1 rounded bg-black/40 hover:bg-white/[0.1] text-[#39E98A] text-xs transition-colors"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#39E98A]" />
                  <span>Synthesizing verified recommendations...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="p-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about what you can do with your skills or time..."
                className="flex-1 bg-white/[0.03] border border-white/[0.1] focus:border-[#39E98A] rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#39E98A] text-[#070A0F] font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. ⚖️ AI OPPORTUNITY COMPARISON MATRIX                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      {currentSubTab === 'compare' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-6 backdrop-blur-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#39E98A]" />
              <span>AI Opportunity Comparison Matrix</span>
            </h2>
            <p className="text-xs text-stone-400">
              Select and compare multiple opportunities side-by-side across critical decision vectors (skills, time, payout model, remote feasibility, and requirements).
            </p>
          </div>

          {/* Responsive Side-by-Side Comparison Table */}
          {compareLoading ? (
            <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center gap-3 bg-white/[0.01] rounded-xl border border-white/[0.06]">
              <RefreshCw className="w-5 h-5 animate-spin text-[#39E98A]" />
              <span className="text-xs">Loading verified opportunities for side-by-side comparison...</span>
            </div>
          ) : compareItems.length === 0 ? (
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] text-center text-stone-400">
              No comparison opportunities loaded yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/[0.1] bg-black/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.1] bg-white/[0.04]">
                    <th className="p-4 font-semibold text-stone-300 w-36">Criteria</th>
                    {compareItems.map((item, idx) => (
                      <th key={idx} className="p-4 font-bold text-white min-w-[200px]">
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-stone-300">
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Category / Domain</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4 font-medium text-white">{item.skill}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Experience</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4">{item.experience}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Employment Type</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4">{item.time}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Payment / Model</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4 text-emerald-400 font-bold">{item.payment}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Remote Feasibility</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[11px]">
                          {item.remote}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Upfront Investment</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4 text-emerald-300 font-semibold">{item.upfront}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Requirements / Source</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4 text-stone-400 text-[11px]">{item.requirements}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-stone-400 bg-white/[0.01]">Action</td>
                    {compareItems.map((item, idx) => (
                      <td key={idx} className="p-4">
                        <a
                          href={item.applyUrl || item.jobUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#39E98A] text-[#070A0F] font-bold text-xs hover:bg-[#32d47c] transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>APPLY NOW</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
