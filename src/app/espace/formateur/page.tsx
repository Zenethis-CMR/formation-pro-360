import { redirect } from "next/navigation";
import Link from "next/link";
import { createMission, reviewMission, publishMission } from "@/app/espace/actions";
import { requireRole } from "@/lib/auth/require-role";
import { isBackendConfigured } from "@/lib/database/server";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { displayDomain } from "@/components/technology-badge";
import { CohortProgress } from "@/components/cohort-progress";
import { TrainingSchedule } from "@/components/training-schedule";
import { TrainerCoachingPanel } from "@/components/trainer-coaching-panel";
import { LaunchReadiness } from "@/components/launch-readiness";
import { SecureTrainerOverview } from "@/components/secure-trainer-overview";
import { WorkspaceTabHeading } from "@/components/workspace-tab-heading";
import { learnerInsight, type CoachMessage } from "@/lib/coaching-insights";
import { V2TrainerCoursePreview, type V2CoursePreview } from "@/components/v2-trainer-course-preview";
import { V2TrainerEvaluationOverview } from "@/components/v2-trainer-evaluation-overview";

type Params={error?:string;success?:string;onglet?:string;page?:string};
type Submission={id:string;mission_id:string;learner_id:string;url:string;note:string;created_at:string};
type Mission={id:string;title:string;domain:string;xp:number;published:boolean;week:number};
type MissionRubric={mission_id:string;rubric:string[]};
type LearningProfile={learner_id:string;preferred_name:string|null;goal:string|null;minutes_per_day:number|null;regular_days:number[]|null;optional_days:number[]|null};
export default async function TrainerSpace({searchParams}:{searchParams:Promise<Params>}) {
  if(!isBackendConfigured()) redirect("/espace");
  const {db} = await requireRole("trainer");
  const params=await searchParams;
  const tab=(["evaluations","apprenants","programme"].includes(params.onglet||"") ? params.onglet : "dashboard")||"dashboard";
  // Avoid fetching cohort/history/authoring data on unrelated tabs.
  // Evaluation history is paginated at the database level (not sliced in memory).
  const requestedPage=Number(params.page);
  const historyPage=Number.isSafeInteger(requestedPage)&&requestedPage>=1&&requestedPage<=1000?requestedPage:1;
  const historySize=50;
  const skipped=Promise.resolve({data:null,error:null,count:null});
  const [{data:submissions,error:se,count:pendingCountFromDb},{data:missions,error:me},{data:learners,error:le,count:learnerCountFromDb},{data:awards,error:ae,count:awardCountFromDb},{data:allSubmissions,error:allSe,count:submissionCountFromDb},{data:practice,error:pe},{data:guides,error:ge,count:guideCountFromDb},{data:settings,error:settingsError},{data:deps,error:depsError},{data:steps,error:stepsError},{data:coachMessages,error:coachError},{data:badgeAwards,error:badgeAwardsError,count:badgeCountFromDb},{data:learningProfiles,error:learningProfilesError}] = await Promise.all([
    tab==="dashboard"
      ? db.from("submissions").select("id",{head:true,count:"exact"}).eq("status","pending")
      : tab==="evaluations" ? db.from("submissions").select("id,mission_id,learner_id,url,note,created_at").eq("status","pending").order("created_at") : skipped,
    db.from("missions").select("id,title,domain,xp,published,week").order("week"),
    tab==="dashboard"||tab==="programme"
      ? db.from("profiles").select("id",{head:true,count:"exact"}).eq("role","learner")
      : db.from("profiles").select("id").eq("role","learner").order("created_at"),
    tab==="programme"
      ? db.from("xp_ledger").select("mission_id",{head:true,count:"exact"})
      : tab==="dashboard"||tab==="apprenants" ? db.from("xp_ledger").select("learner_id,mission_id,xp") : skipped,
    tab==="programme"
      ? db.from("submissions").select("id",{head:true,count:"exact"})
      : tab==="evaluations"
        ? db.from("submissions").select("id,learner_id,mission_id,status,score,feedback,created_at",{count:"exact"})
          .neq("status","pending").order("created_at",{ascending:false}).range((historyPage-1)*historySize,historyPage*historySize-1)
        : tab==="apprenants" ? db.from("submissions").select("id,learner_id,mission_id,status,score,feedback,created_at").order("created_at",{ascending:false}).limit(500) : skipped,
    tab==="apprenants" ? db.from("practice_checkins").select("learner_id,practice_date") : skipped,
    tab==="programme"
      ? db.from("mission_guides").select("mission_id",{head:true,count:"exact"})
      : tab==="evaluations" ? db.from("mission_guides").select("mission_id,rubric") : skipped,
    tab==="programme"||tab==="apprenants" ? db.from("training_settings").select("start_date").eq("id",true).maybeSingle() : skipped,
    tab==="apprenants" ? db.from("mission_prerequisites").select("mission_id,prerequisite_id") : skipped,
    tab==="apprenants" ? db.from("workshop_steps").select("learner_id,mission_id,completed_at") : skipped,
    tab==="apprenants" ? db.from("coach_messages").select("id,trainer_id,learner_id,body,created_at").order("created_at",{ascending:false}).limit(200) : skipped,
    tab==="programme" ? db.from("learner_badges").select("badge_slug",{head:true,count:"exact"}) : skipped,
    tab==="apprenants"||tab==="evaluations" ? db.from("learner_preferences").select("learner_id,preferred_name,goal,minutes_per_day,regular_days,optional_days") : skipped
  ]);
  if(se||me||le||ae||allSe||pe||ge||settingsError||depsError||stepsError||coachError||badgeAwardsError||learningProfilesError)return <main className="page"><p className="alert danger">Erreur de chargement. Vérifie les migrations SQL et les droits du compte.</p></main>;
  const pending=(submissions||[]) as Submission[], catalog=(missions||[]) as Mission[];
  const pendingCount=tab==="dashboard"?(pendingCountFromDb??0):pending.length;
  const learnerCount=tab==="dashboard"||tab==="programme"?(learnerCountFromDb??0):(learners||[]).length;
  const historyTotal=tab==="evaluations"?(submissionCountFromDb??0):0;
  const preferencesById=new Map<string,LearningProfile>(((learningProfiles||[]) as LearningProfile[]).map(p=>[p.learner_id,p]));
  const namedLearners=(learners||[]).map(l=>({
    ...l,
    preferred_name:preferencesById.get(l.id)?.preferred_name||null,
    goal:preferencesById.get(l.id)?.goal||null,
    minutes_per_day:preferencesById.get(l.id)?.minutes_per_day||null,
    regular_days:preferencesById.get(l.id)?.regular_days||null,
    optional_days:preferencesById.get(l.id)?.optional_days||[]
  }));
  const byId = new Map(catalog.map(m=>[m.id,m]));
  const learnerNames=new Map(namedLearners.map((l,i)=>[l.id,l.preferred_name||"Apprenant "+String(i+1).padStart(2,"0")]));
  const reviewed=(allSubmissions||[]).filter(s=>s.status!=="pending");
  const rubricById = new Map(((guides||[]) as MissionRubric[]).map(g=>[g.mission_id,g.rubric]));
  const published=catalog.filter(m=>m.published);
  const insights=(tab==="apprenants"?(learners||[]):[]).map(l=>learnerInsight({
    learnerId:l.id,missions:published,
    deps:deps||[],awards:awards||[],submissions:allSubmissions||[],
    practices:practice||[],steps:steps||[],startDate:settings?.start_date??null
  }));
  // Preview is opt-in and read-only: the production database has not yet
  // received the new training_tracks migration. Do not query new tables by default.
  const showV2Preview=tab==="programme" && process.env.FORMATION_V2_PREVIEW_ENABLED==="true";
  let v2Course:V2CoursePreview|null=null;
  let v2Unavailable=false;
  if(showV2Preview){
    const trackR=await db.from("training_tracks")
      .select("id,title,status").eq("slug","ingenierie-produit-ia").maybeSingle();
    if(trackR.error) v2Unavailable=true;
    else if(trackR.data) {
      const track=trackR.data as {id:string;title:string;status:V2CoursePreview["status"]};
      const modulesR=await db.from("track_modules")
        .select("id,week,title,outcome").eq("track_id",track.id).order("week");
      if(modulesR.error) v2Unavailable=true;
      else {
        const moduleRows=(modulesR.data||[]) as {id:string;week:number;title:string;outcome:string}[];
        const ids=moduleRows.map(m=>m.id);
        const lessonR=ids.length
          ? await db.from("module_lessons").select("module_id,title,objective,evidence_required,version,status").in("module_id",ids).order("version",{ascending:false})
          : {data:[] as {module_id:string;title:string;objective:string;evidence_required:string;version:number;status:"draft"|"published"}[],error:null};
        if(lessonR.error) v2Unavailable=true;
        else {
          const byModule=new Map<string,V2CoursePreview["modules"][number]["lessons"]>();
          for(const lesson of lessonR.data||[]) {
            const list=byModule.get(lesson.module_id)||[];
            list.push({title:lesson.title,objective:lesson.objective,
              evidence:lesson.evidence_required,version:lesson.version,status:lesson.status});
            byModule.set(lesson.module_id,list);
          }
          v2Course={
            title:track.title,status:track.status,
            modules:moduleRows.map(m=>({...m,lessons:byModule.get(m.id)||[]}))
          };
        }
      }
    }
  }
  return <main className="page secure-trainer-page">
    {tab!=="dashboard"&&<WorkspaceTabHeading role="trainer" tab={tab}/>}
    {tab==="dashboard"&&<SecureTrainerOverview pending={pendingCount} learners={learnerCount}
      missions={published.length} validatedXp={(awards||[]).reduce((sum,x)=>sum+Number(x.xp),0)}/>}
    {params.success&&<p className="alert success" role="status">{params.success==="message"?"Message pédagogique enregistré dans l'espace apprenant.":"Modification enregistrée dans la base de données."}</p>}
    {params.error&&<p className="alert danger" role="alert">Échec de l'opération. Vérifie les champs ou les droits d'accès.</p>}
    {tab==="evaluations"&&<>
    <V2TrainerEvaluationOverview/>
    <div className="v2-legacy-section-head"><span>ARCHIVES ET CORRECTIONS V1</span><h2>Évaluations du programme historique</h2><p>Les anciennes missions et leurs XP continuent de fonctionner indépendamment des ateliers V2.</p></div>
    <section className="panel" id="evaluations"><div className="section-head"><h2>Soumissions V1 à évaluer</h2><span className="counter">{pending.length} en attente</span></div>
      {!pending.length ? <div className="empty-state"><h3>Aucune soumission en attente</h3><p>Les livrables apparaîtront ici lorsqu’un apprenant les déposera.</p></div>
      :<div className="review-list">{pending.map(s=><article className="review-card" key={s.id}>
        <div><span className="week">MISSION · {displayDomain(byId.get(s.mission_id)?.domain||"")}</span><h3>{byId.get(s.mission_id)?.title||"Mission"}</h3>
          <p className="muted">Apprenant : {learnerNames.get(s.learner_id)||"Apprenant"}</p><p className="muted">{s.note}</p>
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
              <p>La note totale sur 100 est calculée et validée dans la base de données. Minimum 80 pour réussir.</p>
            </fieldset>
            : <label>Note /100<input type="number" name="score" required min={0} max={100} step={1}/></label>}
          <label>Commentaire pédagogique<textarea name="feedback" minLength={3} maxLength={1500} required rows={3}/></label>
          <button type="submit" className="primary-btn">Enregistrer la correction</button>
          <p className="muted">À partir de 80/100, la mission est validée et les XP sont attribués une seule fois.</p>
        </form>
      </article>)}</div>}
    </section>
    <section className="panel" id="historique-evaluations">
      <div className="section-head"><div><span className="eyebrow">HISTORIQUE PÉDAGOGIQUE</span><h2>Corrections précédentes</h2></div>
        <span className="counter">{historyTotal} évaluation(s)</span></div>
      {reviewed.length===0
        ?<div className="empty-state"><h3>Pas encore de correction</h3><p>Les évaluations réalisées et leurs commentaires apparaîtront ici.</p></div>
        :<div className="workspace-review-history">{reviewed.map(s=><article key={s.id} className="workspace-history-item">
          <div><span className="week">{learnerNames.get(s.learner_id)||"Apprenant"} · {byId.get(s.mission_id)?.domain||"Mission"}</span>
            <h3>{byId.get(s.mission_id)?.title||"Mission"}</h3>
            <p>{s.feedback||"Aucun commentaire pédagogique enregistré."}</p></div>
          <div className="workspace-history-score"><strong>{s.score===null?"—":s.score+"/100"}</strong>
            <span className={s.status==="approved"?"is-approved":"is-correction"}>{s.status==="approved"?"Validée":"Correction demandée"}</span>
            <time dateTime={s.created_at}>{new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",dateStyle:"medium"}).format(new Date(s.created_at))}</time></div>
        </article>)}</div>}
      {historyTotal>historySize&&<nav className="workspace-history-pagination" aria-label="Pages de l'historique des évaluations">
        {historyPage>1&&<Link href={"/espace/formateur?onglet=evaluations&page="+(historyPage-1)+"#historique-evaluations"}>← Corrections précédentes</Link>}
        <span>Page {historyPage} sur {Math.ceil(historyTotal/historySize)}</span>
        {historyPage*historySize<historyTotal&&<Link href={"/espace/formateur?onglet=evaluations&page="+(historyPage+1)+"#historique-evaluations"}>Corrections plus anciennes →</Link>}
      </nav>}
    </section>
    </>}
    {tab==="apprenants"&&<>
    <TrainerCoachingPanel learners={namedLearners} insights={insights} messages={(coachMessages||[]) as CoachMessage[]} startDate={settings?.start_date??null}/>
    <div id="cohorte" className="secure-section-marker"/>
    <CohortProgress learners={namedLearners} awards={awards||[]} submissions={allSubmissions||[]} practice={practice||[]} missions={catalog.filter(m=>m.published)} missionCount={catalog.filter(m=>m.published).length}/>
    </>}
    {tab==="programme"&&<>
    {showV2Preview&&<V2TrainerCoursePreview course={v2Course} unavailable={v2Unavailable}/>}
    <div id="programme" className="secure-section-marker"/>
    <TrainingSchedule startDate={settings?.start_date??null} missions={catalog} variant="trainer"/>
    <CurriculumRoadmap missions={catalog} variant="trainer"/>
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
    <section className="panel" id="creation" style={{maxWidth:660}}><span className="eyebrow">PROGRAMME</span><h2>Créer une mission</h2>
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
    <LaunchReadiness publishedMissions={catalog.filter(m=>m.published).length} guidedMissions={guideCountFromDb??0}
      learners={learnerCount} submissions={submissionCountFromDb??0} validatedMissions={awardCountFromDb??0}
      awardedBadges={badgeCountFromDb??0} startDate={settings?.start_date??null}/>
    </>}
  </main>;
}
