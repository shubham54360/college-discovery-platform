'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleRegister = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('PWA Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('PWA Service Worker registration failed:', error);
        }
      };
      
      // Delay registration slightly to allow other page critical resources to initialize first
      window.addEventListener('load', handleRegister);
      return () => {
        window.removeEventListener('load', handleRegister);
      };
    }
  }, []);

  return null;
}
