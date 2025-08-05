'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { TrendingUp, Hash, Users, Trophy, User } from 'lucide-react';

interface TrendItem {
  id: string;
  type: 'hashtag' | 'topic' | 'team' | 'player';
  name: string;
  count: number;
  change: number;
  category: string;
}

export default function TrendsWidget() {
  const [selectedTab, setSelectedTab] = useState<'hashtags' | 'topics' | 'teams' | 'players'>('hashtags');
  
  const trends: TrendItem[] = [
    {
      id: '1',
      type: 'hashtag',
      name: '#Focipedia',
      count: 1234,
      change: 15,
      category: 'Hashtag'
    },
    {
      id: '2',
      type: 'hashtag',
      name: '#NB1',
      count: 856,
      change: 8,
      category: 'Hashtag'
    },
    {
      id: '3',
      type: 'hashtag',
      name: '#ChampionsLeague',
      count: 543,
      change: -3,
      category: 'Hashtag'
    },
    {
      id: '4',
      type: 'topic',
      name: 'Magyar válogatott',
      count: 2341,
      change: 25,
      category: 'Téma'
    },
    {
      id: '5',
      type: 'topic',
      name: 'Ferencváros',
      count: 1892,
      change: 12,
      category: 'Téma'
    },
    {
      id: '6',
      type: 'team',
      name: 'Ferencváros',
      count: 567,
      change: 5,
      category: 'Csapat'
    },
    {
      id: '7',
      type: 'team',
      name: 'Újpest',
      count: 234,
      change: -2,
      category: 'Csapat'
    },
    {
      id: '8',
      type: 'player',
      name: 'Szoboszlai Dominik',
      count: 789,
      change: 18,
      category: 'Játékos'
    }
  ];

  const filteredTrends = trends.filter(item => {
    switch (selectedTab) {
      case 'hashtags':
        return item.type === 'hashtag';
      case 'topics':
        return item.type === 'topic';
      case 'teams':
        return item.type === 'team';
      case 'players':
        return item.type === 'player';
      default:
        return true;
    }
  });

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'hashtags':
        return <Hash className="w-4 h-4" />;
      case 'topics':
        return <TrendingUp className="w-4 h-4" />;
      case 'teams':
        return <Trophy className="w-4 h-4" />;
      case 'players':
        return <User className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getItemIcon = (type: TrendItem['type']) => {
    switch (type) {
      case 'hashtag':
        return <Hash className="w-5 h-5 text-blue-500" />;
      case 'topic':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'team':
        return <Trophy className="w-5 h-5 text-red-500" />;
      case 'player':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.trends.title} />
      <WidgetContent>
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { key: 'hashtags', label: hu.dashboard.trends.hashtags },
              { key: 'topics', label: hu.dashboard.trends.topics },
              { key: 'teams', label: hu.dashboard.trends.teams },
              { key: 'players', label: hu.dashboard.trends.players }
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

          {/* Trends list */}
          <div className="space-y-3">
            {filteredTrends.length > 0 ? (
              filteredTrends.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getItemIcon(item.type)}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCount(item.count)}
                    </div>
                    <div className={`text-xs ${
                      item.change > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : item.change < 0 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <TrendingUp className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {hu.dashboard.trends.empty.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {hu.dashboard.trends.empty.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
} 