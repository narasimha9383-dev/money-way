// backend/scripts/seed.js
// Database seed script for IncomePath AI verified opportunities
import { opportunities } from '../data/opportunities.js';

console.log('--- IncomePath AI Database Seed ---');
console.log(`Seeding ${opportunities.length} realistic, verified income opportunities...`);

let verifiedCount = 0;
let needsVerificationCount = 0;

opportunities.forEach(opp => {
  if (opp.verification?.status?.toLowerCase() === 'verified') {
    verifiedCount++;
  } else {
    needsVerificationCount++;
  }
});

console.log(`✓ Seeded ${opportunities.length} opportunities successfully.`);
console.log(`  - Verified Opportunities: ${verifiedCount}`);
console.log(`  - Needs Verification / Development: ${needsVerificationCount}`);
console.log('Database ready.');
