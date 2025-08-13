import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.indexOf('teams');
  const idStr = parts[idx + 1];
  const id = parseInt(idStr, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Bad team id' }, { status: 400 });
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/teams/${id}/form`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


