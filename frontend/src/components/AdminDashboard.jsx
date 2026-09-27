// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ThumbsDown, 
  BarChart3,
  Edit,
  Save,
  X
} from 'lucide-react';
import { 
  fetchAdminFeedback, 
  adminVerifyOpportunity, 
  adminSaveOpportunity 
} from '../services/api.js';

export default function AdminDashboard({ allOpportunities = [], onOpportunityUpdated }) {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New opportunity form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Skill-Based');
  const [newMode, setNewMode] = useState('Online');
  const [newMinCost, setNewMinCost] = useState(0);
  const [newMaxCost, setNewMaxCost] = useState(500);
  const [newHours, setNewHours] = useState('1–3 hours/day');
  const [newSkills, setNewSkills] = useState('');
  const [newHowItWorks, setNewHowItWorks] = useState('');
  const [newSource, setNewSource] = useState('Direct Industry Review');
  const [newSourceUrl, setNewSourceUrl] = useState('https://');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminFeedback();
      setFeedbackStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      const result = await adminVerifyOpportunity(id);
      if (result.success && onOpportunityUpdated) {
        onOpportunityUpdated(result.opportunity);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const payload = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      mode: newMode,
      experienceLevel: ['Beginner', 'Some experience'],
      isBeginnerFriendly: true,
      isAdvanced: false,
      investment: {
        min: Number(newMinCost),
        max: Number(newMaxCost),
        currency: 'INR',
        description: `₹${newMinCost}–₹${newMaxCost} startup costs.`
      },
      timeRequired: {
        minHoursPerDay: 1,
        maxHoursPerDay: 3,
        label: newHours,
        flexible: true,
        weekendsOnlyViable: true
      },
      incomeModel: 'Per project / milestone',
      locationType: newMode === 'Online' ? 'Remote' : 'Local',
      requiredEquipment: ['Laptop', 'Internet connection'],
      requiredSkills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      suitablePersonalities: ['Working alone', 'Technical work'],
      incomeGoals: ['Side income'],
      countryAvailability: ['India', 'USA', 'UK', 'Canada', 'Australia', 'Other'],
      verification: {
        status: 'Verified',
        lastVerifiedAt: 'September 2026',
        source: newSource,
        sourceUrl: newSourceUrl,
        platformFees: 'Platform dependent',
        ageRestrictions: '18+'
      },
      howItWorks: newHowItWorks,
      whereToStart: [
        'Understand specific client requirements.',
        'Build 2 proof-of-work demonstrations.',
        'Publish services on verified freelance portals.'
      ],
      platforms: [
        { name: 'Upwork', url: 'https://upwork.com', description: 'Verified freelance escrow network', feeInfo: '10%' }
      ],
      pros: ['Flexible schedule', 'Clear compensation'],
      challenges: ['Requires securing initial reviews'],
      sevenDayPlan: [
        { day: 1, title: 'Scope and Tools', tasks: ['Set up software and workspace'] },
        { day: 2, title: 'Build Samples', tasks: ['Create 2 work samples'] },
        { day: 3, title: 'Profile Setup', tasks: ['Publish portfolio'] }
      ],
      scamWarnings: ['Never accept payments outside escrow.']
    };

    try {
      const res = await adminSaveOpportunity(payload);
      if (res.success && onOpportunityUpdated) {
        onOpportunityUpdated(res.opportunity);
        setShowAddModal(false);
        // Reset form
        setNewTitle('');
        setNewHowItWorks('');
        setNewSkills('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Opportunity &amp; Verification Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Maintain database accuracy, verify sources, inspect user feedback, and prevent outdated platform drift.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Opportunity</span>
        </button>
      </div>

      {/* Feedback & Rejection Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rejection Reasons Summary */}
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-rose-400" />
              <span>User Rejection Feedback Analytics</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Logged: {feedbackStats?.totalFeedback || 0}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            When users click 👎, their reasons are aggregated here to highlight systemic mismatches and inform algorithm calibration.
          </p>

          <div className="space-y-2">
            {feedbackStats?.rejectionReasonsSummary && Object.keys(feedbackStats.rejectionReasonsSummary).length > 0 ? (
              Object.entries(feedbackStats.rejectionReasonsSummary).map(([reason, count]) => (
                <div key={reason} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-300">{reason}</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
                    {count} times
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl">
                No negative feedback logged yet. Users are finding recommendations relevant.
              </div>
            )}
          </div>
        </div>

        {/* Database Health Card */}
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Database Integrity &amp; Freshness</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">100% Active</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Verified Opportunities:</span>
              <strong className="text-white font-mono">{allOpportunities.length}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Verification Cycle Standard:</span>
              <strong className="text-emerald-400 font-mono">September 2026 Audit</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Zero-Investment Filter Ratio:</span>
              <strong className="text-white font-mono">
                {allOpportunities.filter(o => o.investment?.min === 0).length} of {allOpportunities.length} (₹0 Starting)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Management Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        <h3 className="text-lg font-bold text-white">All Database Opportunities</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Opportunity</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Cost</th>
                <th className="pb-3 px-4">Verification</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-white">
                    {opp.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {opp.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    {opp.investment?.min === 0 ? '₹0' : `₹${opp.investment?.min}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      🟢 {opp.verification?.status} ({opp.verification?.lastVerifiedAt || 'Sept 2026'})
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={() => handleVerify(opp.id)}
                      disabled={verifyingId === opp.id}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-slate-700 transition-colors"
                    >
                      {verifyingId === opp.id ? 'Verifying...' : 'Re-Verify (Sept 2026)'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Opportunity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Opportunity Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Technical SEO Audit Specialist"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Skill-Based">Skill-Based</option>
                    <option value="Zero-Investment">Zero-Investment</option>
                    <option value="Digital Products">Digital Products</option>
                    <option value="Low-Investment">Low-Investment</option>
                    <option value="Local / Offline">Local / Offline</option>
                    <option value="Long-Term">Long-Term</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Mode:</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Min Capital (₹):</label>
                  <input
                    type="number"
                    value={newMinCost}
                    onChange={(e) => setNewMinCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Time Commitment:</label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Required Skills (comma separated):</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. SEO, Content, HTML/CSS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">How It Works (Summary):</label>
                <textarea
                  rows={3}
                  required
                  value={newHowItWorks}
                  onChange={(e) => setNewHowItWorks(e.target.value)}
                  placeholder="Explain how the user creates value and receives compensation..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
