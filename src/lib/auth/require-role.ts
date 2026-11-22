import { cache } from "react";
import { redirect } from "next/navigation";
import { createDatabaseClient } from "@/lib/database/server";
import { currentUser } from "@/lib/auth/backend";

export type AppRole = "learner" | "trainer";

/** Once per request: avoid re-checking the same profile in nested layouts/pages. */
const resolvedRole = cache(async () => {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await createDatabaseClient();
  const { data: profile, error: profileError } = await db
    .from("profiles").select("id,role").eq("id",user.id).single();
  if (profileError || !profile || !["learner","trainer"].includes(profile.role)) {
    redirect("/login?error=profile");
  }
  return { db, user, role: profile.role as AppRole };
});

export async function requireRole(expected?: AppRole) {
  const context = await resolvedRole();
  if (expected && context.role !== expected) redirect("/espace?error=role");
  return context;
}
