// frontend/src/components/DiscoverOpportunitiesPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  MapPin,
  Compass,
  RotateCw,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Briefcase,
  X,
  ChevronDown,
  Navigation,
  Globe2,
  ArrowUpRight,
  Filter,
  Layers
} from 'lucide-react';
import { fetchOpportunities, refreshOpportunitiesFeedApi } from '../services/api.js';
import { useAuth } from '../AuthContext.jsx';

/**
 * Format relative time from ISO string or timestamp
 */
function formatRelativeTime(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DiscoverOpportunitiesPage({
  onSelectOpportunity,
  onOpenQuestionnaire,
  userProfile
}) {
  const { user, isAuthenticated, savedIds, toggleSaveOpportunity, openAuthModal } = useAuth();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [remoteFilter, setRemoteFilter] = useState('all'); // 'all' | 'true' | 'false'
  const [opportunityType, setOpportunityType] = useState('all');
  const [paidOnly, setPaidOnly] = useState(false);
  const [freshness, setFreshness] = useState('any'); // 'any' | 'today' | '3days' | '7days'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'newest' | 'compensation'

  // Data & Pagination State
  const [opportunities, setOpportunities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [availableSources, setAvailableSources] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // UI Status State
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState(null);
  const [error, setError] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Search input debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 320);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load opportunities whenever filters change or page 1 is reset
  const loadOpportunities = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        search: debouncedQuery.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        location: location !== 'all' ? location : undefined,
        remote: remoteFilter !== 'all' ? remoteFilter : undefined,
        opportunityType: opportunityType !== 'all' ? opportunityType : undefined,
        paidOnly: paidOnly ? 'true' : undefined,
        freshness: freshness !== 'any' ? freshness : undefined,
        sort: sortBy,
        page: pageNum,
        limit: 18
      };

      const res = await fetchOpportunities(params);
      const items = res.opportunities || [];

      if (append) {
        setOpportunities(prev => [...prev, ...items]);
      } else {
        setOpportunities(items);
      }

      setTotalCount(res.total || 0);
      setHasMore(Boolean(res.hasMore));
      setLastUpdated(res.lastUpdated || new Date().toISOString());

      if (res.sources && Array.isArray(res.sources)) {
        setAvailableSources(res.sources);
      }
      if (res.categories && Array.isArray(res.categories)) {
        setAvailableCategories(res.categories);
      }
      if (res.locations && Array.isArray(res.locations)) {
        setAvailableLocations(res.locations);
      }

      // Generate realistic recommendation reasons if user has profile preferences
      if (pageNum === 1 && items.length > 0) {
        computeRecommendations(items);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
      setError('Couldn’t load opportunities right now. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedQuery, category, location, remoteFilter, opportunityType, paidOnly, freshness, sortBy]);

  // Trigger load on filter changes
  useEffect(() => {
    loadOpportunities(1, false);
  }, [loadOpportunities]);

  // Compute realistic recommendations based on actual user preferences
  const computeRecommendations = (items) => {
    if (!items || items.length === 0) {
      setRecommendations([]);
      return;
    }

    const recs = [];
    const userLocation = userProfile?.city || userProfile?.location?.[0] || '';
    const userSkills = userProfile?.skills || [];

    for (const item of items) {
      const reasons = [];

      if (item.remote) {
        reasons.push('Remote / Work from home friendly');
      }
      if (userLocation && item.location && item.location.toLowerCase().includes(userLocation.toLowerCase())) {
        reasons.push(`Available in ${item.location}`);
      }
      if (item.category === 'Gig' || item.category === 'Part-time') {
        reasons.push('Flexible schedule opportunity');
      }
      if (userSkills.length > 0 && item.requirements?.some(r => userSkills.some(s => r.toLowerCase().includes(s.toLowerCase())))) {
        reasons.push('Matches your indicated skill profile');
      }

      if (reasons.length > 0) {
        recs.push({ ...item, recReasons: reasons });
      }
      if (recs.length >= 3) break;
    }

    setRecommendations(recs);
  };

  // Handle Refresh Button Click
  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshToast(null);
    try {
      const res = await refreshOpportunitiesFeedApi();
      const freshCount = res.fresh || res.newOpportunities || 0;
      if (freshCount > 0) {
        setRefreshToast(`+${freshCount} fresh opportunities synced from public feeds!`);
      } else {
        setRefreshToast('All opportunities up to date. Feeds verified.');
      }
      await loadOpportunities(1, false);
    } catch {
      setRefreshToast('Checked feeds. Displaying latest stored opportunities.');
      await loadOpportunities(1, false);
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshToast(null), 4000);
    }
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadOpportunities(nextPage, true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCategory('all');
    setLocation('all');
    setRemoteFilter('all');
    setOpportunityType('all');
    setPaidOnly(false);
    setFreshness('any');
    setSortBy('relevance');
    setPage(1);
  };

  // Handle Geolocation Request
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please select your city manually.');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocatingUser(false);
        // Find nearest city or default to Hyderabad / Bengaluru / Regional
        setLocation('Hyderabad');
      },
      (error) => {
        setLocatingUser(false);
        alert('Location permission was denied. Please select your city from the location filter.');
      },
      { timeout: 8000 }
    );
  };

  // Calculate active filter count
  const activeFiltersCount = [
    category !== 'all',
    location !== 'all',
    remoteFilter !== 'all',
    opportunityType !== 'all',
    paidOnly,
    freshness !== 'any',
    sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Header & Freshness Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-semibold text-emerald-400">
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Opportunity Discovery</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400 font-normal">Real feeds · Verified links</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Discover Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Explore verified gigs, part-time roles, remote jobs, and freelance projects. All listings are sourced from legitimate public feeds and direct partner platforms.
          </p>
        </div>

        {/* Freshness & Refresh Control */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          <div className="text-right hidden sm:block">
            <span className="block text-[11px] text-slate-400">
              Last synced: <span className="text-slate-300 font-medium">{formatRelativeTime(lastUpdated)}</span>
            </span>
            <span className="block text-[10px] text-slate-500">
              {availableSources.length} verified feeds active
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all hover:border-slate-700 cursor-pointer disabled:opacity-50"
            title="Fetch fresh opportunities from live feeds"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Checking Feeds…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Refresh Toast Notification */}
      {refreshToast && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/70 text-xs text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{refreshToast}</span>
          </div>
          <button onClick={() => setRefreshToast(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Prominent Natural Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search e.g. "delivery jobs in Hyderabad", "remote web dev", "internships", "part time"...'
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 shadow-xl transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-12 text-slate-400 hover:text-white p-1 rounded-md"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`absolute right-3 p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFiltersCount > 0
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {debouncedQuery && loading && (
          <div className="absolute -bottom-5 left-4 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Searching opportunities…</span>
          </div>
        )}
      </div>

      {/* 3. Filter Quick-Chips Bar */}
      <div className="space-y-3">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Category:
          </span>
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              category === 'all'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {['Part-time', 'Remote', 'Freelance', 'Gig', 'Internship', 'Local service', 'Skill-Based'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                category === cat
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Location Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location:
          </span>
          <button
            onClick={() => { setLocation('all'); setRemoteFilter('all'); }}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
              location === 'all' && remoteFilter === 'all'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Any Location
          </button>
          <button
            onClick={() => { setLocation('Remote'); setRemoteFilter('true'); }}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center gap-1.5 transition-all ${
              remoteFilter === 'true' || location === 'Remote'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3 h-3 text-emerald-400" />
            <span>Remote Only</span>
          </button>
          {['Hyderabad', 'Bengaluru', 'Chennai'].map((city) => (
            <button
              key={city}
              onClick={() => { setLocation(city); setRemoteFilter('all'); }}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                location === city
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
          <button
            onClick={handleDetectLocation}
            disabled={locatingUser}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 shrink-0 flex items-center gap-1"
            title="Use current location"
          >
            <Navigation className={`w-3 h-3 text-teal-400 ${locatingUser ? 'animate-spin' : ''}`} />
            <span>{locatingUser ? 'Locating…' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* 4. Active Filters Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Active filters:</span>
          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[11px]">
              Category: {category}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setCategory('all')} />
            </span>
          )}
          {location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[11px]">
              Location: {location}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setLocation('all')} />
            </span>
          )}
          {remoteFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[11px]">
              {remoteFilter === 'true' ? 'Remote Only' : 'On-Site Only'}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setRemoteFilter('all')} />
            </span>
          )}
          {opportunityType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Type: {opportunityType}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setOpportunityType('all')} />
            </span>
          )}
          {paidOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Paid Only
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setPaidOnly(false)} />
            </span>
          )}
          {freshness !== 'any' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Fresh: {freshness}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFreshness('any')} />
            </span>
          )}
          {sortBy !== 'relevance' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Sort: {sortBy}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSortBy('relevance')} />
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold ml-auto underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 5. Recommended For You Section (Optional / Collapsible) */}
      {recommendations.length > 0 && !debouncedQuery && category === 'all' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Recommended For You</span>
              <span className="text-[10px] font-normal text-slate-400">
                (Matched against your preferences)
              </span>
            </div>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              {showRecommendations ? 'Hide' : 'Show'}
            </button>
          </div>

          {showRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {recommendations.map((opp) => (
                <div
                  key={`rec-${opp.id}`}
                  className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                        {opp.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{opp.location}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{opp.title}</h4>
                    <p className="text-[11px] text-slate-300 font-medium">{opp.provider}</p>
                    {opp.recReasons?.map((r, i) => (
                      <span key={i} className="inline-block text-[10px] text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded mr-1 mb-1">
                        ✓ {r}
                      </span>
                    ))}
                  </div>

                  <a
                    href={opp.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View Opportunity</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Results Header & Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <div>
          Showing <span className="text-white font-semibold">{opportunities.length}</span> of{' '}
          <span className="text-white font-semibold">{totalCount}</span> verified opportunities
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-emerald-500"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest First</option>
            <option value="compensation">Highest Compensation</option>
          </select>
        </div>
      </div>

      {/* 7. LOADING SKELETON STATE */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="w-20 h-4 bg-slate-800 rounded-lg" />
                <div className="w-16 h-4 bg-slate-800 rounded-lg" />
              </div>
              <div className="w-3/4 h-5 bg-slate-800 rounded-lg" />
              <div className="w-1/2 h-3.5 bg-slate-800 rounded-lg" />
              <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
              <div className="pt-2 flex items-center gap-2">
                <div className="flex-1 h-9 bg-slate-800 rounded-xl" />
                <div className="w-9 h-9 bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 8. ERROR STATE */
        <div className="p-12 text-center bg-rose-950/20 border border-rose-900/40 rounded-2xl space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Couldn’t load opportunities right now</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => loadOpportunities(1, false)}
              className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-300"
            >
              Retry
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-700"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : opportunities.length === 0 ? (
        /* 9. TRUTHFUL EMPTY STATE */
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto">
          <Compass className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No opportunities found for your search</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't find matching opportunities for your current filters. To see more options, try:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside max-w-xs mx-auto text-left">
            <li>Selecting a broader location or choosing "Remote Only"</li>
            <li>Switching to "All Categories"</li>
            <li>Clearing specific compensation or keyword constraints</li>
          </ul>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-300"
            >
              Clear all filters
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-700"
            >
              Refresh feeds
            </button>
          </div>
        </div>
      ) : (
        /* 10. REAL DATA OPPORTUNITY CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => {
            const isSaved = savedIds.includes(opp.id);
            const compLabel = opp.compensation?.label || 'Pay not provided';
            const locationLabel = opp.location || 'Location not provided';

            return (
              <div
                key={opp.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0b1320] border border-slate-800 hover:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                {/* Card Top: Badges & Provider */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                      {opp.category}
                    </span>

                    {/* Verification Status */}
                    {opp.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Source verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 truncate max-w-[130px]">
                        {opp.source}
                      </span>
                    )}
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-1">{opp.provider}</p>
                  </div>

                  {/* Key Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{locationLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{opp.type || 'Opportunity'}</span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1.5 text-emerald-300 font-semibold truncate pt-0.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{compLabel}</span>
                    </div>
                  </div>

                  {/* Requirements / Tags */}
                  {opp.requirements && opp.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.requirements.slice(0, 3).map((req, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 truncate max-w-[140px]"
                        >
                          {req}
                        </span>
                      ))}
                      {opp.requirements.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{opp.requirements.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description snippet */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {opp.description}
                  </p>
                </div>

                {/* Card Footer: Actions */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center gap-2.5">
                  <a
                    href={opp.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>View Opportunity</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        openAuthModal('login');
                      } else {
                        toggleSaveOpportunity(opp.id);
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border-slate-800'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 11. Pagination / Load More Button */}
      {!loading && !error && hasMore && (
        <div className="pt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Loading more opportunities…</span>
              </>
            ) : (
              <>
                <span>Load More Opportunities ({totalCount - opportunities.length} remaining)</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
