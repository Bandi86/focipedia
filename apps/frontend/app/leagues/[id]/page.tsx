'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type Match = { id: number; matchDate: string; round?: string; status: 'Scheduled' | 'Live' | 'Finished' | string; homeTeam: { name: string }; awayTeam: { name: string } };

async function fetchMatches(leagueId: string): Promise<Match[]> {
  const res = await fetch(`/api/matches?leagueId=${encodeURIComponent(leagueId)}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default function LeagueDetailPage() {
  const params = useParams<{ id: string }>();
  const leagueId = params?.id;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['matches', leagueId],
    queryFn: () => fetchMatches(String(leagueId)),
    enabled: Boolean(leagueId),
  });

  const [status, setStatus] = useState<'ALL' | 'Scheduled' | 'Finished'>('ALL');
  const [round, setRound] = useState<string>('');
  const filtered = useMemo(() => {
    const arr = (data || []) as Match[];
    return arr.filter(m => (status==='ALL' || m.status===status) && (!round || (m.round||'').toLowerCase().includes(round.toLowerCase())));
  }, [data, status, round]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liga meccsei</h1>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <label>Státusz:</label>
        <select value={status} onChange={e => setStatus(e.target.value as 'ALL' | 'Scheduled' | 'Finished')} className="border rounded px-2 py-1">
          <option value="ALL">Összes</option>
          <option value="Scheduled">Ütemezett</option>
          <option value="Finished">Lejátszott</option>
        </select>
        <label>Forduló:</label>
        <input value={round} onChange={e => setRound(e.target.value)} placeholder="pl. Matchday 10" className="border rounded px-2 py-1" />
      </div>
      {isLoading && <div>Betöltés…</div>}
      {isError && <div className="text-red-600">Hiba történt. <button className="underline" onClick={() => refetch()}>Újra</button></div>}
      {!isLoading && !isError && (
        <ul className="divide-y">
          {filtered.map(m => (
            <li key={m.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.homeTeam?.name} vs {m.awayTeam?.name}</div>
                <div className="text-sm text-gray-600">{new Date(m.matchDate).toLocaleString()} • {m.round || '—'} • {m.status}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



