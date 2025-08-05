'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Heart, Bookmark, Trophy, Users, Trash2 } from 'lucide-react';

interface FavoriteItem {
  id: string;
  type: 'post' | 'match' | 'team';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  teamColor?: string;
  category: string;
}

export default function FavoritesWidget() {
  const [selectedTab, setSelectedTab] = useState<'posts' | 'matches' | 'teams'>('posts');
  
  const favorites: FavoriteItem[] = [
    {
      id: '1',
      type: 'post',
      title: 'Fantasztikus meccs volt ma!',
      description: 'A Ferencváros ismét megmutatta, hogy miért a legjobb csapat Magyarországon! 🔴⚪ #Fradi #NB1',
      timestamp: '2 órával ezelőtt',
      author: 'Kovács Péter',
      category: 'Poszt'
    },
    {
      id: '2',
      type: 'match',
      title: 'Ferencváros vs Újpest',
      description: 'NB1 - 2025.08.05 20:00 - Groupama Aréna',
      timestamp: 'Ma',
      category: 'Mérkőzés'
    },
    {
      id: '3',
      type: 'team',
      title: 'Ferencváros',
      description: 'Magyar NB1 - Budapest',
      timestamp: 'Kedvenc csapat',
      teamColor: 'bg-red-600',
      category: 'Csapat'
    },
    {
      id: '4',
      type: 'post',
      title: 'Végre megtörtént!',
      description: 'A magyar válogatott kvalifikálta magát az Európa-bajnokságra! 🇭🇺⚽ #MagyarVálogatott #EURO2024',
      timestamp: '5 órával ezelőtt',
      author: 'Nagy Anna',
      category: 'Poszt'
    }
  ];

  const filteredFavorites = favorites.filter(item => {
    switch (selectedTab) {
      case 'posts':
        return item.type === 'post';
      case 'matches':
        return item.type === 'match';
      case 'teams':
        return item.type === 'team';
      default:
        return true;
    }
  });

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'posts':
        return <Bookmark className="w-4 h-4" />;
      case 'matches':
        return <Trophy className="w-4 h-4" />;
      case 'teams':
        return <Users className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getItemIcon = (type: FavoriteItem['type']) => {
    switch (type) {
      case 'post':
        return <Bookmark className="w-5 h-5 text-blue-500" />;
      case 'match':
        return <Trophy className="w-5 h-5 text-green-500" />;
      case 'team':
        return <Users className="w-5 h-5 text-red-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.favorites.title} />
      <WidgetContent>
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { key: 'posts', label: hu.dashboard.favorites.posts },
              { key: 'matches', label: hu.dashboard.favorites.matches },
              { key: 'teams', label: hu.dashboard.favorites.teams }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center gap-2 flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {getTabIcon(tab.key)}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Favorites list */}
          <div className="space-y-3">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getItemIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          {item.author && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.author}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            {item.category}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.timestamp}
                        </span>
                        {item.teamColor && (
                          <div className={`w-6 h-6 rounded-full ${item.teamColor} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">
                              {item.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Heart className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {hu.dashboard.favorites.empty.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {hu.dashboard.favorites.empty.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
} 