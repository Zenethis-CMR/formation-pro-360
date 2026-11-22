import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/login?mode=inscription&error=verification", request.url));
  const api = process.env.FORMATION_API_INTERNAL_URL || "http://10.0.0.42:3000";
  const result = await fetch(`${api}/v1/auth/verify-email`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }), cache: "no-store"
  }).catch(() => null);
  const destination = result?.ok
    ? "/login?mode=connexion&sent=verified"
    : "/login?mode=inscription&error=verification";
  return NextResponse.redirect(new URL(destination, request.url));
}
