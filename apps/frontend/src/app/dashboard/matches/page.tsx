'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { WidgetGrid, Widget, WidgetHeader, WidgetContent } from '@/components/dashboard/WidgetGrid';
import MatchesWidget from '@/components/dashboard/MatchesWidget';
import LiveMatchesWidget from '@/components/dashboard/LiveMatchesWidget';

export default function MatchesPage() {
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
            {hu.dashboard.matches.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hu.dashboard.matches.subtitle}
          </p>
        </header>

        <WidgetGrid>
          <div className="col-span-1 lg:col-span-2">
            <LiveMatchesWidget />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <MatchesWidget />
          </div>

          <div className="col-span-1 lg:col-span-1">
            <Widget>
              <WidgetHeader title="Kedvenc csapatok" />
              <WidgetContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                      <span className="text-sm font-medium">Ferencváros</span>
                    </div>
                    <span className="text-xs text-gray-500">NB1</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium">Újpest</span>
                    </div>
                    <span className="text-xs text-gray-500">NB1</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium">Debrecen</span>
                    </div>
                    <span className="text-xs text-gray-500">NB1</span>
                  </div>
                </div>
              </WidgetContent>
            </Widget>
          </div>
        </WidgetGrid>
      </div>
    </DashboardLayout>
  );
} 