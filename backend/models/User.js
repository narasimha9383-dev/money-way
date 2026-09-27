// backend/models/User.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

// In-memory cache for fast lookups, synced to file on mutation
let usersCache = [];
let isInitialized = false;

/**
 * Ensure default users exist (e.g. admin and sample user for testing)
 */
async function initializeUsersStore() {
  if (isInitialized) return;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      usersCache = JSON.parse(raw || '[]');
    } else {
      usersCache = [];
    }
  } catch (err) {
    console.error('Failed to read users.json, initializing empty cache:', err.message);
    usersCache = [];
  }

  // Ensure default admin account exists
  const adminEmail = 'admin@incomepath.ai';
  const existingAdmin = usersCache.find(u => u.email.toLowerCase() === adminEmail);
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123456', salt);
    const now = new Date().toISOString();
    usersCache.push({
      id: 'usr_admin_default',
      name: 'System Administrator',
      email: adminEmail,
      passwordHash,
      googleId: null,
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      isVerified: true,
      savedOpportunities: [],
      profileData: {
        isProfileCompleted: true,
        availableTime: '4+ hours/day',
        budget: '₹5,000–₹25,000',
        skills: ['Management', 'Security', 'Review'],
        location: ['Online / Remote'],
        equipment: ['Laptop', 'Internet connection']
      },
      actionPlans: [],
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    });
    saveToFile();
  }

  // Ensure default demo user exists for immediate testing
  const demoEmail = 'user@incomepath.ai';
  const existingDemo = usersCache.find(u => u.email.toLowerCase() === demoEmail);
  if (!existingDemo) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('User@123456', salt);
    const now = new Date().toISOString();
    usersCache.push({
      id: 'usr_demo_user',
      name: 'Alex Kumar',
      email: demoEmail,
      passwordHash,
      googleId: null,
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      isVerified: true,
      savedOpportunities: ['freelance-web-dev', 'remote-customer-support'],
      profileData: {
        isProfileCompleted: true,
        availableTime: '1–2 hours/day',
        budget: '₹0',
        skills: ['JavaScript', 'Writing'],
        location: ['Online / Remote'],
        equipment: ['Laptop', 'Internet connection']
      },
      actionPlans: [],
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    });
    saveToFile();
  }

  isInitialized = true;
}

/**
 * Flush usersCache to disk
 */
function saveToFile() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting users.json:', err);
  }
}

// Immediately trigger initialization
initializeUsersStore().catch(console.error);

export class User {
  /**
   * Return safe user representation excluding passwordHash
   */
  static toSafeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safe } = user;
    return safe;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    await initializeUsersStore();
    return usersCache.find(u => u.id === id) || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    if (!email) return null;
    await initializeUsersStore();
    const normalized = email.trim().toLowerCase();
    return usersCache.find(u => u.email.toLowerCase() === normalized) || null;
  }

  /**
   * Find user by Firebase UID
   */
  static async findByFirebaseUid(firebaseUid) {
    if (!firebaseUid) return null;
    await initializeUsersStore();
    return usersCache.find(u => u.firebaseUid === firebaseUid || u.googleId === firebaseUid) || null;
  }

  /**
   * Find user by Google UID (checks both googleId and firebaseUid)
   */
  static async findByGoogleId(googleId) {
    if (!googleId) return null;
    await initializeUsersStore();
    return usersCache.find(u => u.googleId === googleId || u.firebaseUid === googleId) || null;
  }

  /**
   * Create a new user
   */
  static async create({
    name,
    email,
    passwordHash = null,
    googleId = null,
    firebaseUid = null,
    provider = 'email',
    avatar = null,
    role = 'user',
    isVerified = false,
    profileData = null
  }) {
    await initializeUsersStore();
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const effectiveUid = firebaseUid || googleId || null;

    const newUser = {
      id,
      name: name?.trim() || 'User',
      email: normalizedEmail,
      passwordHash,
      googleId: effectiveUid,
      firebaseUid: effectiveUid,
      provider,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`,
      role: role === 'admin' ? 'admin' : 'user', // Default to 'user'
      isVerified: Boolean(isVerified),
      savedOpportunities: [],
      profileData: profileData || { isProfileCompleted: false },
      actionPlans: [],
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };

    usersCache.push(newUser);
    saveToFile();
    return newUser;
  }

  /**
   * Update user by ID
   */
  static async update(id, updates) {
    await initializeUsersStore();
    const index = usersCache.findIndex(u => u.id === id);
    if (index === -1) return null;

    const user = usersCache[index];
    const normalizedUpdates = { ...updates };
    if (normalizedUpdates.firebaseUid && !normalizedUpdates.googleId) {
      normalizedUpdates.googleId = normalizedUpdates.firebaseUid;
    } else if (normalizedUpdates.googleId && !normalizedUpdates.firebaseUid) {
      normalizedUpdates.firebaseUid = normalizedUpdates.googleId;
    }

    const updated = {
      ...user,
      ...normalizedUpdates,
      id: user.id, // prevent id overwrite
      updatedAt: new Date().toISOString()
    };

    usersCache[index] = updated;
    saveToFile();
    return updated;
  }

  /**
   * Delete user by ID
   */
  static async delete(id) {
    await initializeUsersStore();
    const initialLength = usersCache.length;
    usersCache = usersCache.filter(u => u.id !== id);
    if (usersCache.length !== initialLength) {
      saveToFile();
      return true;
    }
    return false;
  }

  /**
   * Get all users (admin inspection only)
   */
  static async findAll() {
    await initializeUsersStore();
    return usersCache.map(u => User.toSafeUser(u));
  }
}
