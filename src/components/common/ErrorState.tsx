import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load products. Please try again.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-8 text-center flex flex-col items-center justify-center my-6 max-w-lg mx-auto">
      <div className="w-12 h-12 bg-rose-900/50 rounded-full flex items-center justify-center text-rose-400 mb-4 ring-8 ring-rose-950/30">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-rose-200 mb-1">Failed to fetch data</h3>
      <p className="text-sm text-rose-300/80 mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};
