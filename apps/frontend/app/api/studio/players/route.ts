import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/players`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Optional: resolve teamName -> teamId if only name provided
    type CreatePlayerPayload = {
      name: string;
      nationality: string;
      position: string;
      teamId?: number;
      teamName?: string;
    };
    const payload: CreatePlayerPayload = { ...body };
    if (!payload.teamId && payload.teamName) {
      const teamsRes = await fetch(`${serverEnv.BACKEND_URL}/teams?name=${encodeURIComponent(payload.teamName)}`);
      if (teamsRes.ok) {
        const teams = (await teamsRes.json()) as Array<{ id: number; name: string }>;
        const match = Array.isArray(teams) ? teams.find((t) => (t.name || '').toLowerCase() === payload.teamName!.toLowerCase()) : null;
        if (match) payload.teamId = match.id;
      }
      delete payload.teamName;
    }
    const res = await fetch(`${serverEnv.BACKEND_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.json({ error: 'failed' }, { status: res.status });
    const created = await res.json();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}


