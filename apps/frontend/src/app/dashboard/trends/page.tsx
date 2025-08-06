'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import TrendsWidget from '@/components/dashboard/TrendsWidget';

export default function TrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {hu.dashboard.trends.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hu.dashboard.trends.subtitle}
          </p>
        </header>

        <WidgetGrid>
          <div className="col-span-1 lg:col-span-3">
            <TrendsWidget />
          </div>
        </WidgetGrid>
      </div>
    </DashboardLayout>
  );
} 