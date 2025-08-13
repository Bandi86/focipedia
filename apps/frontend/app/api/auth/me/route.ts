import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';
import { COOKIE_ACCESS } from '@/config/constants';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_ACCESS)?.value;
    if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const res = await fetch(`${serverEnv.BACKEND_URL}/auth/me`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}


