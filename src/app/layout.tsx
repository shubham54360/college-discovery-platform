import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComparisonDrawer from '@/components/ComparisonDrawer';

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

export const metadata: Metadata = {
  title: 'UniFinder | Discover, Compare, and Bookmark Top Colleges',
  description:
    'Find your perfect college with UniFinder. Search, filter, and compare top public and private US universities side-by-side with high-fidelity student population, tuition, and acceptance statistics.',
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
