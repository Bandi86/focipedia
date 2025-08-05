'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Search, UserPlus, Users, MapPin } from 'lucide-react';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  mutualFriends: number;
}

export default function CommunityWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Kovács Péter',
      username: 'kovacsp',
      avatar: 'KP',
      bio: 'Futball rajongó, Ferencváros szurkoló 🔴⚪',
      location: 'Budapest',
      followers: 234,
      following: 156,
      isFollowing: false,
      mutualFriends: 12
    },
    {
      id: '2',
      name: 'Nagy Anna',
      username: 'nagyanna',
      avatar: 'NA',
      bio: 'Futball elemző és blogger ⚽📝',
      location: 'Debrecen',
      followers: 567,
      following: 89,
      isFollowing: true,
      mutualFriends: 8
    },
    {
      id: '3',
      name: 'Szabó Gábor',
      username: 'szabog',
      avatar: 'SG',
      bio: 'Kedvenc csapat: Újpest 💙',
      location: 'Szeged',
      followers: 123,
      following: 234,
      isFollowing: false,
      mutualFriends: 5
    },
    {
      id: '4',
      name: 'Tóth Eszter',
      username: 'totheszter',
      avatar: 'TE',
      bio: 'Futball fotós 📸⚽',
      location: 'Miskolc',
      followers: 789,
      following: 123,
      isFollowing: false,
      mutualFriends: 15
    }
  ]);

  const handleFollow = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isFollowing: !user.isFollowing,
          followers: user.isFollowing ? user.followers - 1 : user.followers + 1
        };
      }
      return user;
    }));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.community.title} />
      <WidgetContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={hu.dashboard.community.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Users list */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                        {user.avatar}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFollow(user.id)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                            user.isFollowing
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {user.isFollowing ? hu.dashboard.community.unfollow : hu.dashboard.community.follow}
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {user.bio}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{user.mutualFriends} közös ismerős</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{user.followers} követő</span>
                        <span>{user.following} követés</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {hu.dashboard.community.empty.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {hu.dashboard.community.empty.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
} 