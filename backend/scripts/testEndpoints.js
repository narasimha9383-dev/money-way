// backend/scripts/testEndpoints.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_incomepath_super_secure_2026';
import http from 'http';
import app from '../app.js';

const PORT = 5099;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}...`);
  try {
    await runTests();
    console.log('\n=== ALL ENDPOINT AND AUTH TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('\n❌ Test Failure:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('1. Testing Root and Health check...');
  const root = await request('GET', '/');
  if (root.status !== 200 || !root.body.status) throw new Error('Root failed');
  console.log('   ✓ Root:', root.body.name);

  const health = await request('GET', '/api/health');
  if (health.status !== 200 || health.body.status !== 'ok') throw new Error('Health check failed');
  console.log('   ✓ Health check OK');

  console.log('\n2. Testing End-to-End Authentication System...');

  // 2a. Password strength and email validation
  const weakSignup = await request('POST', '/api/auth/signup', {
    name: 'Weak Pass',
    email: 'weak@example.com',
    password: 'weak'
  });
  if (weakSignup.status !== 400) throw new Error('Weak password was not rejected with 400');
  console.log('   ✓ Weak password correctly rejected:', weakSignup.body.error);

  const invalidEmailSignup = await request('POST', '/api/auth/signup', {
    name: 'Bad Email',
    email: 'not-an-email',
    password: 'StrongPassword@123'
  });
  if (invalidEmailSignup.status !== 400) throw new Error('Invalid email was not rejected with 400');
  console.log('   ✓ Invalid email correctly rejected');

  // 2b. Valid user signup
  const uniqueTestEmail = `testuser_${Date.now()}@example.com`;
  const validSignup = await request('POST', '/api/auth/signup', {
    name: 'Test Explorer',
    email: uniqueTestEmail,
    password: 'SecurePassword@2026',
    role: 'admin' // Attempting privilege escalation must be ignored!
  });
  if (validSignup.status !== 201 || !validSignup.body.token || !validSignup.body.user) {
    throw new Error('Valid signup failed: ' + JSON.stringify(validSignup.body));
  }
  if (validSignup.body.user.role !== 'user') throw new Error('User role defaulted incorrectly to non-user!');
  if (validSignup.body.user.passwordHash) throw new Error('Security flaw: passwordHash returned to client!');
  console.log('   ✓ User signup succeeded with safe data and JWT. Role: ' + validSignup.body.user.role);

  const userToken = validSignup.body.token;

  // 2c. Duplicate signup prevention
  const dupSignup = await request('POST', '/api/auth/signup', {
    name: 'Duplicate Test',
    email: uniqueTestEmail,
    password: 'SecurePassword@2026'
  });
  if (dupSignup.status !== 409) throw new Error('Duplicate email was not rejected with 409');
  console.log('   ✓ Duplicate email registration correctly rejected with 409');

  // 2d. Login with incorrect password
  const badLogin = await request('POST', '/api/auth/login', {
    email: uniqueTestEmail,
    password: 'WrongPassword@123'
  });
  if (badLogin.status !== 401 || !badLogin.body.error.includes('Invalid email or password')) {
    throw new Error('Wrong password did not yield generic 401');
  }
  console.log('   ✓ Wrong password rejected with generic 401 error message');

  // 2e. Login with correct password
  const goodLogin = await request('POST', '/api/auth/login', {
    email: uniqueTestEmail.toUpperCase(), // Test case normalization
    password: 'SecurePassword@2026'
  });
  if (goodLogin.status !== 200 || !goodLogin.body.token) throw new Error('Login failed with valid credentials');
  if (goodLogin.body.user.passwordHash) throw new Error('Security flaw: passwordHash returned on login!');
  console.log('   ✓ User login succeeded, JWT generated, email normalized');

  // 2f. Session restoration via GET /api/auth/me
  const meRes = await request('GET', '/api/auth/me', null, userToken);
  if (meRes.status !== 200 || meRes.body.user.email !== uniqueTestEmail.toLowerCase()) {
    throw new Error('/api/auth/me session restore failed');
  }
  console.log('   ✓ Session restoration /api/auth/me succeeded:', meRes.body.user.name);

  // 2g. Expired/invalid token rejection on /api/auth/me
  const fakeTokenRes = await request('GET', '/api/auth/me', null, 'invalid.jwt.token');
  if (fakeTokenRes.status !== 401) throw new Error('Invalid token was not rejected with 401');
  console.log('   ✓ Invalid token rejected with 401');

  // 2h. Role-based authorization: Standard user accessing Admin API
  const unauthorizedAdminAccess = await request('GET', '/api/admin/feedback', null, userToken);
  if (unauthorizedAdminAccess.status !== 403) {
    throw new Error(`Standard user was not blocked with 403 on admin endpoint, got ${unauthorizedAdminAccess.status}`);
  }
  console.log('   ✓ Normal user blocked from admin endpoint with 403 Forbidden');

  // 2i. Admin login and access
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@incomepath.ai',
    password: 'Admin@123456'
  });
  if (adminLogin.status !== 200 || !adminLogin.body.token) throw new Error('Admin login failed');
  const adminToken = adminLogin.body.token;
  console.log('   ✓ Admin login succeeded, role:', adminLogin.body.user.role);

  const authorizedAdminAccess = await request('GET', '/api/admin/feedback', null, adminToken);
  if (authorizedAdminAccess.status !== 200) {
    throw new Error('Admin access to /api/admin/feedback failed with ' + authorizedAdminAccess.status);
  }
  console.log('   ✓ Admin access to /api/admin/feedback succeeded with 200 OK');

  // 2j. User saved opportunities persistence
  const saveOppRes = await request('POST', '/api/auth/saved/freelance-web-dev', null, userToken);
  if (saveOppRes.status !== 200 || !saveOppRes.body.isSaved) throw new Error('Save opportunity failed');
  const getSavedRes = await request('GET', '/api/auth/saved', null, userToken);
  if (!getSavedRes.body.savedOpportunities.includes('freelance-web-dev')) throw new Error('Saved opp not in list');
  console.log('   ✓ User bookmark / saved opportunity persisted in database');

  // 2k. Scenario A: New Google user registration flow
  const googleUid = `google_uid_${Date.now()}`;
  const googleEmail = `google_user_${Date.now()}@example.com`;
  const googleToken1 = `test-token-:${googleEmail}:Google Explorer:${googleUid}`;
  const googleAuthRes1 = await request('POST', '/api/auth/google', { idToken: googleToken1 });
  if (googleAuthRes1.status !== 200 || !googleAuthRes1.body.token || !googleAuthRes1.body.user) {
    throw new Error('Scenario A failed: ' + JSON.stringify(googleAuthRes1.body));
  }
  const createdGoogleUserId = googleAuthRes1.body.user.id;
  const googleUserJwt1 = googleAuthRes1.body.token;
  console.log('   ✓ Scenario A: New Google user registered, provider=google, JWT issued, userId=' + createdGoogleUserId);

  // 2l. Scenario B: Returning Google user - sign in again with the SAME Google account
  const googleAuthRes2 = await request('POST', '/api/auth/google', { idToken: googleToken1 });
  if (googleAuthRes2.status !== 200 || !googleAuthRes2.body.token) {
    throw new Error('Scenario B failed: ' + JSON.stringify(googleAuthRes2.body));
  }
  if (googleAuthRes2.body.user.id !== createdGoogleUserId) {
    throw new Error(`Duplicate user created! Original: ${createdGoogleUserId}, Returning: ${googleAuthRes2.body.user.id}`);
  }
  const googleUserJwt2 = googleAuthRes2.body.token;
  console.log('   ✓ Scenario B: Existing Google user found by firebaseUid, no duplicate created, fresh JWT issued');

  // 2m. Scenario C: Multiple login/logout cycles with the same Google account
  for (let cycle = 1; cycle <= 3; cycle++) {
    // Logout
    const logoutRes = await request('POST', '/api/auth/logout', null, googleUserJwt2);
    if (logoutRes.status !== 200) throw new Error(`Cycle ${cycle} logout failed`);
    // Re-login
    const cycleLoginRes = await request('POST', '/api/auth/google', { idToken: googleToken1 });
    if (cycleLoginRes.status !== 200 || cycleLoginRes.body.user.id !== createdGoogleUserId) {
      throw new Error(`Cycle ${cycle} re-login failed`);
    }
  }
  console.log('   ✓ Scenario C: 3 consecutive logout/login cycles succeeded with the same Google account');

  // 2n. Scenario D & E: Session restoration and Protected API access with Google user JWT
  const googleMeRes = await request('GET', '/api/auth/me', null, googleUserJwt2);
  if (googleMeRes.status !== 200 || googleMeRes.body.user.id !== createdGoogleUserId) {
    throw new Error('Scenario D session restoration failed for Google user');
  }
  const googleProtectedApiRes = await request('GET', '/api/auth/saved', null, googleUserJwt2);
  if (googleProtectedApiRes.status !== 200 || !Array.isArray(googleProtectedApiRes.body.savedOpportunities)) {
    throw new Error('Scenario E protected API failed for Google user');
  }
  console.log('   ✓ Scenarios D & E: Session restoration and protected APIs work for Google authenticated user');

  // 2o. Scenario F: Invalid Firebase token rejection with 401
  const invalidFirebaseTokenRes = await request('POST', '/api/auth/google', { idToken: 'invalid.firebase.token.123' });
  if (invalidFirebaseTokenRes.status !== 401) {
    throw new Error(`Scenario F failed: Expected 401 for invalid Firebase token, got ${invalidFirebaseTokenRes.status}`);
  }
  console.log('   ✓ Scenario F: Invalid Firebase token rejected with 401 response');

  // 2p. Pre-existing email account linking: Existing email/password user logs in with Google
  const preExistingGoogleToken = `test-token-:${uniqueTestEmail}:Linked User:linked_google_uid_${Date.now()}`;
  const linkRes = await request('POST', '/api/auth/google', { idToken: preExistingGoogleToken });
  if (linkRes.status !== 200 || !linkRes.body.token) {
    throw new Error('Existing user Google login failed: ' + JSON.stringify(linkRes.body));
  }
  const emailUser = await request('GET', '/api/auth/me', null, userToken);
  if (linkRes.body.user.id !== emailUser.body.user.id) {
    throw new Error('Existing email user was duplicated instead of linked!');
  }
  console.log('   ✓ Existing email user seamlessly linked to Google without duplicates, userId=' + linkRes.body.user.id);

  console.log('\n3. Testing Opportunities Endpoints...');
  const opps = await request('GET', '/api/opportunities');
  if (opps.status !== 200 || !opps.body.opportunities || opps.body.opportunities.length === 0) throw new Error('GET /api/opportunities failed');
  console.log(`   ✓ Found ${opps.body.total} opportunities, ${opps.body.categories.length} categories`);

  // 3a. Test dynamic /discover query params: search + location + remote
  const deliveryHyd = await request('GET', '/api/opportunities?search=delivery&location=Hyderabad&remote=false');
  if (deliveryHyd.status !== 200 || !deliveryHyd.body.opportunities) throw new Error('Query with search and location failed');
  console.log(`   ✓ Dynamic search+location query returned ${deliveryHyd.body.opportunities.length} results (e.g. ${deliveryHyd.body.opportunities[0]?.provider || 'N/A'})`);

  // 3b. Test pagination and remote filter
  const paginated = await request('GET', '/api/opportunities?remote=true&page=1&limit=5');
  if (paginated.status !== 200 || paginated.body.opportunities.length > 5) throw new Error('Pagination limit failed');
  if (paginated.body.page !== 1 || paginated.body.limit !== 5) throw new Error('Pagination metadata mismatch');
  console.log(`   ✓ Paginated remote query returned ${paginated.body.opportunities.length}/5 items, hasMore=${paginated.body.hasMore}`);

  // 3c. Test refresh feed endpoint
  const refreshFeedRes = await request('POST', '/api/opportunities/refresh-feed');
  if (refreshFeedRes.status !== 200 || !refreshFeedRes.body.lastUpdated) throw new Error('Refresh feed failed');
  console.log(`   ✓ Feed refresh succeeded: total=${refreshFeedRes.body.total}, lastUpdated=${refreshFeedRes.body.lastUpdated}`);

  const search = await request('GET', '/api/opportunities/search?q=web');
  if (search.status !== 200 || !search.body.opportunities) throw new Error('Search failed');
  console.log(`   ✓ Search returned ${search.body.total} results`);

  // 3d. Section 18 Search test cases
  const qPython = await request('GET', '/api/opportunities/search?q=Python');
  if (qPython.status !== 200 || qPython.body.total === 0) throw new Error('Search Python failed');
  if (!qPython.body.opportunities[0].sourceUrl.startsWith('http')) throw new Error('Missing authentic sourceUrl');
  console.log(`   ✓ Search "Python" returned ${qPython.body.total} items (Top: ${qPython.body.opportunities[0].title} @ ${qPython.body.opportunities[0].provider})`);

  const qPythonRemote = await request('GET', '/api/opportunities/search?q=Python%20remote');
  if (qPythonRemote.status !== 200 || !qPythonRemote.body.parsedFilters.isRemote) throw new Error('Search Python remote failed');
  console.log(`   ✓ Search "Python remote" returned ${qPythonRemote.body.total} items (isRemote=true)`);

  const qPythonHyd = await request('GET', '/api/opportunities/search?q=Python%20jobs%20Hyderabad');
  if (qPythonHyd.status !== 200 || qPythonHyd.body.parsedFilters.location !== 'Hyderabad') throw new Error('Search Python Hyderabad failed');
  console.log(`   ✓ Search "Python jobs Hyderabad" returned ${qPythonHyd.body.total} items (Location: Hyderabad)`);

  const qJavaIntern = await request('GET', '/api/opportunities/search?q=Java%20internship');
  if (qJavaIntern.status !== 200 || qJavaIntern.body.parsedFilters.workType !== 'Internship') throw new Error('Search Java internship failed');
  console.log(`   ✓ Search "Java internship" returned ${qJavaIntern.body.total} items (Type: Internship)`);

  const qDesign = await request('GET', '/api/opportunities/search?q=graphic%20design');
  if (qDesign.status !== 200 || qDesign.body.total === 0) throw new Error('Search graphic design failed');
  console.log(`   ✓ Search "graphic design" returned ${qDesign.body.total} items`);

  const qWeekend = await request('GET', '/api/opportunities/search?q=weekend%20work');
  if (qWeekend.status !== 200) throw new Error('Search weekend work failed');
  console.log(`   ✓ Search "weekend work" returned ${qWeekend.body.total} items`);

  const qEmpty = await request('GET', '/api/opportunities/search?q=xyzrandomnonexistent999');
  if (qEmpty.status !== 200 || qEmpty.body.total !== 0 || qEmpty.body.opportunities.length !== 0) throw new Error('Empty search failed');
  console.log(`   ✓ Search invalid query correctly returned honest empty state (total=0)`);

  const qFiltered = await request('GET', '/api/opportunities/search?q=Python&remote=true&category=Internship');
  if (qFiltered.status !== 200 || !qFiltered.body.opportunities.every(o => o.remote === true)) throw new Error('Filtered search failed');
  console.log(`   ✓ Search with filters returned ${qFiltered.body.total} items matching remote & internship`);

  const aiSearch = await request('POST', '/api/opportunities/ai-search', { query: 'I have a laptop and 2 hours a day' });
  if (aiSearch.status !== 200 || !aiSearch.body.aiUnderstanding) throw new Error('AI search failed');
  console.log(`   ✓ AI Search parsed timeHours=${aiSearch.body.aiUnderstanding.timeHours}`);

  const sampleProfile = {
    name: 'Alex',
    isProfileCompleted: true,
    availableTime: '1–2 hours/day',
    budget: '₹0',
    skills: ['JavaScript', 'Writing'],
    location: ['Online / Remote'],
    equipment: ['Laptop', 'Internet connection']
  };

  const recommend = await request('POST', '/api/opportunities/recommend', { profile: sampleProfile }, userToken);
  if (recommend.status !== 200 || !recommend.body.recommendations) throw new Error('Recommend failed');
  console.log(`   ✓ Recommendations returned ${recommend.body.total} items`);

  const queryRecommend = await request('GET', `/api/opportunities/recommendations?profile=${encodeURIComponent(JSON.stringify(sampleProfile))}`);
  if (queryRecommend.status !== 200) throw new Error('GET recommendations failed');
  console.log(`   ✓ Query recommendations returned ${queryRecommend.body.total} items`);

  const nearby = await request('GET', '/api/opportunities/nearby?city=Bengaluru');
  if (nearby.status !== 200 || !nearby.body.services) throw new Error('Nearby failed');
  console.log(`   ✓ Nearby returned ${nearby.body.total} services in Bengaluru`);

  const refresh = await request('POST', '/api/opportunities/refresh', { profile: sampleProfile }, userToken);
  if (refresh.status !== 200) throw new Error('Refresh failed');
  console.log(`   ✓ Refresh returned ${refresh.body.total} fresh items`);

  const aiDiscover = await request('POST', '/api/opportunities/ai-discover', { profile: sampleProfile }, userToken);
  if (aiDiscover.status !== 200) throw new Error('AI Discover failed');
  console.log(`   ✓ AI Discover returned ${aiDiscover.body.discoveries.length} discoveries`);

  const firstOppId = opps.body.opportunities[0].id;
  const similar = await request('GET', `/api/opportunities/similar/${firstOppId}`);
  if (similar.status !== 200) throw new Error('Similar failed');
  console.log(`   ✓ Similar opportunities returned for ${firstOppId}`);

  const detail = await request('GET', `/api/opportunities/${firstOppId}`);
  if (detail.status !== 200 || detail.body.id !== firstOppId) throw new Error('Detail failed');
  console.log(`   ✓ Detail returned: ${detail.body.title}`);

  console.log('\n4. Testing Feedback Endpoints...');
  const notInterested = await request('POST', '/api/feedback/not-interested', { opportunityId: firstOppId, reason: 'Time mismatch' }, userToken);
  if (notInterested.status !== 200 || !notInterested.body.success) throw new Error('Not interested failed');
  console.log('   ✓ Not interested logged');

  const undoNotInterested = await request('POST', '/api/feedback/undo-not-interested', { opportunityId: firstOppId }, userToken);
  if (undoNotInterested.status !== 200 || !undoNotInterested.body.success) throw new Error('Undo not interested failed');
  console.log('   ✓ Undo not interested OK');

  const feedback = await request('POST', '/api/feedback', { opportunityId: firstOppId, useful: true, reason: 'Helpful info' }, userToken);
  if (feedback.status !== 200 || !feedback.body.success) throw new Error('Submit feedback failed');
  console.log('   ✓ Feedback submission OK');

  console.log('\n5. Testing Admin Endpoints with Admin Token...');
  const verifyRes = await request('POST', `/api/admin/verify/${firstOppId}`, null, adminToken);
  if (verifyRes.status !== 200 || !verifyRes.body.success || !verifyRes.body.opportunity) throw new Error('Admin verify failed');
  console.log(`   ✓ Admin verify succeeded for ${firstOppId}, status=${verifyRes.body.opportunity.verification.status}`);

  const newOppPayload = {
    id: 'test-custom-opp-1',
    title: 'Automated Test Opportunity',
    category: 'Skill-Based',
    mode: 'Online',
    investment: { min: 0, max: 200 },
    timeRequired: { minHoursPerDay: 1, maxHoursPerDay: 2, label: '1–2 hrs/day' },
    requiredSkills: ['Testing', 'Node.js'],
    howItWorks: 'Testing backend integrity and endpoints'
  };

  const saveRes = await request('POST', '/api/admin/opportunities', newOppPayload, adminToken);
  if (saveRes.status !== 200 || !saveRes.body.success || saveRes.body.opportunity.id !== 'test-custom-opp-1') throw new Error('Admin save failed');
  console.log(`   ✓ Admin save opportunity succeeded: ${saveRes.body.opportunity.title}`);

  const adminList = await request('GET', '/api/admin/opportunities', null, adminToken);
  if (adminList.status !== 200 || !adminList.body.opportunities) throw new Error('Admin list failed');
  console.log(`   ✓ Admin opportunities list total: ${adminList.body.total}`);

  const deleteRes = await request('DELETE', '/api/admin/opportunities/test-custom-opp-1', null, adminToken);
  if (deleteRes.status !== 200 || !deleteRes.body.success) throw new Error('Admin delete failed');
  console.log('   ✓ Admin delete opportunity succeeded');

  console.log('\n6. Testing Tools and Utility Endpoints...');
  const surprise = await request('POST', '/api/surprise', { profile: sampleProfile });
  if (surprise.status !== 200) throw new Error('Surprise failed');
  console.log(`   ✓ Surprise returned: ${surprise.body.opportunity?.title || 'Alternative'}`);

  const whyNot = await request('POST', '/api/why-not', { opportunityId: firstOppId, profile: sampleProfile });
  if (whyNot.status !== 200) throw new Error('Why-not failed');
  console.log(`   ✓ Why-not returned: isEligible=${whyNot.body.isEligible}`);

  const skillsMap = await request('GET', '/api/skills-explorer');
  if (skillsMap.status !== 200 || !skillsMap.body.Java) throw new Error('Skills explorer failed');
  console.log('   ✓ Skills map explorer OK');

  const skillPathways = await request('GET', '/api/skills-explorer/Java');
  if (skillPathways.status !== 200 || !skillPathways.body.pathways) throw new Error('Skill pathways failed');
  console.log(`   ✓ Java pathways returned: ${skillPathways.body.pathways.length} pathways`);

  const scam = await request('POST', '/api/scam-analyzer', { text: 'Pay refundable registration fee of Rs 500 to start Telegram like video task' });
  if (scam.status !== 200 || scam.body.riskScore === undefined) throw new Error('Scam analyzer failed');
  console.log(`   ✓ Scam analyzer detected risk score: ${scam.body.riskScore} (${scam.body.riskLevel})`);

  const advisor = await request('POST', '/api/advisor/chat', { message: 'I have ₹0 budget and 2 hours a day', profile: sampleProfile }, userToken);
  if (advisor.status !== 200 || !advisor.body.reply) throw new Error('Advisor chat failed');
  console.log('   ✓ Advisor chat response received');

  const legacyRec = await request('POST', '/api/recommendations', { profile: sampleProfile });
  if (legacyRec.status !== 200 || !legacyRec.body.recommendations) throw new Error('Legacy recommendations failed');
  console.log(`   ✓ Legacy recommendations returned ${legacyRec.body.total} items`);

  console.log('\n7. Testing 404 Handler...');
  const notFound = await request('GET', '/api/non-existent-route-12345');
  if (notFound.status !== 404 || notFound.body.success !== false) throw new Error('404 handler failed');
  console.log('   ✓ 404 route handler OK');
}
