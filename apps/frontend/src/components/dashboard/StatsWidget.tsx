'use client';

import React, { Suspense, memo } from 'react';
import { hu } from '@/lib/i18n/hu';
import { TrendingUp, TrendingDown, Users, MessageCircle, Heart, Eye } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StatsWidgetProps {
  className?: string;
}

const StatsContent = memo(function StatsContent() {
  // Mock data
  const stats: StatItem[] = [
    {
      label: hu.dashboard.stats.items.totalPosts,
      value: 0,
      change: { value: 0, type: 'increase' },
      icon: MessageCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      label: hu.dashboard.stats.items.followers,
      value: 0,
      change: { value: 0, type: 'increase' },
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20'
    },
    {
      label: hu.dashboard.stats.items.totalLikes,
      value: 0,
      change: { value: 0, type: 'increase' },
      icon: Heart,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    },
    {
      label: hu.dashboard.stats.items.profileViews,
      value: 0,
      change: { value: 0, type: 'increase' },
      icon: Eye,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return (
    <section aria-labelledby="stats-heading" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 id="stats-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
          {hu.dashboard.stats.title}
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400" aria-label="Time range">
          {hu.dashboard.stats.timeRange}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <li key={index} className="relative">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`} aria-hidden="true">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {stat.label}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" aria-label={`${stat.label} value ${stat.value}`}>
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div
                      className={`flex items-center text-sm ${
                        stat.change.type === 'increase'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                      aria-label={`${stat.change.type === 'increase' ? 'Increased' : 'Decreased'} by ${stat.change.value} percent`}
                    >
                      {stat.change.type === 'increase' ? (
                        <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" aria-hidden="true" />
                      )}
                      {stat.change.value}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          {hu.dashboard.stats.activityOverview}
        </h4>

        {/* Reserve height to avoid CLS; provide accessible text fallback */}
        <figure
          className="h-24 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center gap-1 p-2"
          role="img"
          aria-label="Weekly activity bar chart showing relative activity per day"
        >
          {[20, 35, 25, 45, 30, 55, 40].map((height, index) => (
            <div
              key={index}
              className="bg-green-500 rounded-sm flex-1 transition-colors duration-200 hover:bg-green-600"
              style={{ height: `${height}%` }}
              aria-hidden="true"
            />
          ))}
        </figure>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2" aria-hidden="true">
          <span>{hu.dashboard.stats.days.mon}</span>
          <span>{hu.dashboard.stats.days.tue}</span>
          <span>{hu.dashboard.stats.days.wed}</span>
          <span>{hu.dashboard.stats.days.thu}</span>
          <span>{hu.dashboard.stats.days.fri}</span>
          <span>{hu.dashboard.stats.days.sat}</span>
          <span>{hu.dashboard.stats.days.sun}</span>
        </div>
      </div>
    </section>
  );
});

function StatsSkeleton() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-label="Loading stats">
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </section>
  );
}

export default function StatsWidget({ className = '' }: StatsWidgetProps) {
  return (
    <div className={className} style={{ minHeight: 260 }}>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
    </div>
  );
}