import { sendMagicLink } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Params = { sent?: string; error?: string };
export default async function Login({searchParams}: {searchParams: Promise<Params>}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  return <main className="page">
    <section className="panel" style={{maxWidth:520, margin:"40px auto"}}>
      <span className="eyebrow">ACCÈS SÉCURISÉ</span><h1 style={{fontSize:36,marginTop:15}}>Se connecter</h1>
      <p className="muted">Un lien de connexion à usage unique sera envoyé à ton adresse e-mail.</p>
      {!configured ? <p className="alert danger">La base Supabase n’est pas encore configurée. Cet espace n’est pas disponible.</p> : <>
        {params.sent && <p className="alert success">Vérifie ta boîte mail. Si l’adresse est autorisée, un lien de connexion y a été envoyé.</p>}
        {params.error && <p className="alert danger">La connexion n’a pas pu aboutir. Vérifie ton adresse ou demande un nouveau lien.</p>}
        <form className="form" action={sendMagicLink}>
          <label>Adresse e-mail<input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="adresse@exemple.com"/></label>
          <button className="primary-btn" type="submit">Recevoir mon lien de connexion</button>
        </form>
      </>}
      <p className="muted small-note">Les comptes formateurs sont attribués par un administrateur. Les nouveaux comptes sont apprenants par défaut.</p>
    </section>
  </main>;
}
