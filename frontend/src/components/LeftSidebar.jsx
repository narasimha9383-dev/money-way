// src/components/LeftSidebar.jsx
// Exact requested navigation structure:
// Home
// Search
// Money Recommendation
//     ├── Generator
//     ├── Analyzer
//     ├── Personal Match
//     ├── Skill Mapper
//     ├── Assistant Chat
//     └── Comparison Matrix
// Advisor
// Profile

import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Sparkles, 
  User,
  Bot,
  SearchCode,
  Target,
  Brain,
  MessageSquare,
  Scale,
  ChevronDown,
  ChevronRight,
  Bookmark,
  CheckSquare
} from 'lucide-react';

export default function LeftSidebar({
  currentTab,
  onNavigateToTab,
  currentSubTab = 'generator',
  savedCount = 0,
  compareCount = 0
}) {
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(true);

  const subItems = [
    { id: 'generator', label: 'Generator', icon: Bot, symbol: '├──' },
    { id: 'analyzer', label: 'Analyzer', icon: SearchCode, symbol: '├──' },
    { id: 'matcher', label: 'Personal Match', icon: Target, symbol: '├──' },
    { id: 'mapper', label: 'Skill Mapper', icon: Brain, symbol: '├──' },
    { id: 'assistant', label: 'Assistant Chat', icon: MessageSquare, symbol: '├──' },
    { id: 'compare', label: 'Comparison Matrix', icon: Scale, symbol: '└──' }
  ];

  const isRecActive = currentTab === 'recommendations' || currentTab === 'money-recommendation';

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between py-6 px-4 bg-[#070c14]/90 border-r border-slate-800/80 min-h-[calc(100vh-61px)] select-none backdrop-blur-md">
      {/* Navigation Menu */}
      <div className="space-y-1">
        
        {/* 1. Home */}
        <button
          onClick={() => onNavigateToTab('home')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            currentTab === 'home'
              ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Home className={`w-4 h-4 ${currentTab === 'home' ? 'text-[#39E98A]' : 'text-slate-400 group-hover:text-white'}`} />
          <span>Home</span>
        </button>

        {/* 2. Search */}
        <button
          onClick={() => onNavigateToTab('search')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            currentTab === 'search'
              ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Search className={`w-4 h-4 ${currentTab === 'search' ? 'text-[#39E98A]' : 'text-slate-400 group-hover:text-white'}`} />
          <span>Search</span>
        </button>

        {/* 3. Money Recommendation (Expandable Tree with 6 Sub-items) */}
        <div className="pt-1">
          <button
            onClick={() => {
              onNavigateToTab('recommendations', 'generator');
              setRecommendationsExpanded(true);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isRecActive
                ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className={`w-4 h-4 ${isRecActive ? 'text-[#39E98A]' : 'text-emerald-400'}`} />
              <span className="font-semibold">Money Recommendation</span>
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setRecommendationsExpanded(!recommendationsExpanded);
              }}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
            >
              {recommendationsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              )}
            </span>
          </button>

          {/* Sub-tree */}
          {recommendationsExpanded && (
            <div className="pl-3 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-emerald-500/25 ml-5 font-mono">
              {subItems.map(sub => {
                const isSubActive = isRecActive && currentSubTab === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onNavigateToTab('recommendations', sub.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all text-left group cursor-pointer ${
                      isSubActive
                        ? 'bg-[#39E98A]/20 text-[#39E98A] font-bold border border-[#39E98A]/40'
                        : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-stone-500 font-mono text-[11px] shrink-0">{sub.symbol}</span>
                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-[#39E98A]' : 'text-stone-400 group-hover:text-white'}`} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Advisor */}
        <button
          onClick={() => onNavigateToTab('advisor')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            currentTab === 'advisor'
              ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${currentTab === 'advisor' ? 'text-[#39E98A]' : 'text-slate-400 group-hover:text-white'}`} />
          <span>Advisor</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onNavigateToTab('profile')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            currentTab === 'profile'
              ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <User className={`w-4 h-4 ${currentTab === 'profile' ? 'text-[#39E98A]' : 'text-slate-400 group-hover:text-white'}`} />
          <span>Profile</span>
        </button>
      </div>

      {/* Quick shortcuts at bottom */}
      <div className="pt-4 border-t border-white/[0.08] space-y-1 text-xs">
        <button
          onClick={() => onNavigateToTab('saved')}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.04] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks</span>
          </div>
          {savedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[#39E98A] text-[10px] font-bold">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigateToTab('plans')}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.04] cursor-pointer"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Action Progress</span>
        </button>
      </div>
    </aside>
  );
}
