'use client';

import React, { memo } from 'react';
import { hu } from '@/lib/i18n/hu';
import { MessageCircle, UserPlus, User, Users } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'post' | 'like' | 'follow' | 'profile_update' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

interface ActivityFeedProps {
  className?: string;
}

const ActivityRow = memo(function ActivityRow({ activity }: { activity: ActivityItem }) {
  return (
    <li
      className="flex items-start gap-3 rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      tabIndex={0}
      role="article"
      aria-labelledby={`activity-${activity.id}-title`}
      aria-describedby={`activity-${activity.id}-desc activity-${activity.id}-time`}
    >
      <div className={`flex-shrink-0 p-2 rounded-lg ${activity.iconColor}`} aria-hidden="true">
        <activity.icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p id={`activity-${activity.id}-title`} className="text-sm font-medium text-gray-900 dark:text-white">
          {activity.title}
        </p>
        <p id={`activity-${activity.id}-desc`} className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {activity.description}
        </p>
        <time
          id={`activity-${activity.id}-time`}
          className="text-xs text-gray-500 dark:text-gray-400 mt-2 block"
          dateTime={new Date().toISOString()}
        >
          {activity.timestamp}
        </time>
      </div>
    </li>
  );
});

export default function ActivityFeed({ className = '' }: ActivityFeedProps) {
  // Mock activity data - in real app this would come from API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'profile_update',
      title: hu.dashboard.activity.items.profileUpdate,
      description: hu.dashboard.activity.items.profileUpdateDesc,
      timestamp: '2 órával ezelőtt',
      icon: User,
      iconColor: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      id: '2',
      type: 'follow',
      title: hu.dashboard.activity.items.welcome,
      description: hu.dashboard.activity.items.welcomeDesc,
      timestamp: '1 nappal ezelőtt',
      icon: UserPlus,
      iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20'
    }
  ];

  return (
    <section className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`} aria-labelledby="recent-activity-heading">
      <div className="flex items-center justify-between mb-6">
        <h3 id="recent-activity-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
          {hu.dashboard.activity.title}
        </h3>
        <button
          className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 focus:outline-none focus-visible:underline transition-colors"
          aria-label="View all activity"
        >
          {hu.common.buttons.viewAll}
        </button>
      </div>

      {activities.length > 0 ? (
        <ul className="space-y-2" role="list">
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-8" role="status" aria-live="polite">
          <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">{hu.dashboard.activity.empty.title}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
            {hu.dashboard.activity.empty.description}
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{hu.dashboard.activity.quickActions}</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800"
          >
            <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            {hu.common.buttons.newPost}
          </button>
          <button
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800"
          >
            <Users className="w-4 h-4 mr-2" aria-hidden="true" />
            {hu.common.buttons.findFriends}
          </button>
        </div>
      </div>
    </section>
  );
}