import { sendMagicLink } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { SendLoginEmailButton } from "@/components/send-login-email-button";

type Params = { sent?: string; error?: string };
export default async function Login({searchParams}: {searchParams: Promise<Params>}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  return <main className="page">
    <section className="panel" style={{maxWidth:520, margin:"40px auto"}}>
      <span className="eyebrow">ACCÈS SÉCURISÉ</span><h1 style={{fontSize:36,marginTop:15}}>Se connecter</h1>
      <p className="muted">Entre ton adresse e-mail. Un lien de connexion à usage unique te sera envoyé si l’envoi est autorisé.</p>
      {!configured ? <p className="alert danger">La base Supabase n’est pas encore configurée. Cet espace n’est pas disponible.</p> : <>
        {params.sent && <p className="alert success">Vérifie ta boîte mail. Si l’adresse est autorisée, un lien de connexion y a été envoyé.</p>}
        {params.error && <p className="alert danger" role="alert">
          {params.error==="quota"?"Trop de demandes d’e-mails en peu de temps. Patiente avant de recommencer, puis vérifie ta boîte de réception et tes courriers indésirables.":params.error==="unauthorized"?"Le service d’envoi a refusé cette adresse. Contacte ton formateur afin de vérifier la configuration de la messagerie.":"La connexion n’a pas pu aboutir. Vérifie ton adresse puis réessaie plus tard."}
        </p>}
        <form className="form" action={sendMagicLink}>
          <label>Adresse e-mail<input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="adresse@exemple.com"/></label>
          <SendLoginEmailButton/>
        </form>
      </>}
      <p className="muted small-note">N’envoie pas plusieurs demandes successives : chaque envoi consomme le quota du projet. Vérifie aussi les courriers indésirables. Les nouveaux comptes sont apprenants par défaut.</p>
    </section>
  </main>;
}
