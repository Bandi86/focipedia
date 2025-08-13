import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/config/env";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  isProd,
  ACCESS_TOKEN_MAX_AGE_S,
  REFRESH_TOKEN_MAX_AGE_S,
} from "@/config/constants";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(COOKIE_REFRESH)?.value;
  if (!refreshToken) return NextResponse.json({ error: "No refresh" }, { status: 401 });
  const res = await fetch(`${serverEnv.BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const resp = NextResponse.json({ ok: true });
  resp.cookies.set(COOKIE_ACCESS, data.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_S,
  });
  resp.cookies.set(COOKIE_REFRESH, data.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_S,
  });
  return resp;
}


