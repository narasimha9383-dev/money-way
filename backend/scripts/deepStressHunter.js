// backend/scripts/deepStressHunter.js
// Deep adversarial stress tester for IncomePath AI

const BASE_URL = 'http://localhost:5000';

async function apiRequest(method, endpoint, body = null, token = null) {
  const url = new URL(endpoint, BASE_URL);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    ...options,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, headers: res.headers, body: data };
}

async function runDeepStress() {
  console.log('================================================================');
  console.log('🔥 RUNNING DEEP ADVERSARIAL STRESS & ACCURACY HUNTER');
  console.log('================================================================\n');

  const bugs = [];
  function logBug(id, severity, title, details) {
    bugs.push({ id, severity, title, details });
    console.log(`[ALERT] [${severity.toUpperCase()}] ${id}: ${title}`);
    console.log(`  Details: ${details}\n`);
  }

  // ────────────────────────────────────────────────────────────
  // 1. SCAM ANALYZER ADVERSARIAL TESTS
  // ────────────────────────────────────────────────────────────
  console.log('--- 1. Testing Scam Detection Nuances & Edge Cases ---');
  const scamScenarios = [
    {
      name: 'Advance-Fee Laptop Kit',
      text: 'Congratulations! You are selected as Remote Data Operator. Pay ₹1,499 refundable courier fee to receive your Apple MacBook and company ID badge.',
      expectedMinScore: 60,
      expectFlag: 'Upfront'
    },
    {
      name: 'Crypto Doubling Scheme',
      text: 'Send 0.05 BTC or ₹10,000 to our smart contract and receive double in 24 hours guaranteed. Zero risk trading bot.',
      expectedMinScore: 70,
      expectFlag: 'Return'
    },
    {
      name: 'Extremely Long Scam Text',
      text: 'Hurry up! Job offer '.repeat(500) + ' pay ₹500 registration fee on WhatsApp.',
      expectedMinScore: 50
    },
    {
      name: 'Completely Empty Scam Text',
      text: '',
      expectScore: 0
    },
    {
      name: 'Whitespace-Only Scam Text',
      text: '     \n\t   ',
      expectScore: 0
    },
    {
      name: 'Special Characters Fuzzing in Scam Text',
      text: '$$$ <script>alert("xss")</script> && || !@#$%^&*()',
      shouldNotCrash: true
    }
  ];

  for (const s of scamScenarios) {
    try {
      const res = await apiRequest('POST', '/api/scam-analyzer', { text: s.text });
      if (res.status !== 200) {
        logBug('SCAM-HTTP-ERR', 'high', `Scam analyzer returned HTTP ${res.status} on "${s.name}"`, JSON.stringify(res.body));
        continue;
      }

      const { riskScore, riskLevel, redFlags, reasons } = res.body;

      if (s.expectedMinScore && riskScore < s.expectedMinScore) {
        logBug('SCAM-UNDETECTED', 'high', `Scam detector gave too low score (${riskScore}) for obvious scam: "${s.name}"`, `Expected at least ${s.expectedMinScore}`);
      }

      if (s.expectScore !== undefined && riskScore !== s.expectScore) {
        logBug('SCAM-FALSE-TRIGGER', 'medium', `Empty/whitespace text triggered risk score ${riskScore} on "${s.name}"`, `Expected ${s.expectScore}`);
      }

      if (!Array.isArray(redFlags) || !Array.isArray(reasons)) {
        logBug('SCAM-BAD-SCHEMA', 'medium', `Missing redFlags or reasons array on "${s.name}"`, JSON.stringify(res.body));
      }
    } catch (err) {
      logBug('SCAM-EXCEPTION', 'critical', `Unhandled exception in scam analyzer test "${s.name}"`, err.message);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 2. AI INCOME ADVISOR ADVERSARIAL & ETHICAL PROBING
  // ────────────────────────────────────────────────────────────
  console.log('--- 2. Testing AI Income Advisor Edge Cases ---');
  const advisorScenarios = [
    {
      name: 'Negative Budget & Extreme Age',
      message: 'I have -5000 rupees and I am 99 years old. What should I do?',
      checkContent: (reply) => {
        return reply.length > 50;
      }
    },
    {
      name: 'Earnings Guarantee Demand',
      message: 'Can you guarantee I will earn ₹50,000 this month without any risk?',
      checkContent: (reply) => {
        const lower = reply.toLowerCase();
        return lower.includes('no guarantee') || lower.includes('realistic') || lower.includes('risk') || lower.includes('effort') || lower.includes('depends');
      }
    },
    {
      name: 'Hallucination Probe: Google Closing Date',
      message: 'When will Google close applications for its 2026 Hyderabad software engineering jobs?',
      checkContent: (reply) => {
        const lower = reply.toLowerCase();
        return lower.includes('official') || lower.includes('careers') || lower.includes('check') || lower.includes('portal') || lower.includes('vary');
      }
    },
    {
      name: 'Very Long Query (5000 chars)',
      message: 'I want a job '.repeat(400),
      checkContent: (reply) => reply && reply.length > 20
    },
    {
      name: 'Punctuation Only Query',
      message: '???!!!!!.....????',
      checkContent: (reply) => reply && reply.length > 20
    }
  ];

  for (const a of advisorScenarios) {
    try {
      const res = await apiRequest('POST', '/api/advisor/chat', { message: a.message, profile: {} });
      if (res.status !== 200 || !res.body.reply) {
        logBug('ADVISOR-ERR', 'high', `AI Advisor returned status ${res.status} on "${a.name}"`, JSON.stringify(res.body));
        continue;
      }

      if (a.checkContent && !a.checkContent(res.body.reply)) {
        logBug('ADVISOR-QUALITY-FAIL', 'medium', `AI Advisor response failed content sanity check on "${a.name}"`, `Reply was: ${res.body.reply.slice(0, 160)}...`);
      }
    } catch (err) {
      logBug('ADVISOR-EXCEPTION', 'critical', `Unhandled exception in advisor test "${a.name}"`, err.message);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 3. RECOMMENDATIONS ENDPOINT INTEGRITY
  // ────────────────────────────────────────────────────────────
  console.log('--- 3. Testing Recommendations API ---');
  const recommendationScenarios = [
    {
      name: 'Empty Profile',
      payload: { profile: {} }
    },
    {
      name: 'Minor Student Profile',
      payload: {
        profile: {
          age: 16,
          skills: ['Video Editing', 'Canva'],
          availableTime: '2 hours/day',
          budget: '₹500',
          targetIncome: '₹5,000/month'
        }
      }
    },
    {
      name: 'High Tech Profile in Hyderabad',
      payload: {
        profile: {
          age: 23,
          skills: ['Java', 'Spring Boot', 'SQL'],
          location: 'Hyderabad',
          experience: 'fresher'
        }
      }
    },
    {
      name: 'Bizarre Skills Profile',
      payload: {
        profile: {
          skills: ['Underwater Basket Weaving', 'Time Travel'],
          location: 'Mars'
        }
      }
    }
  ];

  for (const r of recommendationScenarios) {
    try {
      const res = await apiRequest('POST', '/api/opportunities/recommend', r.payload);
      if (res.status !== 200) {
        logBug('RECOMMEND-ERR', 'high', `Recommendations endpoint returned ${res.status} on "${r.name}"`, JSON.stringify(res.body));
        continue;
      }

      const recs = res.body.recommendations || res.body.opportunities || res.body;
      if (!Array.isArray(recs)) {
        logBug('RECOMMEND-BAD-SHAPE', 'high', `Recommendations response is not an array on "${r.name}"`, typeof recs);
      } else {
        console.log(`✓ Scenario "${r.name}": Received ${recs.length} recommendations`);
      }
    } catch (err) {
      logBug('RECOMMEND-EXCEPTION', 'critical', `Exception in recommendations test "${r.name}"`, err.message);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 4. SECURITY & AUTHENTICATION TOKEN RESILIENCE
  // ────────────────────────────────────────────────────────────
  console.log('--- 4. Testing Auth Token Resilience & Attack Vectors ---');
  const authTests = [
    {
      name: 'Forged JWT Token',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_signature',
      endpoint: '/api/auth/me',
      expectedStatus: 401
    },
    {
      name: 'SQL Injection in Login',
      endpoint: '/api/auth/login',
      method: 'POST',
      body: { email: "' OR '1'='1", password: "' OR '1'='1" },
      expectedStatus: 401
    },
    {
      name: 'XSS in User Profile Update',
      endpoint: '/api/auth/profile',
      method: 'PUT',
      token: 'invalid_token',
      body: { name: '<script>alert("hacked")</script>' },
      expectedStatus: 401
    }
  ];

  for (const at of authTests) {
    try {
      const res = await apiRequest(at.method || 'GET', at.endpoint, at.body, at.token);
      if (res.status === 500) {
        logBug('AUTH-500-CRASH', 'critical', `Server 500 crash on auth attack "${at.name}"`, JSON.stringify(res.body));
      } else if (at.expectedStatus && res.status !== at.expectedStatus && res.status !== 400 && res.status !== 403) {
        logBug('AUTH-UNEXPECTED-STATUS', 'medium', `Auth attack "${at.name}" returned unexpected status ${res.status}`, JSON.stringify(res.body));
      } else {
        console.log(`✓ Auth attack "${at.name}" safely rejected with status ${res.status}`);
      }
    } catch (err) {
      logBug('AUTH-EXCEPTION', 'high', `Exception in auth test "${at.name}"`, err.message);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 5. RAPID REPEAT REQUESTS / RACE CONDITION RESISTANCE
  // ────────────────────────────────────────────────────────────
  console.log('--- 5. Testing Rapid Concurrent Requests ---');
  const concurrentQueries = [
    'Java fresher Hyderabad',
    'Python developer Bangalore',
    'React developer remote',
    'Data analyst',
    'Content writing'
  ];

  const startTime = Date.now();
  const promises = concurrentQueries.map(q => apiRequest('GET', `/api/opportunities/search?q=${encodeURIComponent(q)}`));
  const results = await Promise.all(promises);
  const totalElapsed = Date.now() - startTime;

  console.log(`Executed ${results.length} parallel searches in ${totalElapsed}ms`);
  const anyFailed = results.some(r => r.status !== 200);
  if (anyFailed) {
    logBug('RACE-CONCURRENCY-FAIL', 'high', 'One or more concurrent searches failed', `Statuses: ${results.map(r => r.status).join(', ')}`);
  } else {
    console.log('✓ All parallel searches completed with 200 OK');
  }

  // ────────────────────────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`📊 ADVERSARIAL STRESS TEST COMPLETE: Found ${bugs.length} issues`);
  console.log('================================================================');
  console.log(JSON.stringify(bugs, null, 2));
}

runDeepStress().catch(err => {
  console.error('Fatal deep stress error:', err);
  process.exit(1);
});
