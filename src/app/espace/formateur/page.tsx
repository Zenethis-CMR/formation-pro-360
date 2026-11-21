import { redirect } from "next/navigation";
import Link from "next/link";
import { createMission, reviewMission, publishMission } from "@/app/espace/actions";
import { signOut } from "@/app/auth/actions";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { displayDomain } from "@/components/technology-badge";
import { CohortProgress } from "@/components/cohort-progress";
import { TrainingSchedule } from "@/components/training-schedule";
import { TrainerCoachingPanel } from "@/components/trainer-coaching-panel";
import { LaunchReadiness } from "@/components/launch-readiness";
import { learnerInsight, type CoachMessage } from "@/lib/coaching-insights";

type Params={error?:string;success?:string};
type Submission={id:string;mission_id:string;learner_id:string;url:string;note:string;created_at:string};
type Mission={id:string;title:string;domain:string;xp:number;published:boolean;week:number};
type MissionRubric={mission_id:string;rubric:string[]};
export default async function TrainerSpace({searchParams}:{searchParams:Promise<Params>}) {
  if(!isSupabaseConfigured()) redirect("/espace");
  const {supabase} = await requireRole("trainer");
  const params=await searchParams;
  const [{data:submissions,error:se},{data:missions,error:me},{data:learners,error:le},{data:awards,error:ae},{data:allSubmissions,error:allSe},{data:practice,error:pe},{data:guides,error:ge},{data:settings,error:settingsError},{data:deps,error:depsError},{data:steps,error:stepsError},{data:coachMessages,error:coachError},{data:badgeAwards,error:badgeAwardsError}] = await Promise.all([
    supabase.from("submissions").select("id,mission_id,learner_id,url,note,created_at").eq("status","pending").order("created_at"),
    supabase.from("missions").select("id,title,domain,xp,published,week").order("week"),
    supabase.from("profiles").select("id").eq("role","learner").order("created_at"),
    supabase.from("xp_ledger").select("learner_id,mission_id,xp"),
    supabase.from("submissions").select("learner_id,mission_id,status,created_at"),
    supabase.from("practice_checkins").select("learner_id,practice_date"),
    supabase.from("mission_guides").select("mission_id,rubric"),
    supabase.from("training_settings").select("start_date").eq("id",true).maybeSingle(),
    supabase.from("mission_prerequisites").select("mission_id,prerequisite_id"),
    supabase.from("workshop_steps").select("learner_id,mission_id,completed_at"),
    supabase.from("coach_messages").select("id,trainer_id,learner_id,body,created_at").order("created_at",{ascending:false}).limit(200),
    supabase.from("learner_badges").select("badge_slug")
  ]);
  if(se||me||le||ae||allSe||pe||ge||settingsError||depsError||stepsError||coachError||badgeAwardsError)return <main className="page"><p className="alert danger">Erreur de chargement. Vérifie les migrations SQL et les droits du compte.</p></main>;
  const pending=(submissions||[]) as Submission[], catalog=(missions||[]) as Mission[];
  const byId = new Map(catalog.map(m=>[m.id,m]));
  const rubricById = new Map(((guides||[]) as MissionRubric[]).map(g=>[g.mission_id,g.rubric]));
  const published=catalog.filter(m=>m.published);
  const insights=(learners||[]).map(l=>learnerInsight({
    learnerId:l.id,missions:published,
    deps:deps||[],awards:awards||[],submissions:allSubmissions||[],
    practices:practice||[],steps:steps||[],startDate:settings?.start_date??null
  }));
  return <main className="page">
    <section className="page-hero"><div><span className="eyebrow">ESPACE FORMATEUR · AUTORISATION VÉRIFIÉE</span>
      <h1>Évaluer pour <span>faire progresser.</span></h1><p>Les évaluations sont enregistrées dans PostgreSQL ; les XP sont attribués par une opération sécurisée et contrôlée.</p></div></section>
    <form action={signOut} style={{display:"flex",justifyContent:"flex-end"}}><button type="submit" className="text-btn">Se déconnecter</button></form>
    <div className="stats-grid"><div className="stat-card"><span>SOUMISSIONS EN ATTENTE</span><strong>{pending.length}</strong></div>
      <div className="stat-card"><span>MISSIONS PUBLIÉES</span><strong>{catalog.filter(m=>m.published).length}</strong></div>
      <div className="stat-card"><span>APPRENANTS INSCRITS</span><strong>{(learners||[]).length}</strong></div>
      <div className="stat-card"><span>XP ATTRIBUÉS</span><strong>{(awards||[]).reduce((sum,x)=>sum+Number(x.xp),0)}</strong></div></div>
    <TrainerCoachingPanel learners={learners||[]} insights={insights} messages={(coachMessages||[]) as CoachMessage[]} startDate={settings?.start_date??null}/>
    <LaunchReadiness publishedMissions={catalog.filter(m=>m.published).length} guidedMissions={(guides||[]).length}
      learners={(learners||[]).length} submissions={(allSubmissions||[]).length} validatedMissions={(awards||[]).length}
      awardedBadges={(badgeAwards||[]).length} startDate={settings?.start_date??null}/>
    <TrainingSchedule startDate={settings?.start_date??null} missions={catalog} variant="trainer"/>
    <CurriculumRoadmap missions={catalog} variant="trainer"/>
    <CohortProgress learners={learners||[]} awards={awards||[]} submissions={allSubmissions||[]} practice={practice||[]} missions={catalog.filter(m=>m.published)} missionCount={catalog.filter(m=>m.published).length}/>
    {params.success && <p className="alert success">{params.success==="message"?"Message pédagogique enregistré et visible dans l’espace apprenant.":"Modification enregistrée dans la base de données."}</p>}
    {params.error && <p className="alert danger">Échec de l’opération. Vérifie les champs ou les droits d’accès.</p>}
    <section className="panel"><div className="section-head"><h2>Soumissions à évaluer</h2><span className="counter">{pending.length} en attente</span></div>
      {!pending.length ? <div className="empty-state"><h3>Aucune soumission en attente</h3><p>Les livrables apparaîtront ici lorsqu’un apprenant les déposera.</p></div>
      :<div className="review-list">{pending.map(s=><article className="review-card" key={s.id}>
        <div><span className="week">MISSION · {displayDomain(byId.get(s.mission_id)?.domain||"")}</span><h3>{byId.get(s.mission_id)?.title||"Mission"}</h3>
          <p className="muted">Apprenant : {s.learner_id.slice(0,8)}…</p><p className="muted">{s.note}</p>
          <a href={s.url} className="external-link" target="_blank" rel="noopener noreferrer">Consulter le livrable ↗</a>
          {(rubricById.get(s.mission_id)||[]).length>0 && <div className="trainer-evaluation-rubric">
            <strong>Grille de vérification</strong>
            <ul>{(rubricById.get(s.mission_id)||[]).map((criterion,index)=><li key={index}>{criterion}</li>)}</ul>
          </div>}
        </div>
        <form action={reviewMission} className="form">
          <input type="hidden" name="submissionId" value={s.id}/>
          {(rubricById.get(s.mission_id)||[]).length===4
            ? <fieldset className="trainer-criteria-form"><legend>Notation détaillée · 4 critères sur 25 points</legend>
              {(rubricById.get(s.mission_id)||[]).map((criterion,index)=><label key={index}>
                <span>{criterion}</span>
                <input name={"criterion"+index} type="number" required min={0} max={25} step={1} defaultValue={20} aria-label={"Points sur 25 : "+criterion}/>
                <small>/ 25</small>
              </label>)}
              <p>La note totale sur 100 est calculée et validée dans Supabase. Minimum 80 pour réussir.</p>
            </fieldset>
            : <label>Note /100<input type="number" name="score" required min={0} max={100} step={1}/></label>}
          <label>Commentaire pédagogique<textarea name="feedback" minLength={3} maxLength={1500} required rows={3}/></label>
          <button type="submit" className="primary-btn">Enregistrer la correction</button>
          <p className="muted">À partir de 80/100, la mission est validée et les XP sont attribués une seule fois.</p>
        </form>
      </article>)}</div>}
    </section>
    <section className="panel"><div className="section-head"><h2>Brouillons à publier</h2><span className="counter">{catalog.filter(m=>!m.published).length} brouillon(s)</span></div>
      <div className="review-list">{catalog.filter(m=>!m.published).map(m=><div key={m.id} className="review-card">
        <div><span className="week">SEMAINE {m.week} · {displayDomain(m.domain)}</span><h3>{m.title}</h3>
          <p className="muted">Récompense : {m.xp} XP</p>
          <Link className="authoring-guide-link" href={"/espace/formateur/atelier/"+m.id}>Rédiger ou modifier les quatre étapes de l'atelier</Link>
        </div>
        <form action={publishMission} className="form"><input type="hidden" name="missionId" value={m.id}/>
          <button type="submit" className="primary-btn">Publier la mission</button>
        </form></div>)}</div>
    </section>
    <section className="panel" style={{maxWidth:660}}><span className="eyebrow">PROGRAMME</span><h2>Créer une mission</h2>
      <p className="muted">La mission est d’abord enregistrée en brouillon. Choisis éventuellement un prérequis, rédige ses étapes pédagogiques, puis publie-la.</p>
      <form action={createMission} className="form">
        <label>Titre<input name="title" required minLength={3} maxLength={110}/></label>
        <label>Domaine<input name="domain" required minLength={2} maxLength={80} defaultValue="Développement web"/></label>
        <label>Description<textarea name="description" required minLength={10} maxLength={1500} rows={3}/></label>
        <label>Livrable attendu<input name="deliverable" required minLength={3} maxLength={500}/></label>
        <div className="field-row"><label>Semaine<input name="week" type="number" required defaultValue={1} min={1} max={8}/></label>
          <label>XP<input name="xp" type="number" required defaultValue={100} min={10} max={1000}/></label></div>
        <label>Mission préalable (optionnelle)
          <select name="prerequisiteId" defaultValue="">
            <option value="">Aucun prérequis</option>
            {catalog.filter(m=>m.published).map(m=><option value={m.id} key={m.id}>Semaine {m.week} · {m.title}</option>)}
          </select>
          <small>La mission préalable doit déjà être publiée et appartenir à la même semaine ou à une semaine antérieure.</small>
        </label>
        <button className="primary-btn" type="submit">Enregistrer comme brouillon</button>
      </form>
    </section>
  </main>;
}
