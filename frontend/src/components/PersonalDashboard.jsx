// src/components/PersonalDashboard.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bookmark, 
  CheckSquare, 
  X, 
  ArrowRight, 
  Coins, 
  Clock, 
  MapPin, 
  Folder, 
  Sparkles,
  TrendingUp,
  User,
  Trash2,
  BookOpen,
  Search,
  Bell,
  Compass,
  ShieldCheck,
  Smartphone,
  Laptop,
  CheckCircle2,
  LogIn,
  Building2
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';

export default function PersonalDashboard({
  savedIds = [],
  savedOpportunities: directSavedOpps = null,
  rejectedIds = [],
  allOpportunities = [],
  userProfile = {},
  onSelectOpportunity,
  onRemoveSaved,
  onOpenQuestionnaire,
  onNavigateToTab
}) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [activeFolder, setActiveFolder] = useState('all');

  // Load action plans from localStorage safely
  let actionPlans = {};
  try {
    const saved = localStorage.getItem('incomepath_action_plans');
    if (saved) actionPlans = JSON.parse(saved);
  } catch (err) {
    console.error('Error loading action plans:', err);
  }

  const effectiveSavedOpps = directSavedOpps || allOpportunities.filter(o => savedIds.includes(o.id));
  const activePlanCount = Object.keys(actionPlans).length;

  // DYNAMIC categories derived from active saved opportunities (Zero hardcoded list)
  const dynamicCategories = Array.from(
    new Set(effectiveSavedOpps.map(o => o.category || o.sector || 'General').filter(Boolean))
  );
  const folders = ['all', ...dynamicCategories];

  const filteredSaved = effectiveSavedOpps.filter(o => {
    if (activeFolder === 'all') return true;
    const cat = o.category || o.sector || 'General';
    return cat === activeFolder;
  });

  const effectiveName = user?.name || userProfile?.name || 'Explorer';
  const effectiveEmail = user?.email || userProfile?.email || '';
  const effectiveAvatar = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(effectiveName)}`;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 pb-24 animate-in fade-in duration-300">
      
      {/* 1. Header Bar with Auth status & Preferences button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[#39E98A]">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Personal Work & Discovery Dashboard
              </h1>
              {isAuthenticated ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Cloud Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Local Device Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live overview of your bookmarked roles, active 7-day action roadmaps, capabilities, and personal constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <button
            onClick={onOpenQuestionnaire}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all hover:scale-102 cursor-pointer"
          >
            Edit Profile Preferences
          </button>
        </div>
      </div>

      {/* 2. Guest Mode or Logged In Status Banner */}
      {!isAuthenticated ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs sm:text-sm font-bold text-white">
                Browsing in Guest Mode · Local Workspace
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your saved items and action plans are currently stored in this browser. Sign in or create a free account to sync seamlessly across your Phone, Tablet, Laptop, and Desktop.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-md shadow-emerald-950/50"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={effectiveAvatar} 
              alt={effectiveName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{effectiveName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Explorer'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{effectiveEmail}</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Sync Status</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All Devices Active
            </span>
          </div>
        </div>
      )}

      {/* 3. Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1 hover:border-slate-750 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Saved Roles</span>
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{effectiveSavedOpps.length}</div>
          <span className="text-[10px] text-slate-500 block">Bookmarked for execution</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1 hover:border-slate-750 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Active Plans</span>
            <CheckSquare className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{activePlanCount}</div>
          <span className="text-[10px] text-slate-500 block">7-day execution roadmaps</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1 hover:border-slate-750 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Skills Mapped</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
            {userProfile?.skills?.length || 0}
          </div>
          <span className="text-[10px] text-slate-500 block">Capabilities on record</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1 hover:border-slate-750 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Hidden</span>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{rejectedIds.length}</div>
          <span className="text-[10px] text-slate-500 block">Excluded from discovery</span>
        </div>
      </div>

      {/* 4. Quick Discovery Bridges Launchpad */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Work Discovery Bridges</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('search')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer hover:bg-slate-850"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">AI Natural Search</h3>
            <p className="text-xs text-slate-400 mt-1">Search any role, shift, or skill via AI semantic bridge.</p>
          </button>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('nearby')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 text-left transition-all group cursor-pointer hover:bg-slate-850"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">Jobs Near Me</h3>
            <p className="text-xs text-slate-400 mt-1">Explore verified local & regional openings with GPS radius.</p>
          </button>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('alerts')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer hover:bg-slate-850"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Bell className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Job Alerts System</h3>
            <p className="text-xs text-slate-400 mt-1">Native push, audio chime & mobile vibration notifications.</p>
          </button>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('detailsOfOrganization')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer hover:bg-slate-850"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Organization Details</h3>
            <p className="text-xs text-slate-400 mt-1">Inspect genuine companies, authentic career portals & open roles.</p>
          </button>
        </div>
      </div>

      {/* 5. User Profile Constraints Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Active Profile Constraints</h2>
          </div>
          <span className="text-xs text-slate-400">
            Country: <strong className="text-white">{userProfile?.country || 'India'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Available Time</span>
            <span className="font-semibold text-white mt-0.5 block">{userProfile?.availableTime || 'Flexible'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Starting Budget</span>
            <span className="font-semibold text-emerald-400 mt-0.5 block">{userProfile?.budget || '₹0'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Experience Level</span>
            <span className="font-semibold text-white mt-0.5 block">{userProfile?.experienceLevel || 'Beginner'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Income Goal</span>
            <span className="font-semibold text-white mt-0.5 block">{userProfile?.incomeGoal || 'Side income'}</span>
          </div>
        </div>

        <div className="text-xs">
          <span className="text-slate-500 mr-2 font-medium">Mapped Skills:</span>
          <span className="text-slate-300 font-medium">
            {userProfile?.skills && userProfile.skills.length > 0
              ? userProfile.skills.join(', ')
              : 'No skills recorded yet. Complete the profile questionnaire to match high-precision opportunities.'}
          </span>
        </div>
      </div>

      {/* 6. Active In-Flight 7-Day Plans */}
      {activePlanCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <CheckSquare className="w-5 h-5 text-teal-400" />
              <span>Active 7-Day Action Roadmaps ({activePlanCount})</span>
            </h2>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('plans')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View All Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(actionPlans).map(([oppId, planData]) => {
              const opp = allOpportunities.find(o => o.id === oppId);
              if (!opp) return null;

              const totalTasks = opp.sevenDayPlan?.reduce((acc, d) => acc + (d.tasks?.length || 0), 0) || 1;
              const completedCount = Object.values(planData.tasks || {}).filter(Boolean).length;
              const percent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

              return (
                <div key={oppId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                        {opp.category || opp.sector || 'Opportunity'}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">{opp.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700 shrink-0">
                      {planData.stage || 'In Progress'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Checklist Progress</span>
                      <span className="font-mono text-emerald-400 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectOpportunity) onSelectOpportunity(opp);
                      if (onNavigateToTab) onNavigateToTab('plans');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Plan Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Saved Opportunities with Dynamic Categorization */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Bookmark className="w-5 h-5 text-emerald-400" />
              <span>Saved Opportunities ({effectiveSavedOpps.length})</span>
            </h2>
            <p className="text-xs text-slate-400">All bookmarks categorized dynamically without static hardcoding.</p>
          </div>

          {/* Dynamic category tabs */}
          {dynamicCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {folders.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFolder(f)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFolder === f
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f === 'all' ? `All (${effectiveSavedOpps.length})` : f}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredSaved.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-slate-900/60 border border-slate-800/80 rounded-3xl space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No saved opportunities in this view</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the Bookmark icon on any job card across Search, Nearby, or Discover to pin it directly to your dashboard.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('discover')}
              className="px-4 py-2 rounded-xl bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 font-bold text-xs cursor-pointer transition-transform hover:scale-105"
            >
              Explore Verified Opportunities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSaved.map(opp => (
              <div 
                key={opp.id} 
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-750 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {opp.category || opp.sector || 'Opportunity'}
                    </span>
                    <button
                      onClick={() => onRemoveSaved && onRemoveSaved(opp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {opp.howItWorks || opp.description || opp.summary || 'Verified opportunity with realistic execution steps.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="font-semibold text-emerald-400">
                    {opp.investment?.min === 0 ? '₹0 Initial' : (opp.investment?.min ? `₹${opp.investment.min}` : 'Free')}
                  </span>
                  <button
                    onClick={() => onSelectOpportunity && onSelectOpportunity(opp)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
