'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { WidgetGrid, Widget, WidgetHeader, WidgetContent } from '@/components/dashboard/WidgetGrid';

// Lazy-load non-critical widgets for performance
const WelcomeWidget = lazy(() => import('@/components/dashboard/WelcomeWidget'));
const StatsWidget = lazy(() => import('@/components/dashboard/StatsWidget'));
const ActivityFeed = lazy(() => import('@/components/dashboard/ActivityFeed'));

function CardSkeleton({ title }: { title?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-label={title ? `Loading ${title}` : 'Loading'}>
      {title && <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />}
      <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authenticated = auth.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          // If not authenticated, redirect to login
          router.replace('/');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{hu.common.loading}</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {hu.dashboard.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hu.dashboard.subtitle}
          </p>
        </header>

        <WidgetGrid>
          <div className="col-span-1 md:col-span-2" style={{ minHeight: 220 }}>
            <Suspense fallback={<CardSkeleton title="Welcome" />}>
              <WelcomeWidget className="h-full" />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2" style={{ minHeight: 260 }}>
            <Suspense fallback={<CardSkeleton title="Your Stats" />}>
              <StatsWidget className="h-full" />
            </Suspense>
          </div>

          <div className="col-span-1 md:col-span-2" style={{ minHeight: 240 }}>
            <Suspense fallback={<CardSkeleton title="Recent Activity" />}>
              <ActivityFeed className="h-full" />
            </Suspense>
          </div>

          <Widget>
            <WidgetHeader title={hu.dashboard.profile.title} subtitle={hu.dashboard.profile.subtitle} />
            <WidgetContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {hu.dashboard.profile.subtitle}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {hu.dashboard.profile.completion} 75%
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </WidgetContent>
          </Widget>
        </WidgetGrid>
      </div>
    </DashboardLayout>
  );
}