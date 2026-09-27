// backend/models/User.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from './schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

// In-memory cache for fast lookups, synced to file on mutation
let usersCache = [];
let isInitialized = false;

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

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
    const adminDoc = {
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
    };
    usersCache.push(adminDoc);
    saveToFile();

    if (isMongoConnected()) {
      UserModel.findOneAndUpdate({ email: adminEmail }, adminDoc, { upsert: true }).catch(() => {});
    }
  }

  // Ensure default demo user exists for immediate testing
  const demoEmail = 'user@incomepath.ai';
  const existingDemo = usersCache.find(u => u.email.toLowerCase() === demoEmail);
  if (!existingDemo) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('User@123456', salt);
    const now = new Date().toISOString();
    const demoDoc = {
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
    };
    usersCache.push(demoDoc);
    saveToFile();

    if (isMongoConnected()) {
      UserModel.findOneAndUpdate({ email: demoEmail }, demoDoc, { upsert: true }).catch(() => {});
    }
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
    const { passwordHash, _id, __v, ...safe } = (user._doc || user);
    return safe;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    if (isMongoConnected()) {
      try {
        const mongoUser = await UserModel.findOne({ id }).lean();
        if (mongoUser) return mongoUser;
      } catch (err) {
        console.warn('MongoDB findById fallback:', err.message);
      }
    }
    await initializeUsersStore();
    return usersCache.find(u => u.id === id) || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();

    if (isMongoConnected()) {
      try {
        const mongoUser = await UserModel.findOne({ email: normalized }).lean();
        if (mongoUser) return mongoUser;
      } catch (err) {
        console.warn('MongoDB findByEmail fallback:', err.message);
      }
    }

    await initializeUsersStore();
    return usersCache.find(u => u.email.toLowerCase() === normalized) || null;
  }

  /**
   * Find user by Firebase UID
   */
  static async findByFirebaseUid(firebaseUid) {
    if (!firebaseUid) return null;

    if (isMongoConnected()) {
      try {
        const mongoUser = await UserModel.findOne({
          $or: [{ firebaseUid }, { googleId: firebaseUid }]
        }).lean();
        if (mongoUser) return mongoUser;
      } catch (err) {
        console.warn('MongoDB findByFirebaseUid fallback:', err.message);
      }
    }

    await initializeUsersStore();
    return usersCache.find(u => u.firebaseUid === firebaseUid || u.googleId === firebaseUid) || null;
  }

  /**
   * Find user by Google UID (checks both googleId and firebaseUid)
   */
  static async findByGoogleId(googleId) {
    if (!googleId) return null;

    if (isMongoConnected()) {
      try {
        const mongoUser = await UserModel.findOne({
          $or: [{ googleId }, { firebaseUid: googleId }]
        }).lean();
        if (mongoUser) return mongoUser;
      } catch (err) {
        console.warn('MongoDB findByGoogleId fallback:', err.message);
      }
    }

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
      role: role === 'admin' ? 'admin' : 'user',
      isVerified: Boolean(isVerified),
      savedOpportunities: [],
      profileData: profileData || { isProfileCompleted: false },
      actionPlans: [],
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };

    // Save to MongoDB
    if (isMongoConnected()) {
      try {
        await UserModel.create(newUser);
      } catch (err) {
        console.error('MongoDB UserModel.create error:', err.message);
      }
    }

    // Always update local cache & backup file
    usersCache.push(newUser);
    saveToFile();
    return newUser;
  }

  /**
   * Update user by ID
   */
  static async update(id, updates) {
    await initializeUsersStore();
    const normalizedUpdates = { ...updates };
    if (normalizedUpdates.firebaseUid && !normalizedUpdates.googleId) {
      normalizedUpdates.googleId = normalizedUpdates.firebaseUid;
    } else if (normalizedUpdates.googleId && !normalizedUpdates.firebaseUid) {
      normalizedUpdates.firebaseUid = normalizedUpdates.googleId;
    }
    normalizedUpdates.updatedAt = new Date().toISOString();

    // Update in MongoDB
    if (isMongoConnected()) {
      try {
        await UserModel.findOneAndUpdate({ id }, normalizedUpdates, { new: true });
      } catch (err) {
        console.error('MongoDB UserModel.update error:', err.message);
      }
    }

    // Update in local cache
    const index = usersCache.findIndex(u => u.id === id);
    if (index !== -1) {
      const user = usersCache[index];
      const updated = {
        ...user,
        ...normalizedUpdates,
        id: user.id
      };
      usersCache[index] = updated;
      saveToFile();
      return updated;
    }

    return null;
  }

  /**
   * Delete user by ID
   */
  static async delete(id) {
    if (isMongoConnected()) {
      try {
        await UserModel.deleteOne({ id });
      } catch (err) {
        console.error('MongoDB UserModel.delete error:', err.message);
      }
    }

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
    if (isMongoConnected()) {
      try {
        const mongoUsers = await UserModel.find().lean();
        if (mongoUsers && mongoUsers.length > 0) {
          return mongoUsers.map(u => User.toSafeUser(u));
        }
      } catch (err) {
        console.warn('MongoDB findAll fallback:', err.message);
      }
    }

    await initializeUsersStore();
    return usersCache.map(u => User.toSafeUser(u));
  }
}

