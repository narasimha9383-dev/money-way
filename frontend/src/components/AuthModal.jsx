// frontend/src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import MoneyWayLogo from './MoneyWayLogo.jsx';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';

export default function AuthModal() {
  const {
    authModalState,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    loginWithGoogle,
    linkGoogle
  } = useAuth();

  const { isOpen, mode: initialMode, emailHint } = authModalState;

  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signup' | 'link'
  const [formData, setFormData] = useState({
    name: '',
    email: emailHint || '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Link account state if Google conflict occurs
  const [linkConflictEmail, setLinkConflictEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setFormData(prev => ({
        ...prev,
        email: emailHint || prev.email || '',
        password: '',
        confirmPassword: ''
      }));
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, initialMode, emailHint]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  // Password requirements calculation
  const password = formData.password;
  const passLength = password.length >= 8;
  const passUpper = /[A-Z]/.test(password);
  const passLower = /[a-z]/.test(password);
  const passSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passAllValid = passLength && passUpper && passLower && passSpecial;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const validateForm = () => {
    const errors = {};
    if (mode === 'signup' && (!formData.name || !formData.name.trim())) {
      errors.name = 'Please enter your full name.';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (mode === 'signup' && !passAllValid) {
      errors.password = 'Please satisfy all password security requirements.';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);

    try {
      if (mode === 'signup') {
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password
        });
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setServerError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.code === 'ACCOUNT_EXISTS_WITH_PASSWORD') {
        // Switch to account linking flow
        setLinkConflictEmail(err.data?.email || formData.email || '');
        setMode('link');
      } else {
        setServerError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLinkAccountSubmit = async (e) => {
    e.preventDefault();
    if (!linkPassword) {
      setServerError('Please enter your existing password to link your Google account.');
      return;
    }

    setLoading(true);
    setServerError(null);
    try {
      await linkGoogle({
        email: linkConflictEmail,
        password: linkPassword
      });
    } catch (err) {
      setServerError(err.message || 'Account linking failed. Please verify your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#0b1320] border border-slate-800 shadow-2xl p-6 sm:p-8 text-[#F5F7F5] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <MoneyWayLogo size="lg" showText={false} className="justify-center mb-1" />

          <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
            {mode === 'signup' 
              ? 'Create Your Account' 
              : mode === 'link' 
              ? 'Link Google Account' 
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signup'
              ? 'Join Money Way to save pathways and track your action plans.'
              : mode === 'link'
              ? `Confirm password for ${linkConflictEmail} to link Google sign-in.`
              : 'Sign in to access your verified opportunities and personalized dashboard.'}
          </p>
        </div>

        {/* Mode Switch Tabs (Login / Signup) */}
        {mode !== 'link' && (
          <div className="flex p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setServerError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setServerError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#39E98A] text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{serverError}</span>
          </div>
        )}

        {/* ACCOUNT LINKING FORM */}
        {mode === 'link' ? (
          <form onSubmit={handleLinkAccountSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Account Linking Required
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                An account with this email was previously registered using a password. Please confirm your password once to securely connect your Google account.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={linkConflictEmail}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  placeholder="Enter your existing account password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-[#39E98A] focus:ring-1 focus:ring-[#39E98A] text-xs text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Link'}
              </button>
            </div>
          </form>
        ) : (
          /* STANDARD LOGIN / SIGNUP FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Kumar"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border ${
                      formErrors.name ? 'border-rose-500' : 'border-slate-800'
                    } focus:border-[#39E98A] focus:ring-1 focus:ring-[#39E98A] text-xs text-white placeholder-slate-500 outline-none transition-all`}
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-rose-400">{formErrors.name}</p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.email ? 'border-rose-500' : 'border-slate-800'
                  } focus:border-[#39E98A] focus:ring-1 focus:ring-[#39E98A] text-xs text-white placeholder-slate-500 outline-none transition-all`}
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
              {formErrors.email && (
                <p className="text-[11px] text-rose-400">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.password ? 'border-rose-500' : 'border-slate-800'
                  } focus:border-[#39E98A] focus:ring-1 focus:ring-[#39E98A] text-xs text-white placeholder-slate-500 outline-none transition-all`}
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-[11px] text-rose-400">{formErrors.password}</p>
              )}

              {/* Password Requirements Checklist (Signup only) */}
              {mode === 'signup' && formData.password.length > 0 && (
                <div className="p-2.5 mt-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-[11px]">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                    Security Requirements:
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <span className={`flex items-center gap-1.5 ${passLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passLength ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      8+ Characters
                    </span>
                    <span className={`flex items-center gap-1.5 ${passUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passUpper ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      1 Uppercase (A-Z)
                    </span>
                    <span className={`flex items-center gap-1.5 ${passLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passLower ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      1 Lowercase (a-z)
                    </span>
                    <span className={`flex items-center gap-1.5 ${passSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passSpecial ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      1 Number or Symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border ${
                      formErrors.confirmPassword ? 'border-rose-500' : 'border-slate-800'
                    } focus:border-[#39E98A] focus:ring-1 focus:ring-[#39E98A] text-xs text-white placeholder-slate-500 outline-none transition-all`}
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-400">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#39E98A]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0b1320] px-3 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
                or
              </span>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-slate-700 border border-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all hover:bg-slate-800/80 cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#39E98A]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* Modal Footer: Mode Switch Link */}
        {mode !== 'link' && (
          <div className="pt-2 text-center text-xs text-slate-400">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setServerError(null); }}
                  className="text-[#39E98A] font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setServerError(null); }}
                  className="text-[#39E98A] font-semibold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
