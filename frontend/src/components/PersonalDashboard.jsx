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
  BookOpen
} from 'lucide-react';

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
  const [activeFolder, setActiveFolder] = useState('all');

  // Load action plans from localStorage
  let actionPlans = {};
  try {
    const saved = localStorage.getItem('incomepath_action_plans');
    if (saved) actionPlans = JSON.parse(saved);
  } catch (err) {
    console.error(err);
  }

  const effectiveSavedOpps = directSavedOpps || allOpportunities.filter(o => savedIds.includes(o.id));
  const activePlanCount = Object.keys(actionPlans).length;

  const folders = ['all', 'Skill-Based', 'Zero-Investment', 'Digital Products', 'Local / Offline', 'Long-Term'];

  const filteredSaved = effectiveSavedOpps.filter(o => {
    if (activeFolder === 'all') return true;
    return o.category === activeFolder;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Discovery Dashboard</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track your saved opportunities, active 7-day roadmaps, and profile constraints.
          </p>
        </div>

        <button
          onClick={onOpenQuestionnaire}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 w-fit"
        >
          Edit Profile Preferences
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Saved Ideas</span>
          <div className="text-2xl font-bold text-emerald-400">{effectiveSavedOpps.length}</div>
          <span className="text-[10px] text-slate-500">Bookmarked for later</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Active Plans</span>
          <div className="text-2xl font-bold text-teal-400">{activePlanCount}</div>
          <span className="text-[10px] text-slate-500">7-day execution roadmaps</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Not Interested</span>
          <div className="text-2xl font-bold text-rose-400">{rejectedIds.length}</div>
          <span className="text-[10px] text-slate-500">Hidden from feed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Recorded Skills</span>
          <div className="text-2xl font-bold text-cyan-400">
            {userProfile.skills?.length || 0}
          </div>
          <span className="text-[10px] text-slate-500">Capabilities mapped</span>
        </div>
      </div>

      {/* User Profile Snapshot Card */}
      <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Active Profile</h3>
          </div>
          <span className="text-xs text-slate-400">Country: <strong className="text-white">{userProfile.country || 'India'}</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px]">Time:</span>
            <span className="font-semibold text-white">{userProfile.availableTime || '1–2 hours/day'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Budget:</span>
            <span className="font-semibold text-emerald-400">{userProfile.budget || '₹0'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Experience:</span>
            <span className="font-semibold text-white">{userProfile.experienceLevel || 'Beginner'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Income Goal:</span>
            <span className="font-semibold text-white">{userProfile.incomeGoal || 'Side income'}</span>
          </div>
        </div>

        <div className="pt-2 text-xs">
          <span className="text-slate-500 mr-2">Skills on record:</span>
          <span className="text-slate-300 font-medium">
            {userProfile.skills && userProfile.skills.length > 0
              ? userProfile.skills.join(', ')
              : 'None recorded yet'}
          </span>
        </div>
      </div>

      {/* Active Action Plans section */}
      {activePlanCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-400" />
            <span>Active In-Flight 7-Day Plans</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(actionPlans).map(([oppId, planData]) => {
              const opp = allOpportunities.find(o => o.id === oppId);
              if (!opp) return null;

              const totalTasks = opp.sevenDayPlan?.reduce((acc, d) => acc + (d.tasks?.length || 0), 0) || 1;
              const completedCount = Object.values(planData.tasks || {}).filter(Boolean).length;
              const percent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

              return (
                <div key={oppId} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">{opp.category}</span>
                      <h4 className="text-base font-bold text-white">{opp.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-900 text-teal-300 border border-slate-800">
                      {planData.stage || 'In Progress'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Checklist Progress</span>
                      <span className="font-mono text-emerald-400 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectOpportunity(opp);
                      onNavigateToTab('plans');
                    }}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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

      {/* Saved Opportunities Categorized by Folders */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-400" />
              <span>Saved Opportunities ({effectiveSavedOpps.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Organized by category folders.</p>
          </div>

          {/* Folder tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  activeFolder === f
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f === 'all' ? 'All Saved' : f}
              </button>
            ))}
          </div>
        </div>

        {filteredSaved.length === 0 ? (
          <div className="p-8 text-center bg-slate-850 border border-slate-800 rounded-2xl text-xs text-slate-400">
            No saved opportunities found in this category. Click the Bookmark (❤️) icon on any recommendation card to save it.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSaved.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{opp.category || 'Career'}</span>
                    <button
                      onClick={() => onRemoveSaved && onRemoveSaved(opp.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{(opp.howItWorks || opp.description || '').slice(0, 120)}...</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="font-semibold text-emerald-400">
                    {opp.investment?.min === 0 ? '₹0 Initial' : (opp.investment?.min ? `₹${opp.investment.min}` : 'Free')}
                  </span>
                  <button
                    onClick={() => onSelectOpportunity && onSelectOpportunity(opp)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Guide</span>
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
