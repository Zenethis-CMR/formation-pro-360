import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const flow = request.nextUrl.searchParams.get("flow");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL("/login?error=setup", origin));
  if (!code) return NextResponse.redirect(new URL("/login?error=callback", origin));
  const supabase = await createClient();
  const {error} = await supabase.auth.exchangeCodeForSession(code);
  const destination = error ? "/login?error=callback" : flow==="recovery" ? "/auth/nouveau-mot-de-passe" : "/espace";
  return NextResponse.redirect(new URL(destination, origin));
}
