// src/components/SimilarOpportunitiesModal.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Bookmark, ShieldCheck, Coins, Clock, AlertCircle } from 'lucide-react';
import { fetchSimilarOpportunities } from '../services/api.js';
import { getOpportunityImage } from '../services/imageMap.js';

export default function SimilarOpportunitiesModal({
  targetOpportunity,
  onClose,
  onSelectOpportunity,
  onSaveOpportunity,
  isSaved,
  rejectedIds = []
}) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (targetOpportunity?.id) {
      loadSimilar();
    }
  }, [targetOpportunity]);

  const loadSimilar = async () => {
    setLoading(true);
    try {
      const res = await fetchSimilarOpportunities(targetOpportunity.id, {
        rejectedIds,
        limit: 3
      });
      setSimilar(res.similar || []);
    } catch (err) {
      console.error('Failed to load similar opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!targetOpportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Similar Opportunities
              </h3>
              <p className="text-xs text-slate-400">
                Alternative paths with comparable skills and setup requirements to "{targetOpportunity.title}".
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3 py-6 text-center text-xs text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-2" />
            <span>Finding verified similar pathways...</span>
          </div>
        ) : similar.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">
              No additional verified similar opportunities found without repeating rejected items.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {similar.map((opp) => {
              const img = getOpportunityImage(opp);
              const saved = isSaved(opp.id);
              return (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={img}
                      alt={opp.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {opp.category}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {opp.title}
                      </h4>
                      {/* Similarity Reasons (Section 25) */}
                      <p className="text-[11px] text-slate-400">
                        {opp.similarityReasons?.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectOpportunity(opp);
                      }}
                      className="flex-1 sm:flex-initial py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onSaveOpportunity(opp.id)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        saved
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                      title={saved ? 'Saved' : 'Save'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-400' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
