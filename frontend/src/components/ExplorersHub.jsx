// src/components/ExplorersHub.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Code, 
  Laptop, 
  Clock, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { fetchSkillsMap, fetchSkillPathways, fetchOpportunities } from '../services/api.js';

export default function ExplorersHub({ onSelectOpportunity }) {
  const [activeTab, setActiveTab] = useState('skill'); // 'skill', 'resource', 'time', 'budget', 'generator'

  // Skill explorer state
  const [skillsMap, setSkillsMap] = useState({});
  const [selectedSkill, setSelectedSkill] = useState('Python');
  const [customSkillInput, setCustomSkillInput] = useState('');

  const handleSkillSearch = async (e) => {
    if (e) e.preventDefault();
    const query = customSkillInput.trim();
    if (!query) return;
    try {
      const res = await fetchSkillPathways(query);
      if (res && res.pathways) {
        setSkillsMap(prev => ({ ...prev, [res.skill || query]: res.pathways }));
        setSelectedSkill(res.skill || query);
      }
    } catch (err) {
      console.error('Skill search error:', err);
    }
  };

  // Resource explorer state
  const [resLaptop, setResLaptop] = useState(true);
  const [resPhone, setResPhone] = useState(true);
  const [resVehicle, setResVehicle] = useState(false);
  const [resCamera, setResCamera] = useState(false);
  const [resHours, setResHours] = useState('2 hours');
  const [resBudget, setResBudget] = useState('₹0');
  const [resourceMatches, setResourceMatches] = useState([]);

  // Time explorer state
  const [selectedTimePreset, setSelectedTimePreset] = useState('30 minutes');
  const [timeMatches, setTimeMatches] = useState([]);

  // Budget explorer state
  const [selectedBudgetPreset, setSelectedBudgetPreset] = useState('₹0');
  const [budgetMatches, setBudgetMatches] = useState([]);

  // Generator state
  const [genSkill, setGenSkill] = useState('React + Web Development');
  const [genTime, setGenTime] = useState('2 hours/day');
  const [genCapital, setGenCapital] = useState('₹0');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  useEffect(() => {
    fetchSkillsMap()
      .then(data => setSkillsMap(data))
      .catch(err => console.error(err));
  }, []);

  // Update Resource Explorer matches
  useEffect(() => {
    fetchOpportunities()
      .then(res => {
        const opps = res.opportunities || [];
        const matches = opps.filter(o => {
          if (resBudget === '₹0' && o.investment.min > 0) return false;
          if (o.requiredEquipment.includes('Laptop') && !resLaptop) return false;
          if (o.requiredEquipment.includes('Vehicle') && !resVehicle) return false;
          if (o.requiredEquipment.includes('Camera') && !resCamera) return false;
          return true;
        });
        setResourceMatches(matches.slice(0, 6));
      })
      .catch(err => console.error(err));
  }, [resLaptop, resPhone, resVehicle, resCamera, resHours, resBudget]);

  // Update Time Explorer matches
  useEffect(() => {
    fetchOpportunities()
      .then(res => {
        const opps = res.opportunities || [];
        let filtered = opps;
        if (selectedTimePreset === '15 minutes' || selectedTimePreset === '30 minutes') {
          filtered = opps.filter(o => o.timeRequired.minHoursPerDay <= 1.0);
        } else if (selectedTimePreset === '1 hour') {
          filtered = opps.filter(o => o.timeRequired.minHoursPerDay <= 1.5);
        } else if (selectedTimePreset === 'Weekend only') {
          filtered = opps.filter(o => o.timeRequired.weekendsOnlyViable);
        }
        setTimeMatches(filtered.slice(0, 6));
      })
      .catch(err => console.error(err));
  }, [selectedTimePreset]);

  // Update Budget Explorer matches
  useEffect(() => {
    fetchOpportunities()
      .then(res => {
        const opps = res.opportunities || [];
        let filtered = opps;
        if (selectedBudgetPreset === '₹0') {
          filtered = opps.filter(o => o.investment.min === 0);
        } else if (selectedBudgetPreset === 'Under ₹500') {
          filtered = opps.filter(o => o.investment.min <= 500);
        } else if (selectedBudgetPreset === '₹500–₹2,000') {
          filtered = opps.filter(o => o.investment.min <= 2000);
        }
        setBudgetMatches(filtered.slice(0, 6));
      })
      .catch(err => console.error(err));
  }, [selectedBudgetPreset]);

  // Generator trigger
  const handleGenerateIdeas = () => {
    setGeneratedIdeas([
      {
        title: `Packaged ${genSkill} Quick-Fix Service`,
        problem: "Small businesses struggle with slow-loading components, broken forms, and mobile glitches.",
        targetCustomer: "Local business owners, Shopify store operators, indie SaaS founders.",
        startingCost: "₹0 (Free code editors & GitHub)",
        validationStep: "Audit 5 websites of local businesses and list 3 specific bugs in each.",
        firstStep: "Send a polite video recording demonstrating how to fix their mobile navigation menu.",
        businessModel: "Fixed ₹3,500 ($50) per bug ticket or ₹15,000 monthly maintenance retainer.",
        risks: "Scope creep; must set explicit boundary of 2 revisions per ticket."
      },
      {
        title: `Curated ${genSkill} Starter Kits & Cheat-Sheets`,
        problem: "Junior developers and non-technical founders waste 20+ hours piecing together boilerplate code.",
        targetCustomer: "Bootcamp students, startup founders building MVPs, freelancer devs.",
        startingCost: "₹0 (Gumroad free account + Notion)",
        validationStep: "Post 1 helpful component snippet on Twitter/X or Reddit r/webdev to test interest.",
        firstStep: "Bundle 3 battle-tested UI templates into a clean GitHub repository with README.",
        businessModel: "Pay-what-you-want on Gumroad ($9 suggested price).",
        risks: "High market saturation; requires unique design aesthetics or specific API niches."
      },
      {
        title: `1-on-1 Practical ${genSkill} Debugging & Tutoring`,
        problem: "Students and adult learners get stuck in tutorial hell without personalized code review.",
        targetCustomer: "University students, career switchers, bootcamp participants.",
        startingCost: "₹0 (Zoom/Google Meet + Excalidraw)",
        validationStep: "Offer two 30-minute free diagnostic code reviews on Discord developer servers.",
        firstStep: "List your profile on Superprof and Topmate with a clear 5-lesson curriculum.",
        businessModel: "₹800–₹1,500/hr ($20–$40/hr internationally) billed weekly.",
        risks: "Requires high patience and verbal explanation clarity."
      }
    ]);
  };

  const currentPathways = skillsMap[selectedSkill] || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-white">Income Explorers Hub</h1>
        <p className="text-xs text-slate-400">
          Discover opportunities through different entry angles: by skill, available resources, available time, or strictly verified budget thresholds.
        </p>
      </div>

      {/* Explorer Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'skill', label: 'Skill → Income Explorer', icon: Code },
          { id: 'resource', label: 'Resource Explorer', icon: Laptop },
          { id: 'time', label: 'Time Explorer', icon: Clock },
          { id: 'budget', label: 'Budget Explorer (Hard Filter)', icon: Coins },
          { id: 'generator', label: '✨ Create My Opportunity', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SKILL TO INCOME EXPLORER */}
      {activeTab === 'skill' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select or Enter a Skill</h3>
                <p className="text-xs text-slate-400">Explore multiple distinct monetization paths for each capability.</p>
              </div>
            </div>

            {/* Custom Skill Search Form */}
            <form onSubmit={handleSkillSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Search any skill to explore (e.g. React, SEO, Accounting, Translation, Excel)..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Skill</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {['Python', 'Java', 'JavaScript', 'Writing', 'Video Editing', 'Graphic Design', 'Mathematics', 'Teaching'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSkill(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedSkill === s
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Monetization Pathways Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Monetization Pathways for "{selectedSkill}"</span>
              <span className="text-xs text-emerald-400 font-mono font-normal">({currentPathways.length} distinct models)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPathways.map((pathway, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-emerald-400 border border-slate-800">
                        {pathway.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{pathway.startupTime}</span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{pathway.path}</h4>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Income Model:</span>
                        <span className="font-semibold text-emerald-400">{pathway.incomeModel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Requirements:</span>
                        <span>{pathway.requirements}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Target Clients:</span>
                        <span>{pathway.targetClients}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="font-semibold text-emerald-400 block mb-0.5">First Practical Step:</span>
                      <span>{pathway.firstStep}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Verified Platforms:</span>
                      <span className="text-slate-200 font-semibold">{pathway.verifiedPlatforms?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. RESOURCE EXPLORER */}
      {activeTab === 'resource' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">What can I do with what I have?</h3>
            <p className="text-xs text-slate-400">Toggle your currently available hardware and resources.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setResLaptop(!resLaptop)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  resLaptop ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                💻 Laptop / PC {resLaptop ? '✓' : ''}
              </button>
              <button
                onClick={() => setResPhone(!resPhone)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  resPhone ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                📱 Smartphone {resPhone ? '✓' : ''}
              </button>
              <button
                onClick={() => setResVehicle(!resVehicle)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  resVehicle ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                🛵 Vehicle {resVehicle ? '✓' : ''}
              </button>
              <button
                onClick={() => setResCamera(!resCamera)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  resCamera ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                📷 Camera {resCamera ? '✓' : ''}
              </button>
            </div>

            <div className="flex gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Budget:</span>
                <select
                  value={resBudget}
                  onChange={(e) => setResBudget(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                >
                  <option value="₹0">₹0 Budget</option>
                  <option value="Under ₹500">Under ₹500</option>
                  <option value="₹2,000">Up to ₹2,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceMatches.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">{opp.category}</span>
                  <h4 className="text-base font-bold text-white mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{opp.howItWorks.slice(0, 120)}...</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs font-semibold text-emerald-400">{opp.investment.min === 0 ? '₹0 Starting' : `₹${opp.investment.min}`}</span>
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TIME EXPLORER */}
      {activeTab === 'time' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">How much time do you have?</h3>
            <p className="text-xs text-slate-400">Strictly filter opportunities requiring no more than your selected daily window.</p>
            <div className="flex flex-wrap gap-2">
              {['15 minutes', '30 minutes', '1 hour', '2 hours', 'Weekend only'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTimePreset(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    selectedTimePreset === t
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ⏱️ {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeMatches.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">{opp.category}</span>
                  <h4 className="text-base font-bold text-white mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{opp.howItWorks.slice(0, 120)}...</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Time: <strong className="text-white">{opp.timeRequired.label}</strong></span>
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BUDGET EXPLORER (HARD FILTER) */}
      {activeTab === 'budget' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Coins className="w-4 h-4" />
              <span>Hard Financial Filter</span>
            </div>
            <h3 className="text-lg font-bold text-white">Select Your Hard Maximum Investment</h3>
            <p className="text-xs text-slate-400">
              We never show a ₹20,000 business to someone with ₹0. This is a strict cutoff filter.
            </p>

            <div className="flex flex-wrap gap-2">
              {['₹0', 'Under ₹500', '₹500–₹2,000'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBudgetPreset(b)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    selectedBudgetPreset === b
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  💰 {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetMatches.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">{opp.category}</span>
                  <h4 className="text-base font-bold text-white mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{opp.howItWorks.slice(0, 120)}...</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-emerald-400 font-semibold">{opp.investment.description.split('.')[0]}</span>
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CREATE MY OPPORTUNITY (GENERATOR) */}
      {activeTab === 'generator' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">✨ Create My Opportunity Blueprint</h3>
            <p className="text-xs text-slate-400">
              Input what you know, how much time you have, and your capital to generate 3 actionable service or product blueprints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Skills / Tools:</label>
                <input
                  type="text"
                  value={genSkill}
                  onChange={(e) => setGenSkill(e.target.value)}
                  placeholder="e.g. Java + Spring Boot or Cooking"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Time Bandwidth:</label>
                <input
                  type="text"
                  value={genTime}
                  onChange={(e) => setGenTime(e.target.value)}
                  placeholder="e.g. 2 hours/day"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Available Capital:</label>
                <input
                  type="text"
                  value={genCapital}
                  onChange={(e) => setGenCapital(e.target.value)}
                  placeholder="e.g. ₹0"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateIdeas}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Generate 3 Structured Blueprints</span>
            </button>
          </div>

          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Generated Blueprints</h3>
              <div className="space-y-4">
                {generatedIdeas.map((idea, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">Blueprint #{idx + 1}</span>
                      <span className="text-xs bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 text-slate-300 font-semibold">{idea.startingCost}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white">{idea.title}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-slate-500 block font-semibold">Problem Solved:</span>
                        <p className="text-slate-300">{idea.problem}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-slate-500 block font-semibold">Target Customer:</span>
                        <p className="text-slate-300">{idea.targetCustomer}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-emerald-400 block font-semibold">Validation Step (Day 1):</span>
                        <p className="text-slate-300">{idea.validationStep}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-teal-400 block font-semibold">First Action:</span>
                        <p className="text-slate-300">{idea.firstStep}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Business Model:</span>
                        <span className="font-semibold text-white">{idea.businessModel}</span>
                      </div>
                      <div className="text-amber-400/90 text-[11px] sm:max-w-xs">
                        ⚠ <strong>Risk:</strong> {idea.risks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
