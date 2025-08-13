'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function MatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['match', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/matches/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      return res.json();
    }
  });
  if (isLoading) return <div className="p-6">Betöltés…</div>;
  if (isError) return <div className="p-6 text-red-600">Hiba. <button className="underline" onClick={() => refetch()}>Újra</button></div>;
  type Team = { name?: string };
  type MatchDetails = { matchDate?: string; league?: { name?: string }; homeTeam?: Team; awayTeam?: Team; events?: Array<unknown>; odds?: Array<unknown> };
  const m = (data || {}) as MatchDetails;
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">{m?.homeTeam?.name} vs {m?.awayTeam?.name}</h1>
      <div className="text-sm text-gray-600">{m?.matchDate ? new Date(m.matchDate).toLocaleString() : ''} • {m?.league?.name}</div>
      <div className="mt-4">Események: {m?.events?.length ?? 0} • Odds: {m?.odds?.length ?? 0}</div>
    </div>
  );
}


