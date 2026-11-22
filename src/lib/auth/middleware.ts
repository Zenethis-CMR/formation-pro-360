import { type NextRequest, NextResponse } from "next/server";

/**
 * Cheap first-pass routing only: no duplicate network call to CT420.
 * Actual session verification, PostgREST RLS and role checks occur in
 * the server-rendered /espace layout and every server action.
 * An arbitrary/expired cookie never authorizes access.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/espace")) return NextResponse.next({ request });
  if (!request.cookies.get("fp360_session")?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next({ request });
}
