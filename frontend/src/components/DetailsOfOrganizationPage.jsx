// frontend/src/components/DetailsOfOrganizationPage.jsx
// Details of Organization Explorer & Verification Hub (/detailsOfOrganization and /discover)
import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Building,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  Briefcase,
  AlertTriangle,
  FileCheck,
  Check,
  ChevronRight,
  TrendingUp,
  Globe,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { fetchOrganizationDetailsApi, fetchOrganizationsListApi } from '../services/api.js';

export default function DetailsOfOrganizationPage({
  userProfile,
  onSelectOpportunity,
  onOpenExternalLink,
  onNavigateToTab,
  isSaved = () => false,
  onSaveJob = () => {}
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [organization, setOrganization] = useState(null);
  const [featuredOrgs, setFeaturedOrgs] = useState([]);
  const [error, setError] = useState(null);

  // Quick search presets for popular verified organizations
  const POPULAR_ORGS = [
    'Swiggy',
    'Zomato',
    'Tata Consultancy Services (TCS)',
    'Infosys',
    'Apollo Hospitals',
    'Amazon India',
    'Urban Company',
    'Zepto',
    'Wipro',
    'Reliance Retail & Jio'
  ];

  // Load featured organizations list on mount
  useEffect(() => {
    let mounted = true;
    async function loadDirectory() {
      setListLoading(true);
      try {
        const res = await fetchOrganizationsListApi();
        if (mounted && res?.organizations) {
          setFeaturedOrgs(res.organizations);
        }
      } catch (err) {
        console.error('Failed to load organizations directory:', err);
      } finally {
        if (mounted) setListLoading(false);
      }
    }
    loadDirectory();
    return () => { mounted = false; };
  }, []);

  // Check URL query parameters for default organization search (e.g. ?org=Swiggy or ?q=TCS)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const orgParam = params.get('org') || params.get('q') || params.get('company');
        if (orgParam) {
          setSearchInput(orgParam);
          performOrgSearch(orgParam);
          return;
        }
      }
    } catch {}
    // Default to Swiggy on first load to showcase organization details immediately
    performOrgSearch('Swiggy');
  }, []);

  const performOrgSearch = async (query) => {
    const qClean = String(query || '').trim();
    if (!qClean) return;

    setLoading(true);
    setError(null);
    setActiveQuery(qClean);

    try {
      const res = await fetchOrganizationDetailsApi(qClean);
      if (res && res.success && res.organization) {
        setOrganization(res.organization);
      } else {
        setError(res?.error || 'Unable to retrieve organization details. Please try another company name.');
        setOrganization(null);
      }
    } catch (err) {
      console.error('Error in performOrgSearch:', err);
      setError('Network error while fetching organization profile. Please try again.');
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      performOrgSearch(searchInput.trim());
    }
  };

  const handleSelectPreset = (name) => {
    setSearchInput(name);
    performOrgSearch(name);
  };

  const handleExternalClick = (url, label) => {
    if (onOpenExternalLink) {
      onOpenExternalLink(url, label || 'Official Organization Career Portal');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 pb-28 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-800/90 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[#39E98A]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  Details of Organization
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Employer Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Inspect genuine hiring organizations, verify authentic career domains, check scam shield ratings, and discover live vacancies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('search')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Switch to Role Search
            </button>
          </div>
        </div>

        {/* 2. Traditional, Clean Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl focus-within:border-emerald-500 transition-all">
            <div className="flex items-center flex-1 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any organization (e.g. Swiggy, TCS, Zomato, Infosys, Apollo Hospitals, Amazon, Zepto...)"
                className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-0"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Inspect Organization</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Popular Organization Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-slate-500 text-[11px] font-mono mr-1">Popular:</span>
          {POPULAR_ORGS.map((orgName) => (
            <button
              key={orgName}
              type="button"
              onClick={() => handleSelectPreset(orgName)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                activeQuery.toLowerCase() === orgName.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-750'
              }`}
            >
              {orgName}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Loading State */}
      {loading && (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <Loader2 className="w-8 h-8 text-[#39E98A] animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-mono tracking-wider uppercase">
            Fetching organization credentials, authentic domains & active roles...
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
          <p className="text-xs sm:text-sm text-rose-200 font-semibold">{error}</p>
          <button
            onClick={() => performOrgSearch('Swiggy')}
            className="text-xs text-rose-300 underline hover:text-white"
          >
            Try viewing Swiggy or TCS details instead
          </button>
        </div>
      )}

      {/* 5. Organization Details Card (When Loaded) */}
      {organization && !loading && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Organization Showcase */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
            
            {/* Top row: Brand Avatar, Name, Sector & CTAs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800/80 pb-6">
              <div className="flex items-start sm:items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md shrink-0 border border-white/10"
                  style={{ backgroundColor: organization.logoColor || '#10B981' }}
                >
                  {organization.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                      {organization.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      100% Genuine Enterprise
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="text-slate-300 font-medium">{organization.sector}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {organization.headquarters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Careers URL & Official Website */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {organization.careersUrl && (
                  <button
                    onClick={() => handleExternalClick(organization.careersUrl, `${organization.name} Official Careers`)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span>Visit Official Careers Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                {organization.websiteUrl && (
                  <button
                    onClick={() => handleExternalClick(organization.websiteUrl, `${organization.name} Homepage`)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Company Website</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description & Work Model */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Organization Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
                {organization.description}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Work Model: <strong className="text-white">{organization.workModel || 'On-site / Hybrid'}</strong></span>
              </div>
            </div>

            {/* Scam Shield & Anti-Fraud Security Guarantee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Scam Shield Authenticity Score
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {organization.scamShieldScore}/100
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {organization.feePolicy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Anti-Fraud Recruitment Advice
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {organization.fraudWarning}
                </p>
              </div>
            </div>

            {/* Step-by-Step Verified Hiring Stages */}
            {organization.hiringProcess && organization.hiringProcess.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>Verified Recruitment & Onboarding Stages</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {organization.hiringProcess.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-extrabold flex items-center justify-center font-mono">
                        0{idx + 1}
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 6. Active Live Openings at this Organization */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-heading flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>Active Openings at {organization.name} ({organization.totalOpenings || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real vacancies with direct application destination verification.
                </p>
              </div>
              {organization.careersUrl && (
                <button
                  onClick={() => handleExternalClick(organization.careersUrl, organization.name)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Career Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {(!organization.activeRoles || organization.activeRoles.length === 0) ? (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No active cached vacancies for this specific search</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {organization.name} hires actively on their primary corporate portal. Click below to view all current openings directly.
                </p>
                <button
                  onClick={() => handleExternalClick(organization.careersUrl, organization.name)}
                  className="px-4 py-2 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Open {organization.name} Careers Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.activeRoles.map((role) => (
                  <div
                    key={role.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                          {role.sector}
                        </span>
                        <span className="text-[10px] text-teal-300 font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {role.linkType}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1">{role.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{role.location}</span>
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Compensation:</span>
                        <span className="font-bold text-emerald-400">
                          {role.compensation?.label || 'Competitive / Market Standard'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleExternalClick(role.applicationUrl, role.title)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-102 cursor-pointer shadow-md shadow-emerald-500/10"
                        >
                          <span>Apply Directly</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onSelectOpportunity && onSelectOpportunity(role)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 7. Featured Organizations Directory */}
      <div className="space-y-4 pt-6">
        <div>
          <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-400" />
            <span>Verified Employer Directory</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select any enterprise below to inspect organizational details, verified careers links, and live roles.
          </p>
        </div>

        {listLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono">
            Loading verified organizations...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredOrgs.map((org) => (
              <div
                key={org.name}
                onClick={() => handleSelectPreset(org.name)}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow shrink-0"
                      style={{ backgroundColor: org.logoColor || '#10B981' }}
                    >
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {org.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{org.sector}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                    {org.scamShieldScore}% Trust
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {org.headquarters.split(',')[0]}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
