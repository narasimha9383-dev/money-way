// src/components/SearchOpportunitiesPage.jsx
// Dynamic, data-driven /search experience for Money Way Platform
// Connected directly to backend API (/api/opportunities/search) with real data feeds.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Coins,
  ExternalLink,
  Bookmark,
  SlidersHorizontal,
  RotateCw,
  X,
  AlertCircle,
  Filter,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { searchOpportunities, refreshOpportunitiesFeedApi } from '../services/api.js';
import { useAuth } from '../AuthContext.jsx';

// Multi-sector taxonomy covering all human skill domains
const SECTOR_PILLS = [
  { id: 'all', label: 'All Sectors', icon: '🌐', query: '' },
  { id: 'games', label: 'Games & Sports', icon: '🎮', query: 'cricket' },
  { id: 'trades', label: 'Physical Trades', icon: '⚡', query: 'electrician' },
  { id: 'shows', label: 'Shows & Stage', icon: '🎭', query: 'sound engineer' },
  { id: 'tech', label: 'Technology & Hardware', icon: '💻', query: 'cctv' },
  { id: 'culinary', label: 'Culinary & Hospitality', icon: '🍳', query: 'cooking' },
  { id: 'wellness', label: 'Healthcare & Fitness', icon: '🏥', query: 'fitness' },
  { id: 'logistics', label: 'Logistics & Ops', icon: '📦', query: 'warehouse' }
];

// Natural multi-sector search query suggestions
const SUGGESTED_SEARCH_QUERIES = [
  'Cricket Coach',
  'Commercial Electrician',
  'Sound Engineer',
  'Game QA Testing',
  'Stage Actor',
  'HVAC Technician',
  'Pastry Chef',
  'CCTV Specialist',
  'Fitness Trainer',
  'Warehouse Ops',
  'Python Developer',
  'Graphic Design'
];

