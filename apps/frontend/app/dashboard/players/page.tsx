'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface Player {
  id: number;
  name: string;
  nationality: string;
  position: string;
  teamId: number;
  createdAt: string; // Add createdAt for sorting
}

interface Team {
  id: number;
  name: string;
}

export default function PlayersPage() {
  const [newName, setNewName] = useState('');
  const [newNationality, setNewNationality] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newTeamId, setNewTeamId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetAll<Player>('players');
  const { data: teams, isLoading: isLoadingTeams, error: teamsError } = useGetAll<Team>('teams');

  const createPlayerMutation = useCreate<Omit<Player, 'id' | 'createdAt'>>('players');

  useEffect(() => {
    if (createPlayerMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Player added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createPlayerMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding player: ${createPlayerMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createPlayerMutation.isSuccess, createPlayerMutation.isError, createPlayerMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newTeamId === '') return;
    createPlayerMutation.mutate(
      {
        name: newName,
        nationality: newNationality,
        position: newPosition,
        teamId: newTeamId as number,
      },
      {
        onSuccess: () => {
          setNewName('');
          setNewNationality('');
          setNewPosition('');
          setNewTeamId('');
        },
      },
    );
  };

  const sortedPlayers = players
    ? [...players].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  if (isLoadingPlayers || isLoadingTeams) return <div>Loading players...</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;
  if (teamsError) return <div>Error loading teams: {teamsError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Players</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Player</h2>
        <div className="mb-4">
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
            Player Name
          </label>
          <input
            type="text"
            id="playerName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playerNationality" className="block text-sm font-medium text-gray-700">
            Nationality
          </label>
          <input
            type="text"
            id="playerNationality"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newNationality}
            onChange={(e) => setNewNationality(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            id="playerPosition"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playerTeamId" className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <select
            id="playerTeamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTeamId}
            onChange={(e) => setNewTeamId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Team</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createPlayerMutation.isPending}
        >
          {createPlayerMutation.isPending ? 'Adding...' : 'Add Player'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Players</h2>
      <ul className="space-y-2">
        {sortedPlayers.map((player: Player) => (
          <li key={player.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">
              {player.name} ({player.position}) - {player.nationality} (Team ID: {player.teamId})
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(player.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
