'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { TrendingUp } from 'lucide-react';

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
  reason: string;
}

export default function SuggestedUsersWidget() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([
    {
      id: '1',
      name: 'Kiss János',
      username: 'kissj',
      avatar: 'KJ',
      bio: 'Futball elemző és kommentátor',
      followers: 1234,
      isFollowing: false,
      reason: 'Sok közös érdeklődés'
    },
    {
      id: '2',
      name: 'Molnár Eszter',
      username: 'molnare',
      avatar: 'ME',
      bio: 'Futball fotós és blogger',
      followers: 856,
      isFollowing: false,
      reason: 'Közös helyszín'
    },
    {
      id: '3',
      name: 'Balogh Tamás',
      username: 'baloght',
      avatar: 'BT',
      bio: 'Futball edző és elemző',
      followers: 2341,
      isFollowing: false,
      reason: 'Népszerű a közösségben'
    }
  ]);

  const handleFollow = (userId: string) => {
    setSuggestedUsers(suggestedUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isFollowing: !user.isFollowing
        };
      }
      return user;
    }));
  };

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.community.suggested} />
      <WidgetContent>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-semibold text-xs">
                  {user.avatar}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {user.name}
                  </h4>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      user.isFollowing
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.isFollowing ? 'Követve' : 'Követés'}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  @{user.username}
                </p>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {user.bio}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.followers} követő
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{user.reason}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium py-2">
            Több javaslat megtekintése
          </button>
        </div>
      </WidgetContent>
    </Widget>
  );
} 