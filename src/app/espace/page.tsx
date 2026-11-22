import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function Espace() {
  // Fail closed: the private workspace never renders public application content.
  if(!isSupabaseConfigured()) redirect("/login?error=setup");
  const {role}=await requireRole();
  redirect(role==="trainer"?"/espace/formateur":"/espace/apprenant");
}
