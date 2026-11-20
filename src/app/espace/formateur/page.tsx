import { redirect } from "next/navigation";
import { createMission, reviewMission } from "@/app/espace/actions";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Params={error?:string;success?:string};
type Submission={id:string;mission_id:string;learner_id:string;url:string;note:string;created_at:string};
type Mission={id:string;title:string;domain:string;xp:number;published:boolean};
export default async function TrainerSpace({searchParams}:{searchParams:Promise<Params>}) {
  if(!isSupabaseConfigured()) redirect("/espace");
  const {supabase} = await requireRole("trainer");
  const params=await searchParams;
  const [{data:submissions,error:se},{data:missions,error:me}] = await Promise.all([
    supabase.from("submissions").select("id,mission_id,learner_id,url,note,created_at").eq("status","pending").order("created_at"),
    supabase.from("missions").select("id,title,domain,xp,published").order("week")
  ]);
  if(se||me)return <main className="page"><p className="alert danger">Erreur de chargement. Vérifie les migrations SQL et les droits du compte.</p></main>;
  const pending=(submissions||[]) as Submission[], catalog=(missions||[]) as Mission[];
  const byId = new Map(catalog.map(m=>[m.id,m]));
  return <main className="page">
    <section className="page-hero"><div><span className="eyebrow">ESPACE FORMATEUR · AUTORISATION VÉRIFIÉE</span>
      <h1>Évaluer pour <span>faire progresser.</span></h1><p>Les évaluations sont enregistrées dans PostgreSQL ; les XP sont attribués par une opération sécurisée et contrôlée.</p></div></section>
    <div className="stats-grid"><div className="stat-card"><span>SOUMISSIONS EN ATTENTE</span><strong>{pending.length}</strong></div>
      <div className="stat-card"><span>MISSIONS PUBLIÉES</span><strong>{catalog.filter(m=>m.published).length}</strong></div>
      <div className="stat-card"><span>MISSIONS EN BROUILLON</span><strong>{catalog.filter(m=>!m.published).length}</strong></div></div>
    {params.success && <p className="alert success">Modification enregistrée dans la base de données.</p>}
    {params.error && <p className="alert danger">Échec de l’opération. Vérifie les champs ou les droits d’accès.</p>}
    <section className="panel"><div className="section-head"><h2>Soumissions à évaluer</h2><span className="counter">{pending.length} en attente</span></div>
      {!pending.length ? <div className="empty-state"><h3>Aucune soumission en attente</h3><p>Les livrables apparaîtront ici lorsqu’un apprenant les déposera.</p></div>
      :<div className="review-list">{pending.map(s=><article className="review-card" key={s.id}>
        <div><span className="week">MISSION · {byId.get(s.mission_id)?.domain}</span><h3>{byId.get(s.mission_id)?.title||"Mission"}</h3>
          <p className="muted">Apprenant : {s.learner_id.slice(0,8)}…</p><p className="muted">{s.note}</p>
          <a href={s.url} className="external-link" target="_blank" rel="noopener noreferrer">Consulter le livrable ↗</a></div>
        <form action={reviewMission} className="form">
          <input type="hidden" name="submissionId" value={s.id}/>
          <label>Note /100<input type="number" name="score" required min={0} max={100} step={1}/></label>
          <label>Commentaire pédagogique<textarea name="feedback" minLength={3} maxLength={1500} required rows={3}/></label>
          <button type="submit" className="primary-btn">Enregistrer la correction</button>
          <p className="muted">À partir de 80/100, la mission est validée et les XP sont attribués une seule fois.</p>
        </form>
      </article>)}</div>}
    </section>
    <section className="panel" style={{maxWidth:660}}><span className="eyebrow">PROGRAMME</span><h2>Créer une mission</h2>
      <p className="muted">La mission est créée comme brouillon. Sa publication et ses prérequis seront gérés dans une prochaine étape.</p>
      <form action={createMission} className="form">
        <label>Titre<input name="title" required minLength={3} maxLength={110}/></label>
        <label>Domaine<input name="domain" required minLength={2} maxLength={80} defaultValue="Développement web"/></label>
        <label>Description<textarea name="description" required minLength={10} maxLength={1500} rows={3}/></label>
        <label>Livrable attendu<input name="deliverable" required minLength={3} maxLength={500}/></label>
        <div className="field-row"><label>Semaine<input name="week" type="number" required defaultValue={1} min={1} max={52}/></label>
          <label>XP<input name="xp" type="number" required defaultValue={100} min={10} max={1000}/></label></div>
        <button className="primary-btn" type="submit">Enregistrer comme brouillon</button>
      </form>
    </section>
  </main>;
}
