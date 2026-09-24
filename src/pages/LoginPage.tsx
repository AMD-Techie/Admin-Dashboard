import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, KeyRound, Loader2, Package, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/products';

  const handleQuickFill = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      await login({ username: username.trim(), password: password.trim() });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your username and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Package className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-white tracking-tight">
          Product Admin Dashboard
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Authenticate to manage inventory, view analytics, and update catalogue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {/* Quick Demo Test Credentials Banner */}
          <div className="mb-6 bg-slate-800/80 border border-indigo-500/30 rounded-xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Test Credentials (PRD)
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Username: <code className="text-indigo-300 font-mono font-bold">emilys</code> | Password:{' '}
              <code className="text-indigo-300 font-mono font-bold">emilyspass</code>
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <div className="mt-0.5 shrink-0">⚠️</div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
