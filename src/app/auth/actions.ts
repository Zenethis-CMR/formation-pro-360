"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { isValidEmail, isValidPassword } from "@/lib/auth/validation";

// This is the only public site URL. Never send a customer to a Vercel preview.
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://formation-pro-360.vercel.app";
const callbackUrl = (flow?: "signup" | "recovery") =>
  new URL(flow ? "/auth/callback?flow="+flow : "/auth/callback",siteOrigin).toString();

export async function signInWithPassword(formData:FormData) {
  if(!isSupabaseConfigured()) redirect("/login?error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  if(!isValidEmail(email)||!password||password.length>128) redirect("/login?error=credentials");
  const supabase=await createClient();
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error) {
    if(error.status===429) redirect("/login?error=quota");
    if(error.code==="email_not_confirmed") redirect("/login?error=confirm");
    redirect("/login?error=credentials");
  }
  revalidatePath("/espace");
  redirect("/espace");
}

export async function registerLearner(formData:FormData) {
  if(!isSupabaseConfigured()) redirect("/login?mode=inscription&error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  if(!isValidEmail(email)) redirect("/login?mode=inscription&error=email");
  if(!isValidPassword(password)) redirect("/login?mode=inscription&error=password");
  if(password!==confirm) redirect("/login?mode=inscription&error=mismatch");
  const supabase=await createClient();
  // A single identity is maintained by Supabase Auth (email uniquely identifies
  // the account); the existing profiles trigger assigns only *new* users learner.
  const {data,error}=await supabase.auth.signUp({
    email,password,options:{emailRedirectTo:callbackUrl("signup")}
  });
  if(error) {
    if(error.status===429||error.code==="over_email_send_rate_limit") redirect("/login?mode=inscription&error=quota");
    if(error.code==="weak_password") redirect("/login?mode=inscription&error=password");
    if(error.code==="email_address_not_authorized") redirect("/login?mode=inscription&error=unauthorized");
    // Do not reveal whether this email already belongs to a registered learner.
    if(error.code==="user_already_exists"||error.code==="email_exists") redirect("/login?mode=inscription&sent=signup");
    redirect("/login?mode=inscription&error=signup");
  }
  if(data.session) redirect("/espace/bienvenue");
  redirect("/login?mode=inscription&sent=signup");
}

export async function sendMagicLink(formData:FormData) {
  if(!isSupabaseConfigured()) redirect("/login?mode=lien&error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  if(!isValidEmail(email)) redirect("/login?mode=lien&error=email");
  const supabase=await createClient();
  const {error}=await supabase.auth.signInWithOtp({
    email,
    // Important: a login attempt must never create a second learner account.
    options:{shouldCreateUser:false,emailRedirectTo:callbackUrl()}
  });
  if(error) {
    if(error.code==="over_email_send_rate_limit"||error.status===429) redirect("/login?mode=lien&error=quota");
    if(error.code==="email_address_not_authorized") redirect("/login?mode=lien&error=unauthorized");
    redirect("/login?mode=lien&error=send");
  }
  redirect("/login?mode=lien&sent=link");
}

export async function requestPasswordReset(formData:FormData) {
  if(!isSupabaseConfigured()) redirect("/login?mode=recuperation&error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  if(!isValidEmail(email)) redirect("/login?mode=recuperation&error=email");
  const supabase=await createClient();
  const {error}=await supabase.auth.resetPasswordForEmail(email,{
    redirectTo:callbackUrl("recovery")
  });
  if(error?.status===429||error?.code==="over_email_send_rate_limit") {
    redirect("/login?mode=recuperation&error=quota");
  }
  if(error) redirect("/login?mode=recuperation&error=recovery");
  // Same response for unknown emails. No account enumeration.
  redirect("/login?mode=recuperation&sent=reset");
}

export async function updateAccountPassword(formData:FormData) {
  const {supabase}=await requireRole();
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  const destination=String(formData.get("source"))==="recovery"
    ? "/auth/nouveau-mot-de-passe" : "/espace/compte";
  if(!isValidPassword(password)) redirect(destination+"?error=password");
  if(password!==confirm) redirect(destination+"?error=mismatch");
  const {error}=await supabase.auth.updateUser({password});
  if(error) redirect(destination+"?error=update");
  revalidatePath("/espace");
  redirect(destination+"?success=1");
}

export async function signOut() {
  if(isSupabaseConfigured()) {
    const supabase=await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
