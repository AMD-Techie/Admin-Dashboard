import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Desktop Skeleton Rows */}
      <div className="hidden md:block bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-800/80 p-4 border-b border-slate-700/50 grid grid-cols-12 gap-4">
          <div className="h-4 bg-slate-700/60 rounded col-span-1"></div>
          <div className="h-4 bg-slate-700/60 rounded col-span-3"></div>
          <div className="h-4 bg-slate-700/60 rounded col-span-2"></div>
          <div className="h-4 bg-slate-700/60 rounded col-span-2"></div>
          <div className="h-4 bg-slate-700/60 rounded col-span-2"></div>
          <div className="h-4 bg-slate-700/60 rounded col-span-2"></div>
        </div>
        <div className="divide-y divide-slate-700/40">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="p-4 grid grid-cols-12 gap-4 items-center">
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg col-span-1"></div>
              <div className="space-y-2 col-span-3">
                <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-slate-700/60 rounded col-span-2 w-20"></div>
              <div className="h-4 bg-slate-700/60 rounded col-span-2 w-16"></div>
              <div className="h-4 bg-slate-700/60 rounded col-span-2 w-14"></div>
              <div className="flex gap-2 col-span-2 justify-end">
                <div className="w-8 h-8 bg-slate-700/60 rounded-lg"></div>
                <div className="w-8 h-8 bg-slate-700/60 rounded-lg"></div>
                <div className="w-8 h-8 bg-slate-700/60 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-700/60 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-700/40">
              <div className="h-5 bg-slate-700/60 rounded w-20"></div>
              <div className="h-5 bg-slate-700/60 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
