// src/components/PersonalizedResults.jsx
// Implements:
// - Section 10: Empty state (never generate random results)
// - Section 13: Progressive disclosure (basic card → expand details)
// - Section 19: Card design spec
// - Section 23: Staged loading experience
// - Section 27: Feedback animation (toast confirmation)
// - Sections 4/5: Fact vs Estimate labels, no fake earning claims
// - Section 6: Source status indicators

import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Dices,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  X,
  ThumbsUp,
  ThumbsDown,
  Scale,
  BookOpen,
  Search,
  Info,
  ShieldCheck,
  Clock,
  Coins,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { getOpportunityImage } from '../services/imageMap.js';

// Source status badge (Section 6)
function VerificationBadge({ status, lastVerifiedAt }) {
  const s = status || 'Verified';
  const color =
    s === 'Verified'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
      : s === 'Needs Verification'
      ? 'bg-amber-950/60 text-amber-300 border-amber-800'
      : 'bg-red-950/60 text-red-300 border-red-800';
  const dot =
    s === 'Verified'
      ? 'bg-emerald-400'
      : s === 'Needs Verification'
      ? 'bg-amber-400'
      : 'bg-red-400';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {s}
      {lastVerifiedAt && <span className="opacity-70">· {lastVerifiedAt}</span>}
    </span>
  );
}

