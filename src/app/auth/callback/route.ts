import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL("/login?error=setup", origin));
  if (!code) return NextResponse.redirect(new URL("/login?error=callback", origin));
  const supabase = await createClient();
  const {error} = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/login?error=callback" : "/espace", origin));
}
