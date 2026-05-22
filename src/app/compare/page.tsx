'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getComparedColleges, removeFromCompare, clearCompare, CompareCollege } from '@/lib/compare';
import Loader from '@/components/Loader';

interface Review {
  id: string;
  rating: number;
}

interface CollegeDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  logoUrl: string;
  coverUrl: string;
  type: string;
  established: number;
  ranking: number;
  admissionRate: number;
  tuitionInState: number;
  tuitionOutState: number;
  roomAndBoard: number;
  studentPopulation: number;
  studentFacultyRatio: string;
  averageSat: number | null;
  averageAct: number | null;
  netPrice: number;
  popularMajors: string;
  ratings: number;
  reviews: Review[];
}

export default function CompareMatrixPage() {
  const [comparedList, setComparedList] = useState<CompareCollege[]>([]);
  const [colleges, setColleges] = useState<CollegeDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFullDetails = async () => {
    const list = getComparedColleges();
    setComparedList(list);

    if (list.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const promises = list.map(async (item) => {
        const res = await fetch(`/api/colleges/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          return data.college as CollegeDetails;
        }
        return null;
      });

      const results = await Promise.all(promises);
      const activeColleges = results.filter((c): c is CollegeDetails => c !== null);
      setColleges(activeColleges);
    } catch (err) {
      console.error('Failed to load comparison data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullDetails();

    // Listen for changes in compare items
    const handleCompareChange = () => {
      fetchFullDetails();
    };

    window.addEventListener('unifinder_compare_change', handleCompareChange);
    return () => {
      window.removeEventListener('unifinder_compare_change', handleCompareChange);
    };
  }, []);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
  };

  const handleClear = () => {
    clearCompare();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader />
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 mb-6 text-2xl font-bold shadow-xl">
          !
        </div>
        <h2 className="text-3xl font-black text-white font-display">Comparison List is Empty</h2>
        <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
          You haven't added any universities to your comparison drawer yet. Browse our directory to select up to 3 institutions side-by-side.
        </p>
        <Link
          href="/colleges"
          className="mt-8 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          Discover Colleges &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">Comparison Matrix</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Side-by-side analytical breakdown of your selected universities.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="self-start md:self-auto inline-flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-all cursor-pointer"
        >
          Clear All Selected
        </button>
      </div>

      {/* Grid Comparison Matrix */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800">
              {/* Feature Header Cell */}
              <th className="py-6 px-4 w-1/4 text-sm font-bold uppercase tracking-wider text-slate-500">
                Key Parameters
              </th>

              {/* College Card Headers */}
              {colleges.map((college) => (
                <th key={college.id} className="py-6 px-6 w-1/4 align-top relative group">
                  <button
                    onClick={() => handleRemove(college.id)}
                    className="absolute top-2 right-4 text-slate-500 hover:text-rose-400 transition-colors p-1.5 cursor-pointer"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="space-y-4">
                    {college.logoUrl ? (
                      <img
                        src={college.logoUrl}
                        alt={college.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-800 bg-slate-950 shadow-md"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-lg">
                        {college.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="block text-sm font-extrabold text-white hover:text-indigo-400 transition-colors line-clamp-1 leading-snug"
                      >
                        {college.name}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">
                        {college.city}, {college.state}
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-800/40 font-semibold text-slate-300">
            {/* National Rank Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">National Ranking</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                    Rank #{college.ranking}
                  </span>
                </td>
              ))}
            </tr>

            {/* Institution Type Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Institution Type</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] uppercase tracking-wider font-extrabold ${
                    college.type === 'Public'
                      ? 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400'
                      : 'bg-indigo-500/10 border-indigo-400/20 text-indigo-400'
                  }`}>
                    {college.type}
                  </span>
                </td>
              ))}
            </tr>

            {/* Established Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Established Year</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  {college.established}
                </td>
              ))}
            </tr>

            {/* Admission Rate Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Acceptance Rate</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200 text-sm font-extrabold">
                  {Math.round(college.admissionRate * 100)}%
                </td>
              ))}
            </tr>

            {/* Student Population Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Student Population</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  {college.studentPopulation.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Student Faculty Ratio Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Student-Faculty Ratio</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  {college.studentFacultyRatio}
                </td>
              ))}
            </tr>

            {/* Tuition In-State Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">In-State Tuition</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  ${college.tuitionInState.toLocaleString()} / Yr
                </td>
              ))}
            </tr>

            {/* Tuition Out-of-State Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Out-of-State Tuition</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-indigo-400 font-bold">
                  ${college.tuitionOutState.toLocaleString()} / Yr
                </td>
              ))}
            </tr>

            {/* Room & Board Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Room & Board</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  ${college.roomAndBoard.toLocaleString()} / Yr
                </td>
              ))}
            </tr>

            {/* Average Net Price Row */}
            <tr className="bg-indigo-650/5 hover:bg-slate-950/30 transition-colors font-bold">
              <td className="py-4 px-4 text-slate-400 font-bold">Average Net Price (After Aid)</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-cyan-400 text-sm font-black">
                  ${college.netPrice.toLocaleString()} / Yr
                </td>
              ))}
            </tr>

            {/* SAT / ACT Scores Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">SAT / ACT Averages</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6 text-slate-200">
                  {college.averageSat ? `SAT: ${college.averageSat}` : 'SAT: Optional'}
                  {college.averageAct ? ` | ACT: ${college.averageAct}` : ' | ACT: Optional'}
                </td>
              ))}
            </tr>

            {/* Average Rating Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Student Reviews Average</td>
              {colleges.map((college) => (
                <td key={college.id} className="py-4 px-6">
                  <span className="inline-flex items-center text-amber-400 font-black">
                    {college.ratings}
                    <svg className="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-slate-500 font-semibold text-[10px] ml-1.5 uppercase">
                      ({college.reviews.length} reviews)
                    </span>
                  </span>
                </td>
              ))}
            </tr>

            {/* Popular Majors Row */}
            <tr className="hover:bg-slate-950/20 transition-colors">
              <td className="py-4 px-4 text-slate-400 font-bold">Popular Majors</td>
              {colleges.map((college) => {
                const majors = college.popularMajors ? college.popularMajors.split(',').slice(0, 3) : [];
                return (
                  <td key={college.id} className="py-4 px-6 text-slate-300">
                    <div className="flex flex-wrap gap-1">
                      {majors.map((m, i) => (
                        <span key={i} className="bg-slate-950 border border-slate-800 text-[10px] px-2 py-0.5 rounded-lg text-slate-400">
                          {m.trim()}
                        </span>
                      ))}
                      {college.popularMajors && college.popularMajors.split(',').length > 3 && (
                        <span className="text-[10px] text-slate-500 font-bold italic ml-1">
                          +{college.popularMajors.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Link Profile Row */}
            <tr className="border-t border-slate-800">
              <td className="py-6 px-4"></td>
              {colleges.map((college) => (
                <td key={college.id} className="py-6 px-6">
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="w-full text-center inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    View Full Profile
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
