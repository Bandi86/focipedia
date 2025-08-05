'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  homeTeamColor: string;
  awayTeamColor: string;
}

export default function MatchesWidget() {
  const [selectedFilter, setSelectedFilter] = useState<'today' | 'upcoming' | 'recent'>('today');
  
  const matches: Match[] = [
    {
      id: '1',
      homeTeam: 'Ferencváros',
      awayTeam: 'Újpest',
      homeScore: 2,
      awayScore: 1,
      date: '2025.08.05',
      time: '20:00',
      venue: 'Groupama Aréna',
      competition: 'NB1',
      status: 'finished',
      homeTeamColor: 'bg-red-600',
      awayTeamColor: 'bg-blue-600'
    },
    {
      id: '2',
      homeTeam: 'Debrecen',
      awayTeam: 'Kisvárda',
      date: '2025.08.06',
      time: '19:30',
      venue: 'Nagyerdei Stadion',
      competition: 'NB1',
      status: 'scheduled',
      homeTeamColor: 'bg-green-600',
      awayTeamColor: 'bg-yellow-600'
    },
    {
      id: '3',
      homeTeam: 'Puskás Akadémia',
      awayTeam: 'Zalaegerszeg',
      homeScore: 1,
      awayScore: 1,
      date: '2025.08.04',
      time: '17:00',
      venue: 'Pancho Aréna',
      competition: 'NB1',
      status: 'finished',
      homeTeamColor: 'bg-purple-600',
      awayTeamColor: 'bg-orange-600'
    },
    {
      id: '4',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      date: '2025.08.07',
      time: '21:00',
      venue: 'Santiago Bernabéu',
      competition: 'La Liga',
      status: 'scheduled',
      homeTeamColor: 'bg-white border border-gray-300',
      awayTeamColor: 'bg-red-600'
    }
  ];

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'live':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'finished':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
      case 'scheduled':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'postponed':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Match['status']) => {
    return hu.dashboard.matches.status[status];
  };

  const filteredMatches = matches.filter(match => {
    switch (selectedFilter) {
      case 'today':
        return match.date === '2025.08.05';
      case 'upcoming':
        return match.status === 'scheduled';
      case 'recent':
        return match.status === 'finished';
      default:
        return true;
    }
  });

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.matches.title} />
      <WidgetContent>
        <div className="space-y-4">
          {/* Filter tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { key: 'today', label: hu.dashboard.matches.today },
              { key: 'upcoming', label: hu.dashboard.matches.upcoming },
              { key: 'recent', label: hu.dashboard.matches.recent }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Matches list */}
          <div className="space-y-3">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {match.competition}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
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
                      {match.status === 'finished' || match.status === 'live' ? (
                        <>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {match.homeScore}
                          </span>
                          <span className="text-gray-500">-</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {match.awayScore}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">vs</span>
                      )}
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

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-24">{match.venue}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Calendar className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {hu.dashboard.matches.empty.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {hu.dashboard.matches.empty.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
} 