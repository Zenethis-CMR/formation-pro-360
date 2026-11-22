import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  // The application no longer uses Supabase Auth. Account links are handled
  // by the Node API through /auth/verify and /auth/nouveau-mot-de-passe.
  return NextResponse.redirect(new URL("/login?error=callback", origin));
}
