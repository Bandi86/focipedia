import { NextResponse } from "next/server";
import { COOKIE_ACCESS, COOKIE_REFRESH, isProd } from "@/config/constants";

export async function POST() {
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set(COOKIE_ACCESS, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  resp.cookies.set(COOKIE_REFRESH, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return resp;
}

export async function DELETE() {
  const resp = new NextResponse(null, { status: 204 });
  resp.cookies.set(COOKIE_ACCESS, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  resp.cookies.set(COOKIE_REFRESH, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return resp;
}


