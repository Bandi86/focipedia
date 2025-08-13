'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface Trophy {
  id: number;
  name: string;
  type: string;
  year: number;
  createdAt: string; // Add createdAt for sorting
}

export default function TrophiesPage() {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Individual');
  const [newYear, setNewYear] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: trophies, isLoading, error } = useGetAll<Trophy>('trophies');
  const createTrophyMutation = useCreate<Omit<Trophy, 'id' | 'createdAt'>>('trophies');

  useEffect(() => {
    if (createTrophyMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Trophy added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createTrophyMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding trophy: ${createTrophyMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createTrophyMutation.isSuccess, createTrophyMutation.isError, createTrophyMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newYear === '') return;
    createTrophyMutation.mutate(
      {
        name: newName,
        type: newType,
        year: newYear as number,
      },
      {
        onSuccess: () => {
          setNewName('');
          setNewType('Individual');
          setNewYear('');
        },
      },
    );
  };

  const sortedTrophies = trophies
    ? [...trophies].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  if (isLoading) return <div>Loading trophies...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trophies</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Trophy</h2>
        <div className="mb-4">
          <label htmlFor="trophyName" className="block text-sm font-medium text-gray-700">
            Trophy Name
          </label>
          <input
            type="text"
            id="trophyName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="trophyType" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="trophyType"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            required
          >
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="trophyYear" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="trophyYear"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newYear}
            onChange={(e) => setNewYear(parseInt(e.target.value))}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createTrophyMutation.isPending}
        >
          {createTrophyMutation.isPending ? 'Adding...' : 'Add Trophy'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Trophies</h2>
      <ul className="space-y-2">
        {sortedTrophies.map((trophy: Trophy) => (
          <li key={trophy.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">
              {trophy.name} ({trophy.year}) - {trophy.type}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(trophy.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
