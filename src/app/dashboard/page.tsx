'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import Loader from '@/components/Loader';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

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

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticate user & pull statistics
  const fetchDashboardData = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        // Redirection to Login
        router.push('/login');
        return;
      }

      const authData = await authRes.json();
      setUser(authData.user);

      // Fetch Saved Colleges
      const savedRes = await fetch('/api/saved');
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedColleges(savedData.savedColleges);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUnsave = (collegeId: string) => {
    // Dynamically remove from local view state immediately
    setSavedColleges((prev) => prev.filter((college) => college.id !== collegeId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile summary header */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/10">
              {user.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                {user.name}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                {user.email}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-4 sm:pt-0 sm:pl-6 flex-grow max-w-[200px]">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Member Since</span>
            <span className="text-xs font-bold text-slate-300 mt-1 block">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Bookmarks Directory Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Bookmarked Universities</h2>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1">
            {savedColleges.length} Saved
          </span>
        </div>

        {savedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college as any}
                initialSaved={true}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-3xl max-w-xl mx-auto">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 mb-4 text-xl font-bold">
              +
            </span>
            <h3 className="text-base font-bold text-white">No bookmarked colleges</h3>
            <p className="text-slate-500 text-xs mt-2 px-6">
              You haven't bookmarked any universities yet. Start exploring the directory and tap the heart icon on any card!
            </p>
            <Link
              href="/colleges"
              className="mt-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Explore Colleges directory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
