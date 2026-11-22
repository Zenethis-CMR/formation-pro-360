import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth/backend";

export type AppRole = "learner" | "trainer";
export async function requireRole(expected?: AppRole) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const {data: profile, error: profileError} = await supabase
    .from("profiles").select("id,role").eq("id",user.id).single();
  if (profileError || !profile) redirect("/login?error=profile");
  const role = profile.role as AppRole;
  if (expected && role !== expected) redirect("/espace?error=role");
  return {supabase, user, role};
}
