// frontend/src/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from './AuthContext.jsx';
import { ShieldAlert, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  title = "Authentication Required", 
  message = "Please sign in or create an account to access this feature." 
}) {
  const { user, loading, isAuthenticated, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#39E98A] animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-wide">Restoring secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-[#0b1320] border border-slate-800 text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#39E98A]">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 rounded-xl bg-[#39E98A] hover:bg-[#32d47c] text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 cursor-pointer transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-[#14080e] border border-rose-900/60 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white font-heading">Access Denied</h3>
          <p className="text-xs text-rose-300/80 leading-relaxed">
            Administrator privileges are required to access this portal. Your current role is <strong className="text-white">{user?.role || 'user'}</strong>.
          </p>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-rose-950 text-left text-[11px] text-slate-400 font-mono">
          <div>User: {user?.email}</div>
          <div>Role: {user?.role}</div>
          <div className="text-rose-400 mt-1">Status: 403 Forbidden</div>
        </div>
      </div>
    );
  }

  return children;
}
