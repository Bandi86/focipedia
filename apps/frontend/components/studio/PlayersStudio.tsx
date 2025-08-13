'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

type Player = { id: number; name: string; nationality: string; position: string; teamId: number; team?: { id: number; name: string } };
type Team = { id: number; name: string };

async function fetchPlayers(): Promise<Player[]> {
  const res = await fetch('/api/studio/players', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

type CreatePlayerPayload = { name: string; nationality: string; position: string; teamName?: string; teamId?: number };
async function createPlayer(payload: CreatePlayerPayload): Promise<Player> {
  const res = await fetch('/api/studio/players', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

async function fetchTeams(): Promise<Team[]> {
  const res = await fetch('/api/studio/teams', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export function PlayersStudio() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['studio-players'], queryFn: fetchPlayers });
  const { data: teams } = useQuery({ queryKey: ['studio-teams'], queryFn: fetchTeams });
  const [form, setForm] = useState({ name: '', nationality: '', position: 'Midfielder', teamName: '' });
  const isValid = useMemo(() => {
    return form.name.trim().length >= 2 && form.nationality.trim().length >= 2 && form.teamName.trim().length >= 2;
  }, [form]);
  const createMut = useMutation({
    mutationFn: (p: CreatePlayerPayload) => createPlayer(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['studio-players'] });
      setForm({ name: '', nationality: '', position: 'Midfielder', teamName: '' });
      toast.success('Játékos létrehozva');
    },
    onError: () => toast.error('Nem sikerült létrehozni'),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Játékosok</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white border border-white/10 shadow">
          <h3 className="font-semibold mb-3">Új játékos</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-white/80">Név</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Név" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Nemzetiség</label>
              <input value={form.nationality} onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Magyar" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Poszt</label>
              <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60">
                <option>Goalkeeper</option>
                <option>Defender</option>
                <option>Midfielder</option>
                <option>Forward</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-white/80">Csapat</label>
              <input list="team-suggestions" value={form.teamName} onChange={(e) => setForm((f) => ({ ...f, teamName: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Kezdj el gépelni..." />
              <datalist id="team-suggestions">
                {(teams || []).slice(0, 50).map((t) => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </div>
            <button disabled={createMut.isPending || !isValid} onClick={() => createMut.mutate({ name: form.name.trim(), nationality: form.nationality.trim(), position: form.position, teamName: form.teamName.trim() })} className="mt-2 w-full rounded-md bg-white text-gray-900 py-2 font-medium disabled:opacity-50 hover:bg-white/90">Létrehozás</button>
            {!isValid && <div className="text-xs text-white/80 mt-2">Adj meg érvényes adatokat (név≥2, nemzetiség≥2, csapat ID&gt;0).</div>}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0b0019]/30 text-white border border-white/10 shadow min-h-[300px]">
          <h3 className="font-semibold mb-3">Játékos lista</h3>
          {isLoading && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          )}
          {isError && <div className="text-sm text-rose-300">Nem sikerült betölteni.</div>}
          {!isLoading && !isError && (
            <ul className="divide-y divide-white/10 text-sm">
              {(data || []).map((p) => (
                <li key={p.id} className="py-2 flex items-center justify-between hover:bg-white/5 px-2 rounded">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-white/80">{p.nationality} • {p.position}</div>
                  </div>
                  <span className="text-white/80">#{p.teamId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


