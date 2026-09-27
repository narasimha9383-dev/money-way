// src/components/LinkSafetyModal.jsx
// Section 7: Link Safety — show domain and verification before any external navigation
// All external links MUST pass through this modal.
// Uses target="_blank" rel="noopener noreferrer" per security requirements.

import React from 'react';
import { ExternalLink, ShieldAlert, ArrowRight, X, ShieldCheck } from 'lucide-react';

export default function LinkSafetyModal({ url, platformName, onClose, onConfirm }) {
  if (!url) return null;

  let domain = 'external website';
  let isValidUrl = true;
  try {
    const parsed = new URL(url);
    domain = parsed.hostname;
  } catch {
    isValidUrl = false;
    domain = url;
  }

  const isKnownSafe =
    domain.endsWith('upwork.com') ||
    domain.endsWith('fiverr.com') ||
    domain.endsWith('freelancer.com') ||
    domain.endsWith('contra.com') ||
    domain.endsWith('topmate.io') ||
    domain.endsWith('gumroad.com') ||
    domain.endsWith('preply.com') ||
    domain.endsWith('cambly.com') ||
    domain.endsWith('superprof.com') ||
    domain.endsWith('udemy.com') ||
    domain.endsWith('coursera.org') ||
    domain.endsWith('skillshare.com') ||
    domain.endsWith('utest.com') ||
    domain.endsWith('testbirds.com') ||
    domain.endsWith('userlytics.com') ||
    domain.endsWith('amazon.in') ||
    domain.endsWith('amazon.com') ||
    domain.endsWith('zomato.com') ||
    domain.endsWith('swiggy.com') ||
    domain.endsWith('dunzo.com') ||
    domain.endsWith('github.com') ||
    domain.endsWith('notion.so') ||
    domain.endsWith('theodinproject.com') ||
    domain.endsWith('freecodecamp.org') ||
    domain.endsWith('developer.mozilla.org') ||
    domain.endsWith('google.com');

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="External link confirmation"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isKnownSafe
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                : 'bg-amber-950/60 border-amber-800 text-amber-400'
            }`}>
              {isKnownSafe
                ? <ShieldCheck className="w-5 h-5" />
                : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                External Link
              </span>
              <h3 className="text-base font-bold text-white">You're leaving Money Way</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-slate-300">
          {platformName && (
            <p>
              You are navigating to the official platform for <strong className="text-white">{platformName}</strong>.
            </p>
          )}

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-semibold block">
              Destination Domain
            </span>
            <span className="font-mono text-sm text-slate-100 break-all">{domain}</span>
            {isKnownSafe && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
                <ShieldCheck className="w-3 h-3" /> Recognised verified platform
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/80 leading-relaxed">
            <strong className="block mb-1 text-amber-300">Safety Reminders:</strong>
            <ul className="space-y-1 list-disc list-inside">
              <li>Never share banking OTPs or passwords on any platform</li>
              <li>Never pay upfront registration or "security deposit" fees</li>
              <li>Keep all project communications inside the platform's official messaging</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-colors"
          >
            <span>Continue to Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