// Staged loading component (Section 23)
function StagedLoader() {
  const [stage, setStage] = useState(0);
  const stages = [
    'Reading your preferences & bandwidth',
    'Checking verified platform requirements',
    'Matching against opportunity database',
    'Preparing factual match explanations'
  ];

  useEffect(() => {
    const timers = stages.map((_, i) =>
      setTimeout(() => setStage(i + 1), i * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-md mx-auto space-y-5">
      <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto">
        <RotateCw className="w-5 h-5 text-emerald-400 animate-spin" />
      </div>
      <h3 className="text-base font-bold text-white">Analyzing your profile…</h3>
      <div className="space-y-2.5 text-xs text-left max-w-xs mx-auto">
        {stages.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 transition-all duration-300 ${
              i < stage ? 'text-emerald-400' : i === stage ? 'text-teal-300 font-semibold' : 'text-slate-600'
            }`}
          >
            {i < stage ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : i === stage ? (
              <RotateCw className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <span className="w-4 h-4 shrink-0 rounded-full border border-slate-700 flex items-center justify-center text-[9px]">○</span>
            )}
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PersonalizedResults({
  recommendations = [],
  profile,
  onSelectOpportunity,
  onSaveOpportunity,
  onRejectOpportunity,
  isSaved,
  onDiscoverMore,
  onSurpriseMe,
  onAddToCompare,
  isCompared,
  onFeedback,
  modeFilter,
  setModeFilter,
  complexityMode,
  setComplexityMode,
  onOpenQuestionnaire,
  loading = false,
  onOpenExternalLink,
  initialSearchQuery = ''
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const [feedbackPromptId, setFeedbackPromptId] = useState(null);
  const [feedbackToastId, setFeedbackToastId] = useState(null);
  const [feedbackToastText, setFeedbackToastText] = useState('');

  const feedbackReasons = [
    'Too difficult / complex',
    'Too expensive startup cost',
    'Requires too much daily time',
    'Not interested in this niche',
    'Not available locally',
    "Requires skills I don't want to learn",
    'Other reason'
  ];

  const showFeedbackToast = (id, text) => {
    setFeedbackToastId(id);
    setFeedbackToastText(text);
    setTimeout(() => {
      setFeedbackToastId(null);
      setFeedbackToastText('');
    }, 3500);
  };

  const handleThumbsUp = (oppId) => {
    onFeedback(oppId, true);
    showFeedbackToast(oppId, '✓ Thanks — we\'ll use this to improve your recommendations.');
  };

  const handleThumbsDown = (oppId) => {
    setFeedbackPromptId(oppId);
  };

  const submitNegativeFeedback = (oppId, reason) => {
    onFeedback(oppId, false, reason);
    setFeedbackPromptId(null);
    showFeedbackToast(oppId, '✓ Understood — this opportunity will not appear again.');
  };

  const filteredRecommendations = recommendations.filter((opp) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.category.toLowerCase().includes(q) ||
      (opp.howItWorks || '').toLowerCase().includes(q) ||
      (opp.requiredSkills || []).some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-20">
      {/* ── Header & Controls ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                {profile?.isProfileCompleted ? 'Recommended for You' : 'Verified Database Directory'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {profile?.isProfileCompleted ? 'Opportunities For You' : 'Explore All Verified Opportunities'}
            </h1>
            <p className="text-xs text-slate-400">
              {profile?.isProfileCompleted 
                ? 'Based on your time, skills, budget and preferences. Real database recommendations only.'
                : 'Browse verified opportunities from our database. Build your profile for personalized matches.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenQuestionnaire}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Adjust Preferences
            </button>
            <button
              onClick={onDiscoverMore}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Discover More</span>
            </button>
            <button
              onClick={onSurpriseMe}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Show an opportunity outside your usual category that still respects your hard constraints"
            >
              <Dices className="w-3.5 h-3.5 text-purple-400" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
          {/* Online / Offline toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
            <span className="text-slate-500 px-2 font-medium">Workplace:</span>
            {['Both', 'Online', 'Offline'].map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  modeFilter === m
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your results…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Complexity toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Complexity:</span>
          {['all', 'beginner', 'advanced'].map((m) => (
            <button
              key={m}
              onClick={() => setComplexityMode(m)}
              className={`px-3 py-1 rounded-lg border font-medium transition-colors capitalize ${
                complexityMode === m
                  ? 'bg-slate-700 text-slate-100 border-slate-600'
                  : 'text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {m === 'all' ? 'All Levels' : m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Staged Loading (Section 23) ── */}
      {loading && <StagedLoader />}

      {/* ── Empty State (Section 10 — zero fake results) ── */}
      {!loading && filteredRecommendations.length === 0 && (
        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">No verified matches found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your current requirements are quite specific. Because we follow a{' '}
            <strong className="text-slate-300">Zero Fake Information Policy</strong>, we never generate random
            or unverified opportunities just to fill the screen.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your time, budget, location, or skill preferences to broaden the filter.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <button
              onClick={onOpenQuestionnaire}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
            >
              Adjust Preferences
            </button>
            <button
              onClick={() => { setModeFilter('Both'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Explore Broader Options
            </button>
          </div>
        </div>
      )}

      {/* ── Opportunity Cards Grid (Section 19 card spec, Section 13 progressive disclosure) ── */}
      {!loading && filteredRecommendations.length > 0 && (
        <>
          <p className="text-xs text-slate-500 px-1">
            Showing {filteredRecommendations.length} verified match{filteredRecommendations.length !== 1 ? 'es' : ''}.
            Results shown do not constitute income guarantees — earnings vary.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecommendations.map((opp) => {
              const isSavedItem = isSaved(opp.id);
              const isComparedItem = isCompared(opp.id);
              const hasFeedbackToast = feedbackToastId === opp.id;

              return (
                <OpportunityCard
                  key={opp.id}
                  opp={opp}
                  isSaved={isSavedItem}
                  isCompared={isComparedItem}
                  feedbackPromptId={feedbackPromptId}
                  hasFeedbackToast={hasFeedbackToast}
                  feedbackToastText={feedbackToastText}
                  feedbackReasons={feedbackReasons}
                  onSelectOpportunity={onSelectOpportunity}
                  onSaveOpportunity={onSaveOpportunity}
                  onRejectOpportunity={onRejectOpportunity}
                  onAddToCompare={onAddToCompare}
                  handleThumbsUp={handleThumbsUp}
                  handleThumbsDown={handleThumbsDown}
                  submitNegativeFeedback={submitNegativeFeedback}
                  setFeedbackPromptId={setFeedbackPromptId}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Opportunity Card ── (Section 19 design spec)
function OpportunityCard({
  opp,
  isSaved,
  isCompared,
  feedbackPromptId,
  hasFeedbackToast,
  feedbackToastText,
  feedbackReasons,
  onSelectOpportunity,
  onSaveOpportunity,
  onRejectOpportunity,
  onAddToCompare,
  handleThumbsUp,
  handleThumbsDown,
  submitNegativeFeedback,
  setFeedbackPromptId
}) {
  return (
    <article className="opportunity-card bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
      {/* Header image */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        <img
          src={getOpportunityImage(opp)}
          alt={opp.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <VerificationBadge status={opp.verification?.status} lastVerifiedAt={opp.verification?.lastVerifiedAt} />
        </div>
        {opp.matchLevel && (
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
              opp.matchLevel === 'Strong Match' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900/80 text-slate-300 border border-slate-700'
            }`}>
              {opp.matchLevel}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Card title and category */}
          <div className="mb-3">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
              {opp.category} · {opp.locationType || opp.mode}
            </span>
            <h3 
              onClick={() => onSelectOpportunity(opp)}
              className="text-lg font-bold text-white hover:text-emerald-300 cursor-pointer leading-tight transition-colors"
            >
              {opp.title}
            </h3>
          </div>

        {/* Specs row — Verified Facts (Section 4) */}
        <div className="grid grid-cols-2 gap-2 py-3 my-2 border-y border-slate-800/60 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase tracking-wide block mb-0.5">
              <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-500" />Startup Cost (Fact)
            </span>
            <span className="font-semibold text-emerald-400">
              {opp.investment?.min === 0 ? '₹0 to start' : `₹${opp.investment?.min}–₹${opp.investment?.max}`}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase tracking-wide block mb-0.5">
              <Clock className="w-3 h-3 inline mr-1" />Time Needed
            </span>
            <span className="font-semibold text-slate-200">
              {opp.timeRequired?.label || '1–3 hrs/day'}
            </span>
          </div>
        </div>

        {/* Why this matched — personalized explanation */}
        {opp.whyMatches && opp.whyMatches.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {opp.whyMatches.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Variable estimate disclaimer (Section 4 & 5 — NO fake earning claims) */}
        <div className="mb-4 text-[11px] text-amber-300/80 bg-amber-950/15 px-3 py-2 rounded-lg border border-amber-900/30 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Variable Estimate:</strong> {
              opp.challenges?.[0] || 'Income varies — depends on individual effort, skill level, market demand, and competition.'
            }
          </span>
        </div>
      </div>

      {/* Card footer actions */}
      <div className="pt-3 border-t border-slate-800/60 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Primary CTA */}
          <button
            onClick={() => onSelectOpportunity(opp)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Guide</span>
          </button>

          {/* Secondary actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSaveOpportunity(opp.id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isSaved
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
              aria-label={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onAddToCompare(opp)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isCompared
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="Add to comparison"
              aria-label="Add to comparison"
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onRejectOpportunity(opp.id)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/30 hover:text-rose-400 text-slate-500 border border-slate-800 transition-colors"
              title="Not interested"
              aria-label="Not interested"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feedback widget (Section 27 — with toast animation) */}
        {hasFeedbackToast ? (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-800/40 animate-in fade-in duration-200">
            {feedbackToastText}
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Was this recommendation useful?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleThumbsUp(opp.id)}
                className="hover:text-emerald-400 p-0.5 flex items-center gap-1 transition-colors"
                aria-label="Yes, useful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThumbsDown(opp.id)}
                className="hover:text-rose-400 p-0.5 flex items-center gap-1 transition-colors"
                aria-label="Not relevant"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Feedback reason panel (Section 27) */}
        {feedbackPromptId === opp.id && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span>What didn't fit?</span>
              <button
                onClick={() => setFeedbackPromptId(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close feedback panel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {feedbackReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => submitNegativeFeedback(opp.id, r)}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-left text-[11px] transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </article>
);
}
