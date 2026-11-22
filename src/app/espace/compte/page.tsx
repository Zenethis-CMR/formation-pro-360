import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { AuthPasswordField } from "@/components/auth-password-field";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { GraduationCap, ArrowRight } from "lucide-react";
import { updateAccountPassword } from "@/app/auth/actions";

type Params={error?:string;success?:string};
export default async function AccountPage({searchParams}:{searchParams:Promise<Params>}){
  const {user,role}=await requireRole();
  const params=await searchParams;
  return <main className="page auth-account-page">
    <Link href="/espace" className="workshop-back"><ArrowLeft size={15}/> Retour à mon espace</Link>
    <div className="auth-account-intro"><span className="journey-overline"><ShieldCheck size={15}/> SÉCURITÉ DU COMPTE</span>
      <h1>Mon compte <span>Formation Pro 360.</span></h1>
      <p>Retrouve tes informations de connexion et définis un mot de passe. Cette action ne crée aucun nouveau profil et ne modifie pas ta progression.</p>
    </div>
    <div className="auth-account-layout">
      <section className="workshop-panel auth-account-card">
        <span className="journey-overline"><UserRound size={15}/> IDENTITÉ</span>
        <h2>Informations personnelles</h2>
        <div className="auth-account-detail"><span>Adresse e-mail</span><strong>{user.email||"Non renseignée"}</strong></div>
        <div className="auth-account-detail"><span>Type de compte</span><strong>{role==="trainer"?"Formateur":"Apprenant"}</strong></div>
        <p className="auth-account-note"><ShieldCheck size={16}/> Tes livrables, validations, XP et badges restent rattachés au même compte Supabase.</p>
      </section>
      <section className="workshop-panel auth-account-card">
        <span className="journey-overline"><LockKeyhole size={15}/> IDENTIFIANTS</span>
        <h2>Définir ou modifier mon mot de passe</h2>
        <p className="muted">Pour les comptes créés avec un lien par e-mail, tu peux maintenant choisir un mot de passe sans te réinscrire.</p>
        {params.success&&<p className="auth-new-feedback success" role="status"><CheckCircle2 size={17}/> Ton mot de passe a été enregistré. Tu pourras l'utiliser lors de ta prochaine connexion.</p>}
        {params.error&&<p className="auth-new-feedback danger" role="alert">{params.error==="mismatch"?"Les mots de passe ne correspondent pas.":params.error==="password"?"Utilise 10 caractères minimum, une majuscule, une minuscule et un chiffre.":"Le mot de passe n'a pas pu être enregistré. Réessaie."}</p>}
        <form className="auth-new-form" action={updateAccountPassword}>
          <AuthPasswordField name="password" label="Nouveau mot de passe" autoComplete="new-password"/>
          <p className="auth-password-rule">10 caractères minimum, une majuscule, une minuscule et un chiffre.</p>
          <AuthPasswordField name="confirmPassword" label="Confirmer le nouveau mot de passe" autoComplete="new-password" confirm/>
          <AuthSubmitButton label="Enregistrer mon mot de passe" pendingLabel="Enregistrement…"/>
        </form>
      </section>
    </div>
  </main>;
}
