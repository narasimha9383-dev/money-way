// src/components/SmartQuestionnaire.jsx
// Smart adaptive questionnaire with:
// - Fade + horizontal slide animations between steps (Section 21)
// - Conditional question flow — transport only shown for outdoor users (Section 12)
// - No unnecessary questions for online-only users (Section 11)
// - Clear progress indicator (Section 23)
// - Zero fake earning claims or promises anywhere (Section 5)

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  MapPin,
  Coins,
  Wrench,
  GraduationCap,
  Laptop,
  HeartHandshake,
  Target,
  Globe2,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Sparkles
} from 'lucide-react';

const timeOptions = [
  '<30 min/day',
  '30–60 min/day',
  '1–2 hours/day',
  '2–4 hours/day',
  '4–8 hours/day',
  'Full-time',
  'Weekends only'
];

const timeOfDayOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];

const locationOptions = [
  { id: 'Indoors only', label: '🏠 Indoors / Home', desc: 'Strictly from home or indoor spaces' },
  { id: 'Online / Remote', label: '🌐 Online / Remote', desc: 'Digital tasks via internet only' },
  { id: 'Outside', label: '🚶 Outside / Field', desc: 'Active physical movement or local transit' },
  { id: 'Office / Workplace', label: '🏢 Office / Co-working', desc: 'Dedicated professional workspace' },
  { id: 'Either', label: '📍 Either / Flexible', desc: 'Comfortable with both remote and local' }
];

const transportOptions = [
  'No vehicle',
  'Bicycle',
  'Bike / Motorcycle',
  'Car',
  'Public transport'
];

const budgetOptions = [
  { id: '₹0', label: '₹0 (Completely Free)', desc: 'Use existing phone/laptop only. Zero upfront spending.' },
  { id: 'Under ₹500', label: 'Under ₹500', desc: 'Minimal software subscription or local travel test.' },
  { id: '₹500–₹2,000', label: '₹500–₹2,000', desc: 'Custom domain, small toolkit, or digital asset packs.' },
  { id: '₹2,000–₹10,000', label: '₹2,000–₹10,000', desc: 'Hardware accessories, certifications, or small stock.' },
  { id: '₹10,000+', label: '₹10,000+', desc: 'Commercial equipment, advanced tools, or micro-venture.' }
];

const skillCategories = {
  Technology: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Data Analysis', 'AI', 'Video Editing', 'UI/UX', 'Web development'],
  Academic: ['Mathematics', 'Science', 'English', 'Tutoring', 'Exam preparation'],
  Communication: ['Teaching', 'Speaking', 'Writing', 'Translation', 'Customer Support', 'Sales'],
  Creative: ['Photography', 'Graphic Design', 'Drawing', 'Music', 'Content Creation'],
  Practical: ['Cooking', 'Driving', 'Repair', 'Fitness', 'Handicrafts', 'Event assistance']
};

const experienceLevels = [
  { id: 'Complete beginner', desc: 'No prior relevant work experience yet' },
  { id: 'Some experience', desc: 'Tried it a bit, have basic understanding' },
  { id: 'Intermediate', desc: 'Comfortable with the basics, some hands-on projects' },
  { id: 'Advanced', desc: 'Significant skill depth, handled real projects' },
  { id: 'Professional', desc: 'Practiced at a professional or commercial level' }
];

const equipmentOptions = [
  { id: 'Smartphone', label: '📱 Smartphone' },
  { id: 'Laptop', label: '💻 Laptop' },
  { id: 'Desktop', label: '🖥️ Desktop PC' },
  { id: 'Internet connection', label: '🌐 Reliable Internet' },
  { id: 'Camera', label: '📷 DSLR / Mirrorless Camera' },
  { id: 'Vehicle', label: '🛵 Vehicle (Bike / Car / Bicycle)' },
  { id: 'Workspace', label: '🪑 Quiet Home Workspace' },
  { id: 'Existing social-media audience', label: '📣 Existing Social Media Audience' },
  { id: 'None of these', label: '❌ None of these' }
];

const personalityOptions = [
  'Working alone',
  'Working with people',
  'Teaching',
  'Technical work',
  'Creative work',
  'Physical work',
  'Selling',
  'Building something long-term',
  'Fast/simple tasks'
];

