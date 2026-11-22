import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isBackendConfigured } from "@/lib/database/server";

export default async function Espace() {
  // Fail closed: the private workspace never renders public application content.
  if(!isBackendConfigured()) redirect("/login?error=setup");
  const {role}=await requireRole();
  redirect(role==="trainer"?"/espace/formateur":"/espace/apprenant");
}
