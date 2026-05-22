'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCompare, removeFromCompare, isInCompare } from '@/lib/compare';
import Loader from '@/components/Loader';

interface User {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface College {
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
  images: string;
  ratings: number;
  reviews: Review[];
}

export default function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  // Data states
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'tuition' | 'reviews'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);

  // Form states for reviews
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch college details
  const fetchCollegeDetails = async () => {
    try {
      const res = await fetch(`/api/colleges/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data.college);
        setIsCompared(isInCompare(data.college.id));
      } else {
        console.error('Failed to fetch college details');
      }
    } catch (err) {
      console.error('Error fetching college details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth state
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Auth state check failed:', err);
    }
  };

  // Fetch saved status
  const fetchSavedStatus = async () => {
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        if (college) {
          const isSavedCollege = data.savedColleges.some((c: any) => c.id === college.id);
          setIsSaved(isSavedCollege);
        }
      }
    } catch (err) {
      console.error('Failed to fetch saved status:', err);
    }
  };

  useEffect(() => {
    fetchCollegeDetails();
    checkAuth();
  }, [slug]);

  useEffect(() => {
    if (college) {
      fetchSavedStatus();
    }
  }, [college]);

  useEffect(() => {
    if (college) {
      setIsCompared(isInCompare(college.id));
      const handleCompareChange = () => {
        setIsCompared(isInCompare(college.id));
      };
      window.addEventListener('unifinder_compare_change', handleCompareChange);
      return () => {
        window.removeEventListener('unifinder_compare_change', handleCompareChange);
      };
    }
  }, [college]);

  const handleBookmarkToggle = async () => {
    if (!college) return;
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: college.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      } else if (res.status === 401) {
        alert('Please sign in to bookmark colleges!');
        router.push('/login');
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleCompareToggle = () => {
    if (!college) return;
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
      } else {
        alert(result.message);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college) return;
    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: college.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSuccess('Thank you! Your review has been submitted.');
        setReviewComment('');
        setReviewRating(5);
        // Refresh college details to pull new reviews
        fetchCollegeDetails();
      } else {
        const errData = await res.json();
        setReviewError(errData.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewError('Failed to submit review due to a server connection error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-white font-display">College Not Found</h2>
        <p className="text-slate-400 mt-4">The university profile you are trying to view doesn't exist or has been removed.</p>
        <Link
          href="/colleges"
          className="mt-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const majors = college.popularMajors ? college.popularMajors.split(',').map((m) => m.trim()) : [];
  const gallery = college.images ? college.images.split(',').map((img) => img.trim()) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Visual Cover Banner */}
      <div className="relative h-64 sm:h-[400px] overflow-hidden bg-slate-950">
        {college.coverUrl ? (
          <img
            src={college.coverUrl}
            alt={college.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-indigo-950 to-cyan-950"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Floating Actions on Top Right */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={handleBookmarkToggle}
            className={`p-3 rounded-2xl border backdrop-blur-md hover:scale-105 transition-all duration-300 cursor-pointer ${
              isSaved
                ? 'bg-rose-600/30 border-rose-500 text-rose-400 shadow-lg shadow-rose-600/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:text-white'
            }`}
            title={isSaved ? 'Bookmarked' : 'Add to Bookmarks'}
          >
            <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleCompareToggle}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-black rounded-2xl border backdrop-blur-md hover:scale-105 transition-all duration-300 cursor-pointer ${
              isCompared
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>{isCompared ? 'Added to Compare' : 'Compare College'}</span>
          </button>
        </div>
      </div>

      {/* Profile Header Details Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-32 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Logo and Name */}
            <div className="flex items-center space-x-5">
              {college.logoUrl ? (
                <img
                  src={college.logoUrl}
                  alt={college.name}
                  className="w-18 h-18 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl bg-slate-900"
                />
              ) : (
                <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-3xl border-4 border-slate-900 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-3xl">
                  {college.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border ${
                    college.type === 'Public'
                      ? 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400'
                      : 'bg-indigo-500/10 border-indigo-400/20 text-indigo-400'
                  }`}>
                    {college.type}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border bg-amber-500/10 border-amber-400/20 text-amber-400">
                    Rank #{college.ranking}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white font-display mt-2 leading-tight">
                  {college.name}
                </h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {college.city}, {college.state} {college.zipCode}
                </p>
              </div>
            </div>

            {/* Ratings Header block */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 self-start md:self-auto min-w-[200px] justify-between">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Student Rating</span>
                <span className="text-2xl font-black text-white flex items-center mt-1">
                  {college.ratings}
                  <svg className="w-5 h-5 text-amber-400 ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
              <div className="text-right border-l border-slate-800/80 pl-4 flex-grow">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Reviews</span>
                <span className="text-lg font-extrabold text-slate-300 mt-1 block">
                  {college.reviews.length} submitted
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-8 border-t border-slate-800/80 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/40">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Admission Rate</span>
              <span className="text-lg font-extrabold text-slate-200 mt-1 block">
                {Math.round(college.admissionRate * 100)}%
              </span>
            </div>
            <div className="bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/40">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Student Population</span>
              <span className="text-lg font-extrabold text-slate-200 mt-1 block">
                {college.studentPopulation.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/40">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Net Annual Price</span>
              <span className="text-lg font-extrabold text-slate-200 mt-1 block">
                ${college.netPrice.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/40">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Established</span>
              <span className="text-lg font-extrabold text-slate-200 mt-1 block">
                {college.established}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Tabs & Panels) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation header */}
            <div className="flex border-b border-slate-800 bg-slate-900/30 p-1.5 rounded-2xl gap-1">
              {(['overview', 'academics', 'tuition', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 capitalize cursor-pointer ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab === 'tuition' ? 'Tuition & Aid' : tab}
                </button>
              ))}
            </div>

            {/* Tab Content Panel */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[300px]">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">About the University</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {college.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Key Profile Data</h4>
                      <ul className="space-y-2.5 text-xs">
                        <li className="flex justify-between py-1.5 border-b border-slate-800/40">
                          <span className="text-slate-500">Institution Type</span>
                          <span className="font-semibold text-slate-200">{college.type}</span>
                        </li>
                        <li className="flex justify-between py-1.5 border-b border-slate-800/40">
                          <span className="text-slate-500">Founded Year</span>
                          <span className="font-semibold text-slate-200">{college.established}</span>
                        </li>
                        <li className="flex justify-between py-1.5 border-b border-slate-800/40">
                          <span className="text-slate-500">National Ranking</span>
                          <span className="font-semibold text-slate-200">#{college.ranking}</span>
                        </li>
                        <li className="flex justify-between py-1.5">
                          <span className="text-slate-500">Official Website</span>
                          <a
                            href={college.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-indigo-400 hover:underline"
                          >
                            Visit Site &rarr;
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Location Information</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {college.name} is nestled in the heart of {college.city}, {college.state}.
                        The campus provides students with direct access to local internships, industrial opportunities,
                        and a rich cultural student lifestyle.
                      </p>
                      <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center space-x-3">
                        <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-300">
                          ZIP: {college.zipCode} | State District
                        </span>
                      </div>
                    </div>
                  </div>

                  {gallery.length > 0 && gallery[0] !== '' && (
                    <div className="pt-6 border-t border-slate-800/60">
                      <h3 className="text-sm font-bold text-white mb-3">Campus Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {gallery.map((imgUrl, i) => (
                          <div key={i} className="h-28 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                            <img
                              src={imgUrl}
                              alt="Campus profile"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Academics Tab */}
              {activeTab === 'academics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">Academics & Admissions Profile</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats */}
                    <div className="bg-slate-950/60 border border-slate-800/60 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">Admissions & Faculty</h4>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Admission Rate</span>
                          <span className="font-extrabold text-white bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg text-indigo-400">
                            {Math.round(college.admissionRate * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Student-to-Faculty Ratio</span>
                          <span className="font-extrabold text-slate-200">{college.studentFacultyRatio}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Average SAT Score</span>
                          <span className="font-extrabold text-slate-200">{college.averageSat ? college.averageSat : 'N/A (Test Optional)'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Average ACT Score</span>
                          <span className="font-extrabold text-slate-200">{college.averageAct ? college.averageAct : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description of Academics */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">Student Body</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        With a vibrant population of <strong className="text-slate-200">{college.studentPopulation.toLocaleString()}</strong> students,
                        the college maintains a personalized learning environment using a {college.studentFacultyRatio} student-faculty ratio.
                        Admissions remain highly competitive, expecting strong extracurricular focus alongside excellent academic stats.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/60">
                    <h4 className="text-sm font-bold text-white mb-3">Popular Majors & Degrees Offered</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {majors.map((major, index) => (
                        <span
                          key={index}
                          className="bg-slate-950 border border-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center hover:border-slate-700 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></span>
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tuition & Aid Tab */}
              {activeTab === 'tuition' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">Tuition & Financial Estimates</h3>
                  <p className="text-slate-400 text-xs">
                    Estimated annual cost of attendance before grants and scholarships. Costs represent standard full-time enrollment.
                  </p>

                  {/* Visual Cost Bars */}
                  <div className="space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/40">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>In-State Tuition</span>
                        <span>${college.tuitionInState.toLocaleString()} / Year</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3.5 border border-slate-800">
                        <div
                          className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((college.tuitionInState / 70000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Out-of-State Tuition</span>
                        <span>${college.tuitionOutState.toLocaleString()} / Year</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3.5 border border-slate-800">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((college.tuitionOutState / 70000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Room & Board</span>
                        <span>${college.roomAndBoard.toLocaleString()} / Year</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3.5 border border-slate-800">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((college.roomAndBoard / 25000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-white mb-3">Fee Breakdown Matrix</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                            <th className="py-2.5">Cost Category</th>
                            <th className="py-2.5">In-State</th>
                            <th className="py-2.5">Out-of-State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          <tr>
                            <td className="py-3 text-slate-400 font-semibold">Tuition & Mandatory Fees</td>
                            <td className="py-3 text-slate-200 font-bold">${college.tuitionInState.toLocaleString()}</td>
                            <td className="py-3 text-slate-200 font-bold">${college.tuitionOutState.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-slate-400 font-semibold">On-Campus Room & Board</td>
                            <td className="py-3 text-slate-200 font-bold">${college.roomAndBoard.toLocaleString()}</td>
                            <td className="py-3 text-slate-200 font-bold">${college.roomAndBoard.toLocaleString()}</td>
                          </tr>
                          <tr className="border-t border-slate-800 font-extrabold text-slate-100">
                            <td className="py-3 text-slate-300">Estimated Total Cost</td>
                            <td className="py-3 text-indigo-400">${(college.tuitionInState + college.roomAndBoard).toLocaleString()}</td>
                            <td className="py-3 text-indigo-400">${(college.tuitionOutState + college.roomAndBoard).toLocaleString()}</td>
                          </tr>
                          <tr className="bg-slate-950/40 font-extrabold">
                            <td className="py-3 px-3 rounded-l-xl text-slate-400 font-semibold">Average Net Price (After Aid)</td>
                            <td colSpan={2} className="py-3 px-3 rounded-r-xl text-cyan-400 text-sm font-black">
                              ${college.netPrice.toLocaleString()} / Year
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews Summary Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Student Reviews & Ratings</h3>
                    <p className="text-slate-400 text-xs">
                      Read about student experiences on campus. Review scores represent academic curriculum, student life, and career support.
                    </p>
                  </div>

                  {/* List of Reviews */}
                  <div className="space-y-4">
                    {college.reviews && college.reviews.length > 0 ? (
                      college.reviews.map((rev) => (
                        <div key={rev.id} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <span className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 uppercase text-xs">
                                {rev.user.name.charAt(0)}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-white">{rev.user.name}</h4>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Stars block */}
                            <div className="flex items-center bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating ? 'text-amber-400' : 'text-slate-700'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed italic pl-1">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-slate-950/20 border border-slate-800 border-dashed rounded-2xl">
                        <p className="text-slate-500 text-xs">No reviews submitted yet for this university. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>

                  {/* Submission Form */}
                  <div className="pt-6 border-t border-slate-800/80">
                    <h4 className="text-sm font-extrabold text-white mb-4">Write a Campus Review</h4>

                    {currentUser ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {reviewError && (
                          <div className="p-3.5 bg-rose-950/30 border border-rose-800/60 rounded-xl text-rose-400 text-xs font-semibold">
                            {reviewError}
                          </div>
                        )}
                        {reviewSuccess && (
                          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs font-semibold">
                            {reviewSuccess}
                          </div>
                        )}

                        {/* Rating select */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Your Rating</label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                              >
                                <svg
                                  className={`w-7 h-7 ${
                                    star <= reviewRating ? 'text-amber-400' : 'text-slate-700'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                            <span className="text-xs text-slate-400 ml-2 font-bold">{reviewRating} out of 5 stars</span>
                          </div>
                        </div>

                        {/* Comment text */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Your Experience</label>
                          <textarea
                            placeholder="Share details about professors, course difficulty, housing, campus social life, etc..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-4 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 leading-relaxed"
                          />
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg cursor-pointer"
                        >
                          {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 text-center">
                        <p className="text-slate-400 text-xs mb-3">You must be logged in to write a campus review.</p>
                        <Link
                          href="/login"
                          className="inline-flex items-center justify-center bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                        >
                          Log In / Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (Action cards & Popular majors list) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Actions Panel */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">Quick Portal</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect with the admissions board or add the college to your active list to begin side-by-side matrices matching this university's parameters.
              </p>
              <div className="space-y-2.5 pt-2">
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-lg transition-all duration-300"
                >
                  Visit Official Website &rarr;
                </a>
                <button
                  onClick={handleCompareToggle}
                  className={`w-full inline-flex items-center justify-center space-x-1.5 px-4 py-3 text-xs font-bold rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isCompared
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  <span>{isCompared ? 'Remove Compare' : 'Add to Compare Matrix'}</span>
                </button>
              </div>
            </div>

            {/* Popular Majors badge card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Academic Majors</h3>
              <div className="flex flex-wrap gap-2">
                {majors.map((m, i) => (
                  <span key={i} className="bg-slate-950 border border-slate-800 text-slate-400 font-semibold px-2.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
