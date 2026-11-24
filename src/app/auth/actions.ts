"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isBackendConfigured } from "@/lib/database/server";
import { requireRole } from "@/lib/auth/require-role";
import { isValidEmail, isValidPassword } from "@/lib/auth/validation";
import { authApi, authCookieName, backendRequest, setBackendSession } from "@/lib/auth/backend";
import { cookies } from "next/headers";
import {publicCourseChoice,withCourseChoice,publicChoiceCookie} from "@/lib/public-course-choice";

async function preserveChoice(formData:FormData){
 const choice=publicCourseChoice(formData.get("parcours"));
 const jar=await cookies();
 if(choice)jar.set(publicChoiceCookie,choice,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24});
 else jar.delete(publicChoiceCookie);
 return (path:string)=>withCourseChoice(path,choice);
}

export async function signInWithPassword(formData:FormData) {
  const destination=await preserveChoice(formData);
  if(!isBackendConfigured()) redirect(destination("/login?error=setup"));
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  if(!isValidEmail(email)||!password||password.length>128) redirect(destination("/login?error=credentials"));
  const response = await backendRequest(`${authApi}/login`, {method:"POST", body:JSON.stringify({email,password})}).catch(()=>null);
  if(!response?.ok) {
    if(!response||response.status>=500) redirect(destination("/login?error=setup"));
    if(response.status===429) redirect(destination("/login?error=quota"));
    if(response?.status===403) redirect(destination("/login?error=confirm"));
    redirect(destination("/login?error=credentials"));
  }
  await setBackendSession(response);
  revalidatePath("/espace");
  (await cookies()).delete(publicChoiceCookie);
  redirect(destination("/espace"));
}

export async function registerLearner(formData:FormData) {
  const destination=await preserveChoice(formData);
  if(!isBackendConfigured()) redirect(destination("/login?mode=inscription&error=setup"));
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  if(!isValidEmail(email)) redirect(destination("/login?mode=inscription&error=email"));
  if(!isValidPassword(password)) redirect(destination("/login?mode=inscription&error=password"));
  if(password!==confirm) redirect(destination("/login?mode=inscription&error=mismatch"));
  const response = await backendRequest(`${authApi}/register`, {method:"POST", body:JSON.stringify({email,password})}).catch(()=>null);
  if(!response?.ok) {
    if(response?.status===429) redirect(destination("/login?mode=inscription&error=quota"));
    if(response?.status===409) redirect(destination("/login?mode=inscription&error=exists"));
    redirect(destination("/login?mode=inscription&error=signup"));
  }
  redirect(destination("/login?mode=inscription&sent=signup"));
}

export async function resendVerificationEmail(formData:FormData) {
  const destination=await preserveChoice(formData);
  if(!isBackendConfigured()) redirect(destination("/login?mode=inscription&verification=1&error=setup"));
  const email=String(formData.get("email")||"").trim().toLowerCase();
  const mode=String(formData.get("mode")||"")==="connexion"?"connexion":"inscription";
  if(!isValidEmail(email)) redirect(destination(`/login?mode=${mode}&verification=1&error=email`));
  const response=await backendRequest(`${authApi}/resend-verification`,{
    method:"POST",body:JSON.stringify({email})
  }).catch(()=>null);
  if(!response?.ok) {
    if(response?.status===429) redirect(destination(`/login?mode=${mode}&verification=1&error=quota`));
    redirect(destination(`/login?mode=${mode}&verification=1&error=resend`));
  }
  redirect(destination(`/login?mode=${mode}&sent=resend`));
}

export async function requestPasswordReset(formData:FormData) {
  const destination=await preserveChoice(formData);
  if(!isBackendConfigured()) redirect(destination("/login?mode=recuperation&error=setup"));
  const email=String(formData.get("email")||"").trim().toLowerCase();
  if(!isValidEmail(email)) redirect(destination("/login?mode=recuperation&error=email"));
  const response=await backendRequest(`${authApi}/request-password-reset`,{method:"POST",body:JSON.stringify({email})}).catch(()=>null);
  if(!response?.ok) redirect(destination("/login?mode=recuperation&error=recovery"));
  // Same response for unknown emails. No account enumeration.
  redirect(destination("/login?mode=recuperation&sent=reset"));
}

export async function updateAccountPassword(formData:FormData) {
  const password=String(formData.get("password")||"");
  const confirm=String(formData.get("confirmPassword")||"");
  const destination=String(formData.get("source"))==="recovery"
    ? "/auth/nouveau-mot-de-passe" : "/espace/compte";
  if(!isValidPassword(password)) redirect(destination+"?error=password");
  if(password!==confirm) redirect(destination+"?error=mismatch");
  const token=String(formData.get("token")||"");
  const currentPassword=String(formData.get("currentPassword")||"");
  const route=token?"reset-password":"change-password";
  if(!token){
    await requireRole();
    if(!currentPassword||currentPassword.length>128) redirect("/espace/compte?error=current");
  }
  const response=await backendRequest(`${authApi}/${route}`,{
    method:"POST",body:JSON.stringify(token?{token,password}:{currentPassword,password})
  }).catch(()=>null);
  if(!response?.ok) {
    if(!token&&response?.status===401) redirect("/espace/compte?error=current");
    redirect(destination+"?error=update");
  }
  revalidatePath("/espace");
  redirect(destination+"?success=1");
}

export async function signOut() {
  await backendRequest(`${authApi}/logout`,{method:"POST"}).catch(()=>null);
  (await cookies()).delete(authCookieName);
  (await cookies()).delete(publicChoiceCookie);
  redirect("/login");
}
