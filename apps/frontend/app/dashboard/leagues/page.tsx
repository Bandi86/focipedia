'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface League {
  id: number;
  name: string;
  country: string;
  logoUrl?: string;
  createdAt: string; // Add createdAt for sorting
}

export default function LeaguesPage() {
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: leagues, isLoading, error } = useGetAll<League>('leagues');
  const createLeagueMutation = useCreate<Omit<League, 'id' | 'createdAt'>>('leagues');

  useEffect(() => {
    if (createLeagueMutation.isSuccess) {
      setMessage({ type: 'success', text: 'League added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createLeagueMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding league: ${createLeagueMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createLeagueMutation.isSuccess, createLeagueMutation.isError, createLeagueMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    createLeagueMutation.mutate(
      {
        name: newName,
        country: newCountry,
        logoUrl: newLogoUrl || undefined,
      },
      {
        onSuccess: () => {
          setNewName('');
          setNewCountry('');
          setNewLogoUrl('');
        },
      },
    );
  };

  const sortedLeagues = leagues
    ? [...leagues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  if (isLoading) return <div>Loading leagues...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Leagues</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New League</h2>
        <div className="mb-4">
          <label htmlFor="leagueName" className="block text-sm font-medium text-gray-700">
            League Name
          </label>
          <input
            type="text"
            id="leagueName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="leagueCountry" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="leagueCountry"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="leagueLogoUrl" className="block text-sm font-medium text-gray-700">
            Logo URL (Optional)
          </label>
          <input
            type="text"
            id="leagueLogoUrl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newLogoUrl}
            onChange={(e) => setNewLogoUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createLeagueMutation.isPending}
        >
          {createLeagueMutation.isPending ? 'Adding...' : 'Add League'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Leagues</h2>
      <ul className="space-y-2">
        {sortedLeagues.map((league: League) => (
          <li key={league.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">
              {league.name} ({league.country})
            </p>
            {league.logoUrl && (
              <img
                src={league.logoUrl}
                alt={league.name}
                className="w-16 h-16 object-contain mt-2"
              />
            )}
            <p className="text-xs text-gray-500">
              Created: {new Date(league.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
