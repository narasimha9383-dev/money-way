// backend/scripts/verify20Queries.js
// SECTION 16 & 17: Full audit of 20 real-world queries with exact-link verification
import http from 'http';
import https from 'https';

const QUERIES = [
  'delivery jobs in Hyderabad',
  'catering jobs in Hyderabad',
  'cook jobs',
  'warehouse jobs in Hyderabad',
  'security guard jobs',
  'cleaning jobs',
  'driver jobs',
  'retail jobs',
  'factory jobs',
  'construction jobs',
  'electrician jobs',
  'part time jobs',
  'night shift jobs',
  'work from home jobs',
  'office assistant jobs',
  'restaurant jobs',
  'packing jobs',
  'sales jobs',
  'customer support jobs',
  'jobs for freshers'
];

async function pingUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeout);
    return {
      status: res.status,
      ok: res.status >= 200 && res.status < 400
    };
  } catch (e) {
    return { status: 500, ok: false, error: e.message };
  }
}

/**
 * Check if URL is a generic homepage / search page (should be rejected)
 */
function isGenericUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, '');
    const host = parsed.hostname.toLowerCase();

    // Allow partner/ride/careers subdomains
    if (host.startsWith('partner.') || host.startsWith('careers.') ||
        host.startsWith('ride.') || host.startsWith('flex.')) {
      return false;
    }

    // Root homepages
    if (pathname === '' || pathname === '/') return true;

    // Aggregator generic pages
    const aggregatorHosts = [
      'www.linkedin.com', 'linkedin.com', 'www.indeed.com', 'indeed.com',
      'www.naukri.com', 'naukri.com', 'www.internshala.com', 'internshala.com',
      'www.glassdoor.com', 'glassdoor.com', 'www.adzuna.com', 'adzuna.com'
    ];
    if (aggregatorHosts.includes(host)) {
      const genPaths = ['/jobs', '/search', '/internships', '/careers', '/opportunities'];
      if (genPaths.includes(pathname.toLowerCase())) return true;
    }

    return false;
  } catch {
    return true;
  }
}

