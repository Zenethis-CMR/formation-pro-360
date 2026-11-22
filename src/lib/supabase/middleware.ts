import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/espace")) return NextResponse.next({request});
  const token = request.cookies.get("fp360_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  const api = process.env.FORMATION_API_INTERNAL_URL || "http://10.0.0.42:4100";
  const result = await fetch(`${api}/v1/auth/me`, {
    headers: { cookie: `fp360_session=${token}` }, cache: "no-store"
  }).catch(() => null);
  if (!result?.ok) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next({request});
}
