import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpenCheck, CheckCircle2, Code2, GraduationCap, LockKeyhole, Mail, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { registerLearner, requestPasswordReset, sendMagicLink, signInWithPassword } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { AuthPasswordField } from "@/components/auth-password-field";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Mode="connexion"|"inscription"|"lien"|"recuperation";
type Params={mode?:string;sent?:string;error?:string};
const messages:Record<string,string>={
  setup:"La connexion est momentanément indisponible. Contacte le responsable de la plateforme.",
  email:"Entre une adresse e-mail valide pour continuer.",
  credentials:"Adresse e-mail ou mot de passe incorrect. Si tu utilisais un lien de connexion auparavant, choisis « Connexion par e-mail ».",
  confirm:"Confirme d'abord ton adresse depuis le message reçu, puis réessaie.",
  password:"Choisis au moins 10 caractères, avec une majuscule, une minuscule et un chiffre.",
  mismatch:"Les deux mots de passe ne correspondent pas.",
  quota:"Trop de tentatives ou d'e-mails demandés. Patiente avant de réessayer.",
  unauthorized:"L'envoi vers cette adresse a été refusé. Contacte ton formateur.",
  signup:"Impossible de créer le compte pour le moment. Vérifie les informations et réessaie.",
  send:"Impossible d'envoyer le lien de connexion. Réessaie plus tard.",
  recovery:"Impossible d'envoyer les instructions de récupération pour le moment.",
  callback:"Le lien est invalide ou expiré. Demande un nouveau lien depuis cette page."
};
const confirmations:Record<string,string>={
  signup:"Vérifie ta boîte e-mail pour confirmer ton inscription. Si tu possèdes déjà un compte, utilise la connexion ou récupère ton accès.",
  link:"Si cette adresse correspond à un compte, un lien de connexion a été demandé. Vérifie aussi les courriers indésirables.",
  reset:"Si un compte correspond à cette adresse, les instructions de récupération ont été envoyées."
};

