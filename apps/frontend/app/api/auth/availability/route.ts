import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const email = params.get('email');
  const name = params.get('name');
  const username = params.get('username');
  const qs = new URLSearchParams();
  if (email) qs.set('email', email);
  if (name) qs.set('name', name);
  if (username) qs.set('username', username);
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/auth/availability?${qs.toString()}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ emailTaken: false, nameTaken: false }, { status: 200 });
  }
}


