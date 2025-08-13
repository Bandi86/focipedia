import { NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/matches/live`, { cache: 'no-store' });
    const data = await res.json();
    type MatchDto = {
      id: number;
      homeTeam?: { name?: string; logoUrl?: string } | null;
      awayTeam?: { name?: string; logoUrl?: string } | null;
      league?: { name?: string; logoUrl?: string } | null;
      competition?: { name?: string } | null;
      minute?: number | string | null;
      homeTeamId?: number | string;
      awayTeamId?: number | string;
      score?: { home?: number; away?: number } | null;
      homeScore?: number | null;
      awayScore?: number | null;
    };
    const mapped = (Array.isArray(data) ? (data as MatchDto[]) : []).slice(0, 8).map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam?.name || m.homeTeamId,
      awayTeam: m.awayTeam?.name || m.awayTeamId,
      minute: m.minute ?? '—',
      league: m.league?.name || m.competition?.name || 'NB I',
      homeLogo: m.homeTeam?.logoUrl || null,
      awayLogo: m.awayTeam?.logoUrl || null,
      leagueLogo: m.league?.logoUrl || null,
      homeScore: typeof m.homeScore === 'number' ? m.homeScore : (m.score?.home ?? null),
      awayScore: typeof m.awayScore === 'number' ? m.awayScore : (m.score?.away ?? null),
    }));
    return NextResponse.json(mapped, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


