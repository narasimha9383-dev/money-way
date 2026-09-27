// src/components/OpportunityComparison.jsx
import React from 'react';
import { 
  Scale, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Clock, 
  MapPin, 
  GraduationCap, 
  AlertTriangle 
} from 'lucide-react';

export default function OpportunityComparison({ 
  compareList = [], 
  onRemoveFromCompare, 
  onClearCompare, 
  onSelectOpportunity 
}) {
  if (compareList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
          <Scale className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Compare Opportunities Side-by-Side</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          You haven't selected any opportunities to compare yet. Browse recommendations or Search and click the <strong>Compare (⚖️)</strong> button on up to 4 items.
        </p>
      </div>
    );
  }

  const attributes = [
    { label: 'Category', render: (o) => <span className="font-semibold text-emerald-400">{o.category}</span> },
    { label: 'Starting Cost', render: (o) => <span className="font-bold text-emerald-400">{o.investment?.min === 0 ? '₹0 Initial' : `₹${o.investment?.min}–₹${o.investment?.max}`}</span> },
    { label: 'Time Commitment', render: (o) => <span className="text-white">{o.timeRequired?.label}</span> },
    { label: 'Location & Mode', render: (o) => <span className="text-slate-200">{o.locationType} ({o.mode})</span> },
    { label: 'Required Equipment', render: (o) => <span className="text-slate-300 text-xs">{o.requiredEquipment?.join(', ')}</span> },
    { label: 'Key Skills Required', render: (o) => <span className="text-slate-300 text-xs">{o.requiredSkills?.join(', ')}</span> },
    { label: 'Income Model', render: (o) => <span className="text-white font-medium">{o.incomeModel}</span> },
    { label: 'Difficulty Level', render: (o) => <span className="text-slate-200">{o.isBeginnerFriendly ? 'Beginner-Friendly' : 'Intermediate/Advanced'}</span> },
    { label: 'Realistic Risk / Caveat', render: (o) => <span className="text-amber-300/90 text-xs">{o.challenges?.[0] || 'Income depends on effort & client acquisition'}</span> },
    { label: 'Platform Fees', render: (o) => <span className="text-slate-300 text-xs">{o.verification?.platformFees || 'Standard'}</span> },
    { label: 'Verification Status', render: (o) => <span className="text-emerald-400 text-xs font-semibold">🟢 {o.verification?.status} ({o.verification?.lastVerifiedAt})</span> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Side-by-Side Comparison Matrix</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing factual requirements without bias. We never declare a forced winner—you choose what fits your situation best.
          </p>
        </div>

        <button
          onClick={onClearCompare}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 w-fit"
        >
          Clear Comparison ({compareList.length})
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-850 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-44 sticky left-0 bg-slate-900">
                Attribute
              </th>
              {compareList.map((opp) => (
                <th key={opp.id} className="p-4 text-sm font-bold text-white min-w-[240px] max-w-[280px]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="line-clamp-2">{opp.title}</span>
                    <button
                      onClick={() => onRemoveFromCompare(opp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {attributes.map((attr, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-850' : 'bg-slate-900/40'}>
                <td className="p-4 font-semibold text-slate-400 sticky left-0 bg-slate-850/95 backdrop-blur-sm border-r border-slate-800">
                  {attr.label}
                </td>
                {compareList.map((opp) => (
                  <td key={opp.id} className="p-4 align-top leading-relaxed">
                    {attr.render(opp)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
