import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const redirectToLogin = (destination: string) =>
    NextResponse.redirect(new URL(destination, publicOrigin));
  if (!token) return redirectToLogin("/login?mode=inscription&error=verification");
  const api = process.env.FORMATION_API_INTERNAL_URL || "http://10.0.0.42:3000";
  const result = await fetch(`${api}/v1/auth/verify-email`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }), cache: "no-store"
  }).catch(() => null);
  const destination = result?.ok
    ? "/login?mode=connexion&sent=verified"
    : "/login?mode=inscription&error=verification";
  return redirectToLogin(destination);
}
