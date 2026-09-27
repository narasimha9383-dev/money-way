// src/components/PremiumHomePage.jsx
// Premium Minimal Editorial UI Overlay over Kage-Style 3D Opportunity Landscape
// The 3D Environment is the Hero across 100% of the page — including the Live Catalogue.
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Bookmark, 
  Send, 
  Sparkles, 
  Compass, 
  SlidersHorizontal,
  FileText, 
  ExternalLink,
  X,
  Briefcase,
  Laptop,
  GraduationCap,
  TrendingUp,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { getOpportunityImage } from '../services/imageMap.js';
import { chatAdvisor, searchOpportunities } from '../services/api.js';
import CinematicBackground from './CinematicBackground.jsx';
import { useAuth } from '../AuthContext.jsx';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function PremiumHomePage({
  userProfile,
  allOpportunities = [],
  recommendations = [],
  onSelectOpportunity,
  onSaveOpportunity,
  isSaved = () => false,
  onNavigateToTab,
  onOpenQuestionnaire,
  onStartPlan,
  onOpenExternalLink
}) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();

  // Navigation scroll state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Search state (Search bar over cinematic background)
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Recommended opportunities category filter
  const [oppFilter, setOppFilter] = useState('All');

  // AI Advisor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'advisor',
      text: 'Hello! I am your Income Advisor. Tell me what skills you have, your daily time budget, or starting capital. I will match you with verified, legitimate pathways.',
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Scroll detection for sticky navigation & 3D cinematic camera progress
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick search handler connected to backend API
  const handleExecuteSearch = async (e, queryOverride) => {
    if (e) e.preventDefault();
    const q = (queryOverride !== undefined ? queryOverride : searchInput).trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await searchOpportunities(q);
      setSearchResults(res.opportunities || []);
      scrollTo('recommended');
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchResults(null);
  };

  // AI Advisor send message
  const handleSendAdvisorChat = async (textOverride) => {
    const textToSend = (textOverride || chatInput).trim();
    if (!textToSend || chatLoading) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await chatAdvisor(textToSend, userProfile);
      const advisorReply = response?.reply || response?.text || 
        "Based on your profile, I recommend exploring zero-investment remote roles like virtual support or content moderation.";
      
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: advisorReply,
          platforms: response?.verifiedPlatforms || [],
          opportunities: response?.opportunities || [],
          prompts: response?.suggestedPrompts || [],
          timestamp: 'Just now'
        }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: "I'm currently unable to connect to the advisor service. Please browse the verified catalogue below.",
          platforms: [],
          opportunities: [],
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  // Smooth scroll helper
  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Real opportunities source: search results take precedence when active
  const baseOpportunities = searchResults !== null 
    ? searchResults 
    : (recommendations.length > 0 ? recommendations : allOpportunities);
  
  const filteredOpportunities = baseOpportunities.filter((opp) => {
    if (oppFilter === 'All') return true;
    if (oppFilter === 'Remote') {
      return opp.remote === true || opp.mode === 'Online' || opp.locationType === 'Remote' || (opp.location || '').toLowerCase() === 'remote' || opp.category === 'Zero-Investment';
    }
    if (oppFilter === 'Zero Investment') {
      return opp.investment?.min === 0 || opp.investment?.amount === 0 || opp.category === 'Zero-Investment' || opp.isAiSynthesized;
    }
    if (oppFilter === 'Part-Time') {
      return (opp.timeRequired?.label || '').toLowerCase().includes('part') || opp.type === 'Part-time' || (opp.timeRequired?.maxHoursPerDay && opp.timeRequired?.maxHoursPerDay <= 4);
    }
    if (oppFilter === 'Local') {
      return opp.locationType?.includes('Local') || opp.mode === 'Offline' || opp.category === 'Local / Offline';
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-transparent text-[#F5F7F5] selection:bg-[#39E98A] selection:text-[#070A0F] font-sans antialiased overflow-x-hidden">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* CONTINUOUS CINEMATIC 3D BACKGROUND (LIVING AMBIENT SCENE)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <CinematicBackground scrollProgress={scrollProgress} />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. MINIMAL STICKY NAVIGATION                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <nav 
        id="top"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#070A0F]/70 backdrop-blur-md border-b border-white/[0.06] shadow-xl shadow-black/70 py-3.5' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center group-hover:border-[#39E98A] transition-all">
              <svg className="w-4 h-4 text-[#39E98A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 3 7 7-3 3 5 5 9-9" />
                <path d="M14 3h7v7" />
              </svg>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#F5F7F5] flex items-center gap-1.5">
              <span>Money <span className="text-[#39E98A]">Way</span></span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-stone-300">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-lg text-[#39E98A] hover:bg-white/[0.04] transition-colors font-semibold cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigateToTab ? onNavigateToTab('search') : scrollTo('recommended')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Search
            </button>
            <button 
              onClick={() => onNavigateToTab ? onNavigateToTab('recommendations') : scrollTo('discover')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#39E98A]" />
              <span>Money Recommendation</span>
            </button>
            <button 
              onClick={() => onNavigateToTab ? onNavigateToTab('advisor') : scrollTo('advisor')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Advisor
            </button>
            <button 
              onClick={() => onNavigateToTab ? onNavigateToTab('profile') : openAuthModal('login')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Profile
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab ? onNavigateToTab('profile') : scrollTo('recommended')}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-[#39E98A]/50 transition-all text-xs text-[#F5F7F5]"
                  title="View Profile"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold max-w-[90px] truncate">{user?.name || 'User'}</span>
                  {isAdmin && <span className="text-[10px] font-bold text-purple-400 bg-purple-950/80 px-1 rounded">Admin</span>}
                </button>
                <button
                  onClick={() => onNavigateToTab ? onNavigateToTab('dashboard') : scrollTo('recommended')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#39E98A] text-[#070A0F] hover:bg-[#32d47c] transition-all cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-[#89938D] hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#89938D] hover:text-[#F5F7F5] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#39E98A] text-[#070A0F] hover:bg-[#32d47c] shadow-sm shadow-[#39E98A]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#89938D] hover:text-white hover:bg-white/[0.04]"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-5 bg-[#070A0F]/95 backdrop-blur-xl border-b border-white/[0.08] space-y-2 text-sm font-medium text-[#89938D]">
            <button 
              onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="block w-full text-left py-2 text-emerald-400 font-semibold"
            >
              Home
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigateToTab ? onNavigateToTab('search') : scrollTo('recommended'); }} 
              className="block w-full text-left py-2 hover:text-white"
            >
              Search
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigateToTab ? onNavigateToTab('recommendations') : scrollTo('discover'); }} 
              className="block w-full text-left py-2 hover:text-white flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#39E98A]" />
              <span>Money Recommendation</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigateToTab ? onNavigateToTab('advisor') : scrollTo('advisor'); }} 
              className="block w-full text-left py-2 hover:text-white"
            >
              Advisor
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigateToTab ? onNavigateToTab('profile') : openAuthModal('login'); }} 
              className="block w-full text-left py-2 hover:text-white"
            >
              Profile
            </button>
            <div className="pt-2 border-t border-white/[0.08]">
              {isAuthenticated ? (
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-[#F5F7F5] font-semibold truncate max-w-[180px]">{user?.name}</span>
                  <button onClick={logout} className="text-rose-400 flex items-center gap-1 cursor-pointer">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                    className="flex-1 py-2 rounded-lg bg-white/[0.05] text-xs font-semibold text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('signup'); }}
                    className="flex-1 py-2 rounded-lg bg-[#39E98A] text-xs font-bold text-slate-950"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. CINEMATIC HERO (EXACT OPPORTUNITY AI LAYOUT)               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-between px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        
        {/* Center Content */}
        <div className="max-w-4xl mx-auto w-full text-center space-y-6 relative z-10 pt-6 sm:pt-12">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono tracking-widest uppercase text-stone-300 mx-auto shadow-lg">
            <span>DISCOVER</span>
            <span className="text-[#39E98A]">✦</span>
            <span>LEARN</span>
            <span className="text-[#39E98A]">✦</span>
            <span>GROW</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7F5] leading-[1.08] drop-shadow-xl">
            The Right Opportunity <br className="hidden sm:inline" />
            <span className="text-[#39E98A]">is Closer Than You Think</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto font-normal drop-shadow">
            Find the best career, freelance, and business opportunities with the power of AI. Your future starts here.
          </p>

          {/* Search Bar (Rounded Pill Container from reference image) */}
          <div className="max-w-2xl mx-auto w-full pt-2">
            <form 
              onSubmit={handleExecuteSearch}
              className="relative p-1.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.12] hover:border-[#39E98A]/50 focus-within:border-[#39E98A] shadow-xl transition-all flex items-center gap-2"
            >
              <div className="pl-4 text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="What are you looking for? (e.g. remote jobs, skills, freelance...)"
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-0 px-2"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={searchLoading}
                className="w-10 h-10 rounded-full bg-[#39E98A] hover:bg-[#32d47c] text-[#070A0F] font-bold transition-all flex items-center justify-center shadow-md shadow-[#39E98A]/30 flex-shrink-0 cursor-pointer"
                aria-label="Search opportunities"
              >
                {searchLoading ? (
                  <span className="text-[10px]">...</span>
                ) : (
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </form>

            {/* Quick Category Chips (from the image: Jobs, Freelance, Skills, Business, More) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
              {[
                { id: 'jobs', label: 'Jobs', icon: Briefcase, q: 'Remote jobs' },
                { id: 'freelance', label: 'Freelance', icon: Laptop, q: 'Freelance' },
                { id: 'skills', label: 'Skills', icon: GraduationCap, q: 'Skills' },
                { id: 'business', label: 'Business', icon: TrendingUp, q: 'Business' },
                { id: 'more', label: 'More', icon: LayoutGrid, q: 'Part-time' }
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={(e) => {
                      setSearchInput(cat.q);
                      handleExecuteSearch(e, cat.q);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-[#39E98A]/50 text-stone-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 shadow-lg backdrop-blur-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Icon className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle Scroll Cue Indicator */}
        <div className="pt-10 pb-4 text-center flex flex-col items-center gap-2 text-[10px] font-mono tracking-widest text-stone-400/80 pointer-events-none relative z-10">
          <span>SCROLL TO EXPLORE OPPORTUNITIES</span>
          <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
            <span className="w-1 h-1.5 rounded-full bg-[#39E98A] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. PLATFORM VALUE PROPOSITION (HIGH-CONVERTING CARDS)        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div id="discover" className="relative z-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:border-[#39E98A]/50 transition-all duration-300 shadow-xl hover:-translate-y-1 space-y-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">100% Verified Escrow</h3>
            <p className="text-xs text-stone-300/80 leading-relaxed font-normal">
              Zero registration fees, upfront deposits, or scam listings. Every opportunity is vetted for guaranteed payouts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:border-[#39E98A]/50 transition-all duration-300 shadow-xl hover:-translate-y-1 space-y-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">AI Role Matching</h3>
            <p className="text-xs text-stone-300/80 leading-relaxed font-normal">
              Matches your skills, available hours, and financial targets to legitimate earning pathways instantly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:border-[#39E98A]/50 transition-all duration-300 shadow-xl hover:-translate-y-1 space-y-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Remote & Local Gigs</h3>
            <p className="text-xs text-stone-300/80 leading-relaxed font-normal">
              Global online freelance contracts, remote micro-tasks, and verified local neighborhood shifts near you.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:border-[#39E98A]/50 transition-all duration-300 shadow-xl hover:-translate-y-1 space-y-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Live Feed Ingestion</h3>
            <p className="text-xs text-stone-300/80 leading-relaxed font-normal">
              Daily curated feeds from Internshala, Upwork, and direct hiring partners with transparent compensation.
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. REAL BACKEND-DRIVEN RECOMMENDED OPPORTUNITIES              */}
      {/* (100% TRANSPARENT TO THE 3D LIVING METROPOLIS BACKGROUND)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="recommended" className="relative z-10 py-24 border-t border-white/[0.08] bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Out-of-the-box 3D Energy Flux Status Ribbon */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-[#39E98A]/30 text-xs text-stone-300 shadow-xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39E98A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39E98A]" />
              </span>
              <span className="text-[#F5F7F5] font-semibold">Live Opportunity Flux Active</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline">Verified earning streams descending into Bengaluru, Remote & Metro Hubs</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#39E98A]">
              <span>₹0 Upfront Required</span>
              <span>•</span>
              <span className="text-[#D8B56A]">Direct Escrow Protection</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#39E98A]">
                {searchResults !== null ? `Search Results (${filteredOpportunities.length})` : 'Live Opportunity Catalogue'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F5] tracking-tight">
                Recommended Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-[#89938D]">
                {searchResults !== null 
                  ? `Showing matches for "${searchInput}".`
                  : 'Real verified opportunities selected based on your profile constraints.'}
              </p>
            </div>

            {/* Category Filter Pills & Search Reset */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {searchResults !== null && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] font-medium flex items-center gap-1 border border-white/[0.1]"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Search</span>
                </button>
              )}

              {['All', 'Remote', 'Zero Investment', 'Part-Time', 'Local'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOppFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                    oppFilter === tab
                      ? 'bg-[#39E98A] text-[#070A0F] font-semibold shadow-sm shadow-[#39E98A]/30'
                      : 'bg-white/[0.02] border border-white/[0.1] text-stone-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid — High-End Glassmorphism over 3D City */}
          {filteredOpportunities.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.1] max-w-md mx-auto space-y-3">
              <h3 className="text-base font-semibold text-white">No opportunities found.</h3>
              <p className="text-xs text-[#89938D]">
                Try selecting a different filter category or reset your search query.
              </p>
              <button
                onClick={() => {
                  setOppFilter('All');
                  setSearchResults(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs font-medium text-white hover:bg-white/[0.12]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.slice(0, 9).map((opp) => {
                const imageUrl = getOpportunityImage(opp);
                const saved = isSaved(opp.id);

                return (
                  <div
                    key={opp.id}
                    className="group rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:border-[#39E98A]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_25px_rgba(57,233,138,0.2)]"
                  >
                    <div>
                      {/* Image Header with Badge Overlay */}
                      <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={opp.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/50 backdrop-blur-md text-[#39E98A] border border-white/[0.12]">
                            {opp.category || 'Verified'}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSaveOpportunity) onSaveOpportunity(opp.id);
                            }}
                            className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                              saved 
                                ? 'bg-rose-950/90 text-rose-400 border border-rose-800' 
                                : 'bg-black/50 text-stone-300 hover:text-white border border-white/[0.12]'
                            }`}
                            title={saved ? 'Saved' : 'Save opportunity'}
                          >
                            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3 text-left">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#89938D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#39E98A]" />
                          <span>{opp.locationType || 'Remote / Online'}</span>
                          <span>•</span>
                          <span>{opp.timeRequired?.label || 'Flexible'}</span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-[#39E98A] transition-colors line-clamp-1">
                          {opp.title}
                        </h3>

                        <p className="text-xs text-[#89938D] line-clamp-2 leading-relaxed">
                          {opp.howItWorks || opp.description || 'Verified income opportunity with transparent requirements and direct application access.'}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/[0.06]">
                          <div>
                            <span className="text-[10px] text-[#89938D] block">Investment:</span>
                            <span className="font-semibold text-[#39E98A]">
                              {opp.investment?.description?.split('.')[0] || '₹0 to start'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#89938D] block">Model:</span>
                            <span className="font-semibold text-white">
                              {opp.incomeModel || 'Project / Contract'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => onSelectOpportunity && onSelectOpportunity(opp)}
                        className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-[#39E98A] hover:text-[#070A0F] border border-white/[0.1] hover:border-transparent text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>View Opportunity Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. MINIMAL AI ADVISOR SECTION (TRANSLUCENT GLASS)            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="advisor" className="relative z-10 py-20 border-t border-white/[0.08] bg-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/[0.08] text-xs font-semibold text-[#39E98A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advisory Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F5] tracking-tight">
              Need personalized guidance?
            </h2>
            <p className="text-xs sm:text-sm text-[#89938D] max-w-md mx-auto leading-relaxed">
              Ask questions about your daily availability, equipment, or skills to match verified opportunities.
            </p>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              "How can I earn from Free Fire or mobile games safely?",
              "I have 2 hours daily and a smartphone. What can I do?",
              "Looking for weekend gigs in Bengaluru with no upfront costs.",
              "I know basic English & typing. Where should I start?"
            ].map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendAdvisorChat(promptText)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.1] text-xs text-stone-300 hover:text-white transition-all text-left"
              >
                "{promptText}"
              </button>
            ))}
          </div>

          {/* Minimal Chat Shell */}
          <div className="rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.1] shadow-xl text-left overflow-hidden">
            <div 
              ref={chatScrollRef}
              className="p-5 space-y-3 max-h-[300px] overflow-y-auto text-xs"
            >
              {chatMessages.map((msg, i) => {
                const isAdvisor = msg.sender === 'advisor';
                return (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2.5 ${isAdvisor ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAdvisor && (
                      <div className="w-6 h-6 rounded-md bg-[#39E98A]/10 border border-[#39E98A]/30 flex items-center justify-center text-[#39E98A] shrink-0 text-[10px] font-bold">
                        AI
                      </div>
                    )}
                    <div className={`rounded-xl px-4 py-2.5 text-xs leading-relaxed max-w-[88%] ${
                      isAdvisor 
                        ? 'bg-white/[0.05] border border-white/[0.1] text-[#F5F7F5]' 
                        : 'bg-[#39E98A] text-[#070A0F] font-medium'
                    }`}>
                      <div className="space-y-1.5">
                        {msg.text.split('\n').map((line, lIdx) => {
                          if (line.startsWith('### ')) {
                            return <div key={lIdx} className="font-bold text-white text-xs mt-2 mb-1">{line.slice(4)}</div>;
                          }
                          if (line.startsWith('---')) {
                            return <hr key={lIdx} className="border-white/10 my-1.5" />;
                          }
                          
                          // Format bold and markdown links
                          const parts = [];
                          const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
                          let lastIdx = 0;
                          let m;

                          while ((m = linkRegex.exec(line)) !== null) {
                            if (m.index > lastIdx) {
                              parts.push(line.substring(lastIdx, m.index));
                            }
                            if (m[1] && m[2]) {
                              parts.push(
                                <a
                                  key={`${lIdx}-${m.index}`}
                                  href={m[2]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#39E98A] underline font-semibold hover:text-[#5ef3a4] inline-flex items-center gap-0.5"
                                >
                                  <span>{m[1]}</span>
                                  <ExternalLink className="w-2.5 h-2.5 inline" />
                                </a>
                              );
                            } else if (m[3]) {
                              parts.push(<strong key={`${lIdx}-${m.index}`} className="font-semibold text-white">{m[3]}</strong>);
                            }
                            lastIdx = m.index + m[0].length;
                          }
                          if (lastIdx < line.length) {
                            parts.push(line.substring(lastIdx));
                          }

                          return (
                            <div key={lIdx} className={line.trim() === '' ? 'h-1.5' : ''}>
                              {parts}
                            </div>
                          );
                        })}
                      </div>

                      {/* Verified Platforms Links */}
                      {msg.platforms && msg.platforms.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1.5">
                          <div className="text-[10px] uppercase font-bold text-[#39E98A] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#39E98A]" />
                            <span>100% Verified Official Platforms:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {msg.platforms.map((p, pIdx) => (
                              <a
                                key={pIdx}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-[#39E98A]/10 border border-white/[0.08] hover:border-[#39E98A]/40 transition-colors group"
                              >
                                <span className="text-white group-hover:text-[#39E98A] font-medium text-[11px] truncate flex items-center gap-1">
                                  {p.name}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                                </span>
                                <span className="text-[9px] text-[#39E98A] bg-[#39E98A]/10 px-1.5 py-0.5 rounded font-mono shrink-0">Official</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Prompts */}
                      {msg.prompts && msg.prompts.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2.5 mt-2 border-t border-white/[0.06]">
                          {msg.prompts.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleSendAdvisorChat(chip)}
                              className="px-2 py-0.5 rounded bg-black/40 hover:bg-white/[0.1] text-[#39E98A] text-[10px] transition-colors"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-[#89938D]">
                  <span className="animate-pulse">Consulting verified opportunity database...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAdvisorChat();
              }}
              className="p-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your skills, schedule, or income goal..."
                className="flex-1 bg-white/[0.03] border border-white/[0.1] focus:border-[#39E98A]/50 rounded-xl px-4 py-2 text-xs text-white placeholder-[#89938D] focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#39E98A] text-[#070A0F] font-semibold text-xs hover:bg-[#32d47c] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. MINIMAL PREMIUM FOOTER (TRANSLUCENT GLASS)                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 border-t border-white/[0.08] bg-transparent text-xs text-[#89938D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.12] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#39E98A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 3 7 7-3 3 5 5 9-9" />
                <path d="M14 3h7v7" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-[#F5F7F5]">Money Way</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => scrollTo('discover')} className="hover:text-white transition-colors">
              Opportunities
            </button>
            <button onClick={() => scrollTo('verify')} className="hover:text-white transition-colors">
              Verification Standards
            </button>
            <button onClick={() => onNavigateToTab ? onNavigateToTab('scam-center') : scrollTo('verify')} className="hover:text-white transition-colors">
              Scam Shield Center
            </button>
            <button onClick={() => onNavigateToTab ? onNavigateToTab('admin') : null} className="hover:text-white transition-colors">
              Admin Portal
            </button>
          </div>

          <div className="text-[11px] text-[#89938D]">
            © {new Date().getFullYear()} Money Way. Zero false promises.
          </div>
        </div>
      </footer>

    </div>
  );
}
