// src/components/OpportunityDetailModal.jsx
// Section 14: Job Detail Page / Modal strictly adhering to verified application links and transparent match factors
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building, 
  MapPin, 
  Navigation, 
  Clock, 
  Coins, 
  Briefcase, 
  Bookmark, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  AlertCircle,
  Bell,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { fetchJobDetailApi } from '../services/api.js';

export default function OpportunityDetailModal({
  jobId,
  opportunity,
  userProfile,
  onClose,
  onSave,
  isSaved = false,
  onOpenExternalLink,
  onCreateAlert
}) {
  const [jobData, setJobData] = useState(opportunity || null);
  const [loading, setLoading] = useState(!opportunity && Boolean(jobId));
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setJobData(opportunity);
      // Track in recently viewed (Section 12)
      try {
        const stored = JSON.parse(localStorage.getItem('moneyway_recently_viewed') || '[]');
        const filtered = stored.filter(item => item.id !== opportunity.id);
        filtered.unshift({
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          location: opportunity.location,
          salary: opportunity.salary,
          sector: opportunity.sector || opportunity.category,
          viewedAt: new Date().toISOString()
        });
        localStorage.setItem('moneyway_recently_viewed', JSON.stringify(filtered.slice(0, 10)));
      } catch {}
    } else if (jobId) {
      setLoading(true);
      fetchJobDetailApi(jobId)
        .then(res => {
          if (res?.job) {
            setJobData(res.job);
            // Track in recently viewed
            try {
              const stored = JSON.parse(localStorage.getItem('moneyway_recently_viewed') || '[]');
              const filtered = stored.filter(item => item.id !== res.job.id);
              filtered.unshift({
                id: res.job.id,
                title: res.job.title,
                company: res.job.company,
                location: res.job.location,
                salary: res.job.salary,
                sector: res.job.sector || res.job.category,
                viewedAt: new Date().toISOString()
              });
              localStorage.setItem('moneyway_recently_viewed', JSON.stringify(filtered.slice(0, 10)));
            } catch {}
          } else {
            setError('Opportunity not found or listing has expired.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to retrieve opportunity details.');
        })
        .finally(() => setLoading(false));
    }
  }, [jobId, opportunity]);

  // Sync browser URL to /jobs/:id while modal is active (Section 38)
  useEffect(() => {
    if (jobData?.id) {
      const targetPath = `/jobs/${encodeURIComponent(jobData.id)}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ modalJobId: jobData.id }, '', targetPath);
      }
    }
  }, [jobData?.id]);

  const handleModalClose = () => {
    if (window.location.pathname.startsWith('/jobs/')) {
      try {
        window.history.replaceState({}, '', '/discover');
      } catch {}
    }
    if (onClose) onClose();
  };

  if (!jobId && !opportunity) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/jobs/${encodeURIComponent(jobData?.id || jobId)}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = jobData?.postedDate || (jobData?.postedAt ? new Date(jobData.postedAt).toLocaleDateString() : 'Date unavailable');
  const distanceText = jobData?.distanceKm !== null && jobData?.distanceKm !== undefined
    ? `${jobData.distanceKm} km away`
    : null;

  const matchReasons = jobData?.matchFactors || jobData?.matchReasons || [];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full uppercase">
                {jobData?.sector || jobData?.category || 'Opportunity'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Real Job Source</span>
              </span>
              {distanceText && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  <Navigation className="w-3 h-3 text-[#39E98A]" />
                  <span>{distanceText}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
              {jobData?.title || 'Loading Opportunity...'}
            </h2>

            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <span>{jobData?.company}</span>
              <span className="text-slate-600">•</span>
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{jobData?.location || 'Local'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Copy link to job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleModalClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-300">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Retrieving verified opportunity record...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-white">{error}</h3>
              <button
                onClick={handleModalClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {copied && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Direct URL copied to clipboard!</span>
                </div>
              )}

              {/* Key Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Compensation</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {jobData.salary ? jobData.salary : <span className="text-slate-400 font-normal">Not disclosed</span>}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Employment Type</span>
                  <span className="font-semibold text-white">
                    {jobData.employmentType || 'Standard'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Experience Level</span>
                  <span className="font-semibold text-white">
                    {jobData.experience || 'Entry-level / Any'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">Posted Freshness</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </span>
                </div>
              </div>

              {/* Match Factors / Why This Matches (Section 15, 16) */}
              {matchReasons.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why this matches your search &amp; profile</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 text-[11px]">
                  Job Description &amp; Responsibilities
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
                  {jobData.description || 'Full duties and scope provided on employer portal.'}
                </p>
              </div>

              {/* Requirements & Skills */}
              {((jobData.skills && jobData.skills.length > 0) || (jobData.requirements && jobData.requirements.length > 0)) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 text-[11px]">
                    Required Skills &amp; Qualifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(jobData.skills || jobData.requirements || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Authenticity Verification Info (Section 3, 33) */}
              {/* Source Authenticity Verification Info (Section 3, 33) */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Source Platform:</span>
                  <span className="font-bold text-white">{jobData.source || 'Verified Partner Network'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Destination Type:</span>
                  <span className={`font-semibold flex items-center gap-1 ${jobData.exactApplicationLinkAvailable ? 'text-emerald-400' : 'text-sky-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{jobData.exactApplicationLinkAvailable ? 'Direct Application Form Verified' : 'Official Employer Career Portal'}</span>
                  </span>
                </div>
                {!jobData.exactApplicationLinkAvailable && (
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    ℹ️ This link leads to the official employer career hub. You can search or select this position on their portal to complete your application.
                  </p>
                )}
                {(jobData.applicationUrl || jobData.sourceUrl) && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 font-medium">Official Portal Host:</span>
                    <a 
                      href={jobData.applicationUrl || jobData.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline max-w-[260px] truncate"
                    >
                      {new URL(jobData.applicationUrl || jobData.sourceUrl).hostname}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions (Section 3: Real Apply Link) */}
        {jobData && !loading && !error && (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave && onSave(jobData.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSaved
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              {onCreateAlert && (
                <button
                  onClick={() => onCreateAlert(jobData)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  title="Create job alert for similar positions"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Alert for Role</span>
                </button>
              )}
            </div>

            {/* APPLY ON ORIGINAL SOURCE BUTTON */}
            <div>
              {jobData.exactApplicationLinkAvailable && (jobData.applicationUrl || jobData.applyUrl) ? (
                <a
                  href={jobData.applicationUrl || jobData.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (onOpenExternalLink) {
                      e.preventDefault();
                      onOpenExternalLink(jobData.applicationUrl || jobData.applyUrl, jobData.company);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  title="Direct 1-click application form"
                >
                  <span>{jobData.linkActionLabel || 'Apply Directly'}</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                </a>
              ) : (jobData.applicationUrl || jobData.applyUrl || jobData.sourceUrl) ? (
                <a
                  href={jobData.applicationUrl || jobData.applyUrl || jobData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (onOpenExternalLink) {
                      e.preventDefault();
                      onOpenExternalLink(jobData.applicationUrl || jobData.applyUrl || jobData.sourceUrl, jobData.company);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  title="Opens verified employer career hub"
                >
                  <span>{jobData.linkActionLabel || 'Open Career Portal'}</span>
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                </a>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-slate-800/80 text-slate-400 text-xs italic border border-slate-700">
                  Application link unavailable
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
