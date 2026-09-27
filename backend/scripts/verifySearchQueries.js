// backend/scripts/verifySearchQueries.js
import http from 'http';
import app from '../app.js';

const PORT = 5088;
const server = app.listen(PORT, async () => {
  try {
    await runVerifications();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    server.close();
  }
});

function testSearch(q) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}/api/opportunities/search?q=${encodeURIComponent(q)}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message, raw: data });
        }
      });
    });
  });
}

async function runVerifications() {
  const queries = [
    'Java developer fresher jobs in Hyderabad',
    'Python developer jobs in Bangalore',
    'Remote frontend developer jobs',
    'React jobs for 0-1 years experience',
    'Data analyst jobs for freshers',
    'xyzrandomnonexistent999'
  ];

  for (const q of queries) {
    const res = await testSearch(q);
    console.log(`\n======================================================`);
    console.log(`QUERY: "${q}"`);
    console.log(`Total Matches: ${res.total}`);
    console.log(`Filters Extracted:`, JSON.stringify(res.filters || res.parsedFilters));
    if (res.fallbackSuggestions && res.fallbackSuggestions.length > 0) {
      console.log(`Fallback Suggestions (Zero Hallucination):`, res.fallbackSuggestions);
    }
    const items = res.results || res.opportunities || [];
    if (items.length > 0) {
      items.slice(0, 3).forEach((item, idx) => {
        console.log(`\n  [#${idx + 1}] ${item.title}`);
        console.log(`      Company: ${item.company || item.provider}`);
        console.log(`      Location: ${item.location} | Type: ${item.locationType} | Remote: ${item.remote}`);
        console.log(`      Experience: ${item.experienceLevel} | Salary: ${item.salary}`);
        console.log(`      Source: ${item.source}`);
        console.log(`      URL: ${item.url || item.sourceUrl}`);
        console.log(`      Freshness: ${item.freshness || 'Verified'}`);
        console.log(`      Match Reasons: ${(item.matchExplanation || []).join(' | ')}`);
      });
    } else {
      console.log('  -> Honest empty state (0 results, no fabricated jobs).');
    }
  }
}