const incomeGoalOptions = [
  { id: 'Small extra income', desc: 'A little extra each month — no pressure' },
  { id: 'Side income', desc: 'Consistent part-time earnings alongside a main job or study' },
  { id: 'Replace part-time income', desc: 'Replace a part-time or freelance income source' },
  { id: 'Full-time income', desc: 'Aim for a full primary source of income' },
  { id: 'Build a business', desc: 'Scale into a proper business over time' },
  { id: 'Develop a valuable skill', desc: 'Earning is secondary — skill-building is the goal' }
];

const countryOptions = [
  { id: 'India', flag: '🇮🇳' },
  { id: 'USA', flag: '🇺🇸' },
  { id: 'UK', flag: '🇬🇧' },
  { id: 'Canada', flag: '🇨🇦' },
  { id: 'Australia', flag: '🇦🇺' },
  { id: 'Other', flag: '🌍' }
];

// Step configuration — used for smart step sequence computation
const ALL_STEPS = [
  'time',
  'location',
  'transport',   // Conditional: only shown if user wants outdoor/either work
  'budget',
  'skills',
  'experience',
  'equipment',
  'personality',
  'incomeGoal',
  'country'
];

export default function SmartQuestionnaire({ initialProfile = {}, onComplete, onCancel }) {
  const [availableTime, setAvailableTime] = useState(initialProfile.availableTime || '1–2 hours/day');
  const [availabilitySlot, setAvailabilitySlot] = useState(initialProfile.availabilitySlot || 'Flexible');
  const [location, setLocation] = useState(initialProfile.location || ['Online / Remote']);
  const [transportation, setTransportation] = useState(initialProfile.transportation || 'No vehicle');
  const [budget, setBudget] = useState(initialProfile.budget || '₹0');
  const [skills, setSkills] = useState(initialProfile.skills || []);
  const [noSkillsSelected, setNoSkillsSelected] = useState(
    Array.isArray(initialProfile.skills) && initialProfile.skills.includes("I don't have any specific skills yet.")
  );
  const [experienceLevel, setExperienceLevel] = useState(initialProfile.experienceLevel || 'Some experience');
  const [willingToLearn, setWillingToLearn] = useState(initialProfile.willingToLearn !== false);
  const [equipment, setEquipment] = useState(initialProfile.equipment || ['Smartphone', 'Internet connection']);
  const [workPersonality, setWorkPersonality] = useState(initialProfile.workPersonality || ['Working alone']);
  const [incomeGoal, setIncomeGoal] = useState(initialProfile.incomeGoal || 'Side income');
  const [country, setCountry] = useState(initialProfile.country || 'India');

  // Compute the active step sequence (skip transport for online-only users)
  const wantsOutdoor = location.some(l => l.includes('Outside') || l.includes('Either'));
  const activeSteps = ALL_STEPS.filter(s => {
    if (s === 'transport') return wantsOutdoor;
    return true;
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [animDir, setAnimDir] = useState('forward'); // 'forward' | 'backward'
  const [isAnimating, setIsAnimating] = useState(false);
  const prevStepRef = useRef(stepIndex);

  const currentStepId = activeSteps[stepIndex];
  const totalSteps = activeSteps.length;
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  const navigate = (dir) => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      if (dir === 'forward') setStepIndex(i => i + 1);
      else setStepIndex(i => i - 1);
      setIsAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      navigate('forward');
    } else {
      const finishedProfile = {
        availableTime,
        availabilitySlot,
        location,
        transportation: wantsOutdoor ? transportation : 'Not required',
        budget,
        skills: noSkillsSelected ? ["I don't have any specific skills yet."] : skills,
        experienceLevel,
        willingToLearn,
        equipment,
        workPersonality,
        incomeGoal,
        country
      };
      onComplete(finishedProfile);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) navigate('backward');
  };

  // Multi-select toggle helpers
  const toggleLocation = (id) => {
    if (location.includes(id)) {
      if (location.length > 1) setLocation(location.filter(l => l !== id));
    } else {
      setLocation([...location, id]);
    }
  };

  const toggleSkill = (skill) => {
    if (noSkillsSelected) setNoSkillsSelected(false);
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills.filter(s => !s.includes("don't have")), skill]);
    }
  };

  const handleNoSkillsToggle = () => {
    if (!noSkillsSelected) {
      setNoSkillsSelected(true);
      setSkills(["I don't have any specific skills yet."]);
    } else {
      setNoSkillsSelected(false);
      setSkills([]);
    }
  };

  const toggleEquipment = (id) => {
    if (id === 'None of these') {
      setEquipment(['None of these']);
      return;
    }
    const filtered = equipment.filter(e => e !== 'None of these');
    if (filtered.includes(id)) {
      setEquipment(filtered.filter(e => e !== id));
    } else {
      setEquipment([...filtered, id]);
    }
  };

  const togglePersonality = (p) => {
    if (workPersonality.includes(p)) {
      if (workPersonality.length > 1) setWorkPersonality(workPersonality.filter(x => x !== p));
    } else {
      setWorkPersonality([...workPersonality, p]);
    }
  };

  const slideClass = isAnimating
    ? animDir === 'forward'
      ? 'opacity-0 -translate-x-4'
      : 'opacity-0 translate-x-4'
    : 'opacity-100 translate-x-0';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Wizard Header & Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-emerald-400">Step {stepIndex + 1} of {totalSteps}</span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-400 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {activeSteps.map((s, i) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < stepIndex
                  ? 'bg-emerald-500 w-4'
                  : i === stepIndex
                  ? 'bg-emerald-400 w-6'
                  : 'bg-slate-700 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Animated content wrapper (Section 21: fade + horizontal slide) */}
        <div
          className={`transition-all duration-200 ease-out ${slideClass}`}
          style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div className="flex-1">

            {/* ── STEP: TIME ── */}
            {currentStepId === 'time' && (
              <div className="space-y-6">
                <StepHeader icon={Clock} label="Time Commitment">
                  <h2 className="text-2xl font-bold text-white">How much time can you dedicate?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Be honest. We only match opportunities that respect your available bandwidth.
                  </p>
                </StepHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {timeOptions.map((opt) => (
                    <OptionButton key={opt} selected={availableTime === opt} onClick={() => setAvailableTime(opt)}>
                      {opt}
                    </OptionButton>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    When are you usually available?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeOfDayOptions.map((tod) => (
                      <ChipButton key={tod} selected={availabilitySlot === tod} onClick={() => setAvailabilitySlot(tod)}>
                        {tod}
                      </ChipButton>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP: LOCATION ── */}
            {currentStepId === 'location' && (
              <div className="space-y-5">
                <StepHeader icon={MapPin} label="Working Environment">
                  <h2 className="text-2xl font-bold text-white">Where are you comfortable working?</h2>
                  <p className="text-xs text-slate-400 mt-1">Select all that apply.</p>
                </StepHeader>
                <div className="space-y-2.5">
                  {locationOptions.map((opt) => {
                    const isSelected = location.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleLocation(opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className={`text-sm font-semibold block ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-400">{opt.desc}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {/* Inline note — transport question will follow if outdoor selected */}
                {wantsOutdoor && (
                  <div className="text-xs text-amber-300/80 bg-amber-950/20 border border-amber-900/40 px-3 py-2 rounded-lg flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Since you selected outdoor work, the next step will ask about your transport.</span>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: TRANSPORT (conditional — only if outdoor/either selected) ── */}
            {currentStepId === 'transport' && (
              <div className="space-y-5">
                <StepHeader icon={MapPin} label="Local Mobility">
                  <h2 className="text-2xl font-bold text-white">Do you have personal transport?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Required for local delivery, neighbourhood services, or field work.
                  </p>
                </StepHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {transportOptions.map((t) => (
                    <OptionButton key={t} selected={transportation === t} onClick={() => setTransportation(t)}>
                      {t}
                    </OptionButton>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: BUDGET ── */}
            {currentStepId === 'budget' && (
              <div className="space-y-5">
                <StepHeader icon={Coins} label="Financial Startup Budget">
                  <h2 className="text-2xl font-bold text-white">How much can you start with?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Hard filter: we will never suggest an opportunity requiring more upfront capital than this.
                  </p>
                </StepHeader>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/70 text-amber-300 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> Startup cost and potential earnings are evaluated completely separately.
                    More investment does not mean more income.
                  </span>
                </div>
                <div className="space-y-2.5">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBudget(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        budget === opt.id
                          ? 'bg-emerald-950/60 border-emerald-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${budget === opt.id ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-400">{opt.desc}</span>
                      </div>
                      {budget === opt.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: SKILLS ── */}
            {currentStepId === 'skills' && (
              <div className="space-y-4">
                <StepHeader icon={Wrench} label="Existing Capabilities">
                  <h2 className="text-2xl font-bold text-white">What can you already do?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select skills you have practiced or feel comfortable using.
                  </p>
                </StepHeader>
                <button
                  type="button"
                  onClick={handleNoSkillsToggle}
                  className={`w-full p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                    noSkillsSelected
                      ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌱 "I don't have any specific skills yet." — Show zero-barrier &amp; rapid learning paths
                </button>
                {!noSkillsSelected && (
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                    {Object.entries(skillCategories).map(([catName, list]) => (
                      <div key={catName} className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{catName}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {list.map((skill) => {
                            const active = skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                  active
                                    ? 'bg-emerald-600 text-white border-emerald-500'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: EXPERIENCE ── */}
            {currentStepId === 'experience' && (
              <div className="space-y-5">
                <StepHeader icon={GraduationCap} label="Proficiency Level">
                  <h2 className="text-2xl font-bold text-white">What is your general experience level?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Helps calibrate whether to suggest beginner gigs or high-leverage client work.
                  </p>
                </StepHeader>
                <div className="space-y-2">
                  {experienceLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        experienceLevel === lvl.id
                          ? 'bg-emerald-950/60 border-emerald-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${experienceLevel === lvl.id ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {lvl.id}
                        </span>
                        <span className="text-xs text-slate-400">{lvl.desc}</span>
                      </div>
                      {experienceLevel === lvl.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Willing to learn a new skill if a clear roadmap is provided?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Yes', value: true },
                      { label: 'Maybe', value: true },
                      { label: 'No', value: false }
                    ].map((choice) => (
                      <button
                        key={choice.label}
                        type="button"
                        onClick={() => setWillingToLearn(choice.value)}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                          (choice.label === 'No' ? !willingToLearn : willingToLearn)
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP: EQUIPMENT ── */}
            {currentStepId === 'equipment' && (
              <div className="space-y-5">
                <StepHeader icon={Laptop} label="Available Resources">
                  <h2 className="text-2xl font-bold text-white">What do you currently own?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select what is ready for your use today. Hard filter: we will never recommend something requiring equipment you don't have.
                  </p>
                </StepHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {equipmentOptions.map((eq) => {
                    const checked = equipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => toggleEquipment(eq.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          checked
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{eq.label}</span>
                        {checked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP: PERSONALITY ── */}
            {currentStepId === 'personality' && (
              <div className="space-y-5">
                <StepHeader icon={HeartHandshake} label="Work Style">
                  <h2 className="text-2xl font-bold text-white">What type of work do you prefer?</h2>
                  <p className="text-xs text-slate-400 mt-1">Choose styles that match your natural energy (multiple allowed).</p>
                </StepHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {personalityOptions.map((p) => {
                    const active = workPersonality.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePersonality(p)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                          active
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{p}</span>
                        {active && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP: INCOME GOAL ── */}
            {currentStepId === 'incomeGoal' && (
              <div className="space-y-5">
                <StepHeader icon={Target} label="Income Objective">
                  <h2 className="text-2xl font-bold text-white">What are you trying to achieve?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    This guides complexity filtering. No specific income amounts are promised.
                  </p>
                </StepHeader>
                <div className="space-y-2">
                  {incomeGoalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setIncomeGoal(goal.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        incomeGoal === goal.id
                          ? 'bg-emerald-950/60 border-emerald-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${incomeGoal === goal.id ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {goal.id}
                        </span>
                        <span className="text-xs text-slate-400">{goal.desc}</span>
                      </div>
                      {incomeGoal === goal.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: COUNTRY ── */}
            {currentStepId === 'country' && (
              <div className="space-y-5">
                <StepHeader icon={Globe2} label="Country & Jurisdiction">
                  <h2 className="text-2xl font-bold text-white">Which country are you in?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Payment gateways (UPI, PayPal, Stripe), platform availability, and tax rules differ by country. We filter unavailable platforms.
                  </p>
                </StepHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {countryOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCountry(c.id)}
                      className={`p-3.5 rounded-xl border text-center text-sm font-medium transition-all ${
                        country === c.id
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{c.flag}</span>
                      {c.id}
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-200 block mb-1">Ready to generate recommendations</span>
                  Clicking <strong>Generate Recommendations</strong> runs eligibility checks, budget hard-filters, and country availability filters to produce your custom list with transparent match explanations.
                </div>
              </div>
            )}

          </div>

          {/* Wizard Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
            <div>
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isAnimating}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {stepIndex < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Generate Recommendations</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable sub-components for the questionnaire ──

function StepHeader({ icon: Icon, label, children }) {
  return (
    <div className="space-y-1 mb-2">
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
        selected
          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
      }`}
    >
      <span>{children}</span>
      {selected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
    </button>
  );
}

function ChipButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        selected
          ? 'bg-emerald-600 text-white border-emerald-500'
          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
