'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface MatchEvent {
  id: number;
  minute: number;
  type: string;
  matchId: number;
  playerId: number;
  assistingPlayerId?: number;
  playerInId?: number;
  playerOutId?: number;
  createdAt: string; // Add createdAt for sorting
}

interface Match {
  id: number;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
}

interface Player {
  id: number;
  name: string;
}

export default function MatchEventsPage() {
  const [newMinute, setNewMinute] = useState(0);
  const [newType, setNewType] = useState('Goal');
  const [newMatchId, setNewMatchId] = useState<number | ''>('');
  const [newPlayerId, setNewPlayerId] = useState<number | ''>('');
  const [newAssistingPlayerId, setNewAssistingPlayerId] = useState<number | ''>('');
  const [newPlayerInId, setNewPlayerInId] = useState<number | ''>('');
  const [newPlayerOutId, setNewPlayerOutId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: matchEvents,
    isLoading: isLoadingMatchEvents,
    error: matchEventsError,
  } = useGetAll<MatchEvent>('match-events');
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useGetAll<Match>('matches');
  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetAll<Player>('players');

  const createMatchEventMutation = useCreate<Omit<MatchEvent, 'id' | 'createdAt'>>('match-events');

  useEffect(() => {
    if (createMatchEventMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Match event added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createMatchEventMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding match event: ${createMatchEventMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [
    createMatchEventMutation.isSuccess,
    createMatchEventMutation.isError,
    createMatchEventMutation.error,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newMatchId === '' || newPlayerId === '') return;
    createMatchEventMutation.mutate(
      {
        minute: newMinute,
        type: newType,
        matchId: newMatchId as number,
        playerId: newPlayerId as number,
        assistingPlayerId: newAssistingPlayerId || undefined,
        playerInId: newPlayerInId || undefined,
        playerOutId: newPlayerOutId || undefined,
      },
      {
        onSuccess: () => {
          setNewMinute(0);
          setNewType('Goal');
          setNewMatchId('');
          setNewPlayerId('');
          setNewAssistingPlayerId('');
          setNewPlayerInId('');
          setNewPlayerOutId('');
        },
      },
    );
  };

  const sortedMatchEvents = matchEvents
    ? [...matchEvents].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  if (isLoadingMatchEvents || isLoadingMatches || isLoadingPlayers) return <div>Loading...</div>;
  if (matchEventsError) return <div>Error loading match events: {matchEventsError.message}</div>;
  if (matchesError) return <div>Error loading matches: {matchesError.message}</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Match Events</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Match Event</h2>
        <div className="mb-4">
          <label htmlFor="minute" className="block text-sm font-medium text-gray-700">
            Minute
          </label>
          <input
            type="number"
            id="minute"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newMinute}
            onChange={(e) => setNewMinute(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            required
          >
            <option value="Goal">Goal</option>
            <option value="YellowCard">Yellow Card</option>
            <option value="RedCard">Red Card</option>
            <option value="Substitution">Substitution</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="matchId" className="block text-sm font-medium text-gray-700">
            Match
          </label>
          <select
            id="matchId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newMatchId}
            onChange={(e) => setNewMatchId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Match</option>
            {matches?.map((match) => (
              <option key={match.id} value={match.id}>
                Match ID: {match.id} ({new Date(match.matchDate).toLocaleDateString()})
              </option>
            ))}
          </select>
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
          <label htmlFor="assistingPlayerId" className="block text-sm font-medium text-gray-700">
            Assisting Player (Optional)
          </label>
          <select
            id="assistingPlayerId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAssistingPlayerId}
            onChange={(e) => setNewAssistingPlayerId(parseInt(e.target.value))}
          >
            <option value="">None</option>
            {players?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ID: {player.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="playerInId" className="block text-sm font-medium text-gray-700">
            Player In (Substitution) (Optional)
          </label>
          <select
            id="playerInId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPlayerInId}
            onChange={(e) => setNewPlayerInId(parseInt(e.target.value))}
          >
            <option value="">None</option>
            {players?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ID: {player.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="playerOutId" className="block text-sm font-medium text-gray-700">
            Player Out (Substitution) (Optional)
          </label>
          <select
            id="playerOutId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPlayerOutId}
            onChange={(e) => setNewPlayerOutId(parseInt(e.target.value))}
          >
            <option value="">None</option>
            {players?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ID: {player.id})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createMatchEventMutation.isPending}
        >
          {createMatchEventMutation.isPending ? 'Adding...' : 'Add Match Event'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Match Events</h2>
      <ul className="space-y-2">
        {sortedMatchEvents.map((event: MatchEvent) => (
          <li key={event.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Event ID: {event.id}</p>
            <p>Minute: {event.minute}</p>
            <p>Type: {event.type}</p>
            <p>Match ID: {event.matchId}</p>
            <p>Player ID: {event.playerId}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(event.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
