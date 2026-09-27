// backend/services/firebaseService.js
import { firebaseAuth, isFirebaseConfigured } from '../config/firebaseAdmin.js';
import jwt from 'jsonwebtoken';

let googleCertsCache = null;
let googleCertsExpiry = 0;

/**
 * Fetch and cache Google's public x509 certificates for Firebase Auth
 */
async function getGooglePublicCerts() {
  const now = Date.now();
  if (googleCertsCache && now < googleCertsExpiry) {
    return googleCertsCache;
  }

  try {
    const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    if (!res.ok) throw new Error('Failed to fetch Google public certificates');
    const certs = await res.json();

    // Cache control parsing
    const cacheControl = res.headers.get('cache-control') || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAgeSeconds = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

    googleCertsCache = certs;
    googleCertsExpiry = now + (maxAgeSeconds * 1000);
    return certs;
  } catch (err) {
    console.error('Error fetching Google x509 certs:', err.message);
    if (googleCertsCache) return googleCertsCache;
    throw err;
  }
}

/**
 * Verify a Firebase ID Token received from frontend Google sign-in
 * @param {string} idToken
 * @returns {Promise<{ uid: string, email: string, name: string, picture: string, emailVerified: boolean }>}
 */
export async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('A valid Firebase ID token string is required.');
  }

  // Support automated test tokens during test runs (NODE_ENV=test only)
  if (process.env.NODE_ENV === 'test' && idToken.startsWith('test-token-')) {
    const parts = idToken.split(':');
    const email = parts[1] || 'googleuser@example.com';
    const name = parts[2] || 'Google User';
    const uid = parts[3] || 'google_uid_12345';
    return {
      uid,
      email,
      name,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      emailVerified: true
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'moneyway-100';

  // 1. Try Firebase Admin SDK native verification if fully configured
  if (isFirebaseConfigured && firebaseAuth) {
    try {
      const decoded = await firebaseAuth.verifyIdToken(idToken);
      return {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.displayName || 'Google User',
        picture: decoded.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(decoded.email || 'Google')}`,
        emailVerified: decoded.email_verified ?? true
      };
    } catch (adminErr) {
      console.warn('[Firebase Admin verifyIdToken fallback]:', adminErr.message);
    }
  }

  // 2. Cryptographic verification using Google's public x509 certificates
  try {
    const decodedHeader = jwt.decode(idToken, { complete: true });
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      throw new Error('Invalid Firebase token header.');
    }

    const kid = decodedHeader.header.kid;
    const certs = await getGooglePublicCerts();
    const certificate = certs[kid];

    if (!certificate) {
      throw new Error('No matching Google public key found for token kid: ' + kid);
    }

    const verified = jwt.verify(idToken, certificate, {
      algorithms: ['RS256'],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`
    });

    return {
      uid: verified.user_id || verified.sub,
      email: verified.email,
      name: verified.name || 'Google User',
      picture: verified.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(verified.email || 'Google')}`,
      emailVerified: Boolean(verified.email_verified)
    };
  } catch (err) {
    console.error('[Google ID Token Verification Error]:', err.message);
    const tokenError = new Error(`Google token verification failed: ${err.message}`);
    tokenError.statusCode = 401;
    tokenError.code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
    throw tokenError;
  }
}
