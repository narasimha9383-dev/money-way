// backend/config/firebaseAdmin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let isFirebaseConfigured = false;
let firebaseAuth = null;

try {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (serviceAccountJson) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      const fs = await import('fs');
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountJson, 'utf-8'));
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
    isFirebaseConfigured = true;
    firebaseAuth = getAuth();
    console.log('[Firebase Admin] Initialized with service account credentials.');
  } else if (projectId && clientEmail && privateKey) {
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
    }
    isFirebaseConfigured = true;
    firebaseAuth = getAuth();
    console.log(`[Firebase Admin] Initialized with project ID: ${projectId}`);
  } else if (projectId) {
    if (getApps().length === 0) {
      initializeApp({
        projectId
      });
    }
    isFirebaseConfigured = true;
    firebaseAuth = getAuth();
    console.log(`[Firebase Admin] Initialized with projectId=${projectId}`);
  } else {
    console.info('[Firebase Admin] Notice: No Firebase project configured in .env.');
  }
} catch (err) {
  console.warn('[Firebase Admin] Initialization note:', err.message);
  isFirebaseConfigured = false;
}

export { firebaseAuth, isFirebaseConfigured };
