// src/components/RealtimeNotificationToast.jsx
import React from 'react';
import { 
  Bell, 
  MapPin, 
  X, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function RealtimeNotificationToast({ onSelectJob }) {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const job = activeToast.job || {};

  return (
    <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-4 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl shadow-emerald-950/40 relative overflow-hidden">
        
        {/* Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#39E98A]" />

        <div className="flex items-start gap-3">
          {/* Animated Radar Pulse Icon */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse text-[#39E98A]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>

          {/* Toast Content */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{activeToast.category || 'Live Discovery'}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Just now</span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">
              {activeToast.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeToast.message}
            </p>

            {job?.salary && (
              <div className="text-xs font-bold text-emerald-400 pt-0.5">
                {job.salary}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              {job && onSelectJob && (
                <button
                  onClick={() => {
                    onSelectJob(job);
                    dismissToast();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
                >
                  <span>View Opportunity</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                </button>
              )}

              <button
                onClick={dismissToast}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close X */}
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
