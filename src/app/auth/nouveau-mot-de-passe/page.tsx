import Link from "next/link";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { AuthPasswordField } from "@/components/auth-password-field";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { updateAccountPassword } from "@/app/auth/actions";

type Params={error?:string;success?:string;token?:string};
export default async function RecoverPassword({searchParams}:{searchParams:Promise<Params>}){
  const params=await searchParams;
  if(!params.token&&!params.success) await requireRole();
  return <main className="page auth-recovery-page">
    <section className="panel auth-recovery-panel">
      <span className="journey-overline"><KeyRound size={15}/> RÉCUPÉRATION SÉCURISÉE</span>
      <h1>Créer un nouveau mot de passe.</h1>
      <p className="muted">Choisis un nouveau mot de passe pour retrouver ton compte existant.</p>
      {params.success?<div className="auth-new-feedback success"><CheckCircle2 size={17}/> Le mot de passe a été mis à jour. <Link href="/espace">Accéder à mon espace</Link></div>:<>
        {params.error&&<p className="auth-new-feedback danger" role="alert">{params.error==="mismatch"?"Les deux mots de passe ne correspondent pas.":params.error==="password"?"Utilise au moins 12 caractères.":"La mise à jour a échoué. Réessaie."}</p>}
        <form className="auth-new-form" action={updateAccountPassword}>
          <input type="hidden" name="source" value="recovery"/>
          {params.token&&<input type="hidden" name="token" value={params.token}/>}
          <AuthPasswordField name="password" label="Nouveau mot de passe" autoComplete="new-password"/>
          <p className="auth-password-rule">12 caractères minimum.</p>
          <AuthPasswordField name="confirmPassword" label="Confirmer le mot de passe" autoComplete="new-password" confirm/>
          <AuthSubmitButton label="Enregistrer et sécuriser mon compte" pendingLabel="Enregistrement…"/>
        </form>
      </>}
      <p className="auth-new-legal"><ShieldCheck size={15}/> Tes missions, XP et badges sont conservés.</p>
    </section>
  </main>;
}
