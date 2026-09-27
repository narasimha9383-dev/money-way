// frontend/src/components/DiscoverOpportunitiesPage.jsx
// Section 22: Canonical Discover Page (/discover)
import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Navigation,
  ArrowRight,
  Building,
  CheckCircle2,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { 
  searchJobsApi, 
  fetchNearbyJobsApi, 
  fetchRecentJobsApi, 
  fetchRecommendedJobsApi,
  fetchSavedJobsApi 
} from '../services/api.js';
import JobCard from './JobCard.jsx';

export default function DiscoverOpportunitiesPage({
  userProfile,
  onSelectOpportunity,
  onNavigateToTab,
  onOpenExternalLink,
  isSaved = () => false,
  onSaveJob = () => {}
}) {
  const [searchInput, setSearchInput] = useState('');
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting (Section 22)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  // 11 Core Sectors from Section 6
  const POPULAR_CATEGORIES = [
    { id: 'Delivery / Logistics', label: 'Delivery / Logistics', icon: '🛵', query: 'delivery work' },
    { id: 'Hospitality', label: 'Hospitality & Catering', icon: '🍽️', query: 'catering hotel' },
    { id: 'Technology', label: 'Software & Technology', icon: '💻', query: 'software developer' },
    { id: 'Retail', label: 'Retail & Store Ops', icon: '🛍️', query: 'retail sales associate' },
    { id: 'Customer Service', label: 'Customer Support & BPO', icon: '🎧', query: 'customer support' },
    { id: 'Office', label: 'Back Office & Admin', icon: '📋', query: 'data entry office' },
    { id: 'Healthcare', label: 'Healthcare & Clinic', icon: '🏥', query: 'medical assistant' },
    { id: 'Education', label: 'Education & Tutoring', icon: '📚', query: 'tutor teacher' },
    { id: 'Skilled Work', label: 'Skilled Trades & Tech', icon: '🔧', query: 'electrician technician' },
    { id: 'Marketing', label: 'Marketing & Sales', icon: '📈', query: 'field sales marketing' },
    { id: 'Finance', label: 'Finance & Accounts', icon: '💳', query: 'accounts assistant' }
  ];

  // Natural query suggestions from Section 1 & 7
  const QUERY_EXAMPLES = [
    'I want delivery work near me',
    'Find software jobs for freshers',
    'I need evening part-time work',
    'Show catering jobs nearby',
    'Find warehouse jobs nearby',
    'I completed B.Tech and need a software job',
    'Find jobs paying above ₹20,000'
  ];

  useEffect(() => {
    // Load recently viewed from localStorage (Section 12)
    try {
      const storedViewed = JSON.parse(localStorage.getItem('moneyway_recently_viewed') || '[]');
      setRecentlyViewed(storedViewed.slice(0, 6));
    } catch {
      setRecentlyViewed([]);
    }

    const loadDiscoveryData = async () => {
      setLoading(true);
      try {
        const userLoc = userProfile?.city || userProfile?.location || (() => {
          try {
            return localStorage.getItem('moneyway_chosen_location') || '';
          } catch {
            return '';
          }
        })();
        const [nearbyRes, recentRes, recRes, savedRes] = await Promise.all([
          fetchNearbyJobsApi({ city: userLoc, limit: 4 }),
          fetchRecentJobsApi({ limit: 4 }),
          fetchRecommendedJobsApi({ profile: userProfile, limit: 4 }),
          fetchSavedJobsApi()
        ]);
        setNearbyJobs(nearbyRes?.jobs || []);
        setRecentJobs(recentRes?.jobs || []);
        setRecommendedJobs(recRes?.jobs || []);
        setSavedJobs(savedRes?.jobs || []);
      } catch (err) {
        console.error('Failed to load discover sections:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDiscoveryData();
  }, [userProfile]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() && onNavigateToTab) {
      onNavigateToTab('search', null, searchInput.trim());
    }
  };

  const handleSelectExampleQuery = (q) => {
    if (onNavigateToTab) {
      onNavigateToTab('search', null, q);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. GREETING & NATURAL DISCOVERY SEARCH                        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <span className="text-sm font-bold text-emerald-400 font-mono tracking-wider">
            {getGreeting()}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            What work are you looking for?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Search in your own words. We extract genuine requirements, verify employer application portals, and eliminate duplicate listings.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700 hover:border-emerald-500/80 focus-within:border-emerald-400 rounded-2xl p-1.5 shadow-xl transition-all">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. I need part-time catering work near me, or software jobs for freshers..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-0 px-3 py-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Natural search example chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] text-slate-500 font-semibold">Try:</span>
            {QUERY_EXAMPLES.slice(0, 4).map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectExampleQuery(ex)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                “{ex}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. NEARBY JOBS SECTION (Section 8, 22)                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Nearby Jobs
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('nearby')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View all nearby &amp; map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {nearbyJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nearbyJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectOpportunity}
                onSave={onSaveJob}
                isSaved={isSaved(job.id)}
                onOpenExternalLink={onOpenExternalLink}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
            No nearby jobs within immediate radius. <button onClick={() => onNavigateToTab && onNavigateToTab('nearby')} className="text-emerald-400 underline">Open Nearby Map</button>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. RECENTLY POSTED (Section 11, 22)                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recently Posted
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Prioritizing fresh postings</span>
        </div>

        {recentJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectOpportunity}
                onSave={onSaveJob}
                isSaved={isSaved(job.id)}
                onOpenExternalLink={onOpenExternalLink}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Scanning latest feeds...
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. RECOMMENDED FOR YOU (Section 15, 22)                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#39E98A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recommended For You
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Matched by measurable skills &amp; roles</span>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectOpportunity}
                onSave={onSaveJob}
                isSaved={isSaved(job.id)}
                onOpenExternalLink={onOpenExternalLink}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Set your preferences in your Profile to unlock tailored matches.
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. POPULAR JOB CATEGORIES (Section 6, 22)                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Popular Job Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {POPULAR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigateToTab && onNavigateToTab('search', null, cat.query)}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850 text-left transition-all group cursor-pointer shadow-md flex flex-col justify-between h-28"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {cat.label}
                </h4>
                <span className="text-[10px] text-slate-500">Explore openings →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. RECENTLY VIEWED (Section 12, 22)                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recently Viewed
            </h2>
            <span className="text-xs text-slate-500 font-mono">Your navigation history</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyViewed.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectOpportunity && onSelectOpportunity(item)}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-left cursor-pointer transition-all hover:bg-slate-850 space-y-1"
              >
                <span className="text-[10px] font-bold text-emerald-400 uppercase truncate block">
                  {item.sector || 'Opportunity'}
                </span>
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">{item.company}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. SAVED JOBS SHORTCUT (Section 13, 22)                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      {savedJobs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Saved Jobs ({savedJobs.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('saved')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View all saved</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {savedJobs.slice(0, 4).map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectOpportunity}
                onSave={onSaveJob}
                isSaved={true}
                onOpenExternalLink={onOpenExternalLink}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
