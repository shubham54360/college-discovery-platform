import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import CollegeCard from '@/components/CollegeCard';

// Force dynamic so it always pulls fresh database rankings
export const dynamic = 'force-dynamic';

async function getFeaturedColleges() {
  try {
    // Get top 3 ranked colleges
    const colleges = await db.college.findMany({
      orderBy: {
        ranking: 'asc',
      },
      take: 3,
    });
    return colleges;
  } catch (err) {
    console.error('Failed to fetch featured colleges:', err);
    return [];
  }
}

export default async function LandingPage() {
  const featured = await getFeaturedColleges();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Visual background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-xs font-black text-indigo-300 uppercase tracking-widest mb-6">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span>Next-Generation College Finder</span>
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white leading-tight tracking-tight max-w-4xl mx-auto">
          Find Your Perfect <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-glow">
            Academic Match
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Discover top-tier universities, compare rankings, analyze tuition costs side-by-side, and save your favorites using our high-fidelity, production-grade search intelligence.
        </p>

        {/* Action Button & Search trigger */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/colleges"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all duration-300"
          >
            Start Discovering
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/compare"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-extrabold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white hover:scale-[1.02] transition-all duration-300"
          >
            Compare Matrix
          </Link>
        </div>

        {/* Floating Quick Search Bar Mock */}
        <div className="mt-12 max-w-2xl mx-auto bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
          <form action="/colleges" method="GET" className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow flex items-center px-3 space-x-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="search"
                placeholder="Search Harvard, MIT, Computer Science..."
                className="w-full bg-transparent text-white border-none focus:outline-none placeholder-slate-500 text-sm py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-slate-950/60 border-t border-b border-slate-900/80 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">100+</span>
              <span className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Elite Colleges</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">50+</span>
              <span className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">States Covered</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">3</span>
              <span className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Compare Limit</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">100%</span>
              <span className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Data Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">Featured Elite Universities</h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">Explore the top ranked institutions selected for outstanding academic profiles.</p>
          </div>
          <Link
            href="/colleges"
            className="inline-flex items-center text-sm font-extrabold text-indigo-400 hover:text-indigo-300 mt-4 md:mt-0 transition-colors"
          >
            View All Institutions
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Featured Grid */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((college) => (
              <CollegeCard key={college.id} college={college as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-3xl">
            <p className="text-slate-500 text-sm">No featured colleges seeded yet. Run your seeder first!</p>
          </div>
        )}
      </section>

      {/* Feature Grids */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-900/60 relative z-10">
        <h2 className="text-center text-2xl sm:text-4xl font-black text-white font-display mb-12">Engineered For Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900/35 border border-slate-800 p-8 rounded-3xl space-y-4">
            <span className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <h3 className="text-lg font-extrabold text-white">Dynamic Searching</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Instantly query universities by name, state, programs, or admission criteria. Smart multi-filters let you refine your ideal academic match in real-time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/35 border border-slate-800 p-8 rounded-3xl space-y-4">
            <span className="h-12 w-12 flex items-center justify-center rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </span>
            <h3 className="text-lg font-extrabold text-white">Comparison Matrix</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Add up to 3 colleges to your compare drawer and inspect crucial attributes like tuition costs, admission selectivity, rankings, and size side-by-side.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/35 border border-slate-800 p-8 rounded-3xl space-y-4">
            <span className="h-12 w-12 flex items-center justify-center rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
            <h3 className="text-lg font-extrabold text-white">Personal Dashboard</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Sign up for a secure account to save your bookmarked colleges, edit your profiles, submit student reviews, and manage your discovery journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
