"use server";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login?error=setup");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/login?error=email");
  }
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const {error} = await supabase.auth.signInWithOtp({
    email,
    options: {emailRedirectTo: new URL("/auth/callback", origin).toString()}
  });
  if (error) redirect("/login?error=send");
  redirect("/login?sent=1");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
