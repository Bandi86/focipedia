import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId');
    if (!matchId) return NextResponse.json({ error: 'missing matchId' }, { status: 400 });
    const res = await fetch(`${serverEnv.BACKEND_URL}/odds?matchId=${encodeURIComponent(matchId)}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


