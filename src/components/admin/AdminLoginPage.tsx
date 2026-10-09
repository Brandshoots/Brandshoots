import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No admin account found with this email.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Access temporarily locked due to multiple failed attempts. Try again later.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Please enter your administrator email.');
      return;
    }

    setResetError(null);
    setResetSending(true);

    try {
      await sendPasswordResetEmail(firebaseAuth, resetEmail.trim());
      setResetSuccess(true);
    } catch (err: any) {
      console.error('Reset error:', err);
      setResetError(err?.message || 'Failed to send password reset email.');
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04060A] text-white flex items-center justify-center p-4 selection:bg-[#008CFF] selection:text-white">
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#008CFF]/10 via-[#008CFF]/0 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-[#070B12]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(0,140,255,0.08)] backdrop-blur-2xl z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#008CFF]/15 border border-[#008CFF]/40 flex items-center justify-center text-[#008CFF] mb-4 shadow-[0_0_20px_rgba(0,140,255,0.3)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 font-display font-black text-2xl uppercase tracking-wider">
            <span className="text-[#008CFF]">BRAND</span>
            <span className="text-white">SHOOTS</span>
          </div>
          <p className="mt-1 font-mono text-[11px] tracking-[0.24em] uppercase text-white/50">
            Production CMS & Portal
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brandshoots.com"
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_20px_rgba(0,140,255,0.2)] transition-all font-mono"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetSuccess(false);
                  setResetError(null);
                  setShowResetModal(true);
                }}
                className="text-[11px] font-mono text-[#008CFF] hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_20px_rgba(0,140,255,0.2)] transition-all font-mono"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#008CFF] hover:bg-[#209CFF] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(0,140,255,0.4)] hover:shadow-[0_0_36px_rgba(0,140,255,0.65)] active:scale-98 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
          <Link
            to="/"
            className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors"
          >
            ← Back to Live Site
          </Link>
          <p className="text-[10px] font-mono text-center text-white/30">
            Protected BrandShoots Realtime Database portal. Authorized personnel only.
          </p>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#0A0E17] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 font-display uppercase tracking-wider">
              Reset Administrator Password
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed font-mono">
              Enter your registered administrator email address. Firebase will send a secure password reset link.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Password reset email dispatched! Check your inbox.</span>
                </div>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {resetError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@brandshoots.com"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-xs font-mono focus:border-[#008CFF] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetSending}
                    className="flex-1 py-2.5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] disabled:opacity-50 text-white font-mono text-xs uppercase font-bold"
                  >
                    {resetSending ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
