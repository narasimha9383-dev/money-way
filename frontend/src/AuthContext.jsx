// frontend/src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signup as authSignup,
  login as authLogin,
  loginWithGoogle as authLoginWithGoogle,
  linkGoogleAccount as authLinkGoogleAccount,
  logout as authLogout,
  getCurrentUser
} from './services/auth.js';
import {
  getStoredToken,
  updateUserProfileApi,
  fetchSavedOpportunitiesApi,
  toggleSavedOpportunityApi
} from './services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login', emailHint: '' });
  const [savedIds, setSavedIds] = useState([]);

  // Restore session on application startup
  const restoreSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setSavedIds(currentUser?.savedOpportunities || []);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session restoration failed:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();

    // Listen for global auth expiration events from API client
    const handleAuthExpired = () => {
      setUser(null);
      setSavedIds([]);
      setAuthModalState({ isOpen: true, mode: 'login', emailHint: '' });
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [restoreSession]);

  /**
   * Refresh authenticated user profile from backend
   */
  const refreshUser = async () => {
    try {
      const refreshed = await getCurrentUser();
      if (refreshed) {
        setUser(refreshed);
        setSavedIds(refreshed?.savedOpportunities || []);
      }
      return refreshed;
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      return null;
    }
  };

  /**
   * Email + Password signup
   */
  const signup = async ({ name, email, password }) => {
    const res = await authSignup({ name, email, password });
    if (res?.user) {
      setUser(res.user);
      setSavedIds(res.user.savedOpportunities || []);
      setAuthModalState({ isOpen: false, mode: 'login', emailHint: '' });
    }
    return res;
  };

  /**
   * Email + Password login
   */
  const login = async ({ email, password }) => {
    const res = await authLogin({ email, password });
    if (res?.user) {
      setUser(res.user);
      setSavedIds(res.user.savedOpportunities || []);
      setAuthModalState({ isOpen: false, mode: 'login', emailHint: '' });
    }
    return res;
  };

  /**
   * Google Sign-In with Firebase ID token
   */
  const loginWithGoogle = async () => {
    const res = await authLoginWithGoogle();
    if (res?.user) {
      setUser(res.user);
      setSavedIds(res.user.savedOpportunities || []);
      setAuthModalState({ isOpen: false, mode: 'login', emailHint: '' });
    }
    return res;
  };

  /**
   * Link Google account to existing email/password account
   */
  const linkGoogle = async ({ email, password }) => {
    const res = await authLinkGoogleAccount({ email, password });
    if (res?.user) {
      setUser(res.user);
      setSavedIds(res.user.savedOpportunities || []);
      setAuthModalState({ isOpen: false, mode: 'login', emailHint: '' });
    }
    return res;
  };

  /**
   * Logout user and clear session
   */
  const logout = async () => {
    try {
      await authLogout();
    } finally {
      setUser(null);
      setSavedIds([]);
    }
  };

  /**
   * Update user questionnaire profile data
   */
  const updateUserProfile = async (profileData, name) => {
    if (!user) return null;
    try {
      const res = await updateUserProfileApi({ name, profileData });
      if (res.user) {
        setUser(res.user);
      }
      return res.user;
    } catch (err) {
      console.error('Failed to update user profile:', err);
      throw err;
    }
  };

  /**
   * Toggle save/bookmark for opportunity
   */
  const toggleSaveOpportunity = async (oppId) => {
    // If not logged in, prompt sign in
    if (!user) {
      setAuthModalState({ isOpen: true, mode: 'login', emailHint: '' });
      return false;
    }

    try {
      const res = await toggleSavedOpportunityApi(oppId);
      setSavedIds(res.savedOpportunities || []);
      setUser(prev => prev ? { ...prev, savedOpportunities: res.savedOpportunities } : prev);
      return res.isSaved;
    } catch (err) {
      console.error('Toggle save opportunity failed:', err);
      return false;
    }
  };

  const openAuthModal = (mode = 'login', emailHint = '') => {
    setAuthModalState({ isOpen: true, mode, emailHint });
  };

  const closeAuthModal = () => {
    setAuthModalState({ isOpen: false, mode: 'login', emailHint: '' });
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    savedIds,
    login,
    signup,
    loginWithGoogle,
    linkGoogle,
    logout,
    refreshUser,
    updateUserProfile,
    toggleSaveOpportunity,
    authModalState,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