// Quick location filters
const QUICK_LOCATIONS = [
  { label: 'Any Location', value: 'all' },
  { label: 'Remote Only', value: 'remote' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Chennai', value: 'Chennai' }
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
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  return `${months} months ago`;
}

export default function SearchOpportunitiesPage({
  userProfile,
  onSelectOpportunity,
  initialQuery = ''
}) {
  const { user, savedIds, toggleSaveOpportunity, openAuthModal, isAuthenticated } = useAuth();

  // Search input & active query state
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  // Filter state
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [opportunityType, setOpportunityType] = useState('all');
  const [category, setCategory] = useState('all');
  const [paidOnly, setPaidOnly] = useState(false);
  const [freshness, setFreshness] = useState('any');
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Data fetching state
  const [opportunities, setOpportunities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [parsedFilters, setParsedFilters] = useState(null);
  const [didYouMean, setDidYouMean] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Debounce search input (450ms for calm typing, zero shaking)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput.trim() !== activeQuery) {
        setActiveQuery(searchInput.trim());
        setPage(1);
      }
    }, 450);
    return () => clearTimeout(handler);
  }, [searchInput, activeQuery]);

  // Execute Search from API
  const performSearch = useCallback(async (isLoadMore = false, targetPage = 1) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const isRemote = selectedLocation === 'remote';
      const locParam = selectedLocation !== 'all' && !isRemote ? selectedLocation : '';

      const params = {
        q: activeQuery,
        location: locParam,
        remote: isRemote ? 'true' : '',
        opportunityType: opportunityType !== 'all' ? opportunityType : '',
        category: category !== 'all' ? category : '',
        paidOnly: paidOnly ? 'true' : '',
        freshness: freshness !== 'any' ? freshness : '',
        sort,
        page: targetPage,
        limit: 18
      };

      const res = await searchOpportunities(params);

      const items = Array.isArray(res?.opportunities) ? res.opportunities : [];
      if (isLoadMore) {
        setOpportunities(prev => [...prev, ...items]);
      } else {
        setOpportunities(items);
      }

      setTotalCount(typeof res?.total === 'number' ? res.total : items.length);
      setHasMore(Boolean(res?.hasMore));
      setParsedFilters(res?.parsedFilters || null);
      setDidYouMean(res?.didYouMean || null);
      if (res?.lastUpdated) {
        setLastUpdated(res.lastUpdated);
      }
      setLastFetchedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Search API request error:', err);
      setError('Unable to retrieve opportunities from the server right now.');
      if (!isLoadMore) {
        setOpportunities([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeQuery, selectedLocation, opportunityType, category, paidOnly, freshness, sort]);

  // Re-run search when query or filters change
  useEffect(() => {
    performSearch(false, 1);
  }, [performSearch]);

  // Handle explicit form submit (pressing Enter or clicking Search)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveQuery(searchInput.trim());
    setPage(1);
  };

  // Load more pagination handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(true, nextPage);
  };

  // Trigger search term suggestion
  const handleSuggestionClick = (queryText) => {
    setSearchInput(queryText);
    setActiveQuery(queryText);
    setPage(1);
  };

  // Clear all filters and query
  const handleClearFilters = () => {
    setSearchInput('');
    setActiveQuery('');
    setSelectedSector('all');
    setSelectedLocation('all');
    setOpportunityType('all');
    setCategory('all');
    setPaidOnly(false);
    setFreshness('any');
    setSort('relevance');
    setPage(1);
  };

  // Sector Ribbon filter click handler
  const handleSectorClick = (sector) => {
    setSelectedSector(sector.id);
    if (sector.id === 'all') {
      setSearchInput('');
      setActiveQuery('');
    } else {
      setSearchInput(sector.query);
      setActiveQuery(sector.query);
    }
    setPage(1);
  };

  // Live Refresh Feed from external data sources
  const handleRefreshFeed = async () => {
    setRefreshLoading(true);
    try {
      await refreshOpportunitiesFeedApi();
      await performSearch(false, 1);
    } catch (err) {
      console.error('Feed refresh error:', err);
    } finally {
      setRefreshLoading(false);
    }
  };

  // Geolocation trigger ("Near Me" with browser permission)
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocating(false);
        const { latitude, longitude } = position.coords;
        if (latitude > 16.5 && latitude < 18.5) {
          setSelectedLocation('Hyderabad');
        } else if (latitude > 12.0 && latitude < 13.5) {
          setSelectedLocation('Bengaluru');
        } else if (latitude > 12.5 && latitude < 14.0 && longitude > 79.5) {
          setSelectedLocation('Chennai');
        } else {
          setSelectedLocation('Hyderabad');
        }
      },
      () => {
        setGeoLocating(false);
        alert('Could not access current location. Please choose a city manually.');
      }
    );
  };

  const activeFiltersCount = [
    selectedLocation !== 'all',
    opportunityType !== 'all',
    category !== 'all',
    paidOnly,
    freshness !== 'any',
    sort !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 select-none">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & SYNC BAR                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Live Opportunity Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Search Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real jobs, freelance projects, and verified partner listings from live backend feeds.
          </p>
        </div>

        {/* Live Freshness & Sync Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Updated: {formatRelativeTime(lastUpdated)}</span>
          </div>

          <button
            onClick={handleRefreshFeed}
            disabled={refreshLoading || loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            title="Fetch fresh opportunities from partner feeds"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshLoading ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>{refreshLoading ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. DEVELOPER DEBUG INDICATOR (Step 11 requirement)          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400">
        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Search source: API
        </span>
        <span>Query: <strong className="text-white">{activeQuery ? `"${activeQuery}"` : '(all)'}</strong></span>
        <span>Results: <strong className="text-white">{totalCount}</strong></span>
        <span>Last fetched: <strong className="text-white">{lastFetchedAt || 'Not fetched yet'}</strong></span>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. SECTOR SELECTOR RIBBON                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Explore Skills By Sector & Organization Role
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Roles across Games, Trades, Shows, Hardware, Health & Tech
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SECTOR_PILLS.map((sector) => {
            const isSectorActive = selectedSector === sector.id || 
              (sector.id !== 'all' && activeQuery.toLowerCase().includes(sector.query.toLowerCase()));

            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSectorClick(sector)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  isSectorActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span>{sector.icon}</span>
                <span>{sector.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. SEARCH BAR                                                */}
      {/* ──────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <label htmlFor="opportunity-search-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          What human skill or organization role are you looking for?
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-emerald-400 pointer-events-none">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>
          <input
            id="opportunity-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search any skill e.g. "cricket coach", "commercial electrician", "sound engineer", "welding", "game testing"...'
            className="w-full pl-12 pr-36 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base text-white placeholder-slate-500 shadow-xl transition-all outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setActiveQuery('');
                setPage(1);
              }}
              className="absolute right-24 text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              title="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-12 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`absolute right-3 p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Filter search"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Searching feedback */}
        {loading && (
          <div className="absolute -bottom-5 left-4 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Searching opportunities…</span>
          </div>
        )}
      </form>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. REAL QUERY SUGGESTIONS                                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
        <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick searches:</span>
        {SUGGESTED_SEARCH_QUERIES.map((queryText) => (
          <button
            key={queryText}
            type="button"
            onClick={() => handleSuggestionClick(queryText)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
              activeQuery.toLowerCase() === queryText.toLowerCase()
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300 font-semibold'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-emerald-300'
            }`}
          >
            {queryText}
          </button>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. LOCATION QUICK PILLS & GEOLOCATION                        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Location:
        </span>

        {QUICK_LOCATIONS.map((loc) => {
          const isActive = selectedLocation === loc.value;
          return (
            <button
              key={loc.value}
              type="button"
              onClick={() => setSelectedLocation(loc.value)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {loc.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleNearMe}
          disabled={geoLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-700/60 font-medium shrink-0 transition-all cursor-pointer disabled:opacity-50"
          title="Detect city via browser geolocation"
        >
          <Navigation className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
          <span>{geoLocating ? 'Detecting…' : 'Near Me'}</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. ADVANCED FILTERS MODAL / EXPANDABLE DRAWER                */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showFiltersModal && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Advanced Search Filters</span>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Opportunity Type */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Opportunity Type</label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Part-time">Part-Time</option>
                <option value="Freelance">Freelance</option>
                <option value="Gig">Gig Work</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-Time</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
                <option value="Gig">Gig Work</option>
                <option value="Internship">Internship</option>
                <option value="Local service">Local Service</option>
                <option value="Skill-Based">Skill-Based</option>
              </select>
            </div>

            {/* Freshness */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Freshness</label>
              <select
                value={freshness}
                onChange={(e) => setFreshness(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="any">Any Time</option>
                <option value="today">Today (Last 24h)</option>
                <option value="3days">Last 3 Days</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Sort Results By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest First</option>
                <option value="compensation">Compensation (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={paidOnly}
                onChange={(e) => setPaidOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Paid Opportunities Only</span>
            </label>

            <button
              type="button"
              onClick={() => setShowFiltersModal(false)}
              className="ml-auto px-4 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. NATURAL LANGUAGE INTERPRETATION & HINTS                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      {parsedFilters && (
        (parsedFilters.role?.length > 0) ||
        (parsedFilters.skills?.length > 0) ||
        parsedFilters.location ||
        parsedFilters.experience ||
        parsedFilters.isRemote ||
        parsedFilters.remote ||
        parsedFilters.workType
      ) && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Structured Criteria:
            </span>
            {parsedFilters.role?.map(r => (
              <span key={r} className="px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 font-semibold border border-emerald-800/50">
                Role: {r}
              </span>
            ))}
            {parsedFilters.skills?.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-teal-950/90 text-teal-300 font-semibold border border-teal-800/50">
                Skill: {s}
              </span>
            ))}
            {parsedFilters.experience && (
              <span className="px-2 py-0.5 rounded-md bg-blue-950/90 text-blue-300 font-semibold border border-blue-800/50">
                Experience: {parsedFilters.experience === 'entry-level' ? 'Fresher / Entry Level' : (typeof parsedFilters.experience === 'object' ? `${parsedFilters.experience.min}-${parsedFilters.experience.max} yrs` : parsedFilters.experience)}
              </span>
            )}
            {parsedFilters.location && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Location: {Array.isArray(parsedFilters.location) ? parsedFilters.location.join(', ') : parsedFilters.location}
              </span>
            )}
            {(parsedFilters.remote || parsedFilters.isRemote) && (
              <span className="px-2 py-0.5 rounded-md bg-teal-900/50 text-teal-300 border border-teal-700/60 font-medium">
                Remote
              </span>
            )}
            {parsedFilters.workType && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Type: {parsedFilters.workType}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400">
            {totalCount} {totalCount === 1 ? 'verified match' : 'verified matches'} found
          </span>
        </div>
      )}

      {/* Did You Mean suggestion */}
      {didYouMean && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{didYouMean}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. LOADING & RESULTS CONTAINER (ZERO LAYOUT SHIFT / NO SHAKE) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {loading && opportunities.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-[#0b1320] border border-slate-800 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-slate-800 rounded-lg" />
                <div className="h-4 w-20 bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-4/5 bg-slate-800 rounded-lg" />
                <div className="h-4 w-1/2 bg-slate-800 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-4 bg-slate-800 rounded" />
                <div className="h-4 bg-slate-800 rounded" />
              </div>
              <div className="h-10 bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : error && opportunities.length === 0 ? (
        /* ──────────────────────────────────────────────────────────── */
        /* 9. HONEST ERROR STATE                                       */
        /* ──────────────────────────────────────────────────────────── */
        <div className="p-10 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Unable to load opportunities right now.</h3>
          <p className="text-xs text-slate-400">
            {error}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => performSearch(false, 1)}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Retry Search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : !loading && opportunities.length === 0 ? (
        /* ──────────────────────────────────────────────────────────── */
        /* 10. HONEST EMPTY STATE                                      */
        /* ──────────────────────────────────────────────────────────── */
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-5 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              No exact matches found.
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeQuery
                ? `No live job listings matched all specific criteria for "${activeQuery}". We never fabricate jobs to fill results.`
                : 'No live job listings matched your selected filters.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left text-xs text-slate-300 space-y-2">
            <span className="font-semibold text-slate-200">Try:</span>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Remote jobs</li>
              <li>Nearby locations</li>
              <li>Related job titles</li>
              <li>Broader experience range</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedLocation('remote');
                setPage(1);
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-950/80 border border-teal-800/60 text-teal-300 hover:bg-teal-900/80 font-semibold text-xs transition-colors cursor-pointer"
            >
              Try Remote Jobs
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLocation('all');
                setOpportunityType('all');
                setCategory('all');
                setPaidOnly(false);
                setFreshness('any');
                setPage(1);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Broader Range
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={handleRefreshFeed}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80 font-semibold text-xs transition-colors cursor-pointer"
            >
              Refresh Feeds
            </button>
          </div>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────── */
        /* 11. REAL SEARCH RESULT CARDS (Step 8 & 9 requirements)       */
        /* ──────────────────────────────────────────────────────────── */
        <div className={`space-y-6 transition-opacity duration-200 ${loading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
          {loading && (
            <div className="h-1 w-full bg-slate-800 overflow-hidden rounded-full">
              <div className="h-full bg-[#39E98A] w-1/3 animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{opportunities.length}</strong> of <strong className="text-white">{totalCount}</strong> live opportunities
            </span>
            <span className="text-[11px] text-slate-500">Sorted by: {sort}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => {
              const isSaved = savedIds.includes(opp.id);
              const compLabel = (opp.salary && opp.salary !== 'Salary not disclosed')
                ? opp.salary
                : (opp.compensation?.label && opp.compensation.label !== 'Flexible' && opp.compensation.label !== 'Pay not provided'
                  ? opp.compensation.label
                  : 'Salary not disclosed');
              const locationLabel = opp.location || (opp.remote ? 'Remote' : 'Location not specified');
              const providerLabel = opp.company || opp.provider || 'Company not disclosed';
              const jobUrl = opp.url || opp.sourceUrl;
              const postedTime = formatRelativeTime(opp.postedAt);
              const checkedTime = formatRelativeTime(opp.lastCheckedAt || opp.fetchedAt);
              const locationType = opp.locationType || (opp.remote ? 'Remote' : 'Exact City');
              const expLabel = opp.experienceLevel || 'Not specified';
              const isClosed = opp.status === 'closed' || opp.isClosed;

              return (
                <div
                  key={opp.id}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0b1320] border ${isClosed ? 'border-rose-900/40 opacity-75' : 'border-slate-800 hover:border-slate-700'} shadow-xl hover:shadow-2xl transition-all duration-200`}
                >
                  {/* Card Top: Badges & Source */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                          {opp.category || 'Job Listing'}
                        </span>
                        {/* Location Type Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          locationType === 'Remote'
                            ? 'bg-teal-950/80 border-teal-700/60 text-teal-300'
                            : locationType === 'Hybrid'
                            ? 'bg-blue-950/80 border-blue-700/60 text-blue-300'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}>
                          📍 {locationType}
                        </span>
                        {/* Experience Level Badge */}
                        {expLabel && expLabel !== 'Not specified' && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            expLabel.includes('Fresher') || expLabel.includes('Entry')
                              ? 'bg-emerald-950/70 border-emerald-800/50 text-emerald-300'
                              : 'bg-indigo-950/70 border-indigo-800/50 text-indigo-300'
                          }`}>
                            💼 {expLabel}
                          </span>
                        )}
                        {isClosed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-700/60 text-rose-300">
                            Closed / Expired
                          </span>
                        )}
                      </div>

                      {/* Source attribution & Link Verification */}
                      <div className="flex flex-col items-end gap-1 text-right">
                        <span
                          className="text-[10px] font-medium text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 truncate max-w-[140px]"
                          title={`Source: ${opp.source || 'Job Platform'}`}
                        >
                          Source: {opp.source || 'Platform'}
                        </span>
                        {opp.linkStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Link verified</span>
                          </span>
                        ) : opp.linkStatus === 'broken' ? (
                          <span className="text-[10px] font-semibold text-rose-400">
                            Link broken
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500" title="Valid link format, reachability unverified">
                            Link unverified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Company */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-1">
                        <span>{providerLabel}</span>
                      </p>
                    </div>

                    {/* Key Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 truncate" title={locationLabel}>
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{locationLabel}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300 truncate" title={opp.type || 'Full-time'}>
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{opp.type || 'Full-time'}</span>
                      </div>

                      <div className="col-span-2 flex items-center gap-1.5 text-emerald-300 font-semibold truncate pt-0.5" title={compLabel}>
                        <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{compLabel}</span>
                      </div>
                    </div>

                    {/* Freshness Row */}
                    {(postedTime || checkedTime) && (
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 border-t border-slate-850/60">
                        {postedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>Posted {postedTime}</span>
                          </span>
                        )}
                        {checkedTime && (
                          <span className="text-slate-500">
                            • Checked {checkedTime}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Explainable Recommendation Match Breakdown */}
                    {opp.matchExplanation && opp.matchExplanation.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-900/30 space-y-1.5">
                        <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                          <span>Strong match because:</span>
                          {opp.relevanceScore && (
                            <span className="text-[10px] text-slate-400 font-mono">Score: {opp.relevanceScore}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {opp.matchExplanation.map((reason, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-[10px] font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-md"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements / Skills Tags */}
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
                    {opp.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {opp.description}
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                    {/* View Job (Opens actual source URL directly) */}
                    <a
                      href={jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <span>View Job</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Save Button */}
                    <button
                      type="button"
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

          {/* Load More Pagination */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingMore ? 'Loading more…' : 'Load More Opportunities'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
