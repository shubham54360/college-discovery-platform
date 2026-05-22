'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch auth state:', err);
      }
    };
    checkUser();
  }, [pathname]); // Re-verify on navigation

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        setDropdownOpen(false);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                C
              </span>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-300">
                Uni<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Finder</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/colleges"
              className={`text-sm font-semibold transition-colors duration-300 ${
                isActive('/colleges')
                  ? 'text-indigo-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Discover Colleges
            </Link>
            <Link
              href="/compare"
              className={`text-sm font-semibold transition-colors duration-300 ${
                isActive('/compare')
                  ? 'text-indigo-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Compare Matrix
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive('/dashboard')
                    ? 'text-indigo-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                My Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-white bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 hover:bg-slate-800 focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  <span className="h-6 w-6 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <span>{user.name}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-800/80">
                      <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      My Bookmarks
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2.5 text-sm text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center text-sm font-bold px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-900 px-2 pt-2 pb-4 space-y-1">
          <Link
            href="/colleges"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/colleges') ? 'bg-indigo-950/40 text-indigo-400' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Discover Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/compare') ? 'bg-indigo-950/40 text-indigo-400' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Compare Matrix
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive('/dashboard') ? 'bg-indigo-950/40 text-indigo-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              My Dashboard
            </Link>
          )}

          <div className="pt-4 mt-4 border-t border-slate-900 px-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="h-8 w-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-sm font-bold text-indigo-300 uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center block px-4 py-2 text-sm text-rose-400 hover:text-white bg-slate-900 hover:bg-rose-600/20 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block px-4 py-2.5 text-sm font-bold text-white border border-slate-800 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
