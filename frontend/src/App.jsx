// src/App.jsx
import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar.jsx';
import LeftSidebar from './components/LeftSidebar.jsx';
import RightSidebar from './components/RightSidebar.jsx';
import SmartQuestionnaire from './components/SmartQuestionnaire.jsx';
import PersonalizedResults from './components/PersonalizedResults.jsx';
import OpportunityDetailModal from './components/OpportunityDetailModal.jsx';
import SearchOpportunitiesPage from './components/SearchOpportunitiesPage.jsx';
import NearbyJobsPage from './components/NearbyJobsPage.jsx';
import JobAlertsPage from './components/JobAlertsPage.jsx';
import OpportunityComparison from './components/OpportunityComparison.jsx';
import ActionPlanTracker from './components/ActionPlanTracker.jsx';
import ScamCenter from './components/ScamCenter.jsx';
import AIIncomeAdvisor from './components/AIIncomeAdvisor.jsx';
import PersonalDashboard from './components/PersonalDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import LinkSafetyModal from './components/LinkSafetyModal.jsx';
import PremiumHomePage from './components/PremiumHomePage.jsx';
import DetailsOfOrganizationPage from './components/DetailsOfOrganizationPage.jsx';
import MoneyRecommendationHub from './components/MoneyRecommendationHub.jsx';
import AuthModal from './components/AuthModal.jsx';
import RealtimeNotificationToast from './components/RealtimeNotificationToast.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from './AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';

import {
  fetchOpportunities,
  fetchRecommendations,
  fetchSurpriseOpportunity,
  searchOpportunities,
  refreshOpportunities,
  aiDiscoverOpportunities,
  reportNotInterested,
  undoNotInterested,
  sendFeedback,
  fetchJobDetailApi
} from './services/api.js';

import {
  Home,
  Compass,
  Search,
  Bookmark,
  CheckSquare,
  User,
  AlertCircle,
  Undo2,
  X,
  Loader2,
  Sparkles,
  ShieldAlert,
  MapPin,
  Bell,
  Building2
} from 'lucide-react';

