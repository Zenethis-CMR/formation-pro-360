import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function Espace() {
  if (!isSupabaseConfigured()) {
    return <main className="page"><section className="panel"><h1>Configuration nécessaire</h1>
      <p className="muted">L’espace sécurisé sera disponible après connexion de Supabase et application des migrations SQL. Réessaie plus tard ou contacte le responsable de la plateforme.</p>
    </section></main>;
  }
  const {role} = await requireRole();
  redirect(role === "trainer" ? "/espace/formateur" : "/espace/apprenant");
}
