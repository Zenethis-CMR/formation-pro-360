import Link from "next/link";
import "./onboarding-auth.css";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpenCheck, CheckCircle2, Code2, GraduationCap, LockKeyhole, MailCheck, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { registerLearner, requestPasswordReset, resendVerificationEmail, signInWithPassword } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { AuthPasswordField } from "@/components/auth-password-field";
import { isBackendConfigured } from "@/lib/database/server";

type Mode="connexion"|"inscription"|"recuperation";
type Params={mode?:string;sent?:string;error?:string;verification?:string};
const messages:Record<string,string>={
  setup:"La connexion est momentanément indisponible. Contacte le responsable de la plateforme.",
  email:"Entre une adresse e-mail valide pour continuer.",
  credentials:"Adresse e-mail ou mot de passe incorrect. Si tu ne connais pas ton mot de passe, demande une réinitialisation.",
  confirm:"Confirme d'abord ton adresse depuis le message reçu, puis réessaie.",
  password:"Choisis entre 12 et 128 caractères, avec une majuscule, une minuscule et un chiffre.",
  mismatch:"Les deux mots de passe ne correspondent pas.",
  quota:"Trop de tentatives ou d'e-mails demandés. Patiente avant de réessayer.",
  unauthorized:"L'envoi vers cette adresse a été refusé. Contacte ton formateur.",
  signup:"Impossible de créer le compte pour le moment. Vérifie les informations et réessaie.",
  exists:"Cette adresse possède déjà un compte. Connecte-toi ou réinitialise son mot de passe.",
  verification:"Ce lien de confirmation est invalide ou a expiré. Demande une nouvelle confirmation.",
  verification_unavailable:"La vérification est temporairement indisponible. Réessaie avec le lien reçu quand le service sera rétabli, ou demande un nouveau lien.",
  recovery:"Impossible d'envoyer les instructions de récupération pour le moment.",
  resend:"Le renvoi n'a pas abouti. Réessaie dans quelques instants.",
  callback:"Le lien est invalide ou expiré. Demande un nouveau lien depuis cette page."
};
const confirmations:Record<string,string>={
  signup:"Compte créé ! Un message de vérification a été envoyé. Confirme ton adresse avant de te connecter.",
  verified:"Adresse e-mail confirmée ! Connecte-toi maintenant pour commencer ta formation.",
  resend:"Si cette adresse correspond à un compte en attente, un nouveau lien va arriver. Pense aussi à vérifier les spams.",
  reset:"Si un compte correspond à cette adresse, les instructions de récupération ont été envoyées."
};

