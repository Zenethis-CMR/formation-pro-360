import Link from "next/link";
import { DashboardHeader, DashboardQuickLinks, DashboardDisclosure } from "@/components/dashboard-workspace";
import { ArrowUpRight, BookOpen, LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isBackendConfigured } from "@/lib/database/server";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { curriculumWeeks } from "@/lib/curriculum";
import { TechnologyBadge, technologiesForMission, displayDomain } from "@/components/technology-badge";
import { LearningAchievements, type Badge, type EarnedBadge, type PracticeCheckin } from "@/components/learning-achievements";
import { SkillMastery } from "@/components/skill-mastery";
import { TrainingSchedule } from "@/components/training-schedule";
import { LearnerCoachingPanel } from "@/components/learner-coaching-panel";
import { learnerInsight, type CoachMessage } from "@/lib/coaching-insights";
import { LearnerWelcomeBanner } from "@/components/learner-welcome-banner";
import { SecureLearnerOverview } from "@/components/secure-learner-overview";
import { WorkspaceTabHeading } from "@/components/workspace-tab-heading";
import { type LearnerPreferences } from "@/lib/learner-preferences";
import { getV2DashboardPilot } from "@/lib/v2-dashboard-pilot";
import { loadV2LearnerProgress } from "@/lib/v2-learner-progress";
import { V2LearnerProgressPanel } from "@/components/v2-learner-progress-panel";
import { LearnerJourneyGuide } from "@/components/learner-journey-guide";
import { LearnerWeekPlan } from "@/components/learner-week-plan";
import { V2LearnerResourcesPanel, type LearnerCourseResources } from "@/components/v2-learner-resources-panel";
import { backendRequest } from "@/lib/auth/backend";

type Params = { error?: string; success?: string; welcome?: string; onglet?: string };
type Mission = { id:string; title:string; domain:string; description:string; week:number;
  deliverable:string; objectives:string[]; duration:string; xp:number };
