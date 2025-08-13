'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface Odd {
  id: number;
  provider: string;
  homeWinOdds: number;
  drawOdds: number;
  awayWinOdds: number;
  matchId: number;
  createdAt: string; // Add createdAt for sorting
}

interface Match {
  id: number;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  createdAt: string;
}

export default function OddsPage() {
  const [newProvider, setNewProvider] = useState('');
  const [newHomeWinOdds, setNewHomeWinOdds] = useState<number | ''>('');
  const [newDrawOdds, setNewDrawOdds] = useState<number | ''>('');
  const [newAwayWinOdds, setNewAwayWinOdds] = useState<number | ''>('');
  const [newMatchId, setNewMatchId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: odds, isLoading: isLoadingOdds, error: oddsError } = useGetAll<Odd>('odds');
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useGetAll<Match>('matches');
  const createOddMutation = useCreate<Omit<Odd, 'id' | 'createdAt'>>('odds');

  useEffect(() => {
    if (createOddMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Odd added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createOddMutation.isError) {
      setMessage({ type: 'error', text: `Error adding odd: ${createOddMutation.error.message}` });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createOddMutation.isSuccess, createOddMutation.isError, createOddMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newHomeWinOdds === '' || newDrawOdds === '' || newAwayWinOdds === '' || newMatchId === '')
      return;
    createOddMutation.mutate(
      {
        provider: newProvider,
        homeWinOdds: newHomeWinOdds as number,
        drawOdds: newDrawOdds as number,
        awayWinOdds: newAwayWinOdds as number,
        matchId: newMatchId as number,
      },
      {
        onSuccess: () => {
          setNewProvider('');
          setNewHomeWinOdds('');
          setNewDrawOdds('');
          setNewAwayWinOdds('');
          setNewMatchId('');
        },
      },
    );
  };

  const handleMatchClick = (matchId: number) => {
    setNewMatchId(matchId);
  };

  const sortedOdds = odds
    ? [...odds].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];
  const sortedMatches = matches
    ? [...matches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  if (isLoadingOdds || isLoadingMatches) return <div>Loading...</div>;
  if (oddsError) return <div>Error loading odds: {oddsError.message}</div>;
  if (matchesError) return <div>Error loading matches: {matchesError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Odds</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Odd</h2>
        <div className="mb-4">
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            Provider
          </label>
          <input
            type="text"
            id="provider"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="homeWinOdds" className="block text-sm font-medium text-gray-700">
            Home Win Odds
          </label>
          <input
            type="number"
            step="0.01"
            id="homeWinOdds"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newHomeWinOdds}
            onChange={(e) => setNewHomeWinOdds(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="drawOdds" className="block text-sm font-medium text-gray-700">
            Draw Odds
          </label>
          <input
            type="number"
            step="0.01"
            id="drawOdds"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newDrawOdds}
            onChange={(e) => setNewDrawOdds(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="awayWinOdds" className="block text-sm font-medium text-gray-700">
            Away Win Odds
          </label>
          <input
            type="number"
            step="0.01"
            id="awayWinOdds"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAwayWinOdds}
            onChange={(e) => setNewAwayWinOdds(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="matchId" className="block text-sm font-medium text-gray-700">
            Match ID
          </label>
          <input
            type="number"
            id="matchId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newMatchId}
            onChange={(e) => setNewMatchId(parseInt(e.target.value))}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createOddMutation.isPending}
        >
          {createOddMutation.isPending ? 'Adding...' : 'Add Odd'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Available Matches</h2>
      <ul className="space-y-2 mb-8">
        {sortedMatches.map((match: Match) => (
          <li
            key={match.id}
            className="p-4 border rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={() => handleMatchClick(match.id)}
          >
            <p className="font-medium">Match ID: {match.id}</p>
            <p>Date: {new Date(match.matchDate).toLocaleString()}</p>
            <p>
              Teams: {match.homeTeamId} vs {match.awayTeamId}
            </p>
            <p>
              Score: {match.homeScore} - {match.awayScore}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(match.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Existing Odds</h2>
      <ul className="space-y-2">
        {sortedOdds.map((odd: Odd) => (
          <li key={odd.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Odd ID: {odd.id}</p>
            <p>Provider: {odd.provider}</p>
            <p>Match ID: {odd.matchId}</p>
            <p>
              Odds: Home {odd.homeWinOdds}, Draw {odd.drawOdds}, Away {odd.awayWinOdds}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(odd.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
