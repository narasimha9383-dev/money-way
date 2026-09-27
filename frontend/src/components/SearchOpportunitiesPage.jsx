// src/components/SearchOpportunitiesPage.jsx
// Traditional Job Search Experience powered by the AI Discovery Bridge
// Connected directly to canonical backend API (/api/jobs/search) with real verified feeds.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Coins,
  ExternalLink,
  Bookmark,
  RotateCw,
  X,
  AlertCircle,
  Filter,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronDown,
  Building2,
  SlidersHorizontal,
  Compass,
  Globe
} from 'lucide-react';
import {
  searchJobsApi,
  refreshOpportunitiesFeedApi,
  reverseGeocodeApi,
  geocodeLocationApi
} from '../services/api.js';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

// Popular query suggestion chips
const POPULAR_QUERIES = [
  'Delivery Partner',
  'Software Engineer',
  'Data Entry Operator',
  'Retail Sales Associate',
  'Customer Support',
  'Part-Time Gig',
  'Graphic Designer',
  'Warehouse Executive',
  'Content Writer',
  'Digital Marketing'
];

// Helper to format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  const diffMs = Date.now() - parsed.getTime();
  if (isNaN(diffMs) || diffMs < 0) return 'just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  return `${months} months ago`;
}

// Safely extract string location from user profile (handles arrays like ["Online / Remote"] or strings)
function extractCityString(profile) {
  if (!profile) return '';
  if (typeof profile.city === 'string' && profile.city.trim()) {
    const c = profile.city.trim();
    if (/^(\[.*\])$/.test(c)) {
      try {
        const parsed = JSON.parse(c);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = String(parsed[0] || '').trim();
          if (/online|remote|wfh/i.test(first)) return '';
          return first;
        }
      } catch {}
    }
    if (/online|remote|wfh/i.test(c)) return '';
    return c;
  }
  if (Array.isArray(profile.location) && profile.location.length > 0) {
    const loc = String(profile.location[0] || '').trim();
    if (/online|remote|wfh/i.test(loc)) return '';
    return loc;
  }
  if (typeof profile.location === 'string' && profile.location.trim()) {
    if (/online|remote|wfh/i.test(profile.location)) return '';
    return profile.location.trim();
  }
  return '';
}

// Safely determine initial remote work mode
function extractWorkMode(profile) {
  if (!profile) return 'all';
  if (Array.isArray(profile.location)) {
    if (profile.location.some(l => /online|remote|wfh/i.test(String(l)))) {
      return 'remote';
    }
  } else if (typeof profile.location === 'string' && /online|remote|wfh/i.test(profile.location)) {
    return 'remote';
  }
  if (typeof profile.city === 'string' && /online|remote|wfh/i.test(profile.city)) {
    return 'remote';
  }
  return 'all';
}

// Safe string trim helper to prevent any TypeError: x.trim is not a function
function safeTrim(val) {
  if (typeof val === 'string') return val.trim();
  if (Array.isArray(val)) {
    return val.filter(Boolean).map(String).join(', ').trim();
  }
  if (val && typeof val === 'object') return '';
  return val ? String(val).trim() : '';
}

