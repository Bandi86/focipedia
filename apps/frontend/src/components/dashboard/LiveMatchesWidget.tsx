'use client';

import React from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Radio, Clock } from 'lucide-react';

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  competition: string;
  homeTeamColor: string;
  awayTeamColor: string;
}

export default function LiveMatchesWidget() {
  const liveMatches: LiveMatch[] = [
    {
      id: '1',
      homeTeam: 'Manchester City',
      awayTeam: 'Arsenal',
      homeScore: 2,
      awayScore: 1,
      minute: 67,
      competition: 'Premier League',
      homeTeamColor: 'bg-blue-600',
      awayTeamColor: 'bg-red-600'
    },
    {
      id: '2',
      homeTeam: 'Bayern München',
      awayTeam: 'Borussia Dortmund',
      homeScore: 0,
      awayScore: 0,
      minute: 23,
      competition: 'Bundesliga',
      homeTeamColor: 'bg-red-600',
      awayTeamColor: 'bg-yellow-600'
    }
  ];

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.matches.live} />
      <WidgetContent>
        <div className="space-y-4">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <div key={match.id} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                    {match.competition}
                  </span>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      ÉLŐ
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full ${match.homeTeamColor} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {match.homeTeam.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {match.homeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mx-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {match.homeScore}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {match.awayScore}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-medium text-gray-900 dark:text-white text-right">
                      {match.awayTeam}
                    </span>
                    <div className={`w-8 h-8 rounded-full ${match.awayTeamColor} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {match.awayTeam.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {match.minute}'
                    </span>
                  </div>
                  <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                    Részletek
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Radio className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nincs élő meccs
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Jelenleg nincs élő mérkőzés
              </p>
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
} 