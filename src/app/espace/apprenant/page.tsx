import { signOut } from "@/app/auth/actions";
import Link from "next/link";
import { ArrowUpRight, BookOpen, LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { curriculumWeeks } from "@/lib/curriculum";
import { TechnologyBadge, technologiesForMission, displayDomain } from "@/components/technology-badge";
import { LearningAchievements, type Badge, type EarnedBadge, type PracticeCheckin } from "@/components/learning-achievements";
import { SkillMastery } from "@/components/skill-mastery";
import { TrainingSchedule } from "@/components/training-schedule";

type Params = { error?: string; success?: string };
type Mission = { id:string; title:string; domain:string; description:string; week:number;
  deliverable:string; objectives:string[]; duration:string; xp:number };
type Submission = { id:string; mission_id:string; status:string; score:number|null; feedback:string|null; created_at:string };
export default async function LearnerSpace({searchParams}:{searchParams:Promise<Params>}) {
  if (!isSupabaseConfigured()) redirect("/espace");
  const {supabase,user} = await requireRole("learner");
  const params = await searchParams;
  const [{data:rawMissions,error:missionError},{data:rawSubs,error:subsError},{data:rawXp,error:xpError},{data:rawDeps,error:depsError},{data:badgeCatalog,error:badgeError},{data:myBadges,error:earnedError},{data:practice,error:practiceError},{data:settings,error:settingsError}] = await Promise.all([
    supabase.from("missions").select("id,title,domain,description,week,deliverable,objectives,duration,xp").eq("published",true).order("week"),
    supabase.from("submissions").select("id,mission_id,status,score,feedback,created_at").eq("learner_id",user.id).order("created_at",{ascending:false}),
    supabase.from("xp_ledger").select("mission_id,xp").eq("learner_id",user.id),
    supabase.from("mission_prerequisites").select("mission_id,prerequisite_id"),
    supabase.from("badges").select("slug,title,description,icon,required_missions").order("required_missions"),
    supabase.from("learner_badges").select("badge_slug,awarded_at").eq("learner_id",user.id),
    supabase.from("practice_checkins").select("practice_date").eq("learner_id",user.id).order("practice_date",{ascending:false}).limit(45),
    supabase.from("training_settings").select("start_date").eq("id",true).maybeSingle()
  ]);
  if(missionError || subsError || xpError || depsError || badgeError || earnedError || practiceError || settingsError) return <main className="page"><p className="alert danger">Impossible de charger le parcours. Vérifie que les migrations SQL sont appliquées.</p></main>;
  const missions = (rawMissions || []) as Mission[];
  const submissions = (rawSubs || []) as Submission[];
  const approved = new Set((rawXp || []).map(x => x.mission_id as string));
  const xp = (rawXp || []).reduce((sum,x) => sum + Number(x.xp),0);
  const level = Math.floor(xp/300)+1;
  const deps = (rawDeps || []) as {mission_id:string;prerequisite_id:string}[];
  const activeWeek = curriculumWeeks.find(w => missions.some(m => m.week===w.week && !approved.has(m.id)))?.week ?? 8;
  const currentMission = missions.find(m => !approved.has(m.id) &&
    !deps.some(d => d.mission_id===m.id && !approved.has(d.prerequisite_id)));
  return <main className="page">
    <section className="page-hero"><div><span className="eyebrow">ESPACE APPRENANT · COMPTE SÉCURISÉ</span><h1>Progression <span>réelle.</span></h1>
      <p>Tes missions sont conservées dans la base de données. Le formateur valide les livrables avant l’attribution des XP.</p></div></section>
    <form action={signOut} style={{display:"flex",justifyContent:"flex-end"}}><button type="submit" className="text-btn">Se déconnecter</button></form>
    <div className="stats-grid"><div className="stat-card"><span>NIVEAU</span><strong>{level}</strong></div>
      <div className="stat-card"><span>EXPÉRIENCE</span><strong>{xp} <em>XP</em></strong></div>
      <div className="stat-card"><span>MISSIONS VALIDÉES</span><strong>{approved.size}<em> / {missions.length}</em></strong></div></div>
    {params.success && <p className="alert success">{params.success==="practice"?"Séance de pratique enregistrée pour aujourd’hui.": "Livrable enregistré. Il attend maintenant la correction du formateur."}</p>}
    {params.error && <p className="alert danger">{params.error==="practice"?"Impossible d’enregistrer la séance. Essaie à nouveau.":"Impossible d’enregistrer cette soumission. Vérifie les informations et les prérequis."}</p>}
    <LearningAchievements catalog={(badgeCatalog||[]) as Badge[]} earned={(myBadges||[]) as EarnedBadge[]} practice={(practice||[]) as PracticeCheckin[]} validatedCount={approved.size} currentMission={currentMission ? {id:currentMission.id,title:currentMission.title} : null}/>
    <SkillMastery missions={missions} approved={approved}/>
    <TrainingSchedule startDate={settings?.start_date??null} missions={missions} approved={approved}/>
    <CurriculumRoadmap missions={missions} approved={approved} prerequisites={deps}/>
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
  </main>;
}