export default async function Login({searchParams}:{searchParams:Promise<Params>}) {
  const params=await searchParams;
  const mode:Mode=(["connexion","inscription","recuperation"].includes(params.mode||"")
    ? params.mode as Mode : "connexion");
  const configured=isBackendConfigured();
  const creating=mode==="inscription";
  const needsConfirmation=mode!=="recuperation"&&(params.verification==="1"||params.sent==="signup"||params.sent==="resend"
    ||params.error==="confirm"||params.error==="verification"||params.error==="verification_unavailable");
  const title=needsConfirmation?"Vérifie ton adresse e-mail"
    :params.sent==="verified"?"Ton compte est prêt !"
    :mode==="connexion"?"Bienvenue à nouveau"
    :creating?"Commence ton parcours"
    :"Retrouve ton accès";
  return <main className={"auth-new-page onboarding-auth"+(needsConfirmation?" auth-confirmation-mode":"")}>
    <div className="auth-new-container">
      <aside className="auth-new-story">
        <div className="auth-story-top"><div className="auth-story-logo"><GraduationCap size={23}/></div><span>Formation <strong>Pro 360</strong></span></div>
        <span className="auth-story-eyebrow"><Sparkles size={15}/> APPRENDRE. CONSTRUIRE. PROGRESSER.</span>
        <h1>Développe des compétences qui <em>prennent vie.</em></h1>
        <p className="auth-story-lead">Un projet fil rouge, des séances pratiques avec ton formateur et des réalisations concrètes à chaque étape.</p>
        <div className="auth-story-milestones">
          <div><span><Code2 size={19}/></span><div><strong>16 ateliers, 8 semaines</strong><small>Un parcours structuré autour de vrais livrables.</small></div></div>
          <div><span><BookOpenCheck size={19}/></span><div><strong>La pratique d'abord</strong><small>Construis, teste, améliore et publie tes projets.</small></div></div>
          <div><span><BadgeCheck size={19}/></span><div><strong>Des acquis vérifiés</strong><small>Des preuves et des XP après validation du formateur.</small></div></div>
        </div>
        <Link href="/catalogue" className="auth-story-catalog-link"><BookOpenCheck size={17}/> Découvrir les 7 formations <ArrowLeft size={14}/></Link>
        <div className="auth-story-footer"><ShieldCheck size={17}/> Tes progrès sont enregistrés et protégés dans ton espace personnel.</div>
        <div className="auth-story-orb auth-story-orb-one"/><div className="auth-story-orb auth-story-orb-two"/>
      </aside>
      <section className="auth-new-form-side">
        <div className="auth-new-intro"><span className="auth-form-kicker"><ShieldCheck size={15}/> ESPACE SÉCURISÉ</span>
          <h2>{title}</h2>
          <p>{needsConfirmation?"Confirme ton adresse avant de commencer ta formation."
            :creating?"Crée ton compte apprenant pour accéder aux ateliers et suivre tes progrès."
            :mode==="connexion"?"Retrouve tes missions et reprends exactement là où tu t'étais arrêté."
            :"Nous t'enverrons un lien pour définir un nouveau mot de passe."}</p>
        </div>
        {!needsConfirmation&&(mode==="connexion"||mode==="inscription")&&<nav className="auth-mode-tabs" aria-label="Connexion ou inscription">
          <Link href="/login?mode=connexion" className={mode==="connexion"?"active":""} aria-current={mode==="connexion"?"page":undefined}><LockKeyhole size={16}/> Connexion</Link>
          <Link href="/login?mode=inscription" className={mode==="inscription"?"active":""} aria-current={creating?"page":undefined}><UserPlus size={16}/> Inscription</Link>
        </nav>}
        {mode==="recuperation"&&<Link href="/login" className="auth-back-link"><ArrowLeft size={15}/> Retour à la connexion</Link>}
        {!configured&&<p className="alert danger" role="alert">La connexion est momentanément indisponible.</p>}
        {params.sent&&confirmations[params.sent]&&<p className="auth-new-feedback success" role="status"><CheckCircle2 size={18}/>{confirmations[params.sent]}</p>}
        {params.sent==="verified"&&<p className="auth-verified-next" role="status"><CheckCircle2 size={18}/>
          <span>Étape 1 terminée : connecte-toi, choisis ton objectif (facultatif), puis découvre les 16 ateliers.</span>
        </p>}
        {params.error&&<p className="auth-new-feedback danger" role="alert">{messages[params.error]||"Une erreur est survenue. Réessaie plus tard."}</p>}
        {configured&&<>
          {mode==="connexion"&&!needsConfirmation&&<form action={signInWithPassword} className="auth-new-form">
            <label htmlFor="login-email">Adresse e-mail</label>
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthPasswordField name="password" label="Mot de passe" autoComplete="current-password"/>
            <div className="auth-forgot-row"><Link href="/login?mode=recuperation">Mot de passe oublié ?</Link></div>
            <AuthSubmitButton label="Se connecter à mon espace" pendingLabel="Connexion en cours…"/>
          </form>}
          {mode==="inscription"&&!needsConfirmation&&<form action={registerLearner} className="auth-new-form">
            <label htmlFor="signup-email">Adresse e-mail</label>
            <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthPasswordField name="password" label="Créer un mot de passe" autoComplete="new-password"/>
            <p className="auth-password-rule">12 caractères minimum, avec une majuscule, une minuscule et un chiffre.</p>
            <AuthPasswordField name="confirmPassword" label="Confirmer le mot de passe" autoComplete="new-password" confirm/>
            <AuthSubmitButton label="Créer mon compte apprenant" pendingLabel="Création du compte…"/>
            <p className="auth-new-legal">Après ton inscription, vérifie ta boîte de réception et les spams. Les rôles formateurs sont attribués uniquement par l'administration.</p>
          </form>}
          {mode==="recuperation"&&<form action={requestPasswordReset} className="auth-new-form">
            <label htmlFor="reset-email">Adresse e-mail du compte</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.com" maxLength={254} required/>
            <AuthSubmitButton label="Recevoir le lien de récupération" pendingLabel="Envoi en cours…"/>
            <p className="auth-new-legal">Si un compte correspond à cette adresse, tu recevras les instructions pour choisir un nouveau mot de passe.</p>
          </form>}
          {needsConfirmation&&<section className="auth-verification-journey" aria-label="Étapes de création du compte">
            <div className="auth-mail-visual"><MailCheck size={34} strokeWidth={1.6}/></div><p><MailCheck size={20}/> Ouvre le message de vérification, confirme ton adresse, puis connecte-toi pour commencer.</p>
            <ol className="auth-signup-steps">
              <li>{params.sent==="signup"||params.error==="confirm"?<><CheckCircle2 size={16}/> Compte créé</>:<>1 · Demande de confirmation</>}</li>
              <li className="is-current"><MailCheck size={16}/> Confirmer l'e-mail reçu</li>
              <li><BookOpenCheck size={16}/> Se connecter et découvrir les ateliers</li>
            </ol>
            <Link href="/login?mode=connexion" className="auth-verification-next">
              J'ai confirmé mon adresse : me connecter <ArrowRight size={16}/>
            </Link>
            <details className="auth-verification-retry" open={params.verification==="1"&&!!params.error}>
              <summary>Je n'ai pas reçu le message de confirmation</summary>
              <form action={resendVerificationEmail} className="auth-new-form">
                <label htmlFor="resend-verification-email">Adresse e-mail utilisée à l'inscription</label>
                <input id="resend-verification-email" name="email" type="email" autoComplete="email"
                  placeholder="prenom@exemple.com" maxLength={254} required/>
                <input type="hidden" name="mode" value={mode}/>
                <AuthSubmitButton label="Renvoyer le lien" pendingLabel="Envoi en cours…"/>
                <p className="auth-new-legal">Vérifie aussi les spams. Le lien expire après 24 heures.</p>
              </form>
            </details>
          </section>}
        </>}
        <div className="auth-new-bottom"><span><ShieldCheck size={15}/> Authentification sécurisée</span><span>Accès réservé aux membres inscrits</span></div>
      </section>
    </div>
  </main>;
}
