import { NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/matches/upcoming`, { cache: 'no-store' });
    const data = await res.json();
    type UpcomingMatchDto = {
      id: number;
      homeTeam?: { name?: string; logoUrl?: string } | null;
      awayTeam?: { name?: string; logoUrl?: string } | null;
      league?: { id?: number; name?: string; logoUrl?: string } | null;
      competition?: { name?: string } | null;
      homeTeamId?: number | string;
      awayTeamId?: number | string;
      matchDate?: string;
    };
    const mapped = (Array.isArray(data) ? (data as UpcomingMatchDto[]) : []).slice(0, 20).map((m) => ({
      id: m.id,
      homeTeamId: typeof m.homeTeamId === 'string' ? Number(m.homeTeamId) : (m.homeTeamId ?? null),
      awayTeamId: typeof m.awayTeamId === 'string' ? Number(m.awayTeamId) : (m.awayTeamId ?? null),
      homeTeam: m.homeTeam?.name || m.homeTeamId,
      awayTeam: m.awayTeam?.name || m.awayTeamId,
      time: m.matchDate || '',
      league: m.league?.name || m.competition?.name || 'NB I',
      leagueId: m.league?.id ?? null,
      leagueCountry: (m as unknown as { league?: { country?: string } }).league?.country ?? '',
      homeLogo: m.homeTeam?.logoUrl || null,
      awayLogo: m.awayTeam?.logoUrl || null,
      leagueLogo: m.league?.logoUrl || null,
    }));
    return NextResponse.json(mapped, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


