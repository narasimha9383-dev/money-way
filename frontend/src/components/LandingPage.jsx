// src/components/LandingPage.jsx
import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Globe, 
  Code, 
  MapPin, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Laptop, 
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

export const categoryCards = [
  {
    id: 'zero',
    title: '₹0 Starting Options',
    subtitle: 'Begin with zero capital risk',
    description: 'Legitimate platforms utilizing your existing phone, computer, and natural abilities without upfront fees.',
    icon: Coins,
    color: 'emerald',
    badge: 'Zero Upfront Cost',
    filterCategory: 'Zero-Investment'
  },
  {
    id: 'remote',
    title: 'Online & Remote',
    subtitle: 'Work comfortably from home',
    description: 'Asynchronous tasks, user testing, remote assistance, and client deliverables from your bedroom or desk.',
    icon: Globe,
    color: 'teal',
    badge: '100% Home Friendly',
    filterCategory: 'Zero-Investment'
  },
  {
    id: 'skills',
    title: 'Skill-Based Income',
    subtitle: 'Monetize what you already know',
    description: 'Convert coding, writing, video editing, translation, or graphic design into freelance project revenue.',
    icon: Code,
    color: 'blue',
    badge: 'High Value Hourly',
    filterCategory: 'Skill-Based'
  },
  {
    id: 'local',
    title: 'Local & Neighborhood',
    subtitle: 'Direct in-person opportunities',
    description: 'Neighborhood tutoring, electronics repair, event photography, pet care, and flexible delivery shifts.',
    icon: MapPin,
    color: 'amber',
    badge: 'Fast Cash Payouts',
    filterCategory: 'Local / Offline'
  },
  {
    id: 'digital',
    title: 'Digital Products',
    subtitle: 'Build once, sell repeatedly',
    description: 'Create Notion dashboards, spreadsheet calculators, Canva design kits, and micro-templates on Gumroad.',
    icon: Package,
    color: 'purple',
    badge: 'Scalable Assets',
    filterCategory: 'Digital Products'
  },
  {
    id: 'longterm',
    title: 'Long-Term Projects',
    subtitle: 'Compound sustainable leverage',
    description: 'Micro-SaaS tools, niche affiliate review portals, and educational channels that build real equity.',
    icon: TrendingUp,
    color: 'indigo',
    badge: 'Recurring MRR',
    filterCategory: 'Long-Term'
  }
];

export default function LandingPage({ 
  onStartQuestionnaire, 
  onExploreCategory, 
  onSelectOpportunity,
  dailyOpportunity,
  onSaveOpportunity,
  isSaved
}) {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-indigo-500/5 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Structured Verification Engine • Zero False Promises</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Income Opportunities That <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Fit You</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us what you have, what you can do, and how much time you have. Discover realistic, verified ways to earn based on your actual circumstances.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartQuestionnaire}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <span>Find My Opportunities</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onExploreCategory('all')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 font-semibold text-base border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Explore All Ideas</span>
            </button>
          </div>

          {/* Essential Disclaimer */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 text-xs text-left max-w-xl mx-auto">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Transparent Reality:</strong> Income is never guaranteed. Results vary based on skills, effort, market demand, competition, and location.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity of the Day (Daily Discovery) */}
      {dailyOpportunity && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Daily Discovery Spotlight</span>
                  <h3 className="text-xl font-bold text-white">{dailyOpportunity.title}</h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {dailyOpportunity.verification?.status || 'Verified'} ({dailyOpportunity.verification?.lastVerifiedAt || 'Sept 2026'})
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-5 leading-relaxed">
              {dailyOpportunity.howItWorks}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Startup Cost:</span>
                <span className="font-semibold text-emerald-400">{dailyOpportunity.investment?.description?.split('.')[0] || '₹0 to start'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Time Commitment:</span>
                <span className="font-semibold text-white">{dailyOpportunity.timeRequired?.label || '1–3 hours/day'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-semibold text-white">{dailyOpportunity.locationType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Model:</span>
                <span className="font-semibold text-white">{dailyOpportunity.incomeModel}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onSelectOpportunity(dailyOpportunity)}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <span>View Complete Guide &amp; Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSaveOpportunity(dailyOpportunity.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  isSaved(dailyOpportunity.id)
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved(dailyOpportunity.id) ? 'Saved' : 'Save Idea'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6 Exploratory Category Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Structured Opportunity Archetypes</h2>
          <p className="text-slate-400 text-sm mt-2">Filter and explore realistic pathways grouped by resource intensity and delivery model.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onExploreCategory(card.filterCategory)}
                className="group p-6 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 hover-glow cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2 font-medium">{card.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore matching paths</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Principle: ACCURATE → PERSONALIZED → ACTIONABLE */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-950 text-emerald-400 text-xs font-mono font-semibold">
            PLATFORM PHILOSOPHY
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ACCURATE &rarr; PERSONALIZED &rarr; ACTIONABLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Accurate Verification</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every opportunity originates from verified platforms (Upwork, Preply, uTest, Gumroad, Zomato). No fake apps or invented survey scams.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Hard Constraint Matching</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you select ₹0 budget, we hard-block paid options. If you have 30 minutes, we only show rapid micro-deliverables.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. 7-Day Starting Action Plan</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We don't just give an idea and abandon you. Every opportunity includes a day-by-day roadmap from setup to sending your first proposal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
