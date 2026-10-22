import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { LogIn, UserPlus, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Compass, Sparkles, CheckCircle } from 'lucide-react';

interface Props {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onNavigateToHome: () => void;
}

export const AuthView: React.FC<Props> = ({
  initialMode = 'login',
  onLoginSuccess,
  onRegisterUser,
  allUsers,
  onNavigateToHome,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = loginEmail.toLowerCase().trim();
    if (!cleanEmail) {
      setLoginError('Please enter your email address');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const existingUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (existingUser) {
        setLoginEmail('');
        setLoginPassword('');
        onLoginSuccess(existingUser);
      } else {
        // Create brand new customer session user
        const isAdmin = cleanEmail === 'thirunivas418@gmail.com';
        const loggedUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '+91 98765 43210',
          role: isAdmin ? 'admin' : 'customer',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setLoginEmail('');
        setLoginPassword('');
        onRegisterUser(loggedUser);
        onLoginSuccess(loggedUser);
      }
    }, 300);
  };

  // Handle Signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};

    if (!signupName.trim()) {
      err.name = 'Full name is required';
    }
    if (!signupEmail.trim()) {
      err.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      err.email = 'Please enter a valid email address';
    }

    if (!signupPassword) {
      err.password = 'Password is required';
    } else if (signupPassword.length < 6) {
      err.password = 'Password must be at least 6 characters long';
    }

    if (!signupConfirmPassword) {
      err.confirmPassword = 'Please confirm your password';
    } else if (signupPassword !== signupConfirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }

    setSignupErrors(err);
    if (Object.keys(err).length > 0) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = signupEmail.toLowerCase().trim();
      const isAdmin = cleanEmail === 'thirunivas418@gmail.com';

      // Check if user already exists
      const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setSignupErrors({ email: 'An account with this email already exists. Please sign in.' });
        return;
      }

      const newUser: UserProfile = {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: signupName.trim(),
        email: cleanEmail,
        phone: signupPhone.trim() || '+91 98765 43210',
        role: isAdmin ? 'admin' : 'customer',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };

      // Clear all signup form fields
      setSignupName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupErrors({});

      // Register and log in immediately
      onRegisterUser(newUser);
      onLoginSuccess(newUser);
    }, 300);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={onNavigateToHome}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white mx-auto shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Sign in to JourneyHub' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Access your travel dashboard, reservations, and PDF receipts'
              : 'Join JourneyHub to explore tours, unlock AI concierge, and manage trips'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupErrors({});
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* ========================================================================= */}
        {/* LOGIN FORM (Requirement 6) */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Account'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign up now
              </button>
            </div>

            {/* Demo Quick Logins for Instant Testing / Presentations */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                One-Click Presentation Logins
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('thirunivas418@gmail.com');
                    setLoginPassword('admin123');
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-semibold text-center transition-colors"
                >
                  Fill Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('priya.travels@gmail.com');
                    setLoginPassword('travel123');
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-semibold text-center transition-colors"
                >
                  Fill Customer Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SIGNUP FORM (Requirement 6) */}
        {/* ========================================================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border ${
                    signupErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
                />
              </div>
              {signupErrors.name && <p className="text-red-500 text-[11px] mt-1">{signupErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border ${
                    signupErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
                />
              </div>
              {signupErrors.email && <p className="text-red-500 text-[11px] mt-1">{signupErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border ${
                    signupErrors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
                />
              </div>
              {signupErrors.password && <p className="text-red-500 text-[11px] mt-1">{signupErrors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border ${
                    signupErrors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
                />
              </div>
              {signupErrors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1">{signupErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Already have an account? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
