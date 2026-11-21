import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function Espace() {
  if (!isSupabaseConfigured()) {
    return <main className="page"><section className="panel"><h1>Configuration nécessaire</h1>
      <p className="muted">L’espace sécurisé sera disponible après connexion de Supabase et application des migrations SQL. La démonstration reste accessible depuis l’accueil.</p>
    </section></main>;
  }
  const {role} = await requireRole();
  redirect(role === "trainer" ? "/espace/formateur" : "/espace/apprenant");
}
