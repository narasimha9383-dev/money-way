// src/components/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Laptop, 
  Globe, 
  GraduationCap, 
  Play, 
  Box, 
  Clock, 
  MapPin, 
  Code, 
  Palette, 
  PenTool, 
  Megaphone, 
  ArrowRight, 
  Bookmark, 
  Coins, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCw, 
  X, 
  UserCheck, 
  SlidersHorizontal, 
  Compass,
  ExternalLink,
  Layers,
  ChevronDown,
  Info,
  Check,
  Undo2
} from 'lucide-react';
import { getOpportunityImage, heroBannerImage } from '../services/imageMap.js';
import NearbyServicesSection from './NearbyServicesSection.jsx';
import SimilarOpportunitiesModal from './SimilarOpportunitiesModal.jsx';

export default function DashboardHome({
  userProfile,
  recommendations = [],
  allOpportunities = [],
  onSelectOpportunity,
  onSaveOpportunity,
  isSaved,
  onNavigateToTab,
  onOpenQuestionnaire,
  onSearchSubmit,
  searchLoading = false,
  searchQuery = '',
  searchResults = null,
  searchCount = 0,
  searchError = null,
  searchFilters = {},
  onFilterChange,
  onClearSearch,
  onDiscoverMore,
  discoverLoading = false,
  onRefreshOpportunities,
  refreshLoading = false,
  onAIDiscover,
  aiDiscoverLoading = false,
  onAddToCompare,
  isCompared,
  onStartPlan,
  onNotInterested,
  onOpenExternalLink,
  didYouMean = null,
  parsedSearchFilters = null
}) {
  const [localInput, setLocalInput] = useState(searchQuery || '');
  const [searchMode, setSearchMode] = useState('ai'); // 'standard' | 'ai' (AI Search default for natural queries)
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [similarModalTarget, setSimilarModalTarget] = useState(null);
  const [refreshEmptyAdvice, setRefreshEmptyAdvice] = useState(null);

  // Synchronize local input when searchQuery changes externally
  useEffect(() => {
    setLocalInput(searchQuery || '');
  }, [searchQuery]);

  const isProfileCompleted = Boolean(userProfile && userProfile.isProfileCompleted);
  const userName = userProfile?.name || 'Alex';

  const quickChips = [
    { label: 'Freelancing', query: 'Freelancing' },
    { label: 'Work from home', query: 'Work from home' },
    { label: '₹0 investment', query: '₹0 investment' },
    { label: 'Online tutoring', query: 'Online tutoring' },
    { label: 'Video editing', query: 'Video editing' },
    { label: 'Student opportunities', query: 'Student opportunities' },
    { label: 'Local tutoring', query: 'Local tutoring' }
  ];

  const categoryPills = [
    { id: 'freelancing', label: 'Freelancing', icon: Laptop, query: 'Freelancing' },
    { id: 'online', label: 'Online Work', icon: Globe, query: 'Work from home' },
    { id: 'teaching', label: 'Teaching', icon: GraduationCap, query: 'Online tutoring' },
    { id: 'content', label: 'Content Creation', icon: Play, query: 'Video editing' },
    { id: 'digital', label: 'Digital Products', icon: Box, query: 'Digital Products' },
    { id: 'parttime', label: 'Part-time', icon: Clock, query: 'Part-time' },
    { id: 'local', label: 'Nearby Services', icon: MapPin, query: 'Local work' }
  ];

  const exploreCategories = [
    {
      id: 'programming',
      name: 'Programming',
      desc: 'Build your tech skills',
      icon: Code,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      query: 'Web Development'
    },
    {
      id: 'design',
      name: 'Design',
      desc: 'Create & earn',
      icon: Palette,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      query: 'Graphic Design'
    },
    {
      id: 'writing',
      name: 'Writing',
      desc: 'Turn your words into income',
      icon: PenTool,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      query: 'Writing'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      desc: 'Grow brands',
      icon: Megaphone,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      query: 'Affiliate'
    }
  ];

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = localInput.trim();
    if (onSearchSubmit) {
      onSearchSubmit(trimmed, searchFilters, searchMode);
    }
  };

  const handleQuickChipClick = (query) => {
    setLocalInput(query);
    if (onSearchSubmit) {
      onSearchSubmit(query, searchFilters, searchMode);
    }
  };

  const handleTriggerRefresh = async () => {
    if (onRefreshOpportunities) {
      const res = await onRefreshOpportunities(searchFilters);
      if (res && res.emptyStateAdvice) {
        setRefreshEmptyAdvice(res.emptyStateAdvice);
      } else {
        setRefreshEmptyAdvice(null);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Hero Banner: Search-First Experience with AI Search Toggle (Sections 1, 3, 20, 21) */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
        {/* Background photo & overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroBannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070e18] via-[#070e18]/95 to-[#070e18]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent" />

        <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 space-y-6 max-w-4xl">
          {/* Header text */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Find opportunities that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                fit your situation.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Search by skill, time, budget, work type, or simply describe what you're looking for.
            </p>
          </div>

          {/* Search Mode Toggle (Section 3: Standard Search vs AI Search) */}
          <div className="inline-flex rounded-xl p-1 bg-slate-950/90 border border-slate-800 backdrop-blur-md text-xs">
            <button
              type="button"
              onClick={() => setSearchMode('standard')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                searchMode === 'standard'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Search
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('ai')}
              className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                searchMode === 'ai'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ AI Search</span>
            </button>
          </div>

          {/* Search Bar Input (Sections 1, 2, 3, 21) */}
          <form onSubmit={handleFormSubmit} className="pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl focus-within:border-emerald-500 transition-all max-w-3xl">
              <div className="flex items-center flex-1 px-3 py-1">
                {searchMode === 'ai' ? (
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mr-2.5 animate-pulse" />
                ) : (
                  <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
                )}
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder={
                    searchMode === 'ai'
                      ? 'Example: "Java jobs I can do from home with ₹0 investment" or "2 hours tutoring"'
                      : 'Example: "JavaScript", "Python", "Tutoring", "Video Editing"...'
                  }
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                />
                {localInput && (
                  <button
                    type="button"
                    onClick={() => { setLocalInput(''); if (onClearSearch) onClearSearch(); }}
                    className="text-slate-400 hover:text-white p-1"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 px-1">
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  {searchLoading ? <RotateCw className="w-4 h-4 animate-spin text-slate-950" /> : null}
                  <span>{searchLoading ? 'Searching…' : searchMode === 'ai' ? 'AI Search' : 'Search'}</span>
                </button>
                {!isProfileCompleted && (
                  <button
                    type="button"
                    onClick={onOpenQuestionnaire}
                    className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-emerald-300 font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
                  >
                    Build My Profile
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Parsed AI Search Badges (Section 1 & 2: Structured Requirements Decomposition) */}
          {parsedSearchFilters && searchResults !== null && (
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1 text-slate-300">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Parsed by AI:
              </span>
              {parsedSearchFilters.skills?.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px]">
                  Skills: {parsedSearchFilters.skills.join(', ')}
                </span>
              )}
              {parsedSearchFilters.timeHours && (
                <span className="px-2.5 py-0.5 rounded-md bg-teal-950/80 border border-teal-800/80 text-teal-300 text-[11px]">
                  Time: ≤ {parsedSearchFilters.timeHours} hrs/day
                </span>
              )}
              {parsedSearchFilters.budget !== null && parsedSearchFilters.budget !== undefined && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-800/80 text-blue-300 text-[11px]">
                  Budget: ₹{parsedSearchFilters.budget}
                </span>
              )}
              {parsedSearchFilters.mode && (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px]">
                  Location: {parsedSearchFilters.mode}
                </span>
              )}
            </div>
          )}

          {/* Quick Search Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Quick Searches:
            </span>
            {quickChips.map((chip, i) => {
              const isActive = (searchQuery && searchQuery.toLowerCase() === chip.query.toLowerCase()) ||
                               (localInput && localInput.toLowerCase() === chip.query.toLowerCase());
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickChipClick(chip.query)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950 border border-emerald-300 ring-2 ring-emerald-400/40 shadow-emerald-500/20 font-bold'
                      : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-emerald-500/60 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className={`mr-1 font-bold ${isActive ? 'text-slate-950' : 'text-emerald-400'}`}>✦</span>
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. SEARCH RESULTS VIEW (Sections 2, 4, 17, 18, 19, 22) */}
      {(searchLoading || searchResults !== null) && (
        <section id="search-results-section" className="space-y-4 pt-2 scroll-mt-20">
          {/* Search Header Bar with Result Count (Section 18: only display backend count) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white font-heading">
                  {searchLoading
                    ? 'Searching opportunities…'
                    : searchQuery
                    ? `Search results for "${searchQuery}"`
                    : 'All Verified Opportunities'}
                </h2>
              </div>
              {!searchLoading && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {searchCount} {searchCount === 1 ? 'opportunity' : 'opportunities'} found in database
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Search</span>
              </button>
            </div>
          </div>

          {/* "Did you mean" Clarification Prompt (Section 22) */}
          {didYouMean && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{didYouMean}</span>
              </div>
              <button
                onClick={() => {
                  const cleaned = didYouMean.replace(/Did you mean opportunities related to /i, '').replace(/\?/g, '').trim();
                  handleQuickChipClick(cleaned);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shrink-0 transition-colors"
              >
                Search Instead
              </button>
            </div>
          )}

          {/* Functional Search Filters (Section 19: modifies actual API request) */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Filters:
            </span>

            {/* Budget Filter */}
            <select
              value={searchFilters.budget !== undefined ? searchFilters.budget : ''}
              onChange={(e) => onFilterChange('budget', e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Budgets</option>
              <option value="0">₹0 (Zero Investment)</option>
              <option value="500">Under ₹500</option>
              <option value="2000">Under ₹2,000</option>
            </select>

            {/* Work Type Filter */}
            <select
              value={searchFilters.workType || ''}
              onChange={(e) => onFilterChange('workType', e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Locations</option>
              <option value="Online">Online / Remote</option>
              <option value="Offline">Local / In-person</option>
            </select>

            {/* Experience Filter */}
            <select
              value={searchFilters.experience || ''}
              onChange={(e) => onFilterChange('experience', e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Experience</option>
              <option value="Beginner">Beginner Friendly</option>
              <option value="Advanced">Advanced / Technical</option>
            </select>
          </div>

          {/* Search Loading Skeleton (Section 17) */}
          {searchLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((sk) => (
                <div key={sk} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 animate-pulse">
                  <div className="h-40 rounded-xl bg-slate-800/80" />
                  <div className="h-5 w-3/4 rounded bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-800/60" />
                </div>
              ))}
            </div>
          )}

          {/* Search Error State */}
          {!searchLoading && searchError && (
            <div className="p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-2xl space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Search is temporarily unavailable.</h3>
              <p className="text-xs text-slate-400">{searchError}</p>
            </div>
          )}

          {/* Empty Search Results State (Section 2) */}
          {!searchLoading && !searchError && searchResults && searchResults.length === 0 && (
            <div className="p-10 text-center bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                No verified opportunities found for "{searchQuery}".
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your search didn't match any verified opportunities in our database with your current filters. Try searching for skills like <strong>JavaScript</strong>, <strong>Python</strong>, <strong>Writing</strong>, <strong>Tutoring</strong>, or <strong>Video Editing</strong>.
              </p>
              <button
                onClick={onClearSearch}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-colors"
              >
                Clear Search &amp; View All
              </button>
            </div>
          )}

          {/* Real Search Results Cards Grid */}
          {!searchLoading && searchResults && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((opp) => (
                <OpportunityGridCard
                  key={opp.id}
                  opp={opp}
                  isSaved={isSaved(opp.id)}
                  isCompared={isCompared?.(opp.id)}
                  onSelectOpportunity={onSelectOpportunity}
                  onSaveOpportunity={onSaveOpportunity}
                  onAddToCompare={onAddToCompare}
                  onStartPlan={onStartPlan}
                  onFindSimilar={(target) => setSimilarModalTarget(target)}
                  onNotInterested={onNotInterested}
                  onOpenExternalLink={onOpenExternalLink}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Category Pills Row */}
      {searchResults === null && (
        <section className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4 lg:grid-cols-7">
            {categoryPills.map((cat) => {
              const Icon = cat.icon;
              const isActive = (searchQuery && (searchQuery.toLowerCase() === cat.query.toLowerCase() || searchQuery.toLowerCase().includes(cat.label.toLowerCase()))) ||
                               (localInput && (localInput.toLowerCase() === cat.query.toLowerCase() || localInput.toLowerCase().includes(cat.label.toLowerCase())));
              return (
                <button
                  key={cat.id}
                  onClick={() => handleQuickChipClick(cat.query)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/30 text-emerald-300' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-emerald-300 font-bold' : 'group-hover:text-white'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. NEW USER EXPERIENCE: Profile Setup Prompt (Sections 6, 7, 20) */}
      {searchResults === null && !isProfileCompleted && (
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-[#07241e]/40 border border-emerald-900/40 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Step 1 of 1: Personal Profile</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Tell us about yourself
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Answer a few questions about your available time, starting budget, skills, and equipment. We will match you against verified opportunities with zero fake claims.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Your daily time</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Starting budget</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                <span>Available tools</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuestionnaire}
                className="py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Build My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. AFTER PROFILE COMPLETION: Real Recommendations (Sections 5, 8, 13, 16, 19) */}
      {searchResults === null && isProfileCompleted && (
        <section className="space-y-5">
          {/* Header with Refresh & AI Discover Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Opportunities For You
                </h2>
                <p className="text-xs text-slate-400">
                  Based on your time, skills, budget and preferences. Real database recommendations only.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* ✨ AI Discover Button (Section 19) */}
              <button
                onClick={onAIDiscover}
                disabled={aiDiscoverLoading}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-300 hover:from-emerald-500/30 hover:to-teal-500/30 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${aiDiscoverLoading ? 'animate-spin' : ''}`} />
                <span>{aiDiscoverLoading ? 'Discovering…' : '✨ AI Discover'}</span>
              </button>

              {/* 🔄 Refresh Opportunities Button (Sections 13 & 16) */}
              <button
                onClick={handleTriggerRefresh}
                disabled={refreshLoading}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                title="Request fresh data, check verification, and remove duplicates"
              >
                <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshLoading ? 'animate-spin' : ''}`} />
                <span>{refreshLoading ? 'Refreshing…' : '🔄 Refresh Opportunities'}</span>
              </button>

              {/* Discover More */}
              <button
                onClick={onDiscoverMore}
                disabled={discoverLoading}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${discoverLoading ? 'animate-spin' : ''}`} />
                <span>Discover More</span>
              </button>

              <button
                onClick={() => onNavigateToTab('discover')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All ({recommendations.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Refresh Empty State Advice (Section 17: friendly guidance when no new opportunities) */}
          {refreshEmptyAdvice && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" />
                  {refreshEmptyAdvice.message}
                </span>
                <button
                  onClick={() => setRefreshEmptyAdvice(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 pt-1">
                {refreshEmptyAdvice.suggestions.map((sug, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations Cards Grid (3 cards per screen) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.slice(0, 3).map((opp) => (
              <OpportunityGridCard
                key={opp.id}
                opp={opp}
                isSaved={isSaved(opp.id)}
                isCompared={isCompared?.(opp.id)}
                onSelectOpportunity={onSelectOpportunity}
                onSaveOpportunity={onSaveOpportunity}
                onAddToCompare={onAddToCompare}
                onStartPlan={onStartPlan}
                onFindSimilar={(target) => setSimilarModalTarget(target)}
                onNotInterested={onNotInterested}
                onOpenExternalLink={onOpenExternalLink}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. NEARBY OPPORTUNITIES & SERVICES SECTION (Sections 5, 6, 7, 8, 9, 10, 11, 12) */}
      <NearbyServicesSection
        userProfile={userProfile}
        onOpenExternalLink={onOpenExternalLink}
        onSelectOpportunity={onSelectOpportunity}
      />

      {/* 7. Explore by Category Section */}
      {searchResults === null && (
        <section className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-white font-heading">
            Explore by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exploreCategories.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => handleQuickChipClick(c.query)}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 cursor-pointer group transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${c.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. SIMILAR OPPORTUNITIES MODAL (Section 25: Find Similar) */}
      {similarModalTarget && (
        <SimilarOpportunitiesModal
          targetOpportunity={similarModalTarget}
          onClose={() => setSimilarModalTarget(null)}
          onSelectOpportunity={onSelectOpportunity}
          onSaveOpportunity={onSaveOpportunity}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}

// Reusable Opportunity Card Component (Sections 10, 11, 12, 24, 25, 26)
function OpportunityGridCard({ 
  opp, 
  isSaved, 
  isCompared,
  onSelectOpportunity, 
  onSaveOpportunity,
  onAddToCompare,
  onStartPlan,
  onFindSimilar,
  onNotInterested,
  onOpenExternalLink
}) {
  const imageUrl = getOpportunityImage(opp);
  const status = opp.verification?.status || 'Verified';
  const isVerified = status.toLowerCase() === 'verified';
  const [showMoreActions, setShowMoreActions] = useState(false);

  const tags = [
    opp.locationType || 'Remote',
    opp.category === 'Skill-Based' ? 'Skill Based' : opp.category === 'Zero-Investment' ? 'Zero Upfront' : 'Flexible',
    opp.isBeginnerFriendly ? 'Beginner Friendly' : 'Flexible'
  ].slice(0, 3);

  const matchBullets = opp.whyMatches?.length > 0
    ? opp.whyMatches.slice(0, 3)
    : [
        `Fits your available ${opp.timeRequired?.label || 'time'}`,
        opp.investment?.min === 0 ? 'No investment required' : `Startup cost ${opp.investment?.description || 'Low'}`,
        opp.locationType === 'Remote' ? 'Can be done from home' : 'Flexible schedule'
      ];

  return (
    <div className="opportunity-card bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg relative">
      {/* Header Image with Status Pill */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={opp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Verification Status Pill (Section 11) */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
            isVerified
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
              : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {isVerified ? 'Verified' : 'Needs Verification'}
          </span>
        </div>

        {/* Match Level (Section 10: NO fake match percentages) */}
        {opp.matchLevel && (
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
              opp.matchLevel === 'Strong Match' || opp.matchLevel === 'AI Discovered'
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900/90 text-slate-300 border border-slate-700'
            }`}>
              {opp.matchLevel}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 
            onClick={() => onSelectOpportunity(opp)}
            className="text-base font-bold text-white group-hover:text-emerald-300 cursor-pointer transition-colors leading-snug"
          >
            {opp.title}
          </h3>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Key Metrics: Cost, Time, Experience */}
          <div className="space-y-1.5 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                ₹{opp.investment?.min || 0} – ₹{(opp.investment?.max || 2000).toLocaleString('en-IN')} startup cost
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{opp.timeRequired?.label || '1–4 hours/day'}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                {Array.isArray(opp.experienceLevel) 
                  ? `${opp.experienceLevel[0]} – ${opp.experienceLevel[opp.experienceLevel.length - 1]}`
                  : opp.experienceLevel || 'Beginner – Intermediate'}
              </span>
            </div>
          </div>

          {/* "Why this matches you" Section (Section 10 & 20: explain why it was recommended) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Why this was recommended
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {matchBullets.map((m, mi) => (
                <li key={mi} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Primary Actions Row (Section 24: View Details, Save, More Actions) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectOpportunity(opp)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSaveOpportunity(opp.id)}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                  : 'border-slate-700/80 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title={isSaved ? 'Saved' : 'Save Opportunity'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-2 rounded-xl border border-slate-700/80 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="More actions"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreActions ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Secondary Actions Drawer (Sections 24, 25, 26: Real Actions) */}
          {showMoreActions && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-1.5 text-[11px] animate-in fade-in duration-150">
              {/* Find Similar (Section 25) */}
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onFindSimilar?.(opp);
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors text-left"
              >
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Find Similar</span>
              </button>

              {/* Compare (Section 24) */}
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onAddToCompare?.(opp);
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors text-left ${
                  isCompared
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3 text-blue-400 shrink-0" />
                <span>{isCompared ? 'Compared ✓' : 'Compare'}</span>
              </button>

              {/* View Official Source (Section 12 & 22) */}
              {opp.verification?.sourceUrl && (
                <button
                  onClick={() => {
                    setShowMoreActions(false);
                    onOpenExternalLink?.(opp.verification.sourceUrl, opp.verification.source);
                  }}
                  className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors text-left"
                >
                  <ExternalLink className="w-3 h-3 text-teal-400 shrink-0" />
                  <span>View Source</span>
                </button>
              )}

              {/* Not Interested (Section 26) */}
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onNotInterested?.(opp.id, 'User marked not interested');
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors text-left"
              >
                <X className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Not Interested</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
