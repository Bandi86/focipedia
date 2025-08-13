'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface Transfer {
  id: number;
  transferDate: string;
  transferFee?: number;
  transferType: string;
  playerId: number;
  fromTeamId?: number;
  toTeamId: number;
  createdAt: string; // Add createdAt for sorting
}

interface Player {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

export default function TransfersPage() {
  const [newTransferDate, setNewTransferDate] = useState('');
  const [newTransferFee, setNewTransferFee] = useState<number | ''>('');
  const [newTransferType, setNewTransferType] = useState('Permanent');
  const [newPlayerId, setNewPlayerId] = useState<number | ''>('');
  const [newFromTeamId, setNewFromTeamId] = useState<number | ''>('');
  const [newToTeamId, setNewToTeamId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: transfers,
    isLoading: isLoadingTransfers,
    error: transfersError,
  } = useGetAll<Transfer>('transfers');
  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetAll<Player>('players');
  const { data: teams, isLoading: isLoadingTeams, error: teamsError } = useGetAll<Team>('teams');

  const createTransferMutation = useCreate<Omit<Transfer, 'id' | 'createdAt'>>('transfers');

  useEffect(() => {
    if (createTransferMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Transfer added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createTransferMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding transfer: ${createTransferMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [
    createTransferMutation.isSuccess,
    createTransferMutation.isError,
    createTransferMutation.error,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newPlayerId === '' || newToTeamId === '') return;
    createTransferMutation.mutate(
      {
        transferDate: newTransferDate,
        transferFee: newTransferFee || undefined,
        transferType: newTransferType,
        playerId: newPlayerId as number,
        fromTeamId: newFromTeamId || undefined,
        toTeamId: newToTeamId as number,
      },
      {
        onSuccess: () => {
          setNewTransferDate('');
          setNewTransferFee('');
          setNewTransferType('Permanent');
          setNewPlayerId('');
          setNewFromTeamId('');
          setNewToTeamId('');
        },
      },
    );
  };

  const sortedTransfers = transfers
    ? [...transfers].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  if (isLoadingTransfers || isLoadingPlayers || isLoadingTeams) return <div>Loading...</div>;
  if (transfersError) return <div>Error loading transfers: {transfersError.message}</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;
  if (teamsError) return <div>Error loading teams: {teamsError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transfers</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Transfer</h2>
        <div className="mb-4">
          <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">
            Transfer Date
          </label>
          <input
            type="datetime-local"
            id="transferDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTransferDate}
            onChange={(e) => setNewTransferDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="transferFee" className="block text-sm font-medium text-gray-700">
            Transfer Fee (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            id="transferFee"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTransferFee}
            onChange={(e) => setNewTransferFee(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="transferType" className="block text-sm font-medium text-gray-700">
            Transfer Type
          </label>
          <select
            id="transferType"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTransferType}
            onChange={(e) => setNewTransferType(e.target.value)}
            required
          >
            <option value="Permanent">Permanent</option>
            <option value="Loan">Loan</option>
            <option value="FreeAgent">Free Agent</option>
            <option value="EndOfLoan">End Of Loan</option>
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
          <label htmlFor="fromTeamId" className="block text-sm font-medium text-gray-700">
            From Team (Optional)
          </label>
          <select
            id="fromTeamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newFromTeamId}
            onChange={(e) => setNewFromTeamId(parseInt(e.target.value))}
          >
            <option value="">None</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} (ID: {team.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="toTeamId" className="block text-sm font-medium text-gray-700">
            To Team
          </label>
          <select
            id="toTeamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newToTeamId}
            onChange={(e) => setNewToTeamId(parseInt(e.target.value))}
            required
          >
            <option value="">Select To Team</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} (ID: {team.id})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createTransferMutation.isPending}
        >
          {createTransferMutation.isPending ? 'Adding...' : 'Add Transfer'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Transfers</h2>
      <ul className="space-y-2">
        {sortedTransfers.map((transfer: Transfer) => (
          <li key={transfer.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Transfer ID: {transfer.id}</p>
            <p>Date: {new Date(transfer.transferDate).toLocaleDateString()}</p>
            <p>
              Player ID: {transfer.playerId}, From: {transfer.fromTeamId || 'N/A'}, To:{' '}
              {transfer.toTeamId}
            </p>
            <p>
              Type: {transfer.transferType}, Fee: {transfer.transferFee || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(transfer.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
