// src/components/Navbar.jsx
import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Search, 
  Scale, 
  CheckSquare, 
  ShieldAlert, 
  MessageSquare, 
  LayoutDashboard, 
  Bookmark, 
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  savedCount = 0, 
  complexityMode, 
  setComplexityMode
}) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, savedIds } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'plans', label: 'Action Plans', icon: CheckSquare },
    { id: 'scam-center', label: 'Scam Shield', icon: ShieldAlert, highlight: true },
    { id: 'advisor', label: 'AI Advisor', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const effectiveSavedCount = savedIds.length || savedCount;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Money <span className="text-emerald-400">Way</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  ACCURACY &gt; QUANTITY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Verified Realistic Income Discovery</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                      : item.highlight
                      ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Mode Toggle, Saved, Admin, Auth State, Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Beginner / Advanced Mode Selector */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setComplexityMode('beginner')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  complexityMode === 'beginner'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Only show low-barrier, beginner-friendly options"
              >
                🟢 Beginner
              </button>
              <button
                onClick={() => setComplexityMode('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  complexityMode === 'all'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Show all verified opportunities"
              >
                All
              </button>
              <button
                onClick={() => setComplexityMode('advanced')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  complexityMode === 'advanced'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Show advanced business, freelancing & SaaS models"
              >
                🔵 Advanced
              </button>
            </div>

            {/* Saved Bookmarks Button */}
            <button
              onClick={() => handleTabClick('saved')}
              className="relative p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
              title="View Saved Opportunities"
            >
              <Bookmark className="w-4 h-4" />
              {effectiveSavedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {effectiveSavedCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard: Only displayed if user is admin */}
            {isAdmin && (
              <button
                onClick={() => handleTabClick('admin')}
                className={`p-2 rounded-lg border transition-colors ${
                  currentTab === 'admin'
                    ? 'bg-purple-900/50 text-purple-300 border-purple-700'
                    : 'bg-slate-800/80 text-purple-400 hover:text-purple-200 border-slate-700/60'
                }`}
                title="Admin Portal (Database Verification & Metrics)"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Auth Button or User Avatar */}
            {isAuthenticated ? (
              <button
                onClick={() => handleTabClick('profile')}
                className="flex items-center gap-1.5 p-1 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-colors"
                title={`Logged in as ${user?.name || user?.email}`}
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-1">
            <div className="flex sm:hidden items-center justify-between px-3 py-2 bg-slate-950 rounded-lg mb-2 border border-slate-800">
              <span className="text-xs text-slate-400">Mode:</span>
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => setComplexityMode('beginner')}
                  className={`px-2 py-0.5 rounded ${complexityMode === 'beginner' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setComplexityMode('all')}
                  className={`px-2 py-0.5 rounded ${complexityMode === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setComplexityMode('advanced')}
                  className={`px-2 py-0.5 rounded ${complexityMode === 'advanced' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Auth Actions */}
            <div className="pt-2 border-t border-slate-800/80">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-slate-300 truncate">{user?.name || user?.email}</span>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-3 py-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                    className="flex-1 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-white"
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
      </div>
    </header>
  );
}