async function runAudit() {
  console.log('====================================================');
  console.log('EXACT REAL JOB APPLICATION LINKS — FULL AUDIT');
  console.log('====================================================\n');

  let totalQueriesTested = QUERIES.length;
  let totalJobsFetched = 0;
  let relevantCount = 0;
  let irrelevantCount = 0;
  let duplicateCount = 0;
  let validUrlCount = 0;
  let invalidUrlCount = 0;
  let correctDestinationCount = 0;
  let fakeJobsCount = 0;
  let fakeUrlsCount = 0;
  let genericLinksRejected = 0;
  let exactJobLinks = 0;
  let exactApplyLinks = 0;
  let verifiedDestinations = 0;

  const urlVerificationCache = new Map();
  const allJobRows = []; // For the final table

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i];
    console.log(`\n[Query ${i + 1}/${QUERIES.length}] Testing: "${q}"...`);
    const encoded = encodeURIComponent(q);
    const apiUrl = `http://localhost:5000/api/recommendations?query=${encoded}&limit=8`;

    let resData;
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        console.error(`  ❌ HTTP error ${res.status} for query: ${q}`);
        continue;
      }
      resData = await res.json();
    } catch (e) {
      console.error(`  ❌ Failed to fetch query: ${q}`, e.message);
      continue;
    }

    const recs = resData.recommendations || [];
    console.log(`  → Found ${recs.length} recommendations (Provider: ${resData.provider})`);

    const seenIds = new Set();
    const seenSigs = new Set();

    for (const job of recs) {
      totalJobsFetched++;

      // Check duplicate
      const sig = `${job.title}::${job.company}::${job.location}`.toLowerCase();
      if (seenIds.has(job.id) || seenSigs.has(sig)) {
        duplicateCount++;
      } else {
        seenIds.add(job.id);
        seenSigs.add(sig);
      }

      // Check fake indicators
      const isFakeJob = !job.title || !job.company || job.company.includes('ABC ') || job.company === 'Example' || job.title.includes('Fake');
      if (isFakeJob) fakeJobsCount++;

      const isFakeUrl = !job.applyUrl || job.applyUrl.includes('example.com') || job.applyUrl.includes('placeholder') || job.applyUrl.startsWith('fake:');
      if (isFakeUrl) fakeUrlsCount++;

      // Exact Intent & Domain Relevance Check (Section 8 & 9)
      const qLower = q.toLowerCase();
      const jobTitle = (job.title || '').toLowerCase();
      const jobDesc = (job.description || '').toLowerCase();
      const jobLoc = (job.location || '').toLowerCase();
      const jobType = (job.employmentType || '').toLowerCase();
      const jobExp = (job.experience || '').toLowerCase();

      let isRelevant = false;
      if (qLower.includes('delivery')) isRelevant = jobTitle.includes('delivery') || jobTitle.includes('courier') || jobTitle.includes('driver');
      else if (qLower.includes('catering')) isRelevant = jobTitle.includes('cater') || jobTitle.includes('banquet') || jobDesc.includes('cater');
      else if (qLower.includes('cook')) isRelevant = jobTitle.includes('cook') || jobTitle.includes('chef') || jobTitle.includes('kitchen');
      else if (qLower.includes('warehouse')) isRelevant = jobTitle.includes('warehouse') || jobTitle.includes('hub') || jobDesc.includes('warehouse');
      else if (qLower.includes('security guard')) isRelevant = (jobTitle.includes('security') || jobTitle.includes('guard')) && !jobTitle.includes('software') && !jobTitle.includes('analyst');
      else if (qLower.includes('cleaning')) isRelevant = jobTitle.includes('clean') || jobTitle.includes('housekeep') || jobDesc.includes('clean');
      else if (qLower.includes('driver')) isRelevant = jobTitle.includes('driver') || jobTitle.includes('courier');
      else if (qLower.includes('retail')) isRelevant = jobTitle.includes('retail') || jobTitle.includes('store');
      else if (qLower.includes('factory')) isRelevant = jobTitle.includes('factory') || jobTitle.includes('machine') || jobTitle.includes('operator') || jobTitle.includes('production');
      else if (qLower.includes('construction')) isRelevant = jobTitle.includes('construction') || jobTitle.includes('civil') || jobTitle.includes('site');
      else if (qLower.includes('electrician')) isRelevant = jobTitle.includes('electric') || jobTitle.includes('wireman');
      else if (qLower.includes('part time')) isRelevant = jobType.includes('part-time') || jobTitle.includes('part-time') || jobDesc.includes('flexible') || job.employmentType === 'Part-time';
      else if (qLower.includes('night shift')) isRelevant = jobDesc.includes('night') || jobTitle.includes('night') || job.description?.includes('Night Shift');
      else if (qLower.includes('work from home')) isRelevant = job.remote === true || jobTitle.includes('remote') || jobTitle.includes('work from home');
      else if (qLower.includes('office assistant')) isRelevant = jobTitle.includes('office') || jobTitle.includes('assistant') || jobTitle.includes('clerk') || jobTitle.includes('receptionist');
      else if (qLower.includes('restaurant')) isRelevant = jobTitle.includes('restaurant') || jobTitle.includes('steward') || jobTitle.includes('dining') || jobTitle.includes('kitchen');
      else if (qLower.includes('packing')) isRelevant = jobTitle.includes('pack') || jobTitle.includes('fulfillment') || jobTitle.includes('warehouse');
      else if (qLower.includes('sales')) isRelevant = jobTitle.includes('sales') || jobTitle.includes('business development') || jobTitle.includes('telecaller');
      else if (qLower.includes('customer support')) isRelevant = jobTitle.includes('support') || jobTitle.includes('customer') || jobTitle.includes('call center');
      else if (qLower.includes('freshers')) isRelevant = jobTitle.includes('fresher') || jobTitle.includes('trainee') || jobExp.includes('fresher') || jobExp.includes('entry') || jobExp.includes('0') || job.employmentType === 'Internship';
      else isRelevant = true;

      // Location match check for specific city queries
      if (qLower.includes('hyderabad') && !jobLoc.includes('hyderabad') && !job.remote) {
        isRelevant = false;
      }

      if (isRelevant) {
        relevantCount++;
      } else {
        irrelevantCount++;
        console.warn(`    ⚠️ Irrelevant match found for query "${q}": "${job.title}" (${job.company})`);
      }

      // Live URL Verification
      const targetUrl = job.applyUrl || job.jobUrl || job.sourceUrl;
      let reachability = urlVerificationCache.get(targetUrl);
      if (!reachability) {
        reachability = await pingUrl(targetUrl);
        urlVerificationCache.set(targetUrl, reachability);
      }

      const urlIsGeneric = isGenericUrl(targetUrl);
      if (urlIsGeneric) genericLinksRejected++;

      let urlVerified = false;
      if (reachability.ok) {
        validUrlCount++;
        // Verify destination has path or subdomain specific to job / careers / partner / portal
        try {
          const parsed = new URL(targetUrl);
          const isNotJustRoot = parsed.pathname.length > 1 || parsed.hostname.startsWith('partner.') || parsed.hostname.startsWith('careers.') || parsed.hostname.startsWith('ride.');
          if (isNotJustRoot && !urlIsGeneric) {
            correctDestinationCount++;
            urlVerified = true;
          }
        } catch {}
      } else {
        invalidUrlCount++;
        console.warn(`    ⚠️ Dead or unreachable URL: ${targetUrl} (Status: ${reachability.status}, Err: ${reachability.error || 'None'})`);
      }

      // Check new exact-link fields
      if (job.jobUrl && job.jobUrl.startsWith('http') && !isGenericUrl(job.jobUrl)) exactJobLinks++;
      if (job.applyUrl && job.applyUrl.startsWith('http') && !isGenericUrl(job.applyUrl)) exactApplyLinks++;
      if (job.linkVerified === true || job.linkStatus === 'verified') verifiedDestinations++;

      // Collect for table
      allJobRows.push({
        query: q,
        title: job.title,
        company: job.company,
        location: job.location,
        jobUrl: job.jobUrl || 'N/A',
        applyUrl: job.applyUrl || 'N/A',
        linkVerified: urlVerified ? 'YES' : 'NO',
        exactLink: job.exactApplicationLinkAvailable ? 'YES' : 'NO',
        relevant: isRelevant ? 'YES' : 'NO'
      });

      // Log each job for visibility
      console.log(`    ✓ ${job.title} | ${job.company} | ${job.location} | Verified: ${urlVerified ? 'YES' : 'NO'} | Exact: ${job.exactApplicationLinkAvailable ? 'YES' : 'NO'}`);
    }
  }

  // Print the full table
  console.log('\n====================================================');
  console.log('FINAL TEST REPORT — JOB TABLE');
  console.log('====================================================');
  console.log('| # | Job | Company | Location | Exact Job URL | Exact Apply URL | Verified |');
  console.log('|---|-----|---------|----------|---------------|-----------------|----------|');
  allJobRows.forEach((row, idx) => {
    const jobUrlShort = row.jobUrl.length > 45 ? row.jobUrl.substring(0, 42) + '...' : row.jobUrl;
    const applyUrlShort = row.applyUrl.length > 45 ? row.applyUrl.substring(0, 42) + '...' : row.applyUrl;
    console.log(`| ${idx + 1} | ${row.title.substring(0, 30)} | ${row.company.substring(0, 20)} | ${row.location.substring(0, 15)} | ${jobUrlShort} | ${applyUrlShort} | ${row.linkVerified} |`);
  });

  console.log('\n====================================================');
  console.log('AUDIT SUMMARY REPORT');
  console.log('====================================================');
  console.log(`Queries tested:            ${totalQueriesTested}`);
  console.log(`Total real jobs fetched:    ${totalJobsFetched}`);
  console.log(`Relevant results:          ${relevantCount}`);
  console.log(`Irrelevant results:        ${irrelevantCount}`);
  console.log(`Duplicate jobs:            ${duplicateCount}`);
  console.log(`Valid job URLs:            ${validUrlCount}`);
  console.log(`Invalid/dead URLs:         ${invalidUrlCount}`);
  console.log(`Exact job links:           ${exactJobLinks}`);
  console.log(`Exact application links:   ${exactApplyLinks}`);
  console.log(`Verified destinations:     ${verifiedDestinations}`);
  console.log(`Correct destination URLs:  ${correctDestinationCount}`);
  console.log(`Generic links rejected:    ${genericLinksRejected}`);
  console.log(`Dead links rejected:       ${invalidUrlCount}`);
  console.log(`Fake/generated jobs found: ${fakeJobsCount}`);
  console.log(`Fake/generated URLs found: ${fakeUrlsCount}`);
  console.log('====================================================\n');
}

runAudit();
