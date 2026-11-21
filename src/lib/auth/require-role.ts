import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "learner" | "trainer";
export async function requireRole(expected?: AppRole) {
  const supabase = await createClient();
  // getUser verifies the session with the Supabase Auth server.
  const {data: {user}, error} = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  const {data: profile, error: profileError} = await supabase
    .from("profiles").select("id,role").eq("id",user.id).single();
  if (profileError || !profile) redirect("/login?error=profile");
  const role = profile.role as AppRole;
  if (expected && role !== expected) redirect("/espace?error=role");
  return {supabase, user, role};
}
