// backend/scripts/verifyExternalLinks.js
// Verify live HTTP destination and title correspondence for external links

const sampleJobLinks = [
  {
    title: 'Java Backend Software Developer Intern',
    company: 'Internshala Network',
    url: 'https://internshala.com/internships/java-internship-in-hyderabad/',
    expectedKeywords: ['java', 'internship', 'hyderabad']
  },
  {
    title: 'Python Developer & Automation Intern',
    company: 'Internshala Network',
    url: 'https://internshala.com/internships/python-internship/',
    expectedKeywords: ['python', 'internship']
  },
  {
    title: 'Frontend Web Development Intern',
    company: 'Internshala Network',
    url: 'https://internshala.com/internships/web-development-internship/',
    expectedKeywords: ['internship', 'web']
  },
  {
    title: 'Freelance Web & Landing Page Developer',
    company: 'Upwork Global Marketplace',
    url: 'https://www.upwork.com/freelance-jobs/web-development/',
    expectedKeywords: ['web', 'development', 'upwork']
  },
  {
    title: 'Freelance Python Automation & Data Extraction Specialist',
    company: 'Upwork Global Marketplace',
    url: 'https://www.upwork.com/freelance-jobs/python/',
    expectedKeywords: ['python', 'upwork']
  },
  {
    title: 'Junior Python Software Developer',
    company: 'T-Hub Incubator Network',
    url: 'https://t-hub.co/careers/',
    expectedKeywords: ['t-hub', 'career']
  },
  {
    title: 'Amazon Flex Package Delivery Partner',
    company: 'Amazon India',
    url: 'https://flex.amazon.in/',
    expectedKeywords: ['amazon', 'flex']
  },
  {
    title: 'Food & Parcel Delivery Partner',
    company: 'Swiggy',
    url: 'https://ride.swiggy.com/',
    expectedKeywords: ['swiggy']
  }
];

async function verifyLinks() {
  console.log('========================================================================');
  console.log('🔗 VERIFYING LIVE EXTERNAL DESTINATIONS FOR CORRESPONDENCE');
  console.log('========================================================================\n');

  let verifiedCount = 0;
  for (const item of sampleJobLinks) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(item.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      clearTimeout(timeout);

      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const destinationTitle = titleMatch ? titleMatch[1].trim() : 'No title tag';
      const destLower = `${destinationTitle} ${html.slice(0, 2000)}`.toLowerCase();

      const keywordsMatched = item.expectedKeywords.filter(k => destLower.includes(k.toLowerCase()));
      const isReachable = res.status >= 200 && res.status < 400;
      const isRelevant = keywordsMatched.length >= Math.ceil(item.expectedKeywords.length / 2);

      console.log(`[LINK] ${item.title}`);
      console.log(`  URL: ${item.url}`);
      console.log(`  HTTP Status: ${res.status}`);
      console.log(`  Destination Title: "${destinationTitle.slice(0, 70)}..."`);
      console.log(`  Keywords matched: [${keywordsMatched.join(', ')}] / [${item.expectedKeywords.join(', ')}]`);
      console.log(`  Verdict: ${isReachable && isRelevant ? '✓ VERIFIED CORRESPONDENCE' : '⚠️ MISMATCH / UNREACHABLE'}\n`);

      if (isReachable && isRelevant) verifiedCount++;
    } catch (err) {
      console.log(`[LINK] ${item.title}`);
      console.log(`  URL: ${item.url}`);
      console.log(`  Error: ${err.message}\n`);
    }
  }

  console.log(`========================================================================`);
  console.log(`Destination verification results: ${verifiedCount}/${sampleJobLinks.length} verified authentic`);
  console.log(`========================================================================`);
}

verifyLinks().catch(console.error);
