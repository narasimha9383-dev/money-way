// frontend/src/services/auth.js
import {
  signupApi,
  loginApi,
  googleAuthApi,
  linkGoogleApi,
  getMeApi,
  logoutApi,
  setStoredToken,
  removeStoredToken,
  getStoredToken
} from './api.js';
import { signInWithGooglePopup, signOutFirebase } from '../firebase/firebase.js';

/**
 * Register with Email and Password
 */
export async function signup({ name, email, password }) {
  const res = await signupApi({ name, email, password });
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

/**
 * Sign in with Email and Password
 */
export async function login({ email, password }) {
  const res = await loginApi({ email, password });
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

/**
 * Sign in with Google (Firebase popup -> Backend verification -> App JWT)
 */
export async function loginWithGoogle() {
  const idToken = await signInWithGooglePopup();
  const res = await googleAuthApi({ idToken });
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

/**
 * Link Google account to an existing email/password account
 */
export async function linkGoogleAccount({ email, password }) {
  const idToken = await signInWithGooglePopup();
  const res = await linkGoogleApi({ email, password, idToken });
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

/**
 * Fetch current user profile
 */
export async function getCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;
  const res = await getMeApi();
  return res.user;
}

/**
 * Complete Logout:
 * 1. Notify backend
 * 2. Sign out of Firebase client
 * 3. Clear application JWT from localStorage
 */
export async function logout() {
  try {
    await logoutApi();
  } catch {
    // Proceed with client cleanup
  } finally {
    try {
      await signOutFirebase();
    } catch (err) {
      console.warn('[Firebase] signOut warning:', err);
    }
    removeStoredToken();
  }
}
