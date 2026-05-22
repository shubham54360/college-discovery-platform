import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComparisonDrawer from '@/components/ComparisonDrawer';
import ToastContainer from '@/components/Toast';
import PWARegister from '@/components/PWARegister';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'UniFinder | Discover, Compare, and Bookmark Top Colleges',
  description:
    'Find your perfect college with UniFinder. Search, filter, and compare top public and private US universities side-by-side with high-fidelity student population, tuition, and acceptance statistics.',
  keywords: ['college search', 'university comparison', 'college rankings', 'tuition fees', 'SAT scores', 'ACT scores', 'US higher education', 'academic match'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UniFinder',
  },
  openGraph: {
    title: 'UniFinder | US University Discovery & Comparison Matrix',
    description: 'Find your perfect US academic match. Standardized tuition fee listings, population sizes, acceptance rates, and dynamic side-by-side matrices.',
    url: 'https://unifinder.vercel.app',
    siteName: 'UniFinder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniFinder | US University Search Intelligence',
    description: 'Standardized US tuition fee listings, population sizes, acceptance rates, and dynamic side-by-side matrices.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 font-sans text-slate-300 antialiased">
        {/* PWA registration */}
        <PWARegister />

        {/* Global Floating Toasts */}
        <ToastContainer />

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow">{children}</main>

        {/* Floating Comparison Tray */}
        <ComparisonDrawer />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
