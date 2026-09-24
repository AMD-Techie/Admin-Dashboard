import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-indigo-400 mb-6 shadow-2xl">
        <PackageX className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The route or resource you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Product Dashboard
      </Link>
    </div>
  );
};
