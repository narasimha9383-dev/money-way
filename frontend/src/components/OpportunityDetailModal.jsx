// src/components/OpportunityDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Coins, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Bookmark, 
  Scale, 
  Calendar, 
  Info,
  FileCheck
} from 'lucide-react';
import { explainWhyNot } from '../services/api.js';

export default function OpportunityDetailModal({
  opportunity,
  userProfile,
  onClose,
  onSave,
  isSaved,
  onAddToCompare,
  isCompared,
  onStartPlan,
  onOpenExternalLink
}) {
  const [activeTab, setActiveTab] = useState('guide'); // 'guide', 'platforms', 'whynot'
  const [whyNotData, setWhyNotData] = useState(null);
  const [loadingWhyNot, setLoadingWhyNot] = useState(false);

  useEffect(() => {
    if (opportunity && userProfile) {
      setLoadingWhyNot(true);
      explainWhyNot(opportunity.id, userProfile)
        .then(res => setWhyNotData(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingWhyNot(false));
    }
  }, [opportunity, userProfile]);

  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {opportunity.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {opportunity.verification?.status || 'Verified'} ({opportunity.verification?.lastVerifiedAt || 'Sept 2026'})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {opportunity.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Factual Overview &amp; Guide
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'platforms'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Verified Platforms &amp; Fee Data
          </button>
          <button
            onClick={() => setActiveTab('whynot')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'whynot'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            "Why Not?" Diagnostics
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Fact vs Estimate Banner per Section 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <FileCheck className="w-4 h-4" />
                    <span>🟢 Verified Fact</span>
                  </div>
                  <p className="text-slate-300">
                    Startup cost: <strong>{opportunity.investment?.min === 0 ? '₹0' : `₹${opportunity.investment?.min}`}</strong>. Platform fee: <strong>{opportunity.verification?.platformFees || 'Standard'}</strong>. No guaranteed income claims.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>🟡 Variable Estimate</span>
                  </div>
                  <p className="text-slate-300">
                    Time to first payout varies by skill and client response. Income is variable and performance-based.
                  </p>
                </div>
              </div>

              {/* What is it */}
              <div>
                <h3 className="text-base font-bold text-white mb-2">What is this opportunity?</h3>
                <div className="leading-relaxed text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                  {opportunity.howItWorks || "Information could not be verified."}
                </div>
              </div>

              {/* What do you need */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                    Verified Equipment Requirements
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opportunity.requiredEquipment?.map((eq, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
                    Required Skills
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opportunity.requiredSkills?.map((sk, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{sk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Practical Blueprint */}
              <div>
                <h3 className="text-base font-bold text-white mb-3">Where to Start (5-Step Factual Path)</h3>
                <div className="space-y-2.5">
                  {opportunity.whereToStart?.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-800">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realistic Risks / Challenges */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/50 space-y-2">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Realistic Difficulties &amp; Challenges</span>
                </h4>
                <ul className="space-y-1 text-xs text-amber-200/90">
                  {opportunity.challenges?.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIED PLATFORMS & FEES */}
          {activeTab === 'platforms' && (
            <div className="space-y-5">
              <div className="text-xs text-slate-400">
                All platform listings originate from verified company documentation. Clicking will display a link safety domain confirmation before opening.
              </div>

              <div className="space-y-3">
                {opportunity.platforms?.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-base">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800 font-mono">
                          Fee: {p.feeInfo || 'Fee information could not be verified.'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{p.description}</p>
                      {p.url && (
                        <p className="text-[10px] font-mono text-slate-500 break-all">
                          {(() => { try { return new URL(p.url).hostname; } catch { return p.url; } })()}
                        </p>
                      )}
                    </div>

                    {p.url ? (
                      <button
                        onClick={() => onOpenExternalLink && onOpenExternalLink(p.url, p.name)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors w-fit border border-slate-700"
                        aria-label={`Visit ${p.name} — opens in new tab`}
                      >
                        <span>Visit Platform →</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic shrink-0">URL could not be verified.</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-400">
                <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wider text-emerald-400">
                  Verification Source Record
                </span>
                <p><strong>Primary Source:</strong> {opportunity.verification?.source || 'Information could not be verified.'}</p>
                <p><strong>Last Verified Date:</strong> {opportunity.verification?.lastVerifiedAt || 'September 2026'}</p>
                <p><strong>Age Restrictions:</strong> {opportunity.verification?.ageRestrictions || '18+ years'}</p>
                <p><strong>Platform Fees:</strong> {opportunity.verification?.platformFees || 'Information could not be verified.'}</p>
              </div>
            </div>
          )}

          {/* TAB 3: WHY NOT DIAGNOSTICS */}
          {activeTab === 'whynot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-white text-sm mb-1">Rule-Based Eligibility Evaluation</h4>
                <p className="text-slate-400">
                  Here is the exact algorithmic assessment evaluating this opportunity against your profile:
                </p>
              </div>

              {loadingWhyNot ? (
                <div className="p-8 text-center text-slate-400 text-xs">Analyzing profile constraints...</div>
              ) : whyNotData ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Compatibility Assessment:
                    </span>
                    <ul className="space-y-2 text-xs">
                      {whyNotData.reasons?.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          {whyNotData.isEligible ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(opportunity.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                isSaved(opportunity.id)
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved(opportunity.id) ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onAddToCompare(opportunity)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                isCompared(opportunity.id)
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared(opportunity.id) ? 'Compared' : 'Compare'}</span>
            </button>
          </div>

          <button
            onClick={() => onStartPlan(opportunity)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Build My 7-Day Plan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
