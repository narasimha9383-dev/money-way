// backend/models/schemas.js
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, default: null },
  googleId: { type: String, default: null, index: true },
  firebaseUid: { type: String, default: null, index: true },
  provider: { type: String, default: 'email' },
  avatar: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  savedOpportunities: { type: [String], default: [] },
  profileData: {
    isProfileCompleted: { type: Boolean, default: false },
    availableTime: { type: String, default: null },
    budget: { type: String, default: null },
    skills: { type: [String], default: [] },
    location: { type: [String], default: [] },
    equipment: { type: [String], default: [] },
    city: { type: String, default: null },
    experience: { type: String, default: 'Fresher' },
    incomeGoal: { type: String, default: null }
  },
  actionPlans: { type: [mongoose.Schema.Types.Mixed], default: [] },
  lastLoginAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Opportunity Schema
const opportunitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, index: true },
  category: { type: String, default: 'Skill-Based', index: true },
  mode: { type: String, default: 'Online' },
  description: { type: String, default: '' },
  howItWorks: { type: String, default: '' },
  incomeModel: { type: String, default: 'Per project / milestone' },
  locationType: { type: String, default: 'Remote' },
  location: { type: String, default: null },
  company: { type: String, default: null },
  salary: { type: String, default: null },
  employmentType: { type: String, default: null },
  experience: { type: String, default: null },
  source: { type: String, default: 'Verified Opportunity' },
  sourceUrl: { type: String, default: '' },
  applyUrl: { type: String, default: '' },
  sourceType: { type: String, enum: ['real_job', 'demo', 'custom'], default: 'demo' },
  isBeginnerFriendly: { type: Boolean, default: true },
  isAdvanced: { type: Boolean, default: false },
  investment: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    description: { type: String, default: '₹0 startup cost' }
  },
  timeRequired: {
    minHoursPerDay: { type: Number, default: 1 },
    maxHoursPerDay: { type: Number, default: 3 },
    label: { type: String, default: 'Flexible' },
    flexible: { type: Boolean, default: true }
  },
  requiredEquipment: { type: [String], default: [] },
  requiredSkills: { type: [String], default: [] },
  verification: {
    status: { type: String, default: 'Verified' },
    lastVerifiedAt: { type: String, default: 'September 2026' },
    source: { type: String, default: 'Direct Industry Review' },
    sourceUrl: { type: String, default: '' },
    platformFees: { type: String, default: 'Standard' }
  },
  sevenDayPlan: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, {
  timestamps: true
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  opportunityId: { type: String, required: true, index: true },
  useful: { type: Boolean, default: true },
  reason: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const OpportunityModel = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema);
export const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
