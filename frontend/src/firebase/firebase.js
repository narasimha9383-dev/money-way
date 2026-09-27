import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firebase web credentials are public/safe for client-side code.
// Env vars are preferred; fallback ensures Google Sign-In works on all deployments.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBFmCHGbtLweT-b4qDZWEE8TaVwkBqfIAE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'moneyway-100.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'moneyway-100',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'moneyway-100.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '445935673191',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:445935673191:web:a1839945dace14feff99c2'
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (err) {
    console.error('Failed to initialize Firebase app:', err);
  }
} else {
  console.info('[Firebase] Notice: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, or VITE_FIREBASE_PROJECT_ID are not set in frontend/.env.');
}

/**
 * Triggers Google Sign-In popup with Firebase Auth and returns verified fresh ID token
 * @returns {Promise<string>} The Firebase ID token string
 */
export async function signInWithGooglePopup() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      'To enable real-time Google Sign-In, please configure your Firebase Web credentials in frontend/.env (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID).'
    );
  }

  try {
    const credential = await signInWithPopup(auth, googleProvider);
    // Request fresh ID token directly from Google (forceRefresh=true)
    const idToken = await credential.user.getIdToken(true);
    return idToken;
  } catch (err) {
    console.error('Firebase signInWithPopup error:', err.code, err.message);
    if (err.code === 'auth/popup-closed-by-user') {
      const error = new Error('Google Sign-In popup was closed before completing sign-in.');
      error.code = 'POPUP_CLOSED';
      throw error;
    }
    if (err.code === 'auth/popup-blocked') {
      const error = new Error('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      error.code = 'POPUP_BLOCKED';
      throw error;
    }
    if (err.code === 'auth/cancelled-popup-request') {
      const error = new Error('Sign-in was cancelled due to a concurrent popup request.');
      error.code = 'POPUP_CANCELLED';
      throw error;
    }
    if (err.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      const error = new Error(`Domain "${currentHost}" is not authorized in Firebase Console. Please add "${currentHost}" to Authentication -> Settings -> Authorized Domains.`);
      error.code = 'UNAUTHORIZED_DOMAIN';
      throw error;
    }
    if (err.code === 'auth/operation-not-allowed') {
      const error = new Error('Google Sign-In is not enabled in Firebase Authentication console.');
      error.code = 'NOT_ENABLED';
      throw error;
    }
    const error = new Error(err.message || 'Failed to authenticate with Google.');
    error.code = err.code || 'AUTH_ERROR';
    throw error;
  }
}

/**
 * Signs out of the Firebase client to clear cached credentials and ensure clean re-auth
 */
export async function signOutFirebase() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[Firebase] signOut warning:', err.message);
    }
  }
}

export { auth, googleProvider, isFirebaseConfigured };

