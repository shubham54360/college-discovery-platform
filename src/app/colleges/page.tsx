'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import Loader from '@/components/Loader';

// Define structures
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

function CollegesDirectoryContent() {
  const searchParams = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [sortBy, setSortBy] = useState('ranking');

  // Data state
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // States list for selection
  const statesList = ['CA', 'MA', 'TX', 'NY', 'WA', 'MI', 'NJ', 'CT'];

  // Fetch list of saved colleges to identify bookmarked cards
  const fetchSavedColleges = async () => {
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        setSavedIds(data.savedColleges.map((c: any) => c.id));
      }
    } catch (err) {
      console.error('Failed to fetch saved colleges:', err);
    }
  };

  // Fetch colleges based on current filter states
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        state,
        type,
        sortBy,
      });
      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
      }
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchSavedColleges();
  }, []);

  // Refetch when filter conditions change
  useEffect(() => {
    fetchColleges();
  }, [search, state, type, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setState('');
    setType('All');
    setSortBy('ranking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display">University Directory</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Discover and filter premier higher education institutions. Use search filters to find your ideal match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Search Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Keyword</label>
              <div className="relative flex items-center bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition-colors">
                <svg className="w-4 h-4 text-slate-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Harvard, Biology, CA..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* State Filter */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Location (State)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">All States</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Institution Type</label>
              <div className="flex gap-2">
                {['All', 'Public', 'Private'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      type === t
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Sort Results</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ranking">National Rank (Best first)</option>
                <option value="tuition">Tuition Fees (Low to High)</option>
                <option value="population">Population size (Large first)</option>
                <option value="ratings">Ratings average (High first)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college as any}
                  initialSaved={savedIds.includes(college.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-3xl max-w-xl mx-auto">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 mb-4 text-xl font-bold">
                ?
              </span>
              <h3 className="text-lg font-bold text-white">No colleges found</h3>
              <p className="text-slate-500 text-sm mt-2 px-6">
                We couldn't find any institutions matching your exact combination of search keywords and filters. Try clearing some selections!
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesDirectory() {
  return (
    <Suspense fallback={<Loader />}>
      <CollegesDirectoryContent />
    </Suspense>
  );
}