type Submission = { id:string; mission_id:string; status:string; score:number|null; feedback:string|null; created_at:string };
export default async function LearnerSpace({searchParams}:{searchParams:Promise<Params>}) {
  if (!isBackendConfigured()) redirect("/espace");
  const {db,user} = await requireRole("learner");
  const params = await searchParams;
  const tab=(["missions","progression","programme"].includes(params.onglet||"") ? params.onglet : "dashboard")||"dashboard";
  // Shared data only; other tables are fetched solely for the active tab.
  // The skipped promises keep the tuple readable without issuing HTTP requests.
  const skipped = Promise.resolve({data:null,error:null});
  const [{data:rawMissions,error:missionError},{data:rawSubs,error:subsError},{data:rawXp,error:xpError},{data:rawDeps,error:depsError},{data:badgeCatalog,error:badgeError},{data:myBadges,error:earnedError},{data:practice,error:practiceError},{data:settings,error:settingsError},{data:coachMessages,error:messagesError},{data:workshopSteps,error:stepsError},{data:rawPreferences,error:preferencesError}] = await Promise.all([
    db.from("missions").select("id,title,domain,description,week,deliverable,objectives,duration,xp").eq("published",true).order("week"),
    tab==="programme" ? skipped : db.from("submissions").select("id,mission_id,status,score,feedback,created_at").eq("learner_id",user.id).order("created_at",{ascending:false}),
    db.from("xp_ledger").select("mission_id,xp").eq("learner_id",user.id),
    db.from("mission_prerequisites").select("mission_id,prerequisite_id"),
    tab==="progression" ? db.from("badges").select("slug,title,description,icon,required_missions").order("required_missions") : skipped,
    tab==="progression" ? db.from("learner_badges").select("badge_slug,awarded_at").eq("learner_id",user.id) : skipped,
    tab==="progression" ? db.from("practice_checkins").select("practice_date").eq("learner_id",user.id).order("practice_date",{ascending:false}).limit(45) : skipped,
    tab==="progression"||tab==="programme" ? db.from("training_settings").select("start_date").eq("id",true).maybeSingle() : skipped,
    tab==="progression" ? db.from("coach_messages").select("id,trainer_id,learner_id,body,created_at").eq("learner_id",user.id).order("created_at",{ascending:false}).limit(8) : skipped,
    tab==="progression" ? db.from("workshop_steps").select("learner_id,mission_id,completed_at").eq("learner_id",user.id) : skipped,
    tab==="dashboard"||tab==="programme" ? db.from("learner_preferences").select("learner_id,preferred_name,goal,experience,minutes_per_day,regular_days,optional_days").eq("learner_id",user.id).maybeSingle() : skipped
  ]);
  if(missionError || subsError || xpError || depsError || badgeError || earnedError || practiceError || settingsError || messagesError || stepsError || preferencesError) return <main className="page"><p className="alert danger">Impossible de charger le parcours. Vérifie que les migrations SQL sont appliquées.</p></main>;
  const missions = (rawMissions || []) as Mission[];
  const submissions = (rawSubs || []) as Submission[];
  const approved = new Set((rawXp || []).map(x => x.mission_id as string));
  const xp = (rawXp || []).reduce((sum,x) => sum + Number(x.xp),0);
  const level = Math.floor(xp/300)+1;
  const deps = (rawDeps || []) as {mission_id:string;prerequisite_id:string}[];
  const activeWeek = curriculumWeeks.find(w => missions.some(m => m.week===w.week && !approved.has(m.id)))?.week ?? 8;
  const currentMission = missions.find(m => !approved.has(m.id) &&
    !deps.some(d => d.mission_id===m.id && !approved.has(d.prerequisite_id)));
  // V2 rights and XP are independent of the historical V1 mission ledger.
  const pilot=tab==="dashboard"||tab==="programme"?await getV2DashboardPilot():null;
  const v2Progress=tab==="progression"?await loadV2LearnerProgress():null;
  const resourceResponse=tab==="programme"
    ?await backendRequest("/v1/training/catalog/ingenierie-produit-ia").catch(()=>null)
    :null;
  const courseResources:LearnerCourseResources|null=resourceResponse?.ok
    ?await resourceResponse.json().catch(()=>null) as LearnerCourseResources|null:null;
  const insight=learnerInsight({
    learnerId:user.id,missions,deps,
    awards:(rawXp||[]).map(x=>({learner_id:user.id,mission_id:x.mission_id})),
    submissions:submissions.map(x=>({learner_id:user.id,mission_id:x.mission_id,status:x.status,created_at:x.created_at})),
    practices:(practice||[]).map(x=>({learner_id:user.id,practice_date:x.practice_date})),
    steps:workshopSteps||[],startDate:settings?.start_date??null
  });
  return <main className="page secure-learner-page">
    {tab!=="dashboard"&&<WorkspaceTabHeading role="learner" tab={tab}/>}
    {tab==="dashboard"&&<>
      <DashboardHeader trainer={false} name={(rawPreferences as LearnerPreferences|null)?.preferred_name}/>
      {pilot?<SecureLearnerOverview missions={missions} submissions={submissions} approvedIds={[...approved]} dependencies={deps} xp={xp} level={level} pilot={pilot}
        primaryAction={<DashboardDisclosure title="Les étapes de mon parcours" description="Objectifs, inscription, diagnostic facultatif et progression" initiallyOpen={pilot.published&&pilot.enrollment===null}><LearnerJourneyGuide pilot={pilot} profileSaved={!!rawPreferences}/></DashboardDisclosure>}
        workspace={<DashboardQuickLinks trainer={false} enrolled={pilot.enrollment==="active"||pilot.enrollment==="completed"}/>}/>
        :<><section className="panel" role="status"><h2>Le parcours est momentanément indisponible</h2><p>Tu peux consulter tes réalisations et revenir au programme.</p><Link className="primary-btn" href="/espace/parcours/ingenierie-produit-ia">Voir le parcours</Link></section><DashboardQuickLinks trainer={false} enrolled={false}/></>}
      <DashboardDisclosure title="Mes objectifs et mon rythme" description="Personnaliser mon parcours et mon planning">
        <LearnerWelcomeBanner preferences={rawPreferences as LearnerPreferences|null} mission={insight.nextMission} pilot={pilot}/>
      </DashboardDisclosure>
      <section className="v2-catalog-banner"><div><span>LE CATALOGUE 360</span><h2>Sept formations, une première spécialisation active</h2><p>Découvre les six autres domaines, actuellement en préparation. Tes missions historiques et les XP obtenus restent conservés séparément.</p></div><Link href="/catalogue" className="v2-catalog-banner-link">Explorer le catalogue <ArrowUpRight size={16}/></Link></section>
    </>}
    <div className="secure-learner-alerts">
      {params.welcome && <p className="alert success" role="status">Tes préférences sont enregistrées. Tu peux maintenant continuer ton parcours.</p>}
      {params.success && <p className="alert success" role="status">{params.success==="practice"?"Séance de pratique enregistrée pour aujourd’hui.":"Livrable enregistré. Il attend maintenant la correction du formateur."}</p>}
      {params.error && <p className="alert danger" role="alert">{params.error==="practice"?"Impossible d’enregistrer la séance. Essaie à nouveau.":"Impossible d’enregistrer cette soumission. Vérifie les informations et les prérequis."}</p>}
    </div>
    {tab==="progression"&&<>
      {v2Progress&&<V2LearnerProgressPanel progress={v2Progress} otherXp={xp}/>}
      <div className="v2-legacy-section-head"><span>MES AUTRES ACQUIS · RÉALISATIONS CONSERVÉES</span><h2>Mes compétences et récompenses</h2><p>Badges, exercices et retours de tes autres réalisations, conservés sur ton compte.</p></div>
      <LearnerCoachingPanel insight={insight} messages={(coachMessages||[]) as CoachMessage[]} startDate={settings?.start_date??null}/>
      <LearningAchievements catalog={(badgeCatalog||[]) as Badge[]} earned={(myBadges||[]) as EarnedBadge[]} practice={(practice||[]) as PracticeCheckin[]} validatedCount={approved.size} currentMission={currentMission ? {id:currentMission.id,title:currentMission.title} : null}/>
      <SkillMastery missions={missions} approved={approved}/>
    </>}
    {tab==="programme"&&<>
      <LearnerWeekPlan preferences={rawPreferences as LearnerPreferences|null} pilot={pilot}/>
      <V2LearnerResourcesPanel data={courseResources}/>
      <section className="learner-other-resources">
        <div className="v2-legacy-section-head"><span>AUTRES RÉALISATIONS · RESSOURCES CONSERVÉES</span>
          <h2>Calendrier et fiches de mes autres missions</h2>
          <p>Les activités ci-dessous appartiennent à tes réalisations complémentaires.
            Le programme principal « Ingénierie produit et IA » est présenté au-dessus.</p>
        </div>
        <TrainingSchedule startDate={settings?.start_date??null} missions={missions} approved={approved}/>
        <CurriculumRoadmap missions={missions} approved={approved} prerequisites={deps}/>
      </section>
    </>}
    {tab==="missions"&&<>
    <div className="section-head" id="missions"><h2>Programme et missions</h2><span className="counter">Seuil : 80/100</span></div>
    <div className="curriculum-mission-list">{curriculumWeeks.map(w=>{
      const weekMissions = missions.filter(m=>m.week===w.week).sort((a,b)=>{
        if(deps.some(d=>d.mission_id===b.id&&d.prerequisite_id===a.id))return -1;
        if(deps.some(d=>d.mission_id===a.id&&d.prerequisite_id===b.id))return 1;
        return a.title.localeCompare(b.title,"fr");
      });
      if(!weekMissions.length) return null;
      const completedThisWeek = weekMissions.filter(m=>approved.has(m.id)).length;
      return <details className="curriculum-week-group" key={w.week} open={w.week===activeWeek}>
        <summary><span className="curriculum-week-name"><span>SEMAINE {w.week}</span><strong>{w.title}</strong></span><span className="curriculum-week-total">{completedThisWeek}/{weekMissions.length} validée(s)</span></summary>
        <div className="mission-grid">{weekMissions.map(m=>{
      const recent = submissions.find(s=>s.mission_id===m.id);
      const blocked = deps.some(d=>d.mission_id===m.id && !approved.has(d.prerequisite_id));
      const completed = approved.has(m.id);
      const canSubmit = !blocked && !completed && (!recent || recent.status==="changes_requested");
      return <article className="mission-card" id={"mission-"+m.id} key={m.id}>
        <div className="mission-head"><span className="week">SEMAINE {m.week}</span><span className={"status "+(completed?"approved":blocked?"locked":recent?.status==="pending"?"in_review":"available")}>
          {completed?"Validée":blocked?"Verrouillée":recent?.status==="pending"?"En évaluation":recent?.status==="changes_requested"?"À corriger":"Disponible"}</span></div>
        <div className="mission-type"><span>{displayDomain(m.domain)}</span>{technologiesForMission(m).map(tech=><TechnologyBadge name={tech} key={tech}/>)}</div><h3>{m.title}</h3><p>{m.description}</p>
        <p className="muted">Livrable : {m.deliverable}</p><ul className="objective-list">{(m.objectives||[]).map(o=><li key={o}>✓ {o}</li>)}</ul>
        <div className="mission-meta"><span>◷ {m.duration}</span><span className="xp">+{m.xp} XP</span></div>
        {recent?.feedback && <p className="helper">{recent.score}/100 · {recent.feedback}</p>}
        <Link href={"/espace/atelier/"+m.id} className={"mission-workshop-link"+(blocked?" is-locked":"")}>
          {blocked?<LockKeyhole size={16}/>:<BookOpen size={16}/>}
          <span>{completed?"Revoir l'atelier":blocked?"Consulter les consignes":recent?.status==="pending"?"Suivre ma correction":canSubmit?"Ouvrir l'atelier guidé":"Voir l'atelier"}</span>
          <ArrowUpRight size={16}/>
        </Link>
      </article>;
    })}</div>
      </details>;
    })}</div>
    </>}
  </main>;
}
