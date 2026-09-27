// src/components/ScamCenter.jsx
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  XCircle, 
  HelpCircle,
  Sparkles,
  Lock,
  MessageCircle,
  CreditCard,
  FileWarning
} from 'lucide-react';
import { analyzeScamText } from '../services/api.js';

const commonScamPatterns = [
  {
    title: 'Upfront Registration / "Kit" Fees',
    danger: 'CRITICAL',
    description: 'The employer asks you to transfer ₹500–₹5,000 for "document verification", "security deposit", or a "starter training kit" before giving work.',
    reality: 'Legitimate employers never charge candidates money to start work. They pay you; you never pay them.',
    icon: CreditCard
  },
  {
    title: 'Telegram / WhatsApp "Like & Rating" Tasks',
    danger: 'CRITICAL',
    description: 'You are offered ₹150 for subscribing to YouTube channels or reviewing hotels, but then lured into "prepaid crypto/wallet recharge tasks" to unlock your funds.',
    reality: 'This is the #1 cyber scam in 2026. Money sent to "prepaid tasks" can never be withdrawn.',
    icon: MessageCircle
  },
  {
    title: 'Unrealistic Guaranteed Daily Windfalls',
    danger: 'HIGH',
    description: 'Claims like "Earn ₹5,000–₹15,000 daily working 15 minutes without skills or risk."',
    reality: 'No legitimate business pays massive returns for trivial tasks. Income always matches real economic productivity and skill.',
    icon: AlertTriangle
  },
  {
    title: 'Overpayment / Fake Check Equipment Scam',
    danger: 'CRITICAL',
    description: 'The scammer sends a check, tells you to deposit it and wire money to an "office furniture vendor". Days later, the check bounces and your bank demands full repayment.',
    reality: 'Never deposit checks from online strangers or purchase equipment through unverified third parties.',
    icon: FileWarning
  },
  {
    title: 'Remote Desktop & OTP Harvesting',
    danger: 'CRITICAL',
    description: 'The "recruiter" asks you to install AnyDesk, TeamViewer, or share an SMS OTP for "account activation".',
    reality: 'This grants scammers direct control over your mobile banking and UPI apps.',
    icon: Lock
  }
];

export default function ScamCenter() {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleScams = [
    "Part-time job! Earn ₹3000 daily by liking YouTube videos. Join our Telegram group. Pay ₹500 refundable security deposit to activate your employee ID.",
    "Congratulations! You are selected as Remote Assistant. We will courier a check of ₹45,000 to purchase your laptop from our authorized vendor. Deposit check and wire back the remaining balance.",
    "Upwork contract for frontend website redesign. Deliver milestone 1 on GitHub and review on staging server before escrow release."
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      const result = await analyzeScamText(inputText);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = (text) => {
    setInputText(text);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Fraud Prevention &amp; Trust Safety Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Protect Yourself from Income Scams
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          The internet is filled with deceptive schemes preying on honest earners. Learn the red flags and use our scanner to test any suspicious job offer before risking your hard-earned money.
        </p>
      </div>

      {/* Interactive Scam Scanner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <span>"Check This Opportunity" Interactive Analyzer</span>
          </h2>
          <p className="text-xs text-slate-400">
            Paste any suspicious WhatsApp message, Telegram pitch, job description, or email. Our heuristic analyzer will flag known fraud patterns.
          </p>
        </div>

        <div className="space-y-2">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste the suspicious message, job posting, or offer letter text here..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Try a sample:</span>
              <button
                onClick={() => loadSample(sampleScams[0])}
                className="text-emerald-400 hover:underline"
              >
                Telegram Task Scam
              </button>
              <span>•</span>
              <button
                onClick={() => loadSample(sampleScams[1])}
                className="text-amber-400 hover:underline"
              >
                Fake Check Scam
              </button>
              <span>•</span>
              <button
                onClick={() => loadSample(sampleScams[2])}
                className="text-teal-400 hover:underline"
              >
                Legitimate Job
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all ml-auto"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>{analyzing ? 'Scanning text...' : 'Scan For Red Flags'}</span>
            </button>
          </div>
        </div>

        {/* Scan Results Display */}
        {analysisResult && (
          <div className={`p-6 rounded-2xl border transition-all space-y-5 animate-in fade-in duration-300 ${
            analysisResult.badgeColor === 'red'
              ? 'bg-rose-950/30 border-rose-800'
              : analysisResult.badgeColor === 'orange'
              ? 'bg-amber-950/30 border-amber-800'
              : 'bg-emerald-950/30 border-emerald-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {analysisResult.badgeColor === 'red' ? (
                  <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                ) : analysisResult.badgeColor === 'orange' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">Risk Assessment</span>
                  <h3 className="text-lg font-bold text-white">{analysisResult.riskLevel}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono text-white">{analysisResult.riskScore}</span>
                <span className="text-xs text-slate-400 font-mono"> / 100 Risk Score</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {analysisResult.summary}
            </p>

            {/* Identified Red Flags */}
            {analysisResult.redFlags?.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Identified Red Flags ({analysisResult.redFlags.length}):
                </span>
                <div className="space-y-2.5">
                  {analysisResult.redFlags.map((flag, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400">{flag.category}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          {flag.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{flag.description}</p>
                      {flag.matchedText && (
                        <div className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
                          Matched trigger phrase: <span className="text-amber-300">"{flag.matchedText}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Checklist */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Verification Safety Checklist:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.safetyChecklist?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Educational Guide: Top 5 Scams Explained */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">How Modern Income Scams Operate</h2>
          <p className="text-xs text-slate-400">Familiarize yourself with the 5 most common cyber traps targeting job seekers in 2026.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonScamPatterns.map((scam, i) => {
            const Icon = scam.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                    {scam.danger}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{scam.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{scam.description}</p>
                <div className="text-xs text-emerald-400/90 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong>The Reality:</strong> {scam.reality}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
