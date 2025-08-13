/* eslint-disable @next/next/no-img-element */
'use client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog';

type League = { id: number; name: string; country: string; logoUrl?: string; competitionType?: 'DomesticLeague' | 'DomesticCup' | 'InternationalClub' | 'InternationalNational' };

async function fetchLeagues(): Promise<League[]> {
  const res = await fetch('/api/studio/leagues', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function createLeague(payload: Partial<League>) {
  const res = await fetch('/api/studio/leagues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function updateLeague(payload: Partial<League> & { id: number }) {
  const res = await fetch('/api/studio/leagues', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function deleteLeague(id: number) {
  const res = await fetch('/api/studio/leagues', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export function LeaguesStudio() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['studio-leagues'], queryFn: fetchLeagues });
  const [form, setForm] = useState({ name: '', country: '', logoUrl: '', competitionType: 'DomesticLeague' as League['competitionType'] });
  const isValid = useMemo(() => form.name.trim().length >= 2 && form.country.trim().length >= 2, [form]);
  const createMut = useMutation({
    mutationFn: createLeague,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-leagues'] }); setForm({ name: '', country: '', logoUrl: '', competitionType: 'DomesticLeague' }); toast.success('Liga létrehozva'); },
    onError: () => toast.error('Nem sikerült létrehozni'),
  });
  const updateMut = useMutation({
    mutationFn: updateLeague,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-leagues'] }); toast.success('Frissítve'); },
    onError: () => toast.error('Nem sikerült frissíteni'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteLeague(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-leagues'] }); toast.success('Törölve'); },
    onError: () => toast.error('Nem sikerült törölni'),
  });
  const [delId, setDelId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Ligák</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white border border-white/10 shadow">
          <h3 className="font-semibold mb-3">Új liga</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-white/80">Név</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="NB I" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Ország</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Magyarország" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Sorozat típusa</label>
              <select value={form.competitionType || 'DomesticLeague'} onChange={(e) => setForm((f) => ({ ...f, competitionType: e.target.value as League['competitionType'] }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60">
                <option value="DomesticLeague">Bajnokság</option>
                <option value="DomesticCup">Kupa</option>
                <option value="InternationalClub">Nemzetközi (klub)</option>
                <option value="InternationalNational">Nemzetközi (válogatott)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-white/80">Logó URL</label>
              <input value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="https://..." />
            </div>
            <button disabled={!isValid || createMut.isPending} onClick={() => createMut.mutate({ name: form.name.trim(), country: form.country.trim(), logoUrl: form.logoUrl || undefined, competitionType: form.competitionType })} className="mt-2 w-full rounded-md bg-white text-gray-900 py-2 font-medium disabled:opacity-50 hover:bg-white/90">Létrehozás</button>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0b0019]/30 text-white border border-white/10 shadow min-h-[300px]">
          <h3 className="font-semibold mb-3">Liga lista</h3>
          {isLoading && <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>}
          {isError && <div className="text-sm text-rose-300">Nem sikerült betölteni.</div>}
          {!isLoading && !isError && (
            <ul className="divide-y divide-white/10 text-sm">
              {(data || []).map((l) => (
                <li key={l.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {l.logoUrl ? <img src={l.logoUrl} alt="" className="w-7 h-7 rounded object-cover" /> : <div className="w-7 h-7 rounded bg-white/20" />}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{l.name}</div>
                      <div className="text-white/80 truncate">{l.country} • {(l.competitionType === 'DomesticCup' ? 'Kupa' : l.competitionType === 'InternationalClub' ? 'Nemz. klub' : l.competitionType === 'InternationalNational' ? 'Nemz. válogatott' : 'Bajnokság')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateMut.mutate({ id: l.id, name: l.name })} className="px-2 py-1 rounded border border-white/20 hover:bg-white/10">Mentés</button>
                    <button onClick={() => setDelId(l.id)} className="px-2 py-1 rounded border border-rose-400/50 text-rose-200 hover:bg-rose-500/10">Törlés</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Dialog open={delId !== null} onOpenChange={(v) => !v && setDelId(null)}>
        <DialogHeader>Liga törlése</DialogHeader>
        <DialogContent>
          Biztosan törlöd a ligát?
        </DialogContent>
        <DialogFooter>
          <button onClick={() => setDelId(null)} className="px-3 py-1.5 rounded border border-white/20 hover:bg-white/10">Mégse</button>
          <button onClick={() => { if (delId) deleteMut.mutate(delId); setDelId(null); }} className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700">Törlés</button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}


