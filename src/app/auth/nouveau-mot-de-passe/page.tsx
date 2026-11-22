import Link from "next/link";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { AuthPasswordField } from "@/components/auth-password-field";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { updateAccountPassword } from "@/app/auth/actions";

type Params={error?:string;success?:string};
export default async function RecoverPassword({searchParams}:{searchParams:Promise<Params>}){
  await requireRole();
  const params=await searchParams;
  return <main className="page auth-recovery-page">
    <section className="panel auth-recovery-panel">
      <span className="journey-overline"><KeyRound size={15}/> RÉCUPÉRATION SÉCURISÉE</span>
      <h1>Créer un nouveau mot de passe.</h1>
      <p className="muted">Ton identité vient d'être vérifiée par Supabase. Choisis maintenant un mot de passe pour retrouver ton compte existant.</p>
      {params.success?<div className="auth-new-feedback success"><CheckCircle2 size={17}/> Le mot de passe a été mis à jour. <Link href="/espace">Accéder à mon espace</Link></div>:<>
        {params.error&&<p className="auth-new-feedback danger" role="alert">{params.error==="mismatch"?"Les deux mots de passe ne correspondent pas.":params.error==="password"?"Utilise au moins 10 caractères, une majuscule, une minuscule et un chiffre.":"La mise à jour a échoué. Réessaie."}</p>}
        <form className="auth-new-form" action={updateAccountPassword}>
          <input type="hidden" name="source" value="recovery"/>
          <AuthPasswordField name="password" label="Nouveau mot de passe" autoComplete="new-password"/>
          <p className="auth-password-rule">10 caractères minimum, une majuscule, une minuscule et un chiffre.</p>
          <AuthPasswordField name="confirmPassword" label="Confirmer le mot de passe" autoComplete="new-password" confirm/>
          <AuthSubmitButton label="Enregistrer et sécuriser mon compte" pendingLabel="Enregistrement…"/>
        </form>
      </>}
      <p className="auth-new-legal"><ShieldCheck size={15}/> Tes missions, XP et badges sont conservés.</p>
    </section>
  </main>;
}
