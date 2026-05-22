'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { addToCompare, removeFromCompare, isInCompare } from '@/lib/compare';
import { showToast } from '@/components/Toast';

interface College {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  logoUrl: string;
  coverUrl: string;
  type: string;
  established: number;
  ranking: number;
  admissionRate: number;
  tuitionInState: number;
  tuitionOutState: number;
  studentPopulation: number;
  ratings: number;
}

interface CollegeCardProps {
  college: College;
  initialSaved?: boolean;
  onUnsave?: (collegeId: string) => void;
}

export default function CollegeCard({ college, initialSaved = false, onUnsave }: CollegeCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    setIsCompared(isInCompare(college.id));

    // Listen for compare changes to update button state
    const handleCompareChange = () => {
      setIsCompared(isInCompare(college.id));
    };

    window.addEventListener('unifinder_compare_change', handleCompareChange);
    return () => {
      window.removeEventListener('unifinder_compare_change', handleCompareChange);
    };
  }, [college.id]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: college.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
        if (!data.saved && onUnsave) {
          onUnsave(college.id);
        }
      } else if (res.status === 401) {
        showToast('Please sign in to bookmark colleges!', 'error');
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeFromCompare(college.id);
      setIsCompared(false);
    } else {
      const result = addToCompare({
        id: college.id,
        name: college.name,
        slug: college.slug,
        logoUrl: college.logoUrl,
        type: college.type,
        city: college.city,
        state: college.state,
      });
      if (result.success) {
        setIsCompared(true);
        showToast(`Added ${college.name} to comparison!`, 'success');
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  return (
    <div className="group relative bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/85 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Header Cover Banner */}
      <div className="relative h-44 overflow-hidden bg-slate-950">
        {college.coverUrl ? (
          <img
            src={college.coverUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-950 to-slate-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

        {/* Badges on Cover */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg border backdrop-blur-md ${
            college.type === 'Public'
              ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
              : 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300'
          }`}>
            {college.type}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg border bg-amber-500/20 border-amber-400/30 text-amber-300 backdrop-blur-md">
            Rank #{college.ranking}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={handleBookmarkToggle}
          className={`absolute top-4 right-4 p-2 rounded-xl border backdrop-blur-md hover:scale-105 transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-rose-600/30 border-rose-500 text-rose-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isSaved ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* College Info & Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Logo & Basic Info */}
          <div className="flex items-start space-x-3 -mt-11 relative z-10 mb-4">
            {college.logoUrl ? (
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-lg bg-slate-900"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-lg">
                {college.name.charAt(0)}
              </div>
            )}
            <div className="pt-8">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{college.city}, {college.state}</span>
            </div>
          </div>

          {/* Title & Description */}
          <Link href={`/colleges/${college.slug}`} className="block group/title">
            <h3 className="text-lg font-extrabold text-white group-hover/title:text-indigo-400 transition-colors duration-200 line-clamp-1">
              {college.name}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="border-t border-b border-slate-800/60 py-4 my-4 grid grid-cols-3 gap-2 text-center bg-slate-950/20 rounded-xl px-2">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Tuition (Out)</span>
            <span className="text-sm font-extrabold text-slate-200">${college.tuitionOutState.toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Acceptance</span>
            <span className="text-sm font-extrabold text-slate-200">{Math.round(college.admissionRate * 100)}%</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Students</span>
            <span className="text-sm font-extrabold text-slate-200">{college.studentPopulation.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Tray */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* Compare Toggle */}
          <button
            onClick={handleCompareToggle}
            className={`flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
              isCompared
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>{isCompared ? 'Added to Compare' : 'Add to Compare'}</span>
          </button>

          {/* View Details Link */}
          <Link
            href={`/colleges/${college.slug}`}
            className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
