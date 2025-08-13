'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { formatTimeHM } from '@/utils/date';
import { Skeleton } from '@/components/ui/skeleton';

async function fetchUpcoming() {
  const res = await fetch('/api/upcoming-matches', { cache: 'no-store' });
  if (!res.ok) return [] as Array<{ id: number; homeTeam: string; awayTeam: string; time: string }>;
  return res.json();
}

function isKnownTime(input: string) {
  if (!input) return false;
  try {
    const d = new Date(input);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const hm = `${hh}:${mm}`;
    return hm !== '00:00' && hm !== '02:00';
  } catch { return false; }
}

function formatTime(input: string) {
  if (!input) return 'TBA';
  try {
    const d = new Date(input);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const hm = `${hh}:${mm}`;
    // Heurisztika: ha 00:00 vagy 02:00 (UTC-ből csúsztatott), tekintsük TBA-nak
    if (hm === '00:00' || hm === '02:00') return 'TBA';
    return `${hh}:${mm}`;
  } catch { return 'TBA'; }
}

function groupByDate<T extends { id: number; home: string; away: string; time: string }>(items: Array<T>) {
  const map = new Map<string, Array<T>>();
  for (const it of items) {
    const key = (it.time || '').slice(0, 10) || 'Ismeretlen dátum';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  const groups = Array.from(map.entries()).map(([label, matches]) => ({ label, matches }));
  groups.sort((a, b) => a.label.localeCompare(b.label));
  return groups;
}

function SocialFeedCard() {
  const [text, setText] = React.useState('');
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const sentinelRef = React.useRef<HTMLLIElement | null>(null);
  type Post = { id: number; name: string; handle: string; text: string; time: string; media?: boolean; replies?: Array<{ id: number; name: string; text: string }>; open?: boolean };
  const [posts, setPosts] = React.useState<Post[]>([]);
  function submitPost() {
    if (!text.trim()) return;
    setPosts((p) => [{ id: Date.now(), name: 'Te', handle: '@you', text: text.trim(), time: 'most' }, ...p]);
    setText('');
  }
  async function loadMore() {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 300));
    setHasMore(false);
    setLoadingMore(false);
  }
  React.useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !loadingMore) {
          loadMore();
        }
      }
    }, { root: null, rootMargin: '200px' });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [loadingMore, hasMore]);
  return (
    <div className="rounded-2xl p-0 overflow-hidden bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white border border-white/10 shadow">
      <div className="px-5 py-4 font-semibold">Közösség</div>
      <div className="px-5 pt-4 pb-2 border-t border-white/10">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0" aria-hidden />
          <div className="flex-1">
            <label htmlFor="composer" className="sr-only">Új bejegyzés</label>
            <textarea id="composer" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Mi újság?" className="w-full resize-none rounded-lg border border-white/30 bg-white/90 text-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60 placeholder-black/50" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-white/80">{text.length}/280</span>
              <button onClick={submitPost} disabled={!text.trim()} className="px-3 py-1.5 text-sm rounded-md bg-white/90 text-gray-900 disabled:opacity-50 hover:bg-white transition-colors">Küldés</button>
            </div>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-white/10 max-h-[900px] overflow-auto">
        {posts.map((p) => (
          <li key={p.id} className="px-5 py-4 flex gap-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold truncate">{p.name}</span>
                <span className="text-white/80 truncate">{p.handle} · {p.time}</span>
              </div>
              <p className="mt-1 text-sm text-white/95 whitespace-pre-wrap">{p.text}</p>
              {p.media && (
                <div className="mt-2 rounded-lg h-40 bg-white/10 border border-white/10" />
              )}
              {p.open && p.replies && (
                <ul className="mt-2 space-y-2">
                  {p.replies.map((r) => (
                    <li key={r.id} className="flex gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-white/20 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-white/90">{r.text}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
        {hasMore && <li className="px-5 py-4" ref={sentinelRef} />}
      </ul>
      <div className="px-5 py-3 border-t border-white/10">
        <button onClick={loadMore} disabled={loadingMore} className="w-full text-sm rounded-md border border-white/30 px-3 py-2 hover:bg-white/10 disabled:opacity-50">
          {loadingMore ? 'Töltés…' : 'Továbbiak betöltése'}
        </button>
      </div>
    </div>
  );
}

function MatchesCard() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['upcoming-matches'], queryFn: fetchUpcoming, staleTime: 60_000, gcTime: 10 * 60_000 });
  const router = useRouter();
  const search = useSearchParams();
  const initial = (search.get('league') || 'ALL') as 'ALL' | 'TOP' | string;
  const [filter, setFilter] = React.useState<'ALL' | 'TOP' | string>(initial);
  React.useEffect(() => {
    const current = (search.get('league') || 'ALL') as 'ALL' | 'TOP' | string;
    if (current !== filter) setFilter(current);
  }, [search]);
  function updateFilter(next: 'ALL' | 'TOP' | string) {
    setFilter(next);
    const params = new URLSearchParams(search.toString());
    if (next === 'ALL') params.delete('league');
    else params.set('league', next);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  }
  type UpcomingItem = { id: number; homeTeam: string; awayTeam: string; time: string; league?: string; leagueId?: number | null; leagueCountry?: string; homeLogo?: string | null; awayLogo?: string | null; leagueLogo?: string | null };
  const items = (Array.isArray(data) ? (data as UpcomingItem[]) : []).map((m) => ({ id: m.id, home: m.homeTeam, away: m.awayTeam, time: m.time, league: m.league || 'NB I', leagueId: m.leagueId ?? null, leagueCountry: m.leagueCountry || '', homeLogo: m.homeLogo ?? null, awayLogo: m.awayLogo ?? null, leagueLogo: m.leagueLogo ?? null }));
  const allLeagues = Array.from(new Set(items.map((i) => i.league))).sort();
  const topLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'NB I'];
  const filtered = items.filter((i) => {
    if (filter === 'ALL') return true;
    if (filter === 'TOP') return topLeagues.includes(i.league);
    return i.league === filter;
  });
  // const groups = groupByDate(filtered);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(30);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
        setVisibleCount((c) => Math.min(c + 30, filtered.length));
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [filtered.length]);
  const paged = filtered.slice(0, visibleCount);
  const pagedGroups = groupByDate(paged);
  return (
    <div ref={containerRef} className="text-sm text-white max-h-[900px] overflow-auto">
      {isLoading ? (
        <ul className="space-y-3 p-5">
          {[...Array(8)].map((_, i) => (
            <li key={i} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="text-sm text-red-300 p-5 flex items-center justify-between">
          <span>Nem sikerült betölteni a közelgő meccseket.</span>
          <button className="px-2 py-1 text-xs rounded border border-white/20 hover:bg-white/10" onClick={() => refetch()}>Újra</button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 p-5 pt-4">
            <button onClick={() => updateFilter('ALL')} className={`px-2 py-1 rounded border ${filter==='ALL' ? 'bg-white/15 border-white/30' : 'border-white/20 hover:bg-white/10'}`}>Minden</button>
            <button onClick={() => updateFilter('TOP')} className={`px-2 py-1 rounded border ${filter==='TOP' ? 'bg-white/15 border-white/30' : 'border-white/20 hover:bg-white/10'}`}>Top ligák</button>
            {allLeagues.map((lg) => (
              <button key={lg} onClick={() => updateFilter(lg)} className={`px-2 py-1 rounded border ${filter===lg ? 'bg-white/15 border-white/30' : 'border-white/20 hover:bg-white/10'}`}>{lg}</button>
            ))}
          </div>
          {pagedGroups.map((g) => (
            <div key={g.label} className="mb-4">
              <LeagueDayHeader dateLabel={g.label} count={g.matches.length} />
              <ul className="divide-y divide-white/10">
                {Object.entries(
                  g.matches.reduce((acc: Record<string, typeof g.matches>, m) => {
                    (acc[m.league] ||= []).push(m);
                    return acc;
                  }, {})
                ).map(([league, arr]) => (
                  <li key={league} className="py-1">
                     <LeagueHeader league={league} items={arr} />
                     <ul className="divide-y divide-white/10">
                      {arr.map((m) => (
                        <li key={m.id} className="px-1 py-3 hover:bg-white/5 transition-colors rounded">
                          <a href={`/matches/${m.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {m.homeLogo ? (
                                <img src={m.homeLogo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#44008a] to-[#7a00e0] flex-shrink-0" aria-hidden />
                              )}
                              <div className="min-w-0">
                                <div className="truncate font-medium text-white">{m.home} vs {m.away}</div>
                                <div className="text-xs text-white/80 truncate flex items-center gap-2">
                                  {m.leagueLogo && <img src={m.leagueLogo} alt="" className="w-4 h-4 rounded object-cover" />}
                                  <span>{m.league}{m.leagueCountry ? ` • ${m.leagueCountry}` : ''}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-1 rounded border border-white/20 text-white">{formatTime(m.time)}</span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function LeagueDayHeader({ dateLabel, count }: { dateLabel: string; count: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-5 px-5 py-2 bg-[#0b0019]/70 backdrop-blur border-b border-white/10 font-semibold flex items-center justify-between sm:top-0 top-0">
      <span>{dateLabel} • {count} meccs</span>
      <div className="flex items-center gap-2 text-xs" />
    </div>
  );
}

function LeagueHeader({ league, items }: { league: string; items: Array<{ time: string }> }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const next = React.useMemo(() => {
    const future = items.map(i => new Date(i.time).getTime()).filter(ts => ts > now).sort((a,b) => a-b)[0];
    if (!future) return null;
    const ms = future - now;
    const hh = String(Math.floor(ms / 3_600_000)).padStart(2, '0');
    const mm = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, '0');
    const ss = String(Math.floor((ms % 60_000) / 1000)).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }, [items, now]);
  return (
    <div className="sticky sm:top-8 top-10 z-10 -mx-5 px-5 py-1 bg-[#0b0019]/60 backdrop-blur border-b border-white/10 flex items-center gap-2 text-xs">
      <span className="font-semibold">{league}</span>
      {next && <span className="ml-auto text-white/70">Következő kezdésig: {next}</span>}
    </div>
  );
}

function MatchOfTheDayCard() {
  const { data: upcoming } = useQuery({ queryKey: ['upcoming-matches'], queryFn: fetchUpcoming });
  type UpcomingItem = { id: number; homeTeamId?: number | null; awayTeamId?: number | null; homeTeam?: string; awayTeam?: string; homeLogo?: string | null; awayLogo?: string | null; leagueLogo?: string | null; league?: string; leagueId?: number | null; time?: string };
  const priority = [
    // strongest
    'Premier League', 'La Liga',
    // medium
    'Bundesliga', 'Serie A', 'Serie A TIM',
    // remaining as requested
    'NB I', 'Ligue 1',
  ];
  const list = (Array.isArray(upcoming) ? (upcoming as UpcomingItem[]) : []).filter(m => {
    if (!m?.leagueId || !m?.time) return false;
    const dt = new Date(m.time).getTime();
    const nowTs = Date.now();
    const maxWindow = nowTs + 24 * 60 * 60 * 1000; // 24h előre
    return dt >= nowTs && dt <= maxWindow;
  });
  list.sort((a, b) => {
    const ia = priority.indexOf(a.league || '');
    const ib = priority.indexOf(b.league || '');
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    if (ra !== rb) return ra - rb;
    // earlier kickoff first
    return new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime();
  });
  const pick = list[0];
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const eta = React.useMemo(() => {
    if (!pick?.time) return null;
    const ms = new Date(pick.time).getTime() - now;
    if (Number.isNaN(ms)) return null;
    const sign = ms >= 0 ? 1 : -1;
    const abs = Math.abs(ms);
    const hh = String(Math.floor(abs / 3_600_000)).padStart(2, '0');
    const mm = String(Math.floor((abs % 3_600_000) / 60_000)).padStart(2, '0');
    const ss = String(Math.floor((abs % 60_000) / 1000)).padStart(2, '0');
    return `${sign < 0 ? '-' : ''}${hh}:${mm}:${ss}`;
  }, [pick?.time, now]);
  const [standings, setStandings] = React.useState<Array<{ position: number; teamId: number; teamName: string }> | null>(null);
  React.useEffect(() => {
    async function load() {
      if (!pick?.leagueId) { setStandings(null); return; }
      try {
        const res = await fetch(`/api/leagues/${pick.leagueId}/standings`, { cache: 'no-store' });
        if (!res.ok) { setStandings(null); return; }
        const rows = await res.json();
        setStandings(Array.isArray(rows) ? rows : null);
      } catch { setStandings(null); }
    }
    load();
  }, [pick?.leagueId]);
  const homePos = React.useMemo(() => standings?.find((r) => r.teamName === pick?.homeTeam)?.position ?? null, [standings, pick?.homeTeam]);
  const awayPos = React.useMemo(() => standings?.find((r) => r.teamName === pick?.awayTeam)?.position ?? null, [standings, pick?.awayTeam]);
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#44008a] via-[#5a00b3] to-[#7a00e0] text-white shadow-lg border border-white/10">
      <div className="px-6 py-4 text-xs uppercase tracking-wider font-semibold/loose bg-white/10 backdrop-blur">A nap rangadója</div>
      <div className="p-6 lg:p-8">
        {!pick ? (
          <div className="text-sm">Nem elérhető jelenleg.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex items-center gap-3">
                {pick.homeLogo ? <img src={pick.homeLogo} alt="" className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 rounded-full bg-white/20" />}
                <div>
                  <div className="text-xl font-semibold">{pick.homeTeam}</div>
                  <div className="text-white/80 text-xs">Hazai</div>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-extrabold tracking-wide drop-shadow-sm inline-flex items-center justify-center px-3 py-1 rounded`}>
                  vs
                </div>
                <div className="mt-1 text-white/90 text-sm">
                  Kezdés: {formatTime(pick.time || '')}
                </div>
                {eta && (
                  <div className="mt-1 text-white/80 text-xs">Visszaszámláló: {eta}</div>
                )}
              </div>
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <div className="text-xl font-semibold">{pick.awayTeam}</div>
                  <div className="text-white/80 text-xs">Vendég</div>
                </div>
                {pick.awayLogo ? <img src={pick.awayLogo} alt="" className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 rounded-full bg-white/20" />}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold mb-2">Form (utolsó 5) — {pick.homeTeam}{homePos ? <span className="text-white/70 font-normal"> • {homePos}. hely</span> : null}</div>
                <TeamFormBar teamId={pick.homeTeamId ?? null} teamName={pick.homeTeam || ''} align="left" />
              </div>
              <div>
                <div className="text-sm font-semibold mb-2 text-right">{pick.awayTeam}{awayPos ? <span className="text-white/70 font-normal"> • {awayPos}. hely</span> : null} — Form (utolsó 5)</div>
                <TeamFormBar teamId={pick.awayTeamId ?? null} teamName={pick.awayTeam || ''} align="right" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamFormBar({ teamId, teamName, align }: { teamId: number | null; teamName: string; align: 'left' | 'right' }) {
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams', { cache: 'no-store' });
      if (!res.ok) return [] as Array<{ id: number; name: string }>;
      return res.json();
    },
    enabled: !teamId,
  });
  const team = teamId ? { id: teamId, name: teamName } : (Array.isArray(teams) ? teams as Array<{ id: number; name: string }> : []).find(t => t.name === teamName);
  const { data: form } = useQuery({
    queryKey: ['team-form', team && (team as { id: number }).id],
    enabled: Boolean(team && (team as { id: number }).id),
    queryFn: async () => {
      const res = await fetch(`/api/teams/${(team as { id: number }).id}/form`, { cache: 'no-store' });
      if (!res.ok) return [] as Array<{ id: number; result: 'W'|'D'|'L' }>;
      return res.json();
    }
  });
  const arr = (Array.isArray(form) ? form as Array<{ id: number; result: 'W'|'D'|'L'; opponent?: string; gf?: number; ga?: number; date?: string }> : []);
  const display = arr.slice(0,5);
  const sums = display.reduce((acc, m) => { acc.gf += m.gf ?? 0; acc.ga += m.ga ?? 0; return acc; }, { gf: 0, ga: 0 });
  return (
    <div>
      <ul className={`flex ${align==='right' ? 'justify-end' : ''} gap-1`}>
        {display.map((m, i) => {
          const label = m.result === 'W' ? 'GY' : m.result === 'D' ? 'D' : 'V';
          const color = m.result==='W' ? 'bg-emerald-400 text-emerald-950' : m.result==='D' ? 'bg-yellow-400 text-yellow-950' : 'bg-rose-400 text-rose-50';
          return (
            <li key={i}>
              <a href={`/matches/${m.id}`} className={`grid place-items-center w-7 h-7 rounded-full ${color} text-[10px] font-bold`} aria-label={`Meccs ${i+1}`}>
                {label}
              </a>
            </li>
          );
        })}
        {display.length < 5 && [...Array(5 - display.length)].map((_, i) => <li key={`p-${i}`} className="w-7 h-7 rounded-full bg-white/20" />)}
      </ul>
      <div className={`mt-1 text-xs text-white/80 ${align==='right' ? 'text-right' : ''}`}>Utolsó 5: rúgott {sums.gf}, kapott {sums.ga}</div>
    </div>
  );
}

export function WidgetGrid() {
  return (
    <div className="space-y-6">
      {/* Felső stat csempék eltávolítva (mock) */}
      <MatchOfTheDayCard />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl p-0 overflow-hidden bg-[#0b0019]/30 text-white border border-white/10 shadow">
          <div className="px-5 py-4 font-semibold border-b border-white/10">Közelgő meccsek</div>
          <div className="p-0">
            <MatchesCard />
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <SocialFeedCard />
        </div>
      </div>
    </div>
  );
}


