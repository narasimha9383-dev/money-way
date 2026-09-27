// backend/services/recommendationEngine.js
import { opportunities } from '../data/opportunities.js';

export function evaluateOpportunityMatch(opp, profile) {
  const whyMatches = [];
  const possibleMismatches = [];
  const whyNotReasons = [];

  // 1. HARD FILTER: Country Availability
  if (profile.country && opp.countryAvailability && !opp.countryAvailability.includes(profile.country) && !opp.countryAvailability.includes("Other")) {
    whyNotReasons.push(`Not available or regulated in ${profile.country}.`);
  }

  // 2. HARD FILTER: Budget
  const maxUserBudget = parseBudget(profile.budget);
  const minInvestment = opp.investment?.min ?? 0;
  if (minInvestment > maxUserBudget) {
    whyNotReasons.push(`Requires minimum startup investment of ₹${minInvestment.toLocaleString()}, which exceeds your budget of ${profile.budget}.`);
  } else {
    if (minInvestment === 0) {
      whyMatches.push(`Zero starting capital required (₹0 initial cost)`);
    } else {
      whyMatches.push(`Initial investment fits comfortably inside your stated budget`);
    }
  }

  // 3. HARD FILTER: Location & Environment
  const prefLocations = Array.isArray(profile.location) ? profile.location : [profile.location || "Online / Remote"];
  const wantsOnlyIndoorsOrOnline = prefLocations.some(l => l.includes("Indoors") || l.includes("Online") || l.includes("Home"));
  const acceptsOutside = prefLocations.some(l => l.includes("Outside") || l.includes("Either") || l.includes("Local"));

  if (opp.mode === "Offline" && wantsOnlyIndoorsOrOnline && !acceptsOutside) {
    whyNotReasons.push(`Requires local in-person or outdoor work, but your preference is staying indoors / online.`);
  } else if (opp.mode === "Online" || opp.locationType === "Remote" || opp.remote) {
    whyMatches.push(`100% remote / work from home friendly`);
  }

  // 4. HARD FILTER: Equipment / Resources
  const userEquipment = Array.isArray(profile.equipment) ? profile.equipment : [];
  const hasLaptop = userEquipment.some(e => /laptop|desktop/i.test(e));
  const hasVehicle = userEquipment.some(e => /vehicle|bike|bicycle|car/i.test(e)) || /bike|bicycle|car/i.test(profile.transportation || "");
  const hasCamera = userEquipment.some(e => /camera/i.test(e));
  const hasInternet = userEquipment.some(e => /internet/i.test(e));
  const reqEquipment = Array.isArray(opp.requiredEquipment) ? opp.requiredEquipment : [];

  if (reqEquipment.some(e => e === "Laptop" || e === "Desktop") && !hasLaptop) {
    whyNotReasons.push(`Requires a computer or laptop, which was not selected in your resources.`);
  }

  if (reqEquipment.includes("Vehicle") && !hasVehicle) {
    whyNotReasons.push(`Requires a personal vehicle or bicycle for local mobility.`);
  }

  if (reqEquipment.includes("Camera") && !hasCamera) {
    whyNotReasons.push(`Requires dedicated DSLR or Mirrorless camera equipment.`);
  }

  if (reqEquipment.includes("Internet connection") && !hasInternet && userEquipment.length > 0) {
    if (!userEquipment.includes("Internet connection") && !userEquipment.includes("None of these")) {
      possibleMismatches.push(`Requires reliable broadband or mobile internet.`);
    }
  }

  if (hasLaptop && reqEquipment.some(e => e === "Laptop" || e === "Desktop")) {
    whyMatches.push(`Compatible with your existing laptop/computer`);
  }
  if (hasVehicle && reqEquipment.includes("Vehicle")) {
    whyMatches.push(`Leverages your available transportation`);
  }

  // 5. HARD FILTER: Time Available
  const userHours = parseTimeHours(profile.availableTime);
  const minHoursNeeded = opp.timeRequired?.minHoursPerDay ?? 1;
  if (userHours < minHoursNeeded) {
    whyNotReasons.push(`Requires at least ${minHoursNeeded} hours/day, but your available time is ${profile.availableTime}.`);
  } else {
    whyMatches.push(`Fits your available schedule (${profile.availableTime})`);
  }

  // 6. Hard Filter Check
  const isEligible = whyNotReasons.length === 0;

  // 7. Skills & Learning Matching
  const userSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const hasSpecificSkills = !userSkills.includes("I don't have a specific skill yet.") && !userSkills.includes("I don't have any specific skills yet.") && userSkills.length > 0;
  
  const oppSkills = Array.isArray(opp.requiredSkills) ? opp.requiredSkills : (opp.requirements || []);
  let matchingSkills = [];
  if (hasSpecificSkills) {
    matchingSkills = oppSkills.filter(reqSkill => 
      userSkills.some(userSkill => 
        String(reqSkill).toLowerCase().includes(String(userSkill).toLowerCase()) || 
        String(userSkill).toLowerCase().includes(String(reqSkill).toLowerCase())
      )
    );
  }

  if (matchingSkills.length > 0) {
    whyMatches.push(`Directly utilizes your selected skills: ${matchingSkills.join(", ")}`);
  } else if (!opp.isBeginnerFriendly && !profile.willingToLearn) {
    possibleMismatches.push(`Requires specialized skills you have not listed, with learning willingness set to low.`);
  } else if (opp.isBeginnerFriendly) {
    whyMatches.push(`Beginner-friendly: accessible even without deep prior technical expertise`);
  } else if (profile.willingToLearn) {
    whyMatches.push(`Great learning curve that aligns with your willingness to build a new skill`);
    possibleMismatches.push(`Requires 1–2 weeks of upfront practice before securing your first paying client`);
  }

  // 8. Work Personality Alignment
  const userPersonalities = Array.isArray(profile.workPersonality) ? profile.workPersonality : [];
  const suitablePersonalities = Array.isArray(opp.suitablePersonalities) ? opp.suitablePersonalities : [];
  const matchedPersonalities = suitablePersonalities.filter(p => userPersonalities.includes(p));
  if (matchedPersonalities.length > 0) {
    whyMatches.push(`Matches your preferred work style (${matchedPersonalities.join(", ")})`);
  }

  // 9. Income Goal Alignment
  const incomeGoals = Array.isArray(opp.incomeGoals) ? opp.incomeGoals : [];
  if (profile.incomeGoal && incomeGoals.includes(profile.incomeGoal)) {
    whyMatches.push(`Proven alignment with your primary goal: "${profile.incomeGoal}"`);
  }

  // 10. Realistic Caveats
  if (opp.challenges && opp.challenges.length > 0) {
    possibleMismatches.push(opp.challenges[0]);
  }
  if (opp.incomeModel && (opp.incomeModel.includes("Per project") || opp.incomeModel.includes("Commission"))) {
    possibleMismatches.push("Income is variable and based on client acquisition / output, not a fixed hourly wage.");
  }

  // Match Level determination
  let score = 0;
  score += matchingSkills.length * 30;
  score += matchedPersonalities.length * 15;
  if (opp.isBeginnerFriendly && (profile.experienceLevel === "Complete beginner" || profile.experienceLevel === "Beginner")) score += 20;
  if (opp.isAdvanced && (profile.experienceLevel === "Advanced" || profile.experienceLevel === "Professional")) score += 25;
  if ((opp.investment?.min ?? 0) === 0 && parseBudget(profile.budget) === 0) score += 20;

  const matchLevel = score >= 35 || matchingSkills.length > 0 ? "Strong Match" : "Partial Match";

  // Context explanation
  const whyAppeared = generateWhyAppearedSentence(opp, profile, matchingSkills, userHours);

  return {
    isEligible,
    matchLevel,
    score,
    whyAppeared,
    whyMatches,
    possibleMismatches,
    whyNotReasons
  };
}

