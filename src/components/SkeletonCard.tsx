import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl p-6 flex flex-col h-full space-y-5 animate-pulse">
      {/* Cover picture skeleton */}
      <div className="h-44 -mx-6 -mt-6 bg-slate-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent animate-shimmer"></div>
      </div>

      {/* Logo & City skeleton */}
      <div className="flex items-start space-x-3 -mt-12 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-900 shadow-md"></div>
        <div className="pt-8 w-24 h-4 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Title & Description skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-slate-800 rounded-lg w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-800/60 rounded-md w-full"></div>
          <div className="h-3 bg-slate-800/60 rounded-md w-5/6"></div>
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="border-t border-b border-slate-800/60 py-4 my-4 grid grid-cols-3 gap-2 bg-slate-950/20 rounded-xl px-2">
        <div className="flex flex-col items-center space-y-1.5">
          <div className="h-2.5 bg-slate-800/40 rounded w-12"></div>
          <div className="h-4 bg-slate-800/80 rounded w-16"></div>
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <div className="h-2.5 bg-slate-800/40 rounded w-12"></div>
          <div className="h-4 bg-slate-800/80 rounded w-10"></div>
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <div className="h-2.5 bg-slate-800/40 rounded w-12"></div>
          <div className="h-4 bg-slate-800/80 rounded w-14"></div>
        </div>
      </div>

      {/* Button skeletons */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-9 bg-slate-800/80 rounded-xl"></div>
        <div className="w-20 h-9 bg-indigo-900/40 rounded-xl border border-indigo-500/20"></div>
      </div>
    </div>
  );
}
