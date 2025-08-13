import { NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/leagues`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