export function normalizeProfile(rawProfile = {}) {
  const p = { ...rawProfile };
  
  if (p.timeAvailable && !p.availableTime) {
    if (p.timeAvailable === '2_hours' || p.timeAvailable === '2') {
      p.availableTime = '1–2 hours/day';
    } else if (p.timeAvailable === '1_hour' || p.timeAvailable === '1') {
      p.availableTime = '30–60 min/day';
    } else if (p.timeAvailable === '4_hours' || p.timeAvailable === '4') {
      p.availableTime = '2–4 hours/day';
    } else {
      p.availableTime = String(p.timeAvailable);
    }
  }

  if (typeof p.budget === 'number') {
    p.budget = p.budget === 0 ? '₹0' : p.budget <= 500 ? 'Under ₹500' : p.budget <= 2000 ? '₹500–₹2,000' : '₹10,000+';
  }

  if (p.workType && !p.location) {
    if (p.workType === 'remote' || p.workType === 'online') {
      p.location = ['Online / Remote'];
    } else if (p.workType === 'offline' || p.workType === 'local') {
      p.location = ['Local / In-person'];
    } else {
      p.location = ['Online / Remote', 'Local / In-person'];
    }
  }

  if (p.resources && !p.equipment) {
    p.equipment = p.resources.map(r => {
      if (r === 'laptop') return 'Laptop';
      if (r === 'smartphone' || r === 'phone') return 'Smartphone';
      if (r === 'internet') return 'Internet connection';
      if (r === 'vehicle') return 'Vehicle';
      if (r === 'camera') return 'Camera';
      return r;
    });
  }

  if (p.goal && !p.incomeGoal) {
    if (p.goal === 'side_income') p.incomeGoal = 'Side income';
    else if (p.goal === 'full_time') p.incomeGoal = 'Full-time income';
    else p.incomeGoal = p.goal;
  }

  return p;
}

