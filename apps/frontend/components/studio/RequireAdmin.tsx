'use client';
import { useQuery } from '@tanstack/react-query';

type MeResponse = { userId: number; email: string; role: 'USER' | 'ADMIN' } | null;
async function me(): Promise<MeResponse> {
  let res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
  if (res.status === 401) {
    // try refresh then retry once
    await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' }).catch(() => {});
    res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
  }
  if (!res.ok) return null;
  return res.json();
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: me,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });
  if (isLoading) return <div className="rounded-2xl p-4 bg-[#0b0019]/30 border border-white/10 text-white">Betöltés…</div>;
  const role = (data as MeResponse | null)?.role || null;
  if (!role || String(role).toUpperCase() !== 'ADMIN') {
    return <div className="rounded-2xl p-4 bg-[#0b0019]/30 border border-white/10 text-white">Nincs jogosultság.</div>;
  }
  return <>{children}</>;
}


