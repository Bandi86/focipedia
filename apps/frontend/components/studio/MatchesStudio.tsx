'use client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/utils/date';
/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'sonner';

type Match = { id: number; homeTeamId: number; awayTeamId: number; leagueId?: number; matchDate: string; isCup?: boolean };
type Team = { id: number; name: string };
type League = { id: number; name: string };

async function fetchMatches(): Promise<Match[]> {
  const res = await fetch('/api/studio/matches', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function fetchTeams(): Promise<Team[]> {
  const res = await fetch('/api/studio/teams', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}
async function fetchLeagues(): Promise<League[]> {
  const res = await fetch('/api/studio/leagues', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}
type CreateMatchPayload = { homeName: string; awayName: string; leagueName?: string; matchDate: string; isCup?: boolean };
async function createMatch(payload: CreateMatchPayload) {
  const res = await fetch('/api/studio/matches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function deleteMatch(id: number) {
  const res = await fetch('/api/studio/matches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export function MatchesStudio() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['studio-matches'], queryFn: fetchMatches });
  const { data: teams } = useQuery({ queryKey: ['studio-teams'], queryFn: fetchTeams });
  const { data: leagues } = useQuery({ queryKey: ['studio-leagues'], queryFn: fetchLeagues });
  const [form, setForm] = useState({ homeName: '', awayName: '', leagueName: '', date: '', isCup: false });
  const isValid = useMemo(() => form.homeName.trim().length >= 2 && form.awayName.trim().length >= 2 && !!form.date, [form]);
  const createMut = useMutation({
    mutationFn: (p: CreateMatchPayload) => createMatch(p),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-matches'] }); setForm({ homeName: '', awayName: '', leagueName: '', date: '', isCup: false }); toast.success('Meccs létrehozva'); },
    onError: () => toast.error('Nem sikerült létrehozni'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteMatch(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-matches'] }); toast.success('Meccs törölve'); },
    onError: () => toast.error('Nem sikerült törölni'),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Meccsek</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white border border-white/10 shadow">
          <h3 className="font-semibold mb-3">Új meccs</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-white/80">Hazai csapat</label>
              <input list="team-list" value={form.homeName} onChange={(e) => setForm((f) => ({ ...f, homeName: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Hazai" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Vendég csapat</label>
              <input list="team-list" value={form.awayName} onChange={(e) => setForm((f) => ({ ...f, awayName: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Vendég" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Liga</label>
              <input list="league-list" value={form.leagueName} onChange={(e) => setForm((f) => ({ ...f, leagueName: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="NB I" />
            </div>
            <div className="flex items-center gap-2">
              <input id="isCup" type="checkbox" checked={form.isCup} onChange={(e) => setForm((f) => ({ ...f, isCup: e.target.checked }))} />
              <label htmlFor="isCup" className="text-white/80">Kupa mérkőzés</label>
            </div>
            <div>
              <label className="block mb-1 text-white/80">Dátum/idő</label>
              <input
                type="text"
                placeholder="YYYY.MM.DD HH:mm"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                onBlur={() => {
                  const v = form.date.trim();
                  // Accept both local datetime input and our unified format, normalize to ISO
                  // Preferred input: YYYY.MM.DD HH:mm
                  const m = v.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})$/);
                  if (m) {
                    const [, y, mo, d, h, mi] = m;
                    const iso = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi)).toISOString();
                    setForm((f) => ({ ...f, date: iso }));
                    return;
                  }
                  // If it's a valid Date string, keep as is
                  const parsed = new Date(v);
                  if (!Number.isNaN(parsed.getTime())) {
                    setForm((f) => ({ ...f, date: parsed.toISOString() }));
                  }
                }}
                className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <p className="text-xs text-white/70 mt-1">Formátum: YYYY.MM.DD HH:mm</p>
            </div>
            <datalist id="team-list">
              {(teams || []).slice(0, 100).map((t) => <option key={t.id} value={t.name} />)}
            </datalist>
            <datalist id="league-list">
              {(leagues || []).slice(0, 100).map((l) => <option key={l.id} value={l.name} />)}
            </datalist>
            <button disabled={!isValid || createMut.isPending} onClick={() => createMut.mutate({ homeName: form.homeName.trim(), awayName: form.awayName.trim(), leagueName: form.leagueName.trim() || undefined, matchDate: form.date, isCup: form.isCup })} className="mt-2 w-full rounded-md bg-white text-gray-900 py-2 font-medium disabled:opacity-50 hover:bg-white/90">Létrehozás</button>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0b0019]/30 text-white border border-white/10 shadow min-h-[300px]">
          <h3 className="font-semibold mb-3">Meccs lista</h3>
          {isLoading && <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>}
          {isError && <div className="text-sm text-rose-300">Nem sikerült betölteni.</div>}
          {!isLoading && !isError && (
            <ul className="divide-y divide-white/10 text-sm">
              {(data || []).map((m) => (
                <li key={m.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">#{m.id}</div>
                    <div className="text-white/80 truncate">{formatDateTime(m.matchDate)}</div>
                  </div>
                   <button onClick={() => deleteMut.mutate(m.id)} className="px-2 py-1 rounded border border-rose-400/50 text-rose-200 hover:bg-rose-500/10">Törlés</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


