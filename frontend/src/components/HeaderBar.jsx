// src/components/HeaderBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import MoneyWayLogo from './MoneyWayLogo.jsx';
import { 
  Moon, 
  Sun, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  LogOut, 
  User, 
  Bookmark, 
  CheckSquare, 
  ShieldAlert, 
  ChevronDown,
  ChevronRight,
  Menu,
  Home,
  Search,
  Bot,
  SearchCode,
  Target,
  Brain,
  MessageSquare,
  Scale,
  Compass,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { userAvatarImage } from '../services/imageMap.js';
import NotificationTray from './NotificationTray.jsx';

export default function HeaderBar({ 
  currentTab = 'home',
  currentSubTab = 'generator',
  savedCount = 0,
  compareCount = 0,
  onOpenQuestionnaire,
  onNavigateToTab,
  onSelectJob
}) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, savedIds } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerRecsExpanded, setDrawerRecsExpanded] = useState(true);
  const userMenuRef = useRef(null);

  const subItems = [
    { id: 'generator', label: 'Generator', icon: Bot },
    { id: 'analyzer', label: 'Analyzer', icon: SearchCode },
    { id: 'matcher', label: 'Personal Match', icon: Target },
    { id: 'mapper', label: 'Skill Mapper', icon: Brain },
    { id: 'assistant', label: 'Assistant Chat', icon: MessageSquare },
    { id: 'compare', label: 'Comparison Matrix', icon: Scale }
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const userName = user?.name || 'Explorer';
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;
  const effectiveSavedCount = savedIds?.length || savedCount;

  const handleNav = (tab, subTab) => {
    setMobileDrawerOpen(false);
    if (onNavigateToTab) {
      onNavigateToTab(tab, subTab);
    }
  };

  const isRecActive = currentTab === 'recommendations' || currentTab === 'money-recommendation';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0b1320]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors">
        <div className="flex items-center justify-between max-w-[1700px] mx-auto">
          
          {/* Left: Mobile/Tablet Menu Button + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Hamburger button for phones & tablets */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Tagline */}
            <div 
              onClick={() => handleNav('home')}
              className="cursor-pointer group"
            >
              <MoneyWayLogo size="md" />
            </div>
          </div>

          {/* Right Tools: Theme, Notifications, User Profile / Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Dark / Bright Mode Toggle */}
            <button 
              type="button"
              onClick={toggleTheme}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                  : 'bg-amber-50 border-amber-300 text-amber-600 hover:text-amber-800 hover:bg-amber-100 shadow-sm'
              }`}
              title={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              )}
            </button>

            {/* Realtime Live Notifications Tray */}
            <NotificationTray 
              onSelectJob={onSelectJob} 
              onNavigateToTab={onNavigateToTab} 
            />

            {/* DYNAMIC AUTH / USER PROFILE MENU */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-600/50 cursor-pointer transition-all group"
                  title="Account Menu"
                >
                  <img 
                    src={userAvatar} 
                    alt={userName}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-emerald-500/50"
                    onError={(e) => { e.target.src = userAvatarImage; }}
                  />
                  <div className="hidden xs:flex flex-col text-left leading-none">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors max-w-[85px] sm:max-w-[110px] truncate">
                      {userName}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-medium mt-0.5 ${isAdmin ? 'text-purple-400 font-bold' : 'text-slate-400'}`}>
                      {isAdmin ? 'Admin' : 'Explorer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                    <div className="p-3 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{userName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isAdmin 
                            ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {isAdmin ? 'Administrator' : 'Verified Explorer'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs text-slate-300">
                      <button
                        onClick={() => { setShowUserMenu(false); handleNav('profile'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        <span>My Profile & Preferences</span>
                      </button>

                      <button
                        onClick={() => { setShowUserMenu(false); handleNav('saved'); }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-emerald-400" />
                          <span>Saved Opportunities</span>
                        </div>
                        {effectiveSavedCount > 0 && (
                          <span className="text-[10px] font-bold bg-[#39E98A] text-slate-950 px-1.5 py-0.2 rounded-full">
                            {effectiveSavedCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => { setShowUserMenu(false); handleNav('plans'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>Action Plans</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => { setShowUserMenu(false); handleNav('admin'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-900/50 hover:bg-purple-900/50 text-purple-300 hover:text-white transition-colors cursor-pointer text-left"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-400" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 shadow-md shadow-[#39E98A]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MOBILE / TABLET SLIDE-OVER NAVIGATION DRAWER                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-xs bg-[#070c14] border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                <div 
                  onClick={() => handleNav('home')}
                  className="cursor-pointer"
                >
                  <MoneyWayLogo size="sm" showSubtitle={false} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
                  >
                    {isDark ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <span>{isDark ? 'Dark' : 'Bright'}</span>
                  </button>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    aria-label="Close Navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                {/* 1. Home */}
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'home'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>

                {/* 2. Search */}
                <button
                  onClick={() => handleNav('search')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'search'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search Opportunities</span>
                </button>

                {/* 3. Money Recommendation Hub (with sub-menu) */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      handleNav('recommendations', 'generator');
                      setDrawerRecsExpanded(true);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isRecActive
                        ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                        : 'text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Money Recommendation</span>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrawerRecsExpanded(!drawerRecsExpanded);
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      {drawerRecsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  {drawerRecsExpanded && (
                    <div className="pl-4 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-emerald-500/30 ml-4 font-mono">
                      {subItems.map(sub => {
                        const isSubActive = isRecActive && currentSubTab === sub.id;
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNav('recommendations', sub.id)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all text-left ${
                              isSubActive
                                ? 'bg-[#39E98A]/20 text-[#39E98A] font-bold border border-[#39E98A]/40'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Discover */}
                <button
                  onClick={() => handleNav('discover')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'discover'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Discover Opportunities</span>
                </button>

                {/* 5. Action Plans */}
                <button
                  onClick={() => handleNav('plans')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'plans'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Action Plans Tracker</span>
                </button>

                {/* 6. Scam Shield */}
                <button
                  onClick={() => handleNav('scam-center')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'scam-center'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-amber-400/90 hover:bg-amber-950/30'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Scam Shield Center</span>
                </button>

                {/* 7. AI Advisor */}
                <button
                  onClick={() => handleNav('advisor')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'advisor'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Income Advisor</span>
                </button>

                {/* 8. Saved */}
                <button
                  onClick={() => handleNav('saved')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'saved'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Bookmarks</span>
                  </div>
                  {effectiveSavedCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#39E98A] text-slate-950 px-1.5 py-0.2 rounded-full">
                      {effectiveSavedCount}
                    </span>
                  )}
                </button>

                {/* 9. Profile */}
                <button
                  onClick={() => handleNav('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'profile'
                      ? 'bg-[#39E98A]/15 text-[#39E98A] border border-[#39E98A]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile & Constraints</span>
                </button>

                {/* 10. Admin (if admin) */}
                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:bg-purple-900/50`}
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer Auth Info */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white truncate">{userName}</span>
                      <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileDrawerOpen(false); logout(); }}
                    className="w-full py-2 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-400 text-xs font-semibold hover:bg-rose-900/40 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setMobileDrawerOpen(false); openAuthModal('login'); }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileDrawerOpen(false); openAuthModal('signup'); }}
                    className="flex-1 py-2 rounded-xl bg-[#39E98A] text-slate-950 text-xs font-bold shadow-md shadow-[#39E98A]/20"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
