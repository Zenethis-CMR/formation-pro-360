"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isBackendConfigured } from "@/lib/database/server";
import { requireRole } from "@/lib/auth/require-role";
import { isValidEmail, isValidPassword } from "@/lib/auth/validation";
import { authApi, authCookieName, backendRequest, setBackendSession } from "@/lib/auth/backend";
import { cookies } from "next/headers";

export async function signInWithPassword(formData:FormData) {
  if(!isBackendConfigured()) redirect("/login?error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  if(!isValidEmail(email)||!password||password.length>128) redirect("/login?error=credentials");
  const response = await backendRequest(`${authApi}/login`, {method:"POST", body:JSON.stringify({email,password})}).catch(()=>null);
  if(!response?.ok) {
    if(response?.status===429) redirect("/login?error=quota");
    if(response?.status===403) redirect("/login?error=confirm");
    redirect("/login?error=credentials");
  }
  await setBackendSession(response);
  revalidatePath("/espace");
  redirect("/espace");
}

export async function registerLearner(formData:FormData) {
  if(!isBackendConfigured()) redirect("/login?mode=inscription&error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  if(!isValidEmail(email)) redirect("/login?mode=inscription&error=email");
  if(!isValidPassword(password)) redirect("/login?mode=inscription&error=password");
  if(password!==confirm) redirect("/login?mode=inscription&error=mismatch");
  const response = await backendRequest(`${authApi}/register`, {method:"POST", body:JSON.stringify({email,password})}).catch(()=>null);
  if(!response?.ok) {
    if(response?.status===429) redirect("/login?mode=inscription&error=quota");
    if(response?.status===409) redirect("/login?mode=inscription&error=exists");
    redirect("/login?mode=inscription&error=signup");
  }
  redirect("/login?mode=inscription&sent=signup");
}

export async function requestPasswordReset(formData:FormData) {
  if(!isBackendConfigured()) redirect("/login?mode=recuperation&error=setup");
  const email=String(formData.get("email")||"").trim().toLowerCase();
  if(!isValidEmail(email)) redirect("/login?mode=recuperation&error=email");
  const response=await backendRequest(`${authApi}/request-password-reset`,{method:"POST",body:JSON.stringify({email})}).catch(()=>null);
  if(!response?.ok) redirect("/login?mode=recuperation&error=recovery");
  // Same response for unknown emails. No account enumeration.
  redirect("/login?mode=recuperation&sent=reset");
}

export async function updateAccountPassword(formData:FormData) {
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  const destination=String(formData.get("source"))==="recovery"
    ? "/auth/nouveau-mot-de-passe" : "/espace/compte";
  if(!isValidPassword(password)) redirect(destination+"?error=password");
  if(password!==confirm) redirect(destination+"?error=mismatch");
  const token=String(formData.get("token")||"");
  const route=token?"reset-password":"change-password";
  const response=await backendRequest(`${authApi}/${route}`,{
    method:"POST",body:JSON.stringify(token?{token,password}:{password})
  }).catch(()=>null);
  if(!response?.ok) redirect(destination+"?error=update");
  if(!token) await requireRole();
  revalidatePath("/espace");
  redirect(destination+"?success=1");
}

export async function signOut() {
  await backendRequest(`${authApi}/logout`,{method:"POST"}).catch(()=>null);
  (await cookies()).delete(authCookieName);
  redirect("/login");
}
