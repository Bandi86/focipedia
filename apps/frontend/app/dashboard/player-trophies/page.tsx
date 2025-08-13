'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface PlayerTrophy {
  id: number;
  season: string;
  playerId: number;
  trophyId: number;
  createdAt: string; // Add createdAt for sorting
}

interface Player {
  id: number;
  name: string;
}

interface Trophy {
  id: number;
  name: string;
  year: number;
}

export default function PlayerTrophiesPage() {
  const [newSeason, setNewSeason] = useState('');
  const [newPlayerId, setNewPlayerId] = useState<number | ''>('');
  const [newTrophyId, setNewTrophyId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: playerTrophies,
    isLoading: isLoadingPlayerTrophies,
    error: playerTrophiesError,
  } = useGetAll<PlayerTrophy>('player-trophies');
  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetAll<Player>('players');
  const {
    data: trophies,
    isLoading: isLoadingTrophies,
    error: trophiesError,
  } = useGetAll<Trophy>('trophies');

  const createPlayerTrophyMutation =
    useCreate<Omit<PlayerTrophy, 'id' | 'createdAt'>>('player-trophies');

  useEffect(() => {
    if (createPlayerTrophyMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Player trophy added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createPlayerTrophyMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding player trophy: ${createPlayerTrophyMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [
    createPlayerTrophyMutation.isSuccess,
    createPlayerTrophyMutation.isError,
    createPlayerTrophyMutation.error,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newPlayerId === '' || newTrophyId === '') return;
    createPlayerTrophyMutation.mutate(
      {
        season: newSeason,
        playerId: newPlayerId as number,
        trophyId: newTrophyId as number,
      },
      {
        onSuccess: () => {
          setNewSeason('');
          setNewPlayerId('');
          setNewTrophyId('');
        },
      },
    );
  };

  const sortedPlayerTrophies = playerTrophies
    ? [...playerTrophies].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  if (isLoadingPlayerTrophies || isLoadingPlayers || isLoadingTrophies)
    return <div>Loading...</div>;
  if (playerTrophiesError)
    return <div>Error loading player trophies: {playerTrophiesError.message}</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;
  if (trophiesError) return <div>Error loading trophies: {trophiesError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Trophies</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Player Trophy</h2>
        <div className="mb-4">
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">
            Season
          </label>
          <input
            type="text"
            id="season"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
            Player
          </label>
          <select
            id="playerId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPlayerId}
            onChange={(e) => setNewPlayerId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Player</option>
            {players?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ID: {player.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="trophyId" className="block text-sm font-medium text-gray-700">
            Trophy
          </label>
          <select
            id="trophyId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTrophyId}
            onChange={(e) => setNewTrophyId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Trophy</option>
            {trophies?.map((trophy) => (
              <option key={trophy.id} value={trophy.id}>
                {trophy.name} ({trophy.year}) (ID: {trophy.id})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createPlayerTrophyMutation.isPending}
        >
          {createPlayerTrophyMutation.isPending ? 'Adding...' : 'Add Player Trophy'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Player Trophies</h2>
      <ul className="space-y-2">
        {sortedPlayerTrophies.map((playerTrophy: PlayerTrophy) => (
          <li key={playerTrophy.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Trophy ID: {playerTrophy.id}</p>
            <p>Season: {playerTrophy.season}</p>
            <p>
              Player ID: {playerTrophy.playerId}, Trophy ID: {playerTrophy.trophyId}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(playerTrophy.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
