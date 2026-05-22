'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-lg">
                C
              </span>
              <span className="font-extrabold text-lg text-white">
                Uni<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Discover, compare, and bookmark top colleges in the United States. Start your educational journey with high-fidelity analytics and rankings.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} UniFinder. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-white transition-colors duration-200">
                  All Universities
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=Public" className="hover:text-white transition-colors duration-200">
                  Public Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=Private" className="hover:text-white transition-colors duration-200">
                  Private Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/compare" className="hover:text-white transition-colors duration-200">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors duration-200">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors duration-200">
                  Member Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Stay Connected</h3>
            <p className="text-sm text-slate-400">
              Get the latest updates on college admissions, scholarship deadlines, and ranking reports.
            </p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
