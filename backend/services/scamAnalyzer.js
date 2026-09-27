// backend/services/scamAnalyzer.js
// Heuristic analyzer to identify employment, task, and investment scams

export function analyzeOpportunityText(text) {
  if (!text || text.trim().length < 15) {
    return {
      riskLevel: "Insufficient Information",
      riskScore: 0,
      confidence: "Low",
      summary: "Please paste more details from the job offer, message, or website to perform a meaningful scan.",
      redFlags: [],
      reasons: [],
      safetyChecklist: [
        "Request official company domain email address (not @gmail or @outlook)",
        "Search the company name + 'scam' or 'complaints' on Google",
        "Never send money to start working"
      ]
    };
  }

  const redFlags = [];
  let riskScore = 0;
  const lower = text.toLowerCase();

  // Pattern 1: Upfront payment / registration fee / security deposit / courier fee
  const upfrontMatches = text.match(/(registration fee|security deposit|refundable deposit|training fee|kit fee|courier fee|delivery fee|shipping fee|dispatch fee|processing (?:charge|fee)|pay upfront|pay [₹$€£\d,]+.*refundable|refundable.*fee|recharge your wallet|deposit.*to start)/i);
  if (upfrontMatches) {
    redFlags.push({
      category: "Upfront Payment Demand",
      severity: "CRITICAL",
      description: "Asking for money before you start is the #1 hallmark of employment fraud. Legitimate employers pay you; they NEVER charge you.",
      matchedText: upfrontMatches[0]
    });
    riskScore += 45;
  }

  // Pattern 2: Telegram / WhatsApp tasks / Like & Subscribe tasks
  const taskScamMatches = text.match(/(telegram|whatsapp|like.*youtube.*video|subscribe.*channel.*earn|hotel.*review.*rating|task.*commission|prepaid task)/i);
  if (taskScamMatches) {
    redFlags.push({
      category: "Task / Telegram / WhatsApp Contact Channel",
      severity: "CRITICAL",
      description: "Directing professional recruitment communication or tasks exclusively to Telegram or WhatsApp is standard cyber fraud practice.",
      matchedText: taskScamMatches[0]
    });
    riskScore += 40;
  }

  // Pattern 3: Unrealistic guaranteed income claims
  const guaranteedMatches = text.match(/(guaranteed income|100% guarantee|earn [₹$€£]?[0-9,]{4,}.*daily|earn [₹$€£]?[0-9,]{5,}.*per day|daily payout [₹$€£]?[0-9,]{3,}|passive income guaranteed|no risk.*high return|zero risk|double your money|receive double|double in \d+ hours?)/i);
  if (guaranteedMatches) {
    redFlags.push({
      category: "Unrealistic Guaranteed Returns",
      severity: "HIGH",
      description: "No legitimate business guarantees fixed daily windfalls without demanding high skill, capital, or real labor.",
      matchedText: guaranteedMatches[0]
    });
    riskScore += 35;
  }

  // Pattern 4: Fake check / purchasing equipment via personal check / kit delivery fees
  const checkMatches = text.match(/(check.*equipment|deposit.*check|wire.*excess|vendor.*home office|send back the remaining|cashier's check|fee to receive.*(?:laptop|macbook|equipment|badge|kit)|courier.*(?:macbook|laptop|kit|equipment))/i);
  if (checkMatches) {
    redFlags.push({
      category: "Equipment Delivery / Kit Fee Trap",
      severity: "CRITICAL",
      description: "Charging applicants for laptops, ID kits, or couriers before work begins is a prevalent advance-fee employment scam.",
      matchedText: checkMatches[0]
    });
    riskScore += 45;
  }

  // Pattern 5: Credential, OTP, or Remote Access requests
  const credentialMatches = text.match(/(otp|anydesk|teamviewer|remote access|bank password|cvv|share screen.*verification)/i);
  if (credentialMatches) {
    redFlags.push({
      category: "Credential / Remote Access Threat",
      severity: "CRITICAL",
      description: "Asking to install remote desktop tools (AnyDesk/TeamViewer) or requesting OTPs will grant fraudsters direct access to your bank accounts.",
      matchedText: credentialMatches[0]
    });
    riskScore += 50;
  }

  // Pattern 6: Crypto deposits or multi-level recruiting
  const mlmMatches = text.match(/(usdt deposit|crypto wallet|\b[0-9.]+\s*(?:btc|eth|usdt)\b|smart contract|trading bot|recruit \d+ friends|referral commission tree|binary matrix|smart contract profit)/i);
  if (mlmMatches) {
    redFlags.push({
      category: "Crypto / MLM Ponzi Scheme",
      severity: "HIGH",
      description: "Requires recruiting others or depositing cryptocurrency into unregulated smart contracts or wallets.",
      matchedText: mlmMatches[0]
    });
    riskScore += 40;
  }

  // Pattern 7: Urgency / Pressure tactics
  const urgencyMatches = text.match(/(hurry(?:\s+up)?|immediate start|urgent.*transfer|offer expires|limited spots?|only \d+ spots)/i);
  if (urgencyMatches) {
    redFlags.push({
      category: "Artificial Urgency & Pressure",
      severity: "MEDIUM",
      description: "Scammers artificially manufacture extreme time pressure to prevent you from doing due diligence or consulting family.",
      matchedText: urgencyMatches[0]
    });
    riskScore += 15;
  }

  // Pattern 8: Free email domains for executive hiring
  const emailDomainMatches = text.match(/([a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.com)/i);
  if (emailDomainMatches && text.match(/(hr manager|recruiter|executive|multinational|corp)/i)) {
    redFlags.push({
      category: "Unverified Free Email Domain",
      severity: "MEDIUM",
      description: `Claiming to represent an established corporation while communicating through a free public webmail (${emailDomainMatches[0]}) instead of an official company domain.`,
      matchedText: emailDomainMatches[0]
    });
    riskScore += 20;
  }

  // Determine overall risk level
  let riskLevel = "Likely Legitimate / Low Risk";
  let badgeColor = "green";
  if (riskScore >= 45) {
    riskLevel = "CRITICAL RISK: Highly Probable Scam";
    badgeColor = "red";
  } else if (riskScore >= 25) {
    riskLevel = "HIGH RISK: Multiple Red Flags Detected";
    badgeColor = "orange";
  } else if (riskScore > 0) {
    riskLevel = "MODERATE RISK: Needs Caution & Verification";
    badgeColor = "yellow";
  }

  const reasons = redFlags.length > 0
    ? redFlags.map(r => `${r.category}: ${r.description}`)
    : ["No high-risk keywords detected; verified against known scam patterns"];

  return {
    riskLevel,
    riskScore: Math.min(riskScore, 100),
    badgeColor,
    redFlagsCount: redFlags.length,
    redFlags,
    reasons,
    summary: generateScamSummary(riskLevel, redFlags),
    safetyChecklist: [
      "NEVER pay money upfront for job registration, training kits, or software licenses.",
      "NEVER install remote desktop applications (AnyDesk, TeamViewer) at a stranger's request.",
      "NEVER accept checks with instructions to refund the excess balance.",
      "Verify the employer's official website and reach out directly through their corporate switchboard.",
      "Keep all communications and contracts within verified freelance platforms (Upwork, Fiverr) with escrow."
    ]
  };
}

function generateScamSummary(riskLevel, redFlags) {
  if (redFlags.length === 0) {
    return "No obvious scam triggers or high-risk keywords were detected in the text. However, always exercise normal precautions: never provide passwords, OTPs, or upfront fees.";
  }
  if (redFlags.some(r => r.severity === "CRITICAL")) {
    return "WARNING: This opportunity exhibits critical patterns commonly seen in financial and employment fraud schemes. We strongly advise declining or ceasing communication immediately.";
  }
  return "CAUTION: This message contains several warning indicators. Please review the highlighted red flags below and do not commit funds or sensitive credentials.";
}
