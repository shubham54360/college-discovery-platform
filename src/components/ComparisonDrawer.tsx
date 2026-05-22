'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getComparedColleges, removeFromCompare, clearCompare, CompareCollege } from '@/lib/compare';

export default function ComparisonDrawer() {
  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const refreshCompare = () => {
    setColleges(getComparedColleges());
  };

  useEffect(() => {
    refreshCompare();
    // Listen for compare list changes
    window.addEventListener('unifinder_compare_change', refreshCompare);
    return () => {
      window.removeEventListener('unifinder_compare_change', refreshCompare);
    };
  }, []);

  if (colleges.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto md:bottom-6 animate-in slide-in-from-bottom-8 duration-300">
      {/* Drawer Card */}
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-lg rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Counts and Thumbs */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold text-sm">
              {colleges.length}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Compare Colleges</h4>
            <p className="text-xs text-slate-400">
              {colleges.length === 3
                ? 'Maximum compared colleges reached'
                : `Add up to ${3 - colleges.length} more to compare`}
            </p>
          </div>
        </div>

        {/* Middle: Selected College Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {colleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5"
            >
              {college.logoUrl && (
                <img
                  src={college.logoUrl}
                  alt={college.name}
                  className="h-5 w-5 rounded-lg object-cover"
                />
              )}
              <span className="text-xs font-bold text-slate-200 truncate max-w-[100px] md:max-w-[140px]">
                {college.name}
              </span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="text-slate-500 hover:text-rose-400 focus:outline-none cursor-pointer"
                title="Remove"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={clearCompare}
            className="w-1/2 md:w-auto text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-950/50 transition-all duration-300 cursor-pointer"
          >
            Clear All
          </button>
          <Link
            href="/compare"
            className="w-1/2 md:w-auto text-center text-xs font-black bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-all duration-300"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
