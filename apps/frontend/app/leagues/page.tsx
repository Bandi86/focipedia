'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

type League = { id: number; name: string; country: string; competitionType?: 'DomesticLeague' | 'DomesticCup' | 'InternationalClub' | 'InternationalNational' };

async function fetchLeagues(): Promise<League[]> {
  const res = await fetch('/api/leagues', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

function classify(league: League): 'LEAGUE' | 'CUP' | 'UEFA' {
  if (league.competitionType) {
    if (league.competitionType === 'DomesticCup') return 'CUP';
    if (league.competitionType === 'InternationalClub') return 'UEFA';
    return 'LEAGUE';
  }
  const n = (league.name || '').toLowerCase();
  if (/(cup|copa|taça|kupa|coupe|beker)/.test(n)) return 'CUP';
  if (/(uefa|champions|europa|conference)/.test(n)) return 'UEFA';
  return 'LEAGUE';
}

export default function LeaguesPage() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['leagues'], queryFn: fetchLeagues });
  const leagues = (data || []);
  const [tab, setTab] = useState<'ALL' | 'LEAGUE' | 'CUP' | 'UEFA'>('ALL');
  const counts = useMemo(() => {
    let L = 0, C = 0, U = 0;
    for (const lg of leagues) {
      const t = classify(lg);
      if (t === 'LEAGUE') L++; else if (t === 'CUP') C++; else U++;
    }
    return { L, C, U };
  }, [leagues]);
  const filtered = useMemo(() => {
    if (tab === 'ALL') return leagues;
    return leagues.filter(lg => classify(lg) === tab);
  }, [leagues, tab]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ligák</h1>
      <div className="mb-4 flex gap-2 text-sm">
        <button onClick={() => setTab('ALL')} className={`px-3 py-1 rounded border ${tab==='ALL' ? 'bg-white/10' : 'hover:bg-white/5'}`}>Összes ({leagues.length})</button>
        <button onClick={() => setTab('LEAGUE')} className={`px-3 py-1 rounded border ${tab==='LEAGUE' ? 'bg-white/10' : 'hover:bg-white/5'}`}>Bajnokságok ({counts.L})</button>
        <button onClick={() => setTab('CUP')} className={`px-3 py-1 rounded border ${tab==='CUP' ? 'bg-white/10' : 'hover:bg-white/5'}`}>Kupák ({counts.C})</button>
        <button onClick={() => setTab('UEFA')} className={`px-3 py-1 rounded border ${tab==='UEFA' ? 'bg-white/10' : 'hover:bg-white/5'}`}>UEFA ({counts.U})</button>
      </div>
      {isLoading && <div>Betöltés…</div>}
      {isError && <div className="text-red-600">Hiba történt. <button className="underline" onClick={() => refetch()}>Újra</button></div>}
      {!isLoading && !isError && (
        <ul className="divide-y">
          {filtered.map(l => (
            <li key={l.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-gray-600">{l.country} • {classify(l) === 'LEAGUE' ? 'Bajnokság' : classify(l) === 'CUP' ? 'Kupa' : 'UEFA'}</div>
              </div>
              <Link className="text-blue-600 underline" href={`/leagues/${l.id}`}>Megnyitás</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