export default function SearchOpportunitiesPage({
  userProfile,
  onSelectOpportunity,
  onNavigateToTab,
  initialQuery = ''
}) {
  const { theme, isDark } = useTheme();
  const { user, savedIds, toggleSaveOpportunity, openAuthModal, isAuthenticated } = useAuth();

  // Determine initial work mode & location string safely
  const initialMode = extractWorkMode(userProfile);
  const initialCity = extractCityString(userProfile);

  // Traditional dual-input state: [What] + [Where]
  const [whatInput, setWhatInput] = useState(() => safeTrim(initialQuery));
  const [whereInput, setWhereInput] = useState(() => initialCity);

  // Active query parameters dispatched to API
  const [activeWhat, setActiveWhat] = useState(() => safeTrim(initialQuery));
  const [activeWhere, setActiveWhere] = useState(() => initialMode === 'remote' ? 'Remote / Online' : initialCity);

  // Traditional filter dropdown states
  const [employmentType, setEmploymentType] = useState('all');
  const [workMode, setWorkMode] = useState(() => initialMode); // 'all' | 'remote' | 'onsite'
  const [experience, setExperience] = useState('all'); // 'all' | 'fresher' | 'experienced'
  const [minSalary, setMinSalary] = useState(''); // '' | '15000' | '25000' | '50000'
  const [sort, setSort] = useState('relevance'); // 'relevance' | 'newest' | 'distance'
  const [page, setPage] = useState(1);

  // Data fetching state
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [aiIntent, setAiIntent] = useState(null);
  const [availableSources, setAvailableSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoLocating, setGeoLocating] = useState(false);
  const [userLocationName, setUserLocationName] = useState(null);

  // Helper to determine if remote / online mode is active (bulletproof against non-strings)
  const safeWhereStr = safeTrim(whereInput);
  const isRemoteMode = workMode === 'remote' || /^(remote|online|wfh|work from home)$/i.test(safeWhereStr);

  // Main search executor connecting to Canonical Job API (/api/jobs/search)
  const performSearch = useCallback(async ({
    targetWhat = safeTrim(whatInput),
    targetWhere = safeTrim(whereInput),
    targetWorkMode = workMode,
    isLoadMore = false,
    targetPage = 1
  } = {}) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const cleanWhat = safeTrim(targetWhat);
      const cleanWhere = safeTrim(targetWhere);
      const isRemote = targetWorkMode === 'remote' || /^(remote|online|wfh|work from home)$/i.test(cleanWhere);
      const isFullOnsite = targetWorkMode === 'onsite';

      const params = {
        q: cleanWhat,
        location: isRemote ? '' : cleanWhere,
        remote: isRemote ? 'true' : isFullOnsite ? 'false' : '',
        employmentType: employmentType !== 'all' ? employmentType : '',
        experience: experience !== 'all' ? experience : '',
        minPay: minSalary || '',
        sort,
        page: targetPage,
        limit: 18,
        profile: userProfile ? { ...userProfile, city: isRemote ? '' : cleanWhere } : undefined
      };

      const res = await searchJobsApi(params);

      const items = Array.isArray(res?.jobs) ? res.jobs : [];
      if (isLoadMore) {
        setJobs(prev => [...prev, ...items]);
      } else {
        setJobs(items);
      }

      setTotalCount(typeof res?.total === 'number' ? res.total : items.length);
      setTotalPages(res?.totalPages || 1);
      if (res?.intent) {
        setAiIntent(res.intent);
      }
      if (Array.isArray(res?.sources)) {
        setAvailableSources(res.sources);
      }
    } catch (err) {
      console.error('Job search API request error:', err);
      setError('Unable to load verified jobs from the server right now.');
      if (!isLoadMore) {
        setJobs([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [whatInput, whereInput, employmentType, workMode, experience, minSalary, sort, userProfile]);

  // Initial mount: load real jobs by default immediately
  useEffect(() => {
    performSearch({
      targetWhat: activeWhat,
      targetWhere: activeWhere,
      targetWorkMode: workMode,
      isLoadMore: false,
      targetPage: 1
    });
  }, [employmentType, workMode, experience, minSalary, sort]);

  // Sync initialQuery prop changes (e.g. from homepage search or address bar)
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== activeWhat) {
      const cleanInit = safeTrim(initialQuery);
      setWhatInput(cleanInit);
      setActiveWhat(cleanInit);
      setPage(1);
      performSearch({
        targetWhat: cleanInit,
        targetWhere: safeTrim(whereInput),
        targetWorkMode: workMode,
        isLoadMore: false,
        targetPage: 1
      });
    }
  }, [initialQuery]);

  // Keep browser address bar in sync: /search?q=...&loc=...
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/search')) {
        const url = new URL(window.location.href);
        if (activeWhat) url.searchParams.set('q', activeWhat);
        else url.searchParams.delete('q');

        if (activeWhere && activeWhere !== 'Remote / Online') url.searchParams.set('location', activeWhere);
        else url.searchParams.delete('location');

        if (workMode === 'remote') url.searchParams.set('remote', 'true');
        else url.searchParams.delete('remote');

        const newPath = url.pathname + url.search;
        if (window.location.pathname + window.location.search !== newPath) {
          window.history.replaceState(null, '', newPath);
        }
      }
    } catch {
      // ignore
    }
  }, [activeWhat, activeWhere, workMode]);

  // Dedicated switch to 100% Remote / Online mode
  const handleSetRemoteMode = () => {
    setWorkMode('remote');
    setWhereInput('');
    setActiveWhere('Remote / Online');
    setPage(1);
    performSearch({
      targetWhat: safeTrim(whatInput),
      targetWhere: '',
      targetWorkMode: 'remote',
      isLoadMore: false,
      targetPage: 1
    });
  };

  // Dedicated switch to Physical City / In-Person mode
  const handleSetCityMode = () => {
    setWorkMode('all');
    const defaultCity = extractCityString(userProfile);
    setWhereInput(defaultCity);
    setActiveWhere(defaultCity);
    setPage(1);
    performSearch({
      targetWhat: safeTrim(whatInput),
      targetWhere: defaultCity,
      targetWorkMode: 'all',
      isLoadMore: false,
      targetPage: 1
    });
  };

  // Handle explicit form submit (pressing Enter or clicking Find Jobs)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanWhat = safeTrim(whatInput);
    const cleanWhere = safeTrim(whereInput);
    const isTargetRemote = workMode === 'remote' || /^(remote|online|wfh|work from home)$/i.test(cleanWhere);

    if (isTargetRemote) {
      setWorkMode('remote');
      setWhereInput('');
      setActiveWhat(cleanWhat);
      setActiveWhere('Remote / Online');
      setPage(1);
      performSearch({
        targetWhat: cleanWhat,
        targetWhere: '',
        targetWorkMode: 'remote',
        isLoadMore: false,
        targetPage: 1
      });
    } else {
      setActiveWhat(cleanWhat);
      setActiveWhere(cleanWhere);
      setPage(1);
      performSearch({
        targetWhat: cleanWhat,
        targetWhere: cleanWhere,
        targetWorkMode: workMode === 'remote' ? 'all' : workMode,
        isLoadMore: false,
        targetPage: 1
      });
    }
  };

  // Real GPS Geolocation with reverse geocoding to detect exact town / city
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    setWorkMode('all'); // Switching to GPS automatically sets in-person location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await reverseGeocodeApi(latitude, longitude);
          let detectedLoc = '';
          if (res?.success && res.location?.city) {
            detectedLoc = res.location.area
              ? `${res.location.area}, ${res.location.city}`
              : res.location.city;
          } else if (res?.displayName) {
            detectedLoc = res.displayName;
          } else {
            detectedLoc = 'Near Me';
          }
          setWhereInput(detectedLoc);
          setActiveWhere(detectedLoc);
          setUserLocationName(detectedLoc);
          setPage(1);
          performSearch({
            targetWhat: safeTrim(whatInput),
            targetWhere: detectedLoc,
            targetWorkMode: 'all',
            isLoadMore: false,
            targetPage: 1
          });
        } catch (err) {
          console.error('Reverse geocode error:', err);
          setWhereInput('Near Me');
          setActiveWhere('Near Me');
          performSearch({
            targetWhat: safeTrim(whatInput),
            targetWhere: 'Near Me',
            targetWorkMode: 'all',
            isLoadMore: false,
            targetPage: 1
          });
        } finally {
          setGeoLocating(false);
        }
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation denied or failed:', err);
        alert('Could not access your location. Please type your city or area manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Load more pagination handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch({
      targetWhat: activeWhat,
      targetWhere: activeWhere,
      isLoadMore: true,
      targetPage: nextPage
    });
  };

  // Handle quick suggestion click
  const handleSuggestionClick = (queryText) => {
    setWhatInput(queryText);
    setActiveWhat(queryText);
    setPage(1);
    performSearch({
      targetWhat: queryText,
      targetWhere: activeWhere,
      isLoadMore: false,
      targetPage: 1
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setWhatInput('');
    setWhereInput('');
    setActiveWhat('');
    setActiveWhere('');
    setEmploymentType('all');
    setWorkMode('all');
    setExperience('all');
    setMinSalary('');
    setSort('relevance');
    setPage(1);
    performSearch({
      targetWhat: '',
      targetWhere: '',
      isLoadMore: false,
      targetPage: 1
    });
  };

  // Live Refresh Feed from external data sources
  const handleRefreshFeed = async () => {
    setRefreshLoading(true);
    try {
      await refreshOpportunitiesFeedApi();
      await performSearch({
        targetWhat: activeWhat,
        targetWhere: activeWhere,
        isLoadMore: false,
        targetPage: 1
      });
    } catch (err) {
      console.error('Feed refresh error:', err);
    } finally {
      setRefreshLoading(false);
    }
  };

  const hasActiveFilters =
    employmentType !== 'all' ||
    workMode !== 'all' ||
    experience !== 'all' ||
    Boolean(minSalary) ||
    sort !== 'relevance' ||
    Boolean(activeWhat) ||
    Boolean(activeWhere);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 select-none">

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & VERIFICATION STATUS BADGE                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Work Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Real Jobs & Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search verified employers, delivery networks, and direct application portals with zero fabricated listings.
          </p>
        </div>

        {/* Live Status & Refresh Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Direct Live Feeds</span>
          </div>

          <button
            onClick={handleRefreshFeed}
            disabled={refreshLoading || loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh verified job feeds"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshLoading ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>{refreshLoading ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. TRADITIONAL SEARCH BAR CONTAINER (Indeed / LinkedIn Style) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSearchSubmit}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className={`p-2 sm:p-2.5 rounded-2xl border space-y-2.5 transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/60'
        }`}
      >
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {/* Field 1: WHAT (Job title, keywords, company) */}
          <div className={`relative flex-1 flex items-center rounded-xl border focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all ${
            isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="pl-4 text-emerald-500 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex flex-col flex-1 pl-3 pr-8 py-2.5">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                What
              </span>
              <input
                type="text"
                id="search-what-input"
                name="search_what_query"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                value={whatInput}
                onChange={(e) => setWhatInput(e.target.value)}
                placeholder="Job title, skills, or company..."
                className={`w-full bg-transparent text-sm sm:text-base outline-none font-medium ${
                  isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            {whatInput && (
              <button
                type="button"
                onClick={() => setWhatInput('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear job title"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Traditional Divider */}
          <div className={`hidden md:block w-px my-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Field 2: WHERE (City or 100% Remote / Online) */}
          <div className={`relative flex-1 flex flex-col justify-center px-3.5 py-2 rounded-xl border focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all ${
            isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Header row with Label & Quick Mode Toggle */}
            <div className="flex items-center justify-between pb-0.5">
              <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isRemoteMode ? <Globe className="w-3 h-3 text-teal-400" /> : <MapPin className="w-3 h-3 text-emerald-500" />}
                Where
              </span>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSetCityMode}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    !isRemoteMode
                      ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Search by city or area"
                >
                  📍 In-Person
                </button>
                <button
                  type="button"
                  onClick={handleSetRemoteMode}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    isRemoteMode
                      ? isDark ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-teal-100 text-teal-800 border border-teal-300'
                      : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Search 100% remote or online work"
                >
                  🌐 Remote / Online
                </button>
              </div>
            </div>

            {/* Content row depending on Remote or City mode */}
            {isRemoteMode ? (
              <div className="flex items-center justify-between py-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1 rounded-md shrink-0 ${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className={`text-sm font-bold ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>
                      100% Remote / Online
                    </span>
                    <span className={`hidden sm:inline-block ml-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Work from anywhere
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSetCityMode}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                  }`}
                >
                  Switch to City
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-0.5">
                <input
                  type="text"
                  id="search-where-input"
                  name="search_where_location"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  value={typeof whereInput === 'string' ? whereInput : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWhereInput(val);
                    if (typeof val === 'string' && /^(remote|online|wfh|work from home)$/i.test(val.trim())) {
                      handleSetRemoteMode();
                    }
                  }}
                  placeholder="City, state, or area (e.g. Bangalore, Mumbai)..."
                  className={`w-full bg-transparent text-sm sm:text-base outline-none font-medium ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />

                {Boolean(typeof whereInput === 'string' && whereInput) && (
                  <button
                    type="button"
                    onClick={() => setWhereInput('')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Clear location"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* GPS Detect Location Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={geoLocating}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-850 border-slate-700/60 text-slate-300 hover:text-emerald-400'
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-emerald-700 shadow-xs'
                  }`}
                  title="Detect my current location"
                >
                  <Navigation className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin text-emerald-500' : 'text-emerald-500'}`} />
                  <span className="hidden sm:inline">{geoLocating ? 'GPS…' : 'Near Me'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Button: Find Jobs */}
          <button
            type="submit"
            id="search-find-jobs-btn"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Searching…</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Find Jobs</span>
              </>
            )}
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* TRADITIONAL QUICK FILTER PILLS & SELECTORS                  */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className={`flex flex-wrap items-center gap-2 pt-1 border-t text-xs ${
          isDark ? 'border-slate-800/60' : 'border-slate-100'
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Filters:
          </span>

          {/* Job Type Dropdown */}
          <div className="relative">
            <select
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
                setPage(1);
              }}
              className={`py-1.5 pl-3 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer outline-none transition-all ${
                employmentType !== 'all'
                  ? isDark ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <option value="all">Work Type: All</option>
              <option value="Full-time">Full-Time</option>
              <option value="Part-time">Part-Time</option>
              <option value="Gig">Gig / Delivery</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Work Mode Dropdown */}
          <div className="relative">
            <select
              value={workMode}
              onChange={(e) => {
                setWorkMode(e.target.value);
                setPage(1);
              }}
              className={`py-1.5 pl-3 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer outline-none transition-all ${
                workMode !== 'all'
                  ? isDark ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <option value="all">Mode: Any</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-Site</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Experience Level Dropdown */}
          <div className="relative">
            <select
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
                setPage(1);
              }}
              className={`py-1.5 pl-3 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer outline-none transition-all ${
                experience !== 'all'
                  ? isDark ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <option value="all">Experience: Any</option>
              <option value="fresher">Fresher / Entry-Level</option>
              <option value="experienced">Experienced</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Min Salary Dropdown */}
          <div className="relative">
            <select
              value={minSalary}
              onChange={(e) => {
                setMinSalary(e.target.value);
                setPage(1);
              }}
              className={`py-1.5 pl-3 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer outline-none transition-all ${
                minSalary
                  ? isDark ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <option value="">Salary: Any</option>
              <option value="15000">₹15,000+ / mo</option>
              <option value="25000">₹25,000+ / mo</option>
              <option value="35000">₹35,000+ / mo</option>
              <option value="50000">₹50,000+ / mo</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className={`py-1.5 pl-3 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer outline-none transition-all ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <option value="relevance">Sort: Best Match (AI)</option>
              <option value="newest">Sort: Newest First</option>
              <option value="distance">Sort: Nearest Distance</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium ml-auto flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. POPULAR SEARCH SUGGESTION CHIPS                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span className="text-[11px] font-semibold text-slate-400 mr-1">Popular:</span>
        {POPULAR_QUERIES.map((queryText) => {
          const isSelected = activeWhat.toLowerCase() === queryText.toLowerCase();
          return (
            <button
              key={queryText}
              type="button"
              onClick={() => handleSuggestionClick(queryText)}
              className={`px-3 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-emerald-950 border-emerald-700 text-emerald-300 font-bold'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : isDark
                    ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-emerald-300'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-emerald-700 shadow-xs'
              }`}
            >
              {queryText}
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. SEARCH RESULTS FEED CONTAINER                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Results Counter & Header */}
        <div className={`flex flex-wrap items-center justify-between gap-2 text-xs px-1 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <div className="flex items-center flex-wrap gap-2">
            <span>
              Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{jobs.length}</strong> of{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{totalCount}</strong> verified opportunities
              {isRemoteMode ? ' (100% Remote / Online)' : activeWhere ? ` near "${activeWhere}"` : ''}
            </span>

            {isRemoteMode && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-teal-950/80 border-teal-800 text-teal-300' : 'bg-teal-50 border-teal-300 text-teal-800'
              }`}>
                <Globe className="w-3 h-3" />
                Remote Work Verified
              </span>
            )}

            {(aiIntent?.isNearby || activeWhat.toLowerCase().includes('near')) && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}>
                <Navigation className="w-3 h-3" />
                Nearby Feed
              </span>
            )}
          </div>

          <span className="text-[11px]">
            Page {page} of {totalPages}
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading && jobs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`p-5 rounded-2xl border space-y-4 animate-pulse ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`h-5 w-24 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-4 w-20 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
                <div className="space-y-2">
                  <div className={`h-5 w-4/5 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-4 w-1/2 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className={`h-4 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-4 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
                <div className={`h-10 rounded-xl mt-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              </div>
            ))}
          </div>
        ) : error && jobs.length === 0 ? (
          /* Error State */
          <div className={`p-8 rounded-2xl border text-center space-y-3 max-w-md mx-auto ${
            isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-200'
          }`}>
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{error}</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Please check your connection or retry your query.
            </p>
            <button
              type="button"
              onClick={() => performSearch({ targetWhat: activeWhat, targetWhere: activeWhere, targetWorkMode: workMode, isLoadMore: false, targetPage: 1 })}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Retry Search
            </button>
          </div>
        ) : !loading && jobs.length === 0 ? (
          /* Honest Empty State */
          <div className={`p-8 sm:p-12 rounded-2xl border text-center space-y-4 max-w-lg mx-auto my-6 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No matching verified jobs found.
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {activeWhat || activeWhere
                  ? `No verified openings matched "${[activeWhat, activeWhere].filter(Boolean).join(' in ')}". We never display fake jobs to pad results.`
                  : 'No jobs match your selected filter criteria.'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border text-left text-xs space-y-1.5 ${
              isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Recommendations:</span>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <li>Try searching with 100% remote work enabled</li>
                <li>Search broader terms like "delivery", "associate", or "developer"</li>
                <li>Clear experience or salary filters</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSetRemoteMode}
                className={`px-3.5 py-2 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-teal-950/80 border-teal-800/60 text-teal-300 hover:bg-teal-900/80'
                    : 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
                }`}
              >
                🌐 Try 100% Remote Jobs
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Clear All Filters
              </button>
              <button
                type="button"
                onClick={handleRefreshFeed}
                disabled={refreshLoading}
                className={`px-3.5 py-2 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Refresh Real Feeds
              </button>
            </div>
          </div>
        ) : (
          /* Real Job Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const isSaved = savedIds.includes(job.id);
              const applyLink = job.applyUrl || job.applicationUrl || job.jobUrl || job.sourceUrl;
              const locationLabel = job.location || (job.remote ? 'Remote' : 'Location on application');
              const companyName = job.company || job.provider || 'Verified Employer';
              const salaryLabel = job.salary || (job.compensation?.label) || 'Disclosed during application';
              const postedTime = formatRelativeTime(job.postedAt || job.postedDate);

              return (
                <div
                  key={job.id}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                    isDark
                      ? 'bg-[#0b1320] border-slate-800 hover:border-slate-700 shadow-xl hover:shadow-2xl'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-md hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Meta Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Sector / Category badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                          isDark
                            ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                          {job.sector || job.category || 'Opportunity'}
                        </span>

                        {/* Remote / On-Site badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            job.remote || job.isRemote
                              ? isDark
                                ? 'bg-teal-950/80 border-teal-700/60 text-teal-300'
                                : 'bg-teal-50 border-teal-200 text-teal-800'
                              : isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {job.remote || job.isRemote ? '🌐 Remote' : '📍 On-Site'}
                        </span>

                        {/* Distance Badge if available */}
                        {typeof job.distanceKm === 'number' && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isDark
                              ? 'bg-blue-950/90 border-blue-800/60 text-blue-300'
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}>
                            {job.distanceKm === 0 ? 'Exact Location' : `${job.distanceKm} km away`}
                          </span>
                        )}
                      </div>

                      {/* Verified Badge */}
                      <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                          : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      }`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Job Title & Company */}
                    <div>
                      <h3
                        onClick={() => onSelectOpportunity && onSelectOpportunity(job)}
                        className={`text-base font-bold transition-colors line-clamp-2 cursor-pointer ${
                          isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-600'
                        }`}
                        title={job.title}
                      >
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className={`text-xs font-semibold truncate ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {companyName}
                        </span>
                      </div>
                    </div>

                    {/* Job Meta: Location, Schedule, Pay */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className={`flex items-center gap-1.5 truncate ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`} title={locationLabel}>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{locationLabel}</span>
                      </div>

                      <div className={`flex items-center gap-1.5 truncate ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`} title={job.employmentType || job.type || 'Full-time'}>
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.employmentType || job.type || 'Full-time'}</span>
                      </div>

                      <div className={`col-span-2 flex items-center gap-1.5 font-semibold truncate pt-0.5 ${
                        isDark ? 'text-emerald-300' : 'text-emerald-700'
                      }`} title={salaryLabel}>
                        <Coins className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{salaryLabel}</span>
                      </div>
                    </div>

                    {/* AI Match Explanation */}
                    {Array.isArray(job.matchReasons) && job.matchReasons.length > 0 && (
                      <div className={`p-2.5 rounded-xl border space-y-1 ${
                        isDark ? 'bg-slate-950/90 border-emerald-900/40' : 'bg-emerald-50/70 border-emerald-200'
                      }`}>
                        <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                          isDark ? 'text-emerald-400' : 'text-emerald-800'
                        }`}>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            AI Match Factors
                          </span>
                          {job.matchScore && (
                            <span className={`font-mono text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{job.matchScore}% Match</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.matchReasons.slice(0, 3).map((reason, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2 py-0.5 rounded-md border ${
                                isDark
                                  ? 'text-emerald-300 bg-emerald-950/70 border-emerald-800/40'
                                  : 'text-emerald-900 bg-white border-emerald-200 font-medium'
                              }`}
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Freshness Row */}
                    {postedTime && (
                      <div className={`flex items-center gap-1 text-[11px] pt-1 border-t ${
                        isDark ? 'text-slate-400 border-slate-800/60' : 'text-slate-500 border-slate-100'
                      }`}>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Posted {postedTime}</span>
                        {job.source && (
                          <span className="text-slate-400 ml-auto truncate max-w-[140px]">
                            Via {job.source}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className={`pt-4 mt-3 border-t flex items-center gap-2 ${
                    isDark ? 'border-slate-800/80' : 'border-slate-100'
                  }`}>
                    {/* Primary Apply Button */}
                    <a
                      href={applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Details Button */}
                    <button
                      type="button"
                      onClick={() => onSelectOpportunity && onSelectOpportunity(job)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isDark
                          ? 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title="View full job details"
                    >
                      Details
                    </button>

                    {/* Save Bookmark Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          openAuthModal('login');
                        } else {
                          toggleSaveOpportunity(job.id);
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? isDark
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isDark
                            ? 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border-slate-800'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-slate-200'
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

        {/* Load More Pagination */}
        {!loading && page < totalPages && (
          <div className="text-center pt-6">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              {loadingMore ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Loading more verified jobs…</span>
                </>
              ) : (
                <>
                  <span>Load More Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