export default function App() {
  const { theme, isDark } = useTheme();
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    isAdmin,
    savedIds: authSavedIds,
    toggleSaveOpportunity,
    openAuthModal,
    updateUserProfile
  } = useAuth();

  const getInitialRoute = () => {
    try {
      const parts = window.location.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
      const first = (parts[0] || '').toLowerCase();
      const second = parts[1] || '';
      const validSubTabs = ['generator', 'analyzer', 'matcher', 'mapper', 'assistant', 'compare'];

      // Nearby route aliases (Jobs Near You / Jobs Near Me / Nearby)
      if (
        first === 'jobs-near-you' ||
        first === 'jobsnearyou' ||
        first === 'jobs-near-me' ||
        first === 'jobsnearme' ||
        first === 'nearby-jobs' ||
        first === 'nearby' ||
        (first === 'jobs' && (second === 'nearby' || second === 'near-you' || second === 'near-me'))
      ) {
        return { tab: 'nearby', subTab: 'generator' };
      }

      // Search route aliases (/search, /find-jobs, /jobs/search)
      if (
        first === 'search' ||
        first === 'find-jobs' ||
        first === 'findjobs' ||
        (first === 'jobs' && (second === 'search' || second === 'find'))
      ) {
        return { tab: 'search', subTab: 'generator' };
      }

      if (first === 'jobs' && second) {
        return { tab: 'discover', subTab: 'generator', initialJobId: decodeURIComponent(second) };
      }

      if (first === 'recommendations' || first === 'money-recommendation') {
        const sub = validSubTabs.includes(second.toLowerCase()) ? second.toLowerCase() : 'generator';
        return { tab: 'recommendations', subTab: sub };
      }
      if (validSubTabs.includes(first)) {
        return { tab: 'recommendations', subTab: first };
      }

      if (first === 'detailsoforganization' || first === 'details-of-organization' || first === 'organization' || first === 'organizations') {
        return { tab: 'detailsOfOrganization', subTab: 'generator' };
      }

      const validTabs = [
        'home',
        'discover',
        'detailsOfOrganization',
        'search',
        'nearby',
        'saved',
        'alerts',
        'compare',
        'plans',
        'scam-center',
        'advisor',
        'dashboard',
        'profile',
        'admin',
        'recommendations'
      ];
      if (first && validTabs.includes(first)) {
        return { tab: first, subTab: 'generator' };
      }
    } catch {
      // ignore
    }
    return { tab: 'home', subTab: 'generator' };
  };

  const getInitialSearchQuery = () => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || params.get('query') || '';
      }
    } catch {}
    return '';
  };

  const initialRoute = getInitialRoute();
  const [currentTab, setCurrentTab] = useState(initialRoute.tab);
  const [recommendationSubTab, setRecommendationSubTab] = useState(initialRoute.subTab);
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);

  // If initial route points to /jobs/:id, load the job on mount
  useEffect(() => {
    if (initialRoute.initialJobId) {
      fetchJobDetailApi(initialRoute.initialJobId)
        .then(res => {
          if (res && res.job) {
            setSelectedOpportunityForDetail(res.job);
          }
        })
        .catch(err => console.error('Failed to load initial job:', err));
    }
  }, []);

  const handleNavigateTab = (tab, subTab, query) => {
    setShowQuestionnaire(false);
    if (tab === 'recommendations' || tab === 'money-recommendation') {
      setCurrentTab('recommendations');
      const targetSub = subTab || recommendationSubTab || 'generator';
      setRecommendationSubTab(targetSub);
      try {
        const newPath = targetSub ? `/recommendations/${targetSub}` : '/recommendations';
        if (window.location.pathname !== newPath) {
          window.history.pushState({ tab: 'recommendations', subTab: targetSub }, '', newPath);
        }
      } catch {
        // ignore
      }
      return;
    }
    
    setCurrentTab(tab);
    if (tab === 'search') {
      const q = typeof query === 'string' ? query : searchQuery;
      if (typeof query === 'string') {
        setSearchQuery(query);
      }
      try {
        const newPath = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
        if (window.location.pathname + window.location.search !== newPath) {
          window.history.pushState({ tab: 'search', query: q }, '', newPath);
        }
      } catch {
        // ignore
      }
      return;
    }

    try {
      const newPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ tab }, '', newPath);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setCurrentTab(route.tab);
      setRecommendationSubTab(route.subTab);
      try {
        const params = new URLSearchParams(window.location.search);
        setSearchQuery(params.get('q') || params.get('query') || '');
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [complexityMode, setComplexityMode] = useState('all');
  const [modeFilter, setModeFilter] = useState('Both');
  const [loading, setLoading] = useState(false);

  // Search state (Sections 1, 2, 3, 4, 17, 18, 19, 22)
  const [searchMode, setSearchMode] = useState('ai'); // 'standard' | 'ai'
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // null = no search active
  const [searchCount, setSearchCount] = useState(0);
  const [searchError, setSearchError] = useState(null);
  const [didYouMean, setDidYouMean] = useState(null);
  const [parsedSearchFilters, setParsedSearchFilters] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ budget: '', workType: '', experience: '' });
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [aiDiscoverLoading, setAiDiscoverLoading] = useState(false);
  const [undoToast, setUndoToast] = useState(null); // { opportunityId, title }

  // User Profile with explicit isProfileCompleted flag (Sections 6, 7, 8)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_user_profile');
      if (saved) return JSON.parse(saved);
      return {
        name: 'Explorer',
        isProfileCompleted: false
      };
    } catch {
      return {
        name: 'Explorer',
        isProfileCompleted: false
      };
    }
  });

  // Saved and Rejected state
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_saved_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize profile and saved items when user authentication state changes
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        ...(user.profileData || {}),
        name: user.name || prev.name,
        email: user.email,
        isProfileCompleted: user.profileData?.isProfileCompleted ?? prev.isProfileCompleted
      }));
      if (user.savedOpportunities && Array.isArray(user.savedOpportunities)) {
        setSavedIds(user.savedOpportunities);
      }
    }
  }, [user]);

  const [rejectedIds, setRejectedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_rejected_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedOpportunityForDetail, setSelectedOpportunityForDetail] = useState(null);
  const [activeOpportunityForPlan, setActiveOpportunityForPlan] = useState(null);

  // Global Link Safety Modal state — ALL external links go through this (Section 7)
  const [externalLinkState, setExternalLinkState] = useState(null);

  const openExternalLink = (url, platformName) => {
    setExternalLinkState({ url, platformName });
  };

  const closeExternalLink = () => {
    setExternalLinkState(null);
  };

  // Load all opportunities initially
  useEffect(() => {
    fetchOpportunities()
      .then((res) => {
        setAllOpportunities(res.opportunities || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch recommendations whenever profile is completed and changes
  useEffect(() => {
    if (userProfile && userProfile.isProfileCompleted) {
      loadRecommendations();
    }
  }, [userProfile, modeFilter, complexityMode, rejectedIds]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetchRecommendations(userProfile, {
        rejectedIds,
        modeFilter,
        complexityMode,
        limit: 12
      });
      setRecommendations(res.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real Search Execution with Standard & AI Modes (Sections 1, 2, 3, 4, 13, 17, 18, 19, 22)
  const handleExecuteSearch = async (queryText, filters = searchFilters, mode = searchMode) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();

    if (currentTab !== 'home') {
      setCurrentTab('home');
    }
    setSearchLoading(true);
    setSearchError(null);
    setSearchQuery(q);
    setSearchMode(mode);

    try {
      const params = { 
        q, 
        searchMode: mode,
        profile: userProfile && userProfile.isProfileCompleted ? userProfile : undefined
      };
      if (filters.budget !== '' && filters.budget !== undefined) params.budget = filters.budget;
      if (filters.workType) params.workType = filters.workType;
      if (filters.experience) params.experience = filters.experience;

      const res = await searchOpportunities(params);
      setSearchResults(res.opportunities || []);
      setSearchCount(res.total || 0);
      setDidYouMean(res.didYouMean || null);
      setParsedSearchFilters(res.parsedFilters || null);

      setTimeout(() => {
        const el = document.getElementById('search-results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Search is temporarily unavailable.');
      setSearchResults([]);
      setSearchCount(0);
      setDidYouMean(null);
      setParsedSearchFilters(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...searchFilters, [key]: value };
    setSearchFilters(updated);
    if (searchQuery) {
      handleExecuteSearch(searchQuery, updated, searchMode);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchCount(0);
    setSearchError(null);
    setDidYouMean(null);
    setParsedSearchFilters(null);
    setSearchFilters({ budget: '', workType: '', experience: '' });
  };

  // Refresh Opportunities handler (Sections 13, 16, 17)
  const handleRefreshOpportunities = async (filters = searchFilters) => {
    if (!userProfile) return null;
    setRefreshLoading(true);
    try {
      const currentIds = recommendations.map(r => r.id);
      const res = await refreshOpportunities({
        profile: userProfile,
        excludeIds: currentIds,
        rejectedIds,
        filters
      });

      const newItems = res.freshOpportunities || [];
      if (newItems.length > 0) {
        setRecommendations(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const fresh = newItems.filter(item => !existingIds.has(item.id));
          return [...fresh, ...prev];
        });
      }
      return res;
    } catch (err) {
      console.error('Refresh opportunities error:', err);
      return null;
    } finally {
      setRefreshLoading(false);
    }
  };

  // AI Discover handler (Sections 19, 20)
  const handleAIDiscover = async () => {
    if (!userProfile) return;
    setAiDiscoverLoading(true);
    try {
      const currentIds = recommendations.map(r => r.id);
      const res = await aiDiscoverOpportunities({
        profile: userProfile,
        activeSearchQuery: searchQuery,
        filters: searchFilters,
        viewedIds: currentIds,
        rejectedIds
      });

      const discoveries = res.discoveries || [];
      if (discoveries.length > 0) {
        setRecommendations(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const fresh = discoveries.filter(d => !existingIds.has(d.id));
          return [...fresh, ...prev];
        });
      }
    } catch (err) {
      console.error('AI Discover error:', err);
    } finally {
      setAiDiscoverLoading(false);
    }
  };

  // Discover More handler with duplicate prevention (Sections 14 & 15)
  const handleDiscoverMore = async () => {
    if (!userProfile) return;
    setDiscoverLoading(true);
    try {
      const currentIds = recommendations.map(r => r.id);
      const res = await fetchRecommendations(userProfile, {
        rejectedIds,
        excludeIds: currentIds,
        modeFilter,
        complexityMode,
        limit: 6
      });
      const newItems = res.recommendations || [];
      if (newItems.length > 0) {
        setRecommendations(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const fresh = newItems.filter(item => !existingIds.has(item.id));
          if (fresh.length > 0) {
            return [...fresh, ...prev.filter(p => !fresh.some(f => f.id === p.id))];
          }
          return newItems;
        });
      } else {
        await loadRecommendations();
      }
    } catch (err) {
      console.error('Discover more error:', err);
    } finally {
      setDiscoverLoading(false);
    }
  };

  // Not Interested handler with Undo (Section 26)
  const handleNotInterested = async (oppId, reason = 'Not relevant') => {
    const targetOpp = allOpportunities.find(o => o.id === oppId) || recommendations.find(o => o.id === oppId);
    const title = targetOpp?.title || 'Opportunity';

    // Store in rejected list and state
    const updated = [...rejectedIds, oppId];
    setRejectedIds(updated);
    localStorage.setItem('incomepath_rejected_ids', JSON.stringify(updated));

    // Remove from active recommendations & search results
    setRecommendations(prev => prev.filter(o => o.id !== oppId));
    if (searchResults) {
      setSearchResults(prev => prev.filter(o => o.id !== oppId));
    }

    try {
      await reportNotInterested({ opportunityId: oppId, reason });
    } catch (e) {
      console.error(e);
    }

    // Show undo toast notification for 6 seconds
    setUndoToast({ opportunityId: oppId, title });
    setTimeout(() => {
      setUndoToast(prev => (prev?.opportunityId === oppId ? null : prev));
    }, 6000);
  };

  const handleUndoNotInterested = async (oppId) => {
    const updated = rejectedIds.filter(id => id !== oppId);
    setRejectedIds(updated);
    localStorage.setItem('incomepath_rejected_ids', JSON.stringify(updated));
    setUndoToast(null);

    try {
      await undoNotInterested({ opportunityId: oppId });
    } catch (e) {
      console.error(e);
    }

    // Reload recommendations
    loadRecommendations();
  };

  const handleCompleteQuestionnaire = async (finishedProfile) => {
    const updated = { 
      ...userProfile, 
      ...finishedProfile, 
      isProfileCompleted: true 
    };
    setUserProfile(updated);
    localStorage.setItem('incomepath_user_profile', JSON.stringify(updated));
    if (isAuthenticated) {
      try {
        await updateUserProfile(finishedProfile, user?.name);
      } catch (err) {
        console.error('Failed to sync questionnaire to server:', err);
      }
    }
    setShowQuestionnaire(false);
    setCurrentTab('home');
  };

  const handleSaveOpportunity = async (oppId) => {
    if (isAuthenticated) {
      const isNowSaved = await toggleSaveOpportunity(oppId);
      setSavedIds(prev => isNowSaved ? (prev.includes(oppId) ? prev : [...prev, oppId]) : prev.filter(id => id !== oppId));
    } else {
      let updated;
      if (savedIds.includes(oppId)) {
        updated = savedIds.filter(id => id !== oppId);
      } else {
        updated = [...savedIds, oppId];
      }
      setSavedIds(updated);
      localStorage.setItem('incomepath_saved_ids', JSON.stringify(updated));
    }
  };

  const handleRejectOpportunity = (oppId) => {
    handleNotInterested(oppId, 'Marked not interested from cards');
  };

  const handleSurpriseMe = async () => {
    const currentIds = recommendations.map(r => r.id);
    try {
      const res = await fetchSurpriseOpportunity(userProfile, currentIds, rejectedIds);
      if (res.found && res.opportunity) {
        setSelectedOpportunityForDetail(res.opportunity);
      } else {
        alert("No additional unexpected opportunities matched your hard budget/time constraints.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCompare = (opp) => {
    if (compareList.some(item => item.id === opp.id)) {
      setCompareList(compareList.filter(item => item.id !== opp.id));
    } else {
      if (compareList.length >= 4) {
        alert("You can compare up to 4 opportunities simultaneously.");
        return;
      }
      setCompareList([...compareList, opp]);
    }
  };

  const handleStartPlan = (opp) => {
    setActiveOpportunityForPlan(opp);
    setSelectedOpportunityForDetail(null);
    setCurrentTab('plans');
  };

  const handleFeedback = (opportunityId, useful, reason) => {
    sendFeedback({ opportunityId, useful, reason });
    if (!useful) {
      handleNotInterested(opportunityId, reason);
    }
  };

  const savedOpportunities = allOpportunities.filter(o => savedIds.includes(o.id));

  // Loading state during initial authentication session restoration
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080A0C] flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-xl shadow-emerald-950/60 animate-pulse">
          <div className="w-full h-full bg-[#080A0C] rounded-[14px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#39E98A] animate-spin" />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Money Way · Restoring session...
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080A0C] text-[#F5F7F5]' : 'bg-[#F8FAFC] text-[#0F172A]'} flex flex-col font-sans selection:bg-[#39E98A] selection:text-[#080A0C] transition-colors duration-200`}>
      {currentTab === 'home' && !showQuestionnaire ? (
        <PremiumHomePage
          userProfile={userProfile}
          allOpportunities={allOpportunities}
          recommendations={recommendations}
          onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
          onSaveOpportunity={handleSaveOpportunity}
          isSaved={(id) => savedIds.includes(id)}
          onNavigateToTab={handleNavigateTab}
          onOpenQuestionnaire={() => setShowQuestionnaire(true)}
          onStartPlan={handleStartPlan}
          onOpenExternalLink={openExternalLink}
          compareList={compareList}
          onAddToCompare={handleAddToCompare}
        />
      ) : (
        <>
          {/* 1. Top Header Bar */}
          <HeaderBar
            userProfile={userProfile}
            currentTab={currentTab}
            currentSubTab={recommendationSubTab}
            savedCount={savedIds.length}
            compareCount={compareList.length}
            onOpenQuestionnaire={() => setShowQuestionnaire(true)}
            onNavigateToTab={handleNavigateTab}
            onSelectJob={(job) => setSelectedOpportunityForDetail(job)}
          />

          {/* 2. Main Layout with Responsive Multi-Column Structure */}
          <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
            {/* Left Navigation Sidebar (Desktop & Large screens) */}
            <LeftSidebar
              currentTab={currentTab}
              onNavigateToTab={handleNavigateTab}
              currentSubTab={recommendationSubTab}
              savedCount={savedIds.length}
              compareCount={compareList.length}
              onOpenQuestionnaire={() => setShowQuestionnaire(true)}
            />

            {/* Center Main Stage (Device-Adaptive Padding) */}
            <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-8">
              {showQuestionnaire ? (
                <div className="max-w-4xl mx-auto">
                  <SmartQuestionnaire
                    initialProfile={userProfile}
                    onComplete={handleCompleteQuestionnaire}
                    onCancel={() => setShowQuestionnaire(false)}
                  />
                </div>
              ) : (
                <>
                  {/* Personal Dashboard & Profile Tab */}
                  {(currentTab === 'dashboard' || currentTab === 'profile') && (
                    <PersonalDashboard
                      userProfile={userProfile}
                      savedIds={savedIds}
                      rejectedIds={rejectedIds}
                      allOpportunities={allOpportunities}
                      onOpenQuestionnaire={() => setShowQuestionnaire(true)}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                      onRemoveSaved={handleSaveOpportunity}
                      onNavigateToTab={handleNavigateTab}
                    />
                  )}

                  {/* Details of Organization / Discover: Organization Explorer & Verified Intelligence */}
                  {(currentTab === 'discover' || currentTab === 'detailsOfOrganization') && (
                    <DetailsOfOrganizationPage
                      userProfile={userProfile}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                      onOpenExternalLink={openExternalLink}
                      onNavigateToTab={handleNavigateTab}
                      isSaved={(id) => savedIds.includes(id)}
                      onSaveJob={handleSaveOpportunity}
                    />
                  )}

                  {/* Saved Opportunities View */}
                  {currentTab === 'saved' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white font-heading">
                          Saved Opportunities ({savedOpportunities.length})
                        </h2>
                        <p className="text-xs text-slate-400">
                          Opportunities you bookmarked for review and execution.
                        </p>
                      </div>

                      {savedOpportunities.length === 0 ? (
                        <div className="p-12 text-center bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 max-w-md mx-auto">
                          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                          <h3 className="text-base font-bold text-white">No saved opportunities yet</h3>
                          <p className="text-xs text-slate-400">
                            Browse recommendations and click the Bookmark button on any opportunity to save it here.
                          </p>
                          <button
                            onClick={() => setCurrentTab('home')}
                            className="px-4 py-2 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            Explore Opportunities
                          </button>
                        </div>
                      ) : (
                        <PersonalizedResults
                          recommendations={savedOpportunities}
                          profile={userProfile}
                          onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                          onSaveOpportunity={handleSaveOpportunity}
                          onRejectOpportunity={handleRejectOpportunity}
                          isSaved={(id) => savedIds.includes(id)}
                          onDiscoverMore={handleDiscoverMore}
                          onSurpriseMe={handleSurpriseMe}
                          onAddToCompare={handleAddToCompare}
                          isCompared={(id) => compareList.some(item => item.id === id)}
                          onFeedback={handleFeedback}
                          modeFilter={modeFilter}
                          setModeFilter={setModeFilter}
                          complexityMode={complexityMode}
                          setComplexityMode={setComplexityMode}
                          onOpenQuestionnaire={() => setShowQuestionnaire(true)}
                          loading={false}
                          onOpenExternalLink={openExternalLink}
                          initialSearchQuery=""
                        />
                      )}
                    </div>
                  )}

                  {/* Dynamic Real-Data Search Page */}
                  {currentTab === 'search' && (
                    <SearchOpportunitiesPage
                      userProfile={userProfile}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                      onNavigateToTab={handleNavigateTab}
                      initialQuery={searchQuery}
                    />
                  )}

                  {/* Real-Data Nearby Jobs with Map and Distance Badges */}
                  {currentTab === 'nearby' && (
                    <NearbyJobsPage
                      userProfile={userProfile}
                      onSelectJob={(job) => setSelectedOpportunityForDetail(job)}
                    />
                  )}

                  {/* Real-Time Job Alerts & Notification Center */}
                  {currentTab === 'alerts' && (
                    <JobAlertsPage
                      userProfile={userProfile}
                      onSelectJob={(job) => setSelectedOpportunityForDetail(job)}
                      onNavigateToTab={handleNavigateTab}
                    />
                  )}

                  {/* Money Recommendation Hub (6 AI-Powered Sub-Tools: Generator, Analyzer, Personal Match, Skill Mapper, Assistant Chat, Comparison Matrix) */}
                  {currentTab === 'recommendations' && (
                    <MoneyRecommendationHub
                      userProfile={userProfile}
                      activeSubTab={recommendationSubTab}
                      onSelectSubTab={(sub) => {
                        setRecommendationSubTab(sub);
                        try {
                          window.history.pushState({ tab: 'recommendations', subTab: sub }, '', `/recommendations/${sub}`);
                        } catch {}
                      }}
                      onNavigateToTab={handleNavigateTab}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                    />
                  )}

                  {/* Compare View */}
                  {currentTab === 'compare' && (
                    <OpportunityComparison
                      compareList={compareList}
                      onRemoveFromCompare={(id) => setCompareList(compareList.filter(o => o.id !== id))}
                      onClearCompare={() => setCompareList([])}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                      onStartPlan={handleStartPlan}
                    />
                  )}

                  {/* Action Plan Tracker */}
                  {currentTab === 'plans' && (
                    <ActionPlanTracker
                      activeOpportunity={activeOpportunityForPlan}
                      onSelectOpportunity={(opp) => setSelectedOpportunityForDetail(opp)}
                      onNavigateToTab={(tab) => setCurrentTab(tab)}
                      onOpenExternalLink={openExternalLink}
                    />
                  )}

                  {/* Scam Shield Center */}
                  {currentTab === 'scam-center' && (
                    <ScamCenter onOpenExternalLink={openExternalLink} />
                  )}

                  {/* AI Income Advisor */}
                  {currentTab === 'advisor' && (
                    <AIIncomeAdvisor
                      userProfile={userProfile}
                      onOpenQuestionnaire={() => setShowQuestionnaire(true)}
                      onOpenExternalLink={openExternalLink}
                    />
                  )}

                  {/* Admin Dashboard */}
                  {currentTab === 'admin' && (
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard
                        allOpportunities={allOpportunities}
                        onOpportunityUpdated={(updatedOpp) => {
                          if (!updatedOpp) return;
                          setAllOpportunities(prev => {
                            const idx = prev.findIndex(o => o.id === updatedOpp.id);
                            if (idx >= 0) {
                              const copy = [...prev];
                              copy[idx] = updatedOpp;
                              return copy;
                            }
                            return [updatedOpp, ...prev];
                          });
                        }}
                        onOpenExternalLink={openExternalLink}
                      />
                    </ProtectedRoute>
                  )}
                </>
              )}
            </main>
          </div>
        </>
      )}

      {/* Opportunity Detail Full Guide Modal */}
      {selectedOpportunityForDetail && (
        <OpportunityDetailModal
          opportunity={selectedOpportunityForDetail}
          userProfile={userProfile}
          onClose={() => setSelectedOpportunityForDetail(null)}
          onSave={handleSaveOpportunity}
          isSaved={(id) => savedIds.includes(id)}
          onAddToCompare={handleAddToCompare}
          isCompared={(id) => compareList.some(item => item.id === id)}
          onStartPlan={handleStartPlan}
          onOpenExternalLink={openExternalLink}
        />
      )}

      {/* Global External Link Safety Modal (Section 7) */}
      {externalLinkState && (
        <LinkSafetyModal
          url={externalLinkState.url}
          platformName={externalLinkState.platformName}
          onClose={closeExternalLink}
          onConfirm={() => {
            window.open(externalLinkState.url, '_blank', 'noopener,noreferrer');
            closeExternalLink();
          }}
        />
      )}

      {/* Undo "Not Interested" Toast (Section 26) */}
      {undoToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <span className="text-xs text-slate-300">
            Hidden <strong className="text-white">"{undoToast.title}"</strong>
          </span>
          <button
            onClick={() => handleUndoNotInterested(undoToast.opportunityId)}
            className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Undo2 className="w-3 h-3" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => setUndoToast(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar (Phone & Tablet safe area) */}
      {currentTab !== 'home' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080A0C]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-2 flex items-center justify-around text-[10px] font-medium text-slate-400 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl">
          <button
            onClick={() => handleNavigateTab('home')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'home' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavigateTab('detailsOfOrganization')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'discover' || currentTab === 'detailsOfOrganization' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Organizations</span>
          </button>
          <button
            onClick={() => handleNavigateTab('search')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'search' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => handleNavigateTab('nearby')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'nearby' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Nearby</span>
          </button>
          <button
            onClick={() => handleNavigateTab('alerts')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'alerts' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
          </button>
          <button
            onClick={() => handleNavigateTab('saved')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'saved' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
          <button
            onClick={() => handleNavigateTab('profile')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'profile' ? 'text-[#39E98A] font-bold' : 'hover:text-white'}`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      )}

      {/* Global Authentication Modal (Login / Signup / Account Linking) */}
      <AuthModal />

      {/* Global Realtime Notification Toast */}
      <RealtimeNotificationToast onSelectJob={(job) => setSelectedOpportunityForDetail(job)} />
    </div>
  );
}
