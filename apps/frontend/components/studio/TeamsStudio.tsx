/* eslint-disable @next/next/no-img-element */
'use client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog';

type Team = { id: number; name: string; country: string; stadium?: string; logoUrl?: string; founded?: number };

async function fetchTeams(): Promise<Team[]> {
  const res = await fetch('/api/studio/teams', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function createTeam(payload: Partial<Team>) {
  const res = await fetch('/api/studio/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function updateTeam(payload: Partial<Team> & { id: number }) {
  const res = await fetch('/api/studio/teams', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
async function deleteTeam(id: number) {
  const res = await fetch('/api/studio/teams', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export function TeamsStudio() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['studio-teams'], queryFn: fetchTeams });
  const [form, setForm] = useState({ name: '', country: '', stadium: '', logoUrl: '', founded: '' });
  const isValid = useMemo(() => form.name.trim().length >= 2 && form.country.trim().length >= 2, [form]);
  const createMut = useMutation({
    mutationFn: createTeam,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-teams'] }); setForm({ name: '', country: '', stadium: '', logoUrl: '', founded: '' }); toast.success('Csapat létrehozva'); },
    onError: () => toast.error('Nem sikerült létrehozni'),
  });
  const updateMut = useMutation({
    mutationFn: updateTeam,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-teams'] }); toast.success('Frissítve'); },
    onError: () => toast.error('Nem sikerült frissíteni'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['studio-teams'] }); toast.success('Törölve'); },
    onError: () => toast.error('Nem sikerült törölni'),
  });
  const [delId, setDelId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Team | null>(null);
  const [editForm, setEditForm] = useState({ name: '', country: '', stadium: '', logoUrl: '', founded: '' });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Csapatok</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white border border-white/10 shadow">
          <h3 className="font-semibold mb-3">Új csapat</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-white/80">Név</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Ferencváros" />
            </div>
            <div>
              <label className="block mb-1 text-white/80">Ország</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Magyarország" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-white/80">Stadion</label>
                <input value={form.stadium} onChange={(e) => setForm((f) => ({ ...f, stadium: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Groupama" />
              </div>
              <div>
                <label className="block mb-1 text-white/80">Alapítás éve</label>
                <input value={form.founded} onChange={(e) => setForm((f) => ({ ...f, founded: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="1899" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-white/80">Logó URL</label>
              <input value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="https://..." />
            </div>
            <button disabled={!isValid || createMut.isPending} onClick={() => createMut.mutate({ name: form.name.trim(), country: form.country.trim(), stadium: form.stadium || undefined, logoUrl: form.logoUrl || undefined, founded: Number(form.founded) || undefined })} className="mt-2 w-full rounded-md bg-white text-gray-900 py-2 font-medium disabled:opacity-50 hover:bg-white/90">Létrehozás</button>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0b0019]/30 text-white border border-white/10 shadow min-h-[300px]">
          <h3 className="font-semibold mb-3">Csapat lista</h3>
          {isLoading && <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>}
          {isError && <div className="text-sm text-rose-300">Nem sikerült betölteni.</div>}
          {!isLoading && !isError && (
            <ul className="divide-y divide-white/10 text-sm">
              {(data || []).map((t) => (
                <li key={t.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.logoUrl ? <img src={t.logoUrl} alt="" className="w-7 h-7 rounded object-cover" /> : <div className="w-7 h-7 rounded bg-white/20" />}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-white/80 truncate">{t.country}{t.stadium ? ` • ${t.stadium}` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEdit(t); setEditForm({ name: t.name, country: t.country, stadium: t.stadium || '', logoUrl: t.logoUrl || '', founded: String(t.founded || '') }); }} className="px-2 py-1 rounded border border-white/20 hover:bg-white/10">Szerkesztés</button>
                    <button onClick={() => setDelId(t.id)} className="px-2 py-1 rounded border border-rose-400/50 text-rose-200 hover:bg-rose-500/10">Törlés</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Dialog open={delId !== null} onOpenChange={(v) => !v && setDelId(null)}>
        <DialogHeader>Csapat törlése</DialogHeader>
        <DialogContent>
          Biztosan törlöd a csapatot?
        </DialogContent>
        <DialogFooter>
          <button onClick={() => setDelId(null)} className="px-3 py-1.5 rounded border border-white/20 hover:bg-white/10">Mégse</button>
          <button onClick={() => { if (delId) deleteMut.mutate(delId); setDelId(null); }} className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700">Törlés</button>
        </DialogFooter>
      </Dialog>
      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogHeader>Csapat szerkesztése</DialogHeader>
        <DialogContent>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-white/80">Név</label>
              <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-white/80">Ország</label>
                <input value={editForm.country} onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" />
              </div>
              <div>
                <label className="block mb-1 text-white/80">Alapítás</label>
                <input value={editForm.founded} onChange={(e) => setEditForm((f) => ({ ...f, founded: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-white/80">Stadion</label>
                <input value={editForm.stadium} onChange={(e) => setEditForm((f) => ({ ...f, stadium: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" />
              </div>
              <div>
                <label className="block mb-1 text-white/80">Logó URL</label>
                <input value={editForm.logoUrl} onChange={(e) => setEditForm((f) => ({ ...f, logoUrl: e.target.value }))} className="w-full rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/60" />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <button onClick={() => setEdit(null)} className="px-3 py-1.5 rounded border border-white/20 hover:bg-white/10">Mégse</button>
          <button onClick={() => { if (edit) updateMut.mutate({ id: edit.id, name: editForm.name, country: editForm.country, stadium: editForm.stadium || undefined, logoUrl: editForm.logoUrl || undefined, founded: Number(editForm.founded) || undefined }); setEdit(null); }} className="px-3 py-1.5 rounded bg-white text-gray-900 hover:bg-white/90">Mentés</button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}


