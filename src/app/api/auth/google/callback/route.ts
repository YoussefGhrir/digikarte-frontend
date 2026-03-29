import { getServerBackendBase } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect("https://www.digi-karte.com/login");
  }

  const backendUrl = new URL(`${getServerBackendBase()}/api/auth/google/callback`);
  backendUrl.searchParams.set("code", code);
  if (state) {
    backendUrl.searchParams.set("state", state);
  }

  return NextResponse.redirect(backendUrl.toString());
}