export default async function Login({searchParams}:{searchParams:Promise<Params>}) {
  const params=await searchParams;
  const mode:Mode=(["connexion","inscription","lien","recuperation"].includes(params.mode||"")
    ? params.mode as Mode : "connexion");
  const configured=isSupabaseConfigured();
  const creating=mode==="inscription";
  const title=mode==="connexion"?"Bienvenue à nouveau"
    :creating?"Commence ton parcours"
    :mode==="lien"?"Connecte-toi par e-mail":"Retrouve ton accès";
  return <main className="auth-new-page">
    <div className="auth-new-container">
      <aside className="auth-new-story">
        <div className="auth-story-top"><div className="auth-story-logo"><GraduationCap size={23}/></div><span>Formation <strong>Pro 360</strong></span></div>
        <span className="auth-story-eyebrow"><Sparkles size={15}/> APPRENDRE. CONSTRUIRE. PROGRESSER.</span>
        <h1>Développe des compétences qui <em>prennent vie.</em></h1>
        <p className="auth-story-lead">Un environnement d'apprentissage où chaque mission mène à un projet concret, évalué par un véritable formateur.</p>
        <div className="auth-story-milestones">
          <div><span><Code2 size={19}/></span><div><strong>16 missions, 8 semaines</strong><small>Un parcours structuré autour de vrais livrables.</small></div></div>
          <div><span><BookOpenCheck size={19}/></span><div><strong>La pratique d'abord</strong><small>Construis, teste, améliore et publie tes projets.</small></div></div>
          <div><span><BadgeCheck size={19}/></span><div><strong>Des acquis vérifiés</strong><small>XP et badges après validation du formateur.</small></div></div>
        </div>
        <div className="auth-story-footer"><ShieldCheck size={17}/> Tes progrès sont enregistrés et protégés dans ton espace personnel.</div>
        <div className="auth-story-orb auth-story-orb-one"/><div className="auth-story-orb auth-story-orb-two"/>
      </aside>
      <section className="auth-new-form-side">
        <div className="auth-new-intro"><span className="auth-form-kicker"><ShieldCheck size={15}/> ESPACE SÉCURISÉ</span>
          <h2>{title}</h2>
          <p>{creating?"Crée ton compte apprenant pour accéder aux ateliers et suivre tes progrès."
            :mode==="connexion"?"Retrouve tes missions et reprends exactement là où tu t'étais arrêté."
            :mode==="lien"?"Déjà inscrit sans mot de passe ? Reçois un lien sécurisé et conserve ton compte existant."
            :"Nous t'enverrons un lien pour définir un nouveau mot de passe."}</p>
        </div>
        {(mode==="connexion"||mode==="inscription")&&<nav className="auth-mode-tabs" aria-label="Connexion ou inscription">
          <Link href="/login?mode=connexion" className={mode==="connexion"?"active":""} aria-current={mode==="connexion"?"page":undefined}><LockKeyhole size={16}/> Connexion</Link>
          <Link href="/login?mode=inscription" className={mode==="inscription"?"active":""} aria-current={creating?"page":undefined}><UserPlus size={16}/> Inscription</Link>
        </nav>}
        {(mode==="lien"||mode==="recuperation")&&<Link href="/login" className="auth-back-link"><ArrowLeft size={15}/> Retour à la connexion</Link>}
        {!configured&&<p className="alert danger" role="alert">La connexion est momentanément indisponible.</p>}
        {params.sent&&confirmations[params.sent]&&<p className="auth-new-feedback success" role="status"><CheckCircle2 size={18}/>{confirmations[params.sent]}</p>}
        {params.error&&<p className="auth-new-feedback danger" role="alert">{messages[params.error]||"Une erreur est survenue. Réessaie plus tard."}</p>}
        {configured&&<>
          {mode==="connexion"&&<form action={signInWithPassword} className="auth-new-form">
            <label htmlFor="login-email">Adresse e-mail</label>
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthPasswordField name="password" label="Mot de passe" autoComplete="current-password"/>
            <div className="auth-forgot-row"><Link href="/login?mode=recuperation">Mot de passe oublié ?</Link></div>
            <AuthSubmitButton label="Se connecter à mon espace" pendingLabel="Connexion en cours…"/>
          </form>}
          {mode==="inscription"&&<form action={registerLearner} className="auth-new-form">
            <label htmlFor="signup-email">Adresse e-mail</label>
            <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthPasswordField name="password" label="Créer un mot de passe" autoComplete="new-password"/>
            <p className="auth-password-rule">10 caractères minimum, avec une majuscule, une minuscule et un chiffre.</p>
            <AuthPasswordField name="confirmPassword" label="Confirmer le mot de passe" autoComplete="new-password" confirm/>
            <AuthSubmitButton label="Créer mon compte apprenant" pendingLabel="Création du compte…"/>
            <p className="auth-new-legal">Un e-mail de confirmation peut être nécessaire pour activer le compte. Les rôles formateurs sont attribués uniquement par l'administration.</p>
          </form>}
          {mode==="lien"&&<form action={sendMagicLink} className="auth-new-form">
            <label htmlFor="magic-email">Adresse de ton compte existant</label>
            <input id="magic-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthSubmitButton label="Recevoir mon lien sécurisé" pendingLabel="Envoi du lien…"/>
            <p className="auth-new-legal">Ton compte, tes missions et tes XP sont conservés. Après connexion, tu pourras définir un mot de passe dans « Mon compte ».</p>
          </form>}
          {mode==="recuperation"&&<form action={requestPasswordReset} className="auth-new-form">
            <label htmlFor="reset-email">Adresse e-mail du compte</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthSubmitButton label="Recevoir le lien de récupération" pendingLabel="Envoi en cours…"/>
            <p className="auth-new-legal">Si un compte correspond à cette adresse, tu recevras les instructions pour choisir un nouveau mot de passe.</p>
          </form>}
        </>}
        {(mode==="connexion"||mode==="inscription")&&<div className="auth-legacy">
          <div className="auth-legacy-icon"><Mail size={19}/></div>
          <div><strong>Déjà inscrit avec un lien par e-mail ?</strong><p>Continue d'utiliser ton compte existant sans créer de nouveau profil.</p>
            <Link href="/login?mode=lien">Connexion sans mot de passe <ArrowRight size={14}/></Link></div>
        </div>}
        <div className="auth-new-bottom"><span><ShieldCheck size={15}/> Authentification sécurisée avec Supabase</span><Link href="/">Voir la démonstration</Link></div>
      </section>
    </div>
  </main>;
}
