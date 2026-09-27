// src/components/JobCard.jsx
// Section 5, 8, 14, 15, 16, 32, 33: Canonical Job Card with Verified Link & Match Factors
import React from 'react';
import { 
  Building, 
  MapPin, 
  Navigation, 
  Clock, 
  Coins, 
  Bookmark, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function JobCard({
  job,
  onSelect,
  onSave,
  isSaved = false,
  onOpenExternalLink
}) {
  if (!job) return null;

  const distanceText = job.distanceKm !== null && job.distanceKm !== undefined
    ? `${job.distanceKm} km away`
    : null;

  const formattedDate = job.postedDate || (job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Date unavailable');

  const matchReasons = job.matchFactors || job.matchReasons || [];

  return (
    <div 
      onClick={() => onSelect && onSelect(job)}
      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-850 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative"
    >
      {/* Top Header: Sector, Distance, Match Score, Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {job.sector && (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
              {job.sector}
            </span>
          )}

          {distanceText && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
              <Navigation className="w-3 h-3 text-[#39E98A]" />
              <span>{distanceText}</span>
            </span>
          )}

          {job.employmentType && (
            <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
              {job.employmentType}
            </span>
          )}

          {job.matchScore && (
            <span className="text-[11px] font-bold text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{job.matchScore}% match</span>
            </span>
          )}
        </div>

        {/* Save Job Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSave) onSave(job.id);
          }}
          className={`p-2 rounded-xl transition-colors cursor-pointer flex-shrink-0 ${
            isSaved
              ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
              : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700'
          }`}
          title={isSaved ? 'Saved to bookmarks' : 'Save job'}
        >
          <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main Info: Title, Company, Location */}
      <div className="space-y-1.5 flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{job.company || 'Verified Employer'}</span>
          <span className="text-slate-600">•</span>
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate text-slate-400">{job.location || 'Local / Onsite'}</span>
        </p>

        {/* Description snippet */}
        {job.description && (
          <p className="text-xs text-slate-400 line-clamp-2 pt-1 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Why This Matches Chips (Section 15, 16) */}
      {matchReasons.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-1.5">
          {matchReasons.slice(0, 2).map((reason, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 truncate max-w-[280px]"
            >
              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{reason}</span>
            </span>
          ))}
        </div>
      )}

      {/* Bottom Bar: Salary, Freshness, Apply Button (Section 3, 11) */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-emerald-400">
            {job.salary ? job.salary : <span className="text-slate-500 italic font-normal">Salary not disclosed</span>}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Apply CTA (Section 3) */}
        <div>
          {job.exactApplicationLinkAvailable && (job.applicationUrl || job.applyUrl) ? (
            <a
              href={job.applicationUrl || job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenExternalLink) {
                  e.preventDefault();
                  onOpenExternalLink(job.applicationUrl || job.applyUrl, job.company);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
              title="Direct application form verified"
            >
              <span>{job.linkActionLabel || 'Apply'}</span>
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
            </a>
          ) : (job.applicationUrl || job.applyUrl || job.sourceUrl) ? (
            <a
              href={job.applicationUrl || job.applyUrl || job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenExternalLink) {
                  e.preventDefault();
                  onOpenExternalLink(job.applicationUrl || job.applyUrl || job.sourceUrl, job.company);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-xs transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Official employer career portal (search for role on site)"
            >
              <span>{job.linkActionLabel || 'Career Portal'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-500 italic px-2 py-1 bg-slate-800/60 rounded-lg">
              Application link unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