export function recommendOpportunities(rawProfile, options = {}) {
  const profile = normalizeProfile(rawProfile);
  const {
    rejectedIds = [],
    excludeIds = [],
    viewedIds = [],
    modeFilter = "Both", // "Online", "Offline", "Both"
    complexityMode = "all", // "beginner", "advanced", "all"
    limit = 10,
    allOpportunities = opportunities
  } = options;

  const sourceOpportunities = Array.isArray(allOpportunities) && allOpportunities.length > 0 
    ? allOpportunities 
    : opportunities;

  const combinedExclude = new Set([...rejectedIds, ...excludeIds, ...viewedIds]);
  const results = [];

  for (const opp of sourceOpportunities) {
    // Exclude rejected and previously displayed opportunities (Sections 14 & 15)
    if (combinedExclude.has(opp.id)) {
      continue;
    }

    // Exclude unverified opportunities from primary recommendations (Sections 9 & 11)
    if (opp.verification?.status?.toLowerCase() !== 'verified') {
      continue;
    }

    // Complexity Mode Filter
    if (complexityMode === "beginner" && opp.isAdvanced && !opp.isBeginnerFriendly) {
      continue;
    }
    if (complexityMode === "advanced" && opp.isBeginnerFriendly && !opp.isAdvanced) {
      // allow, but prioritize advanced
    }

    // Online / Offline filter
    if (modeFilter === "Online" && opp.mode === "Offline") {
      continue;
    }
    if (modeFilter === "Offline" && opp.mode === "Online") {
      continue;
    }

    const evaluation = evaluateOpportunityMatch(opp, profile);
    if (evaluation.isEligible) {
      results.push({
        ...opp,
        matchLevel: evaluation.matchLevel,
        score: evaluation.score,
        whyAppeared: evaluation.whyAppeared,
        whyMatches: evaluation.whyMatches,
        possibleMismatches: evaluation.possibleMismatches
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

export function getSurpriseOpportunity(profile, currentIds = [], rejectedIds = [], allOpportunities = opportunities) {
  const eligibleOpps = [];
  const sourceOpportunities = Array.isArray(allOpportunities) && allOpportunities.length > 0 
    ? allOpportunities 
    : opportunities;

  for (const opp of sourceOpportunities) {
    if (rejectedIds.includes(opp.id) || currentIds.includes(opp.id)) continue;
    const evaluation = evaluateOpportunityMatch(opp, profile);
    if (evaluation.isEligible) {
      eligibleOpps.push({
        ...opp,
        matchLevel: evaluation.matchLevel,
        whyAppeared: `Surprise pick: An alternative pathway that strictly meets your time, budget, and device criteria!`,
        whyMatches: evaluation.whyMatches,
        possibleMismatches: evaluation.possibleMismatches
      });
    }
  }

  if (eligibleOpps.length === 0) return null;
  // Pick a random eligible one
  const randomIndex = Math.floor(Math.random() * eligibleOpps.length);
  return eligibleOpps[randomIndex];
}

export function explainWhyNot(oppId, profile, allOpportunities = opportunities) {
  const sourceOpportunities = Array.isArray(allOpportunities) && allOpportunities.length > 0 
    ? allOpportunities 
    : opportunities;
  const opp = sourceOpportunities.find(o => o.id === oppId);
  if (!opp) return { found: false, reasons: ["Opportunity not found."] };
  const evaluation = evaluateOpportunityMatch(opp, profile);
  return {
    found: true,
    title: opp.title,
    isEligible: evaluation.isEligible,
    reasons: evaluation.whyNotReasons.length > 0 ? evaluation.whyNotReasons : ["This opportunity actually meets your basic criteria! Check requirements below."]
  };
}

function parseBudget(budgetStr) {
  if (!budgetStr) return 0;
  if (budgetStr === "₹0") return 0;
  if (budgetStr.includes("500") && !budgetStr.includes("2,000")) return 500;
  if (budgetStr.includes("2,000")) return 2000;
  if (budgetStr.includes("10,000")) return 10000;
  if (budgetStr.includes("10,000+")) return 999999;
  return 1000;
}

function parseTimeHours(timeStr) {
  if (!timeStr) return 2;
  if (timeStr.includes("<30") || timeStr.includes("Less than 30")) return 0.5;
  if (timeStr.includes("30–60") || timeStr.includes("30-60")) return 1.0;
  if (timeStr.includes("1–2") || timeStr.includes("1-2")) return 2.0;
  if (timeStr.includes("2–4") || timeStr.includes("2-4")) return 3.5;
  if (timeStr.includes("4–8") || timeStr.includes("4-8")) return 6.0;
  if (timeStr.includes("Full-time")) return 8.0;
  if (timeStr.includes("Weekends only") || timeStr.includes("Weekend")) return 4.0;
  return 2;
}

function generateWhyAppearedSentence(opp, profile, matchingSkills, userHours) {
  const parts = [];
  if (matchingSkills.length > 0) {
    parts.push(`you have experience with ${matchingSkills.slice(0, 2).join(" & ")}`);
  }
  if (profile.budget === "₹0" && (opp.investment?.min ?? 0) === 0) {
    parts.push(`you specified a ₹0 starting budget`);
  }
  if ((opp.mode === "Online" || opp.remote) && (profile.location?.includes("Online") || profile.location?.includes("Indoors"))) {
    parts.push(`you prefer working remotely/indoors`);
  }
  if (profile.availableTime) {
    parts.push(`you have ${profile.availableTime} available`);
  }

  if (parts.length === 0) {
    return `Matches your available resources, location preference, and time constraints.`;
  }

  return `Recommended because ${parts.join(", ")}.`;
}
