import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Mail, Lock, User, Phone, ShieldCheck, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'forgot' | 'verify';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
  onSendVerificationCode: (email: string) => Promise<string>;
  onVerifyEmailCode: (email: string, code: string) => Promise<boolean>;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
  allUsers,
  onRegisterUser,
  onSendVerificationCode,
  onVerifyEmailCode,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [verificationCode, setVerificationCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // Admin Account Check
      if (cleanEmail === 'thirunivas418@gmail.com') {
        if (password === 'Admin@123') {
          const adminUser = allUsers.find((u) => u.email === 'thirunivas418@gmail.com') || {
            id: 'usr-admin-001',
            name: 'Administrator',
            email: 'thirunivas418@gmail.com',
            phone: '+91 98765 43210',
            role: 'admin' as UserRole,
            isEmailVerified: true,
            createdAt: new Date().toISOString(),
          };
          onLoginSuccess(adminUser);
          setLoading(false);
          onClose();
          return;
        } else {
          setError('Invalid administrator password. Use Admin@123');
          setLoading(false);
          return;
        }
      }

      // Customer Account Check
      const existingUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        onLoginSuccess(existingUser);
        setLoading(false);
        onClose();
      } else {
        setError('No JourneyHub account found with this email. Please register below.');
        setLoading(false);
      }
    }, 400);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setError('An account with this email already exists. Please sign in instead.');
      setLoading(false);
      return;
    }

    const newUser: UserProfile = {
      id: `usr-cust-${Date.now()}`,
      name: name.trim() || 'Valued Traveler',
      email: cleanEmail,
      phone: phone.trim() || '+91 98765 00000',
      role: role,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);

    // Send verification code
    const code = await onSendVerificationCode(cleanEmail);
    setSimulatedCode(code);
    setLoading(false);
    setSuccessMsg('Account registered successfully! Verification code sent to email.');
    setMode('verify');
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const isOk = await onVerifyEmailCode(email.trim().toLowerCase(), verificationCode);
    setLoading(false);

    if (isOk) {
      setSuccessMsg('Email verified successfully! You can now book packages.');
      const user = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (user) {
        user.isEmailVerified = true;
        onLoginSuccess(user);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError('Invalid 6-digit verification code. Check your simulated email inbox.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`Password reset instructions sent to ${email}. Check simulated email inbox.`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white relative">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            <span>JourneyHub Authentication</span>
          </div>
          <h3 className="text-xl font-black">
            {mode === 'login' && 'Sign In to JourneyHub'}
            {mode === 'register' && 'Create Customer Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'verify' && 'Verify Email Address'}
          </h3>
          <p className="text-xs text-blue-100/80 mt-1">
            {mode === 'login' && 'Access your travel bookings, receipts, and personalized itineraries.'}
            {mode === 'register' && 'Join JourneyHub to book luxury packages across India and world destinations.'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
            {mode === 'verify' && 'Enter the 6-digit code sent to your registered Gmail address.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="thirunivas418@gmail.com or customer@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Admin Quick Credentials Button */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-white">Admin Account:</span> thirunivas418@gmail.com
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('thirunivas418@gmail.com');
                    setPassword('Admin@123');
                  }}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/60 hover:bg-blue-200 text-blue-700 dark:text-blue-300 font-bold rounded text-[10px]"
                >
                  Auto Fill
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Sign In to Account
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Register Customer Account
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Gmail / Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Create Account & Send Code
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* VERIFY EMAIL FORM */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Verification code dispatched to: <strong className="text-slate-900 dark:text-white">{email}</strong>
                </p>
                {simulatedCode && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-mono font-bold inline-block">
                    Simulated Code: {simulatedCode}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Enter 6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="e.g. 748291"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-mono tracking-widest text-center font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {simulatedCode && (
                  <button
                    type="button"
                    onClick={() => setVerificationCode(simulatedCode)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Auto Fill Code
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Verify Now
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Your Registered Gmail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Send Password Reset Email
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Back to{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
