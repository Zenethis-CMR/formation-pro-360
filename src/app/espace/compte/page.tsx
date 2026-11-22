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
        <p className="auth-account-note"><ShieldCheck size={16}/> Tes livrables, validations, XP et badges restent rattachés au même compte.</p>
        {role==="learner"&&<Link href="/espace/bienvenue" className="auth-preferences-link">
          <GraduationCap size={17}/><span>Personnaliser mon parcours pédagogique</span><ArrowRight size={16}/>
        </Link>}
      </section>
      <section className="workshop-panel auth-account-card">
        <span className="journey-overline"><LockKeyhole size={15}/> IDENTIFIANTS</span>
        <h2>Modifier mon mot de passe</h2>
        <p className="muted">Pour modifier ton mot de passe, saisis ton mot de passe actuel. Si ton compte a été créé avec un lien par e-mail et que tu n’as pas encore de mot de passe, utilise <Link href="/login?mode=recuperation">la récupération par e-mail</Link> pour en définir un sans créer de nouveau profil.</p>
        {params.success&&<p className="auth-new-feedback success" role="status"><CheckCircle2 size={17}/> Ton mot de passe a été enregistré. Tu pourras l'utiliser lors de ta prochaine connexion.</p>}
        {params.error&&<p className="auth-new-feedback danger" role="alert">{params.error==="mismatch"?"Les mots de passe ne correspondent pas.":params.error==="password"?"Utilise 12 caractères minimum.":params.error==="current"?"Le mot de passe actuel est incorrect ou manquant.":"Le mot de passe n'a pas pu être enregistré. Réessaie."}</p>}
        <form className="auth-new-form" action={updateAccountPassword}>
          <AuthPasswordField name="currentPassword" label="Mot de passe actuel" autoComplete="current-password"/>
          <AuthPasswordField name="password" label="Nouveau mot de passe" autoComplete="new-password"/>
          <p className="auth-password-rule">12 caractères minimum.</p>
          <AuthPasswordField name="confirmPassword" label="Confirmer le nouveau mot de passe" autoComplete="new-password" confirm/>
          <AuthSubmitButton label="Enregistrer mon mot de passe" pendingLabel="Enregistrement…"/>
        </form>
      </section>
    </div>
  </main>;
}
