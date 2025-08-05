'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LandingPage } from '@/components/landing/LandingPage';
import { hu } from '@/lib/i18n/hu';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authenticated = auth.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // If authenticated, redirect to dashboard
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto" aria-label={hu.common.loading}></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{hu.common.loading}</p>
        </div>
      </div>
    );
  }

  // If authenticated, show nothing (will redirect to dashboard)
  if (isAuthenticated) {
    return null;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
