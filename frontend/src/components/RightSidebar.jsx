// src/components/RightSidebar.jsx
import React from 'react';
import { 
  Flame, 
  Search, 
  Lightbulb, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function RightSidebar({
  userProfile,
  onOpenQuestionnaire,
  onSearchQuery,
  onExploreCategory,
  onNavigateToTab,
  searchQuery = ''
}) {
  // Dynamically calculate profile completion percentage based on filled fields
  const calculateCompletion = () => {
    if (!userProfile || !userProfile.isProfileCompleted) return 0;
    const checks = [
      Boolean(userProfile.availableTime),
      Boolean(userProfile.budget),
      Boolean(userProfile.skills && userProfile.skills.length > 0),
      Boolean(userProfile.equipment && userProfile.equipment.length > 0),
      Boolean(userProfile.location && userProfile.location.length > 0),
      Boolean(userProfile.incomeGoal),
      Boolean(userProfile.country)
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100) || 70;
  };

  const percentage = calculateCompletion();
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const popularSearches = [
    'Work from home',
    'Freelancing',
    '₹0 opportunities',
    'Online tutoring',
    'Video editing'
  ];

  return (
    <aside className="w-72 xl:w-80 shrink-0 hidden 2xl:flex flex-col gap-5 py-6 px-4 bg-[#0b1320] border-l border-slate-800/80 min-h-[calc(100vh-61px)] select-none">
      {/* 1. Profile Complete Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-4 w-full text-left">
          {/* Circular Progress Gauge */}
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress arc */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white font-heading">
              {percentage}%
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Profile {percentage > 0 ? `${percentage}%` : 'Not Set'}</h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              {percentage > 0 ? 'Better matches, higher opportunities.' : 'Answer questions to unlock matches.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuestionnaire}
          className="w-full py-2 px-3 rounded-xl border border-emerald-500/60 hover:bg-emerald-950/60 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all group"
        >
          <span>{percentage > 0 ? 'Edit Profile' : 'Build Profile'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. Popular Searches Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white">Popular Searches</h4>
        </div>

        <div className="space-y-1.5">
          {popularSearches.map((term, index) => {
            const isActive = searchQuery && searchQuery.toLowerCase() === term.toLowerCase();
            return (
              <button
                key={index}
                onClick={() => onSearchQuery(term)}
                className={`w-full px-3 py-2 rounded-xl border text-xs flex items-center gap-2.5 transition-all text-left cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Search className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                <span className="truncate">{term}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSearchQuery('')}
          className="text-xs text-slate-400 hover:text-emerald-400 font-medium inline-flex items-center gap-1 pt-1 transition-colors"
        >
          <span>View all searches</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3. Quick Tips Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white">Quick Tips</h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Start with what you have. Your skills, time and consistency matter more than money.
        </p>

        <button
          onClick={() => onNavigateToTab('discover')}
          className="w-full py-2 px-3 rounded-xl border border-emerald-500/60 hover:bg-emerald-950/60 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all group"
        >
          <span>Explore Opportunities</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
