'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface Team {
  id: number;
  name: string;
  country: string;
  createdAt: string; // Add createdAt for sorting
}

export default function TeamsPage() {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCountry, setNewTeamCountry] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: teams, isLoading, error } = useGetAll<Team>('teams');
  const createTeamMutation = useCreate<Omit<Team, 'id' | 'createdAt'>>('teams');

  useEffect(() => {
    if (createTeamMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Team added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createTeamMutation.isError) {
      setMessage({ type: 'error', text: `Error adding team: ${createTeamMutation.error.message}` });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createTeamMutation.isSuccess, createTeamMutation.isError, createTeamMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    createTeamMutation.mutate(
      { name: newTeamName, country: newTeamCountry },
      {
        onSuccess: () => {
          setNewTeamName('');
          setNewTeamCountry('');
        },
      },
    );
  };

  const sortedTeams = teams
    ? [...teams].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  if (isLoading) return <div>Loading teams...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Team</h2>
        <div className="mb-4">
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="teamCountry" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="teamCountry"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={newTeamCountry}
            onChange={(e) => setNewTeamCountry(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={createTeamMutation.isPending}
        >
          {createTeamMutation.isPending ? 'Adding...' : 'Add Team'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Teams</h2>
      <ul className="space-y-2">
        {sortedTeams.map((team: Team) => (
          <li key={team.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">
              {team.name} ({team.country})
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(team.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
