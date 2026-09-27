// src/components/ActionPlanTracker.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  BookOpen, 
  TrendingUp,
  Layers
} from 'lucide-react';

const stages = [
  'Discover',
  'Research',
  'Learn',
  'Prepare',
  'Apply',
  'First Attempt',
  'Completed'
];

export default function ActionPlanTracker({
  activeOpportunity,
  allOpportunities = [],
  onSelectOpportunity,
  onOpenExternalLink
}) {
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_action_plans');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedOppId, setSelectedOppId] = useState(
    activeOpportunity?.id || Object.keys(plans)[0] || 'freelance-web-dev'
  );

  // Sync if activeOpportunity changes externally
  useEffect(() => {
    if (activeOpportunity?.id) {
      setSelectedOppId(activeOpportunity.id);
      // Auto-initialize plan if not exists
      if (!plans[activeOpportunity.id]) {
        const newPlans = {
          ...plans,
          [activeOpportunity.id]: {
            stage: 'Prepare',
            tasks: {},
            customNotes: ''
          }
        };
        setPlans(newPlans);
        localStorage.setItem('incomepath_action_plans', JSON.stringify(newPlans));
      }
    }
  }, [activeOpportunity]);

  const currentOpp = allOpportunities.find(o => o.id === selectedOppId) || activeOpportunity;
  const currentPlanState = plans[selectedOppId] || { stage: 'Research', tasks: {}, customNotes: '' };

  const handleToggleTask = (taskKey) => {
    const updatedTasks = {
      ...currentPlanState.tasks,
      [taskKey]: !currentPlanState.tasks[taskKey]
    };
    const updatedPlan = {
      ...currentPlanState,
      tasks: updatedTasks
    };
    const newPlans = { ...plans, [selectedOppId]: updatedPlan };
    setPlans(newPlans);
    localStorage.setItem('incomepath_action_plans', JSON.stringify(newPlans));
  };

  const handleSetStage = (stageName) => {
    const updatedPlan = { ...currentPlanState, stage: stageName };
    const newPlans = { ...plans, [selectedOppId]: updatedPlan };
    setPlans(newPlans);
    localStorage.setItem('incomepath_action_plans', JSON.stringify(newPlans));
  };

  const handleDeletePlan = (oppId) => {
    const newPlans = { ...plans };
    delete newPlans[oppId];
    setPlans(newPlans);
    localStorage.setItem('incomepath_action_plans', JSON.stringify(newPlans));
    const remainingKeys = Object.keys(newPlans);
    if (remainingKeys.length > 0) setSelectedOppId(remainingKeys[0]);
  };

  // Calculate task completion percentage
  const totalTasks = currentOpp?.sevenDayPlan?.reduce((acc, d) => acc + (d.tasks?.length || 0), 0) || 1;
  const completedCount = Object.values(currentPlanState.tasks || {}).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  if (!currentOpp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
          <Calendar className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your 7-Day Action Plan</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No opportunity selected yet. Select an opportunity from Discover or Search and click <strong>Build My Plan (🚀)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* Plan Header */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Actionable 7-Day Roadmap
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {currentOpp.title}
            </h1>
            <p className="text-xs text-slate-400">
              Transforming intent into reality: Step-by-step milestones to secure your first attempt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectOpportunity(currentOpp)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Guide</span>
            </button>
            <button
              onClick={() => handleDeletePlan(currentOpp.id)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
              title="Delete this plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Metric */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Plan Progress</span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}% Completed ({completedCount}/{totalTasks} tasks)</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Opportunity Lifecycle Stages */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Opportunity Lifecycle Stage:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stages.map((stg, i) => {
              const isCurrent = currentPlanState.stage === stg;
              return (
                <button
                  key={stg}
                  onClick={() => handleSetStage(stg)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 mr-1">{i + 1}.</span>
                  {stg}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7-Day Step-by-Step Task Checklist */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>7-Day Daily Milestones</span>
        </h2>

        <div className="space-y-4">
          {currentOpp.sevenDayPlan?.map((planDay) => {
            return (
              <div 
                key={planDay.day} 
                className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-800">
                      D{planDay.day}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Day {planDay.day}: {planDay.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {planDay.tasks?.map((task, tIdx) => {
                    const taskKey = `d${planDay.day}-t${tIdx}`;
                    const isDone = Boolean(currentPlanState.tasks?.[taskKey]);

                    return (
                      <div
                        key={taskKey}
                        onClick={() => handleToggleTask(taskKey)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <span className={`leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Roadmap Gap Bridge (if skills need learning) */}
      {currentOpp.learningRoadmap && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Learning Roadmap &amp; Skill Gap Bridge</span>
          </div>

          <h3 className="text-lg font-bold text-white">Bridge the Skill Gap</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Target Focus: <strong className="text-slate-200">{currentOpp.learningRoadmap.currentSkillGap}</strong>
          </p>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Recommended Free Learning Resources:</span>
            <div className="flex flex-wrap gap-2">
              {currentOpp.learningRoadmap.resources?.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpenExternalLink ? onOpenExternalLink(res.url, res.name) : window.open(res.url, '_blank', 'noopener,noreferrer')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{res.name}</span>
                  {res.free && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded">FREE</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block font-semibold mb-1">Practice Project Goal:</span>
              <p className="text-slate-300">{currentOpp.learningRoadmap.practiceProject}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 block font-semibold mb-1">First Gig Target:</span>
              <p className="text-slate-300">{currentOpp.learningRoadmap.firstGigAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
