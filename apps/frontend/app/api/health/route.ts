import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env";

export async function GET() {
  try {
    const res = await fetch(`${serverEnv.BACKEND_URL}/health`, {
      // forward cookies if needed later
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}


