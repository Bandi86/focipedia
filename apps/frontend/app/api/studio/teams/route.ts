import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/teams`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${serverEnv.BACKEND_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const out = await res.json();
    return NextResponse.json(out, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const { id: _, ...rest } = body;
    const res = await fetch(`${serverEnv.BACKEND_URL}/teams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });
    const out = await res.json();
    return NextResponse.json(out, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const res = await fetch(`${serverEnv.BACKEND_URL}/teams/${id}`, { method: 'DELETE' });
    return NextResponse.json({ ok: res.ok }, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}


