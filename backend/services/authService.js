// backend/services/authService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { verifyFirebaseIdToken } from './firebaseService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'incomepath_jwt_production_secret_key_2026_secure!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Validate password strength
 * Rules: At least 8 characters, 1 uppercase, 1 lowercase, 1 number or special character
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number (0-9) or special symbol.' };
  }
  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

/**
 * Generate application JWT containing only { userId, role }
 */
export function generateToken(user) {
  const payload = {
    userId: user.id,
    role: user.role || 'user'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify application JWT
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Register a new user with Email + Password
 */
export async function signupUser({ name, email, password }) {
  if (!name || !name.trim()) {
    const err = new Error('Full name is required.');
    err.statusCode = 400;
    throw err;
  }

  if (!email || !validateEmailFormat(email)) {
    const err = new Error('Please provide a valid email address.');
    err.statusCode = 400;
    throw err;
  }

  const passCheck = validatePasswordStrength(password);
  if (!passCheck.valid) {
    const err = new Error(passCheck.error);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check for duplicate account
  const existingUser = await User.findByEmail(normalizedEmail);
  if (existingUser) {
    const err = new Error('An account with this email address already exists. Please sign in instead.');
    err.statusCode = 409;
    throw err;
  }

  // Hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Default role is always 'user' (ignoring any client role input)
  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    provider: 'email',
    role: 'user',
    isVerified: false
  });

  const now = new Date().toISOString();
  await User.update(newUser.id, { lastLoginAt: now });

  const token = generateToken(newUser);
  return {
    user: User.toSafeUser({ ...newUser, lastLoginAt: now }),
    token
  };
}

/**
 * Login user with Email + Password
 */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findByEmail(normalizedEmail);

  // Generic invalid error to prevent account enumeration
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  // If user signed up via Google and has no password hash
  if (!user.passwordHash && user.provider === 'google') {
    const err = new Error('This account was created with Google Sign-In. Please sign in using Google.');
    err.statusCode = 400;
    err.code = 'USE_GOOGLE_SIGNIN';
    throw err;
  }

  if (!user.passwordHash) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const now = new Date().toISOString();
  await User.update(user.id, { lastLoginAt: now });

  const token = generateToken(user);
  return {
    user: User.toSafeUser({ ...user, lastLoginAt: now }),
    token
  };
}

/**
 * Authenticate with Google (via Firebase ID token)
 */
export async function loginWithGoogle(idToken) {
  const verifiedProfile = await verifyFirebaseIdToken(idToken);
  const { uid, email, name, picture, emailVerified } = verifiedProfile;

  if (!email) {
    const err = new Error('Google account must have a verified email address.');
    err.statusCode = 400;
    err.code = 'EMAIL_REQUIRED';
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  // 1. Look for existing user by Firebase UID (or Google ID)
  let user = await User.findByFirebaseUid(uid);
  if (user) {
    const updates = { 
      lastLoginAt: now,
      firebaseUid: uid,
      googleId: uid
    };
    if (!user.avatar && picture) updates.avatar = picture;
    const updated = await User.update(user.id, updates);

    const token = generateToken(updated || user);
    return {
      user: User.toSafeUser({ ...user, ...updates }),
      token,
      isNewUser: false
    };
  }

  // 2. Look for existing user by Email (link verified Google UID seamlessly)
  user = await User.findByEmail(normalizedEmail);
  if (user) {
    const updates = { 
      firebaseUid: uid,
      googleId: uid, 
      lastLoginAt: now, 
      isVerified: true 
    };
    if (!user.avatar && picture) updates.avatar = picture;
    const updated = await User.update(user.id, updates);

    const token = generateToken(updated || user);
    return {
      user: User.toSafeUser({ ...user, ...updates }),
      token,
      isNewUser: false
    };
  }

  // 3. New user signup via Google
  const newUser = await User.create({
    name: name || 'Google Explorer',
    email: normalizedEmail,
    passwordHash: null,
    googleId: uid,
    firebaseUid: uid,
    provider: 'google',
    avatar: picture,
    role: 'user',
    isVerified: Boolean(emailVerified)
  });

  await User.update(newUser.id, { lastLoginAt: now });

  const token = generateToken(newUser);
  return {
    user: User.toSafeUser({ ...newUser, lastLoginAt: now }),
    token,
    isNewUser: true
  };
}

/**
 * Link Google account to an existing email/password account after password confirmation
 */
export async function linkGoogleToExistingAccount({ email, password, idToken }) {
  if (!email || !password || !idToken) {
    const err = new Error('Email, password, and Google ID token are required for account linking.');
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findByEmail(normalizedEmail);

  if (!user || !user.passwordHash) {
    const err = new Error('Invalid account credentials.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Password verification failed. Unable to link Google account.');
    err.statusCode = 401;
    throw err;
  }

  const verifiedProfile = await verifyFirebaseIdToken(idToken);
  if (verifiedProfile.email.toLowerCase() !== normalizedEmail) {
    const err = new Error('The Google account email does not match the account you are trying to link.');
    err.statusCode = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const updates = {
    googleId: verifiedProfile.uid,
    isVerified: true,
    lastLoginAt: now
  };
  if (!user.avatar && verifiedProfile.picture) {
    updates.avatar = verifiedProfile.picture;
  }

  const updatedUser = await User.update(user.id, updates);
  const token = generateToken(updatedUser);

  return {
    user: User.toSafeUser(updatedUser),
    token,
    linked: true
  };
}
