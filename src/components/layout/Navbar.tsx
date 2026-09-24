import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Package, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <Link to="/products" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
              Product Admin
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2 py-0.5 rounded-full font-mono font-medium hidden sm:inline-block">
                Dashboard
              </span>
            </h1>
            <p className="text-xs text-slate-400">Inventory Management Portal</p>
          </div>
        </Link>

        {/* User profile & logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 py-1.5 px-3 rounded-full">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-300">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-200 leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  @{user.username}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
