// src/components/LeftSidebar.jsx
// Section 23: Simple, intuitive primary navigation:
// Home, Discover, Search, Nearby, Saved, Alerts, Profile + Tools
import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  Search, 
  MapPin, 
  Bookmark, 
  Bell, 
  User, 
  Sparkles, 
  Bot, 
  SearchCode, 
  Target, 
  Brain, 
  MessageSquare, 
  Scale, 
  ChevronDown, 
  ChevronRight,
  ShieldAlert,
  LayoutDashboard,
  Building2
} from 'lucide-react';

export default function LeftSidebar({
  currentTab,
  onNavigateToTab,
  currentSubTab = 'generator',
  savedCount = 0,
  unreadAlertsCount = 0
}) {
  const [toolsExpanded, setToolsExpanded] = useState(false);

  const primaryNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detailsOfOrganization', label: 'Organization Details', icon: Building2 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'nearby', label: 'Jobs Near Me', icon: MapPin, highlight: true },
    { id: 'saved', label: 'Saved Jobs', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
    { id: 'alerts', label: 'Job Alerts', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : null }
  ];

  const subItems = [
    { id: 'generator', label: 'Pathway Generator', icon: Bot },
    { id: 'analyzer', label: 'Income Analyzer', icon: SearchCode },
    { id: 'matcher', label: 'Personal Matcher', icon: Target },
    { id: 'mapper', label: 'Skill Pathways', icon: Brain },
    { id: 'assistant', label: 'Advisor Chat', icon: MessageSquare },
    { id: 'compare', label: 'Opportunity Compare', icon: Scale }
  ];

  const isRecActive = currentTab === 'recommendations' || currentTab === 'money-recommendation';

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between py-6 px-4 bg-[#070c14]/90 border-r border-slate-800/80 min-h-[calc(100vh-61px)] select-none backdrop-blur-md">
      {/* Primary Navigation Menu */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          Work Discovery
        </div>

        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (item.id === 'dashboard' && currentTab === 'profile') ||
            (item.id === 'detailsOfOrganization' && currentTab === 'discover') ||
            (item.id === 'discover' && currentTab === 'detailsOfOrganization');
          return (
            <button
              key={item.id}
              onClick={() => onNavigateToTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#39E98A]/15 text-[#39E98A] font-semibold border border-[#39E98A]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#39E98A]' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Secondary Exploration Tools */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center justify-between">
            <span>Career Tools</span>
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              {toolsExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <button
            onClick={() => {
              onNavigateToTab('recommendations', 'generator');
              setToolsExpanded(true);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
              isRecActive
                ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Income Intelligence</span>
            </div>
            {toolsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {toolsExpanded && (
            <div className="pl-6 pt-1 space-y-0.5 border-l border-slate-800 ml-5 my-1">
              {subItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isRecActive && currentSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onNavigateToTab('recommendations', sub.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isSubActive
                        ? 'text-emerald-400 font-semibold bg-emerald-950/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <SubIcon className="w-3 h-3 text-slate-500" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => onNavigateToTab('scam-center')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all mt-1 cursor-pointer ${
              currentTab === 'scam-center'
                ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Scam Shield</span>
          </button>
        </div>
      </div>

      {/* Trust Badge at Bottom */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real Job Verification Active</span>
        </div>
        <p className="text-[10px] text-slate-500">
          Zero fabricated listings. Verified employer destinations only.
        </p>
      </div>
    </aside>
  );
}
