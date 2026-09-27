// backend/middleware/authMiddleware.js
import { verifyToken } from '../services/authService.js';
import { User } from '../models/User.js';

/**
 * Middleware: requireAuth
 * Validates the Authorization Bearer JWT token, ensures user exists in DB,
 * and sets req.user = { userId, role } and req.currentUser = safeUser.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing.'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          error: 'Session expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        error: 'Invalid authentication token.'
      });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Malformed authentication token.'
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account associated with this token no longer exists.'
      });
    }

    // Attach verified identity
    req.user = {
      userId: user.id,
      role: user.role
    };
    req.currentUser = User.toSafeUser(user);

    next();
  } catch (err) {
    console.error('requireAuth unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal authorization error.'
    });
  }
}

/**
 * Middleware: requireAdmin
 * Must be executed after requireAuth.
 * Ensures that the authenticated user possesses the 'admin' role.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || !req.currentUser) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required before verifying admin privileges.'
    });
  }

  if (req.user.role !== 'admin' || req.currentUser.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Administrator privileges required to access this resource.'
    });
  }

  next();
}

/**
 * Middleware: optionalAuth
 * Attempts to parse Bearer token if present, but does not block if absent.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]?.trim();
      if (token) {
        try {
          const decoded = verifyToken(token);
          if (decoded && decoded.userId) {
            const user = await User.findById(decoded.userId);
            if (user) {
              req.user = { userId: user.id, role: user.role };
              req.currentUser = User.toSafeUser(user);
            }
          }
        } catch {
          // Ignore invalid optional tokens
        }
      }
    }
  } catch {
    // Proceed without auth
  }
  next();
}
