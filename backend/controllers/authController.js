// backend/controllers/authController.js
import { 
  signupUser, 
  loginUser, 
  loginWithGoogle, 
  linkGoogleToExistingAccount 
} from '../services/authService.js';
import { User } from '../models/User.js';

/**
 * POST /api/auth/signup
 */
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await signupUser({ name, email, password });
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        error: err.message
      });
    }
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        code: err.code,
        error: err.message
      });
    }
    next(err);
  }
}

/**
 * POST /api/auth/google
 */
export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'Firebase ID token is required for Google authentication.'
      });
    }

    const result = await loginWithGoogle(idToken);
    return res.status(200).json({
      success: true,
      message: result.isNewUser ? 'Google account registered successfully.' : 'Signed in with Google.',
      user: result.user,
      token: result.token,
      isNewUser: Boolean(result.isNewUser)
    });
  } catch (err) {
    const status = err.statusCode || (err.message && err.message.toLowerCase().includes('token') ? 401 : null);
    if (status) {
      return res.status(status).json({
        success: false,
        code: err.code || (status === 401 ? 'TOKEN_INVALID' : 'AUTH_ERROR'),
        email: err.email,
        error: err.message
      });
    }
    next(err);
  }
}

/**
 * POST /api/auth/link-google
 * Safe account linking when an email/password account already exists
 */
export async function linkGoogle(req, res, next) {
  try {
    const { email, password, idToken } = req.body;
    const result = await linkGoogleToExistingAccount({ email, password, idToken });
    return res.status(200).json({
      success: true,
      message: 'Google account linked successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        error: err.message
      });
    }
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Protected endpoint returning authenticated user's safe profile
 */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }
    return res.status(200).json({
      success: true,
      user: User.toSafeUser(user)
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  // Application uses stateless JWTs; clearing client session constitutes complete logout
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

/**
 * PUT /api/auth/profile
 * Update user questionnaire profile data and name
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, profileData } = req.body;
    const updates = {};
    if (name && typeof name === 'string') updates.name = name.trim();
    if (profileData && typeof profileData === 'object') updates.profileData = profileData;

    const updated = await User.update(req.user.userId, updates);
    return res.status(200).json({
      success: true,
      user: User.toSafeUser(updated)
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/saved
 * Retrieve user's saved opportunity IDs
 */
export async function getSavedOpportunities(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    return res.status(200).json({
      success: true,
      savedOpportunities: user?.savedOpportunities || []
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/saved/:id
 * Toggle save / bookmark on opportunity
 */
export async function toggleSavedOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    let saved = user.savedOpportunities || [];
    let isSaved = false;

    if (saved.includes(id)) {
      saved = saved.filter(item => item !== id);
      isSaved = false;
    } else {
      saved = [...saved, id];
      isSaved = true;
    }

    await User.update(user.id, { savedOpportunities: saved });

    return res.status(200).json({
      success: true,
      opportunityId: id,
      isSaved,
      savedOpportunities: saved
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/plans
 * Get user's active action plans
 */
export async function getActionPlans(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    return res.status(200).json({
      success: true,
      actionPlans: user?.actionPlans || []
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/plans
 * Save/update user's action plan tracker state
 */
export async function saveActionPlans(req, res, next) {
  try {
    const { actionPlans } = req.body;
    if (!Array.isArray(actionPlans)) {
      return res.status(400).json({ success: false, error: 'actionPlans must be an array.' });
    }

    const updated = await User.update(req.user.userId, { actionPlans });
    return res.status(200).json({
      success: true,
      actionPlans: updated.actionPlans
    });
  } catch (err) {
    next(err);
  }
}
