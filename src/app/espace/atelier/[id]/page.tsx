import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, BookOpen, Check, CheckCircle2, Circle, Clock3, Code2, ExternalLink, Flag, Lightbulb, LockKeyhole, Send, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { isBackendConfigured } from "@/lib/database/server";
import { submitMission, completeWorkshopStep } from "@/app/espace/actions";
import { displayDomain, technologiesForMission, TechnologyBadge } from "@/components/technology-badge";

type Props = {
  params:Promise<{id:string}>;
  searchParams:Promise<{success?:string;error?:string}>;
};
type GuideStep={title:string;instruction:string;deliverable:string};
type Guide={brief:string;steps:GuideStep[];rubric:string[];hint:string;resource_url:string};
type Mission={id:string;title:string;domain:string;week:number;description:string;objectives:string[];deliverable:string;duration:string;xp:number};
type Submission={id:string;status:string;score:number|null;feedback:string|null;url:string;created_at:string};
type Requirement={mission_id:string;prerequisite_id:string};

export default async function MissionWorkshop({params,searchParams}:Props) {
  if(!isBackendConfigured()) redirect("/espace");
  const {id}=await params;
  const query=await searchParams;
  if(!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const {db,user}=await requireRole("learner");
  const [
    {data:rawMission,error:missionError},
    {data:rawGuide,error:guideError},
    {data:rawDeps,error:depsError},
    {data:xp,error:xpError},
    {data:rawSubs,error:subError},
    {data:rawChecked,error:stepError},
    {data:allMissions}
  ]=await Promise.all([
    db.from("missions").select("id,title,domain,week,description,objectives,deliverable,duration,xp").eq("id",id).eq("published",true).maybeSingle(),
    db.from("mission_guides").select("brief,steps,rubric,hint,resource_url").eq("mission_id",id).maybeSingle(),
    db.from("mission_prerequisites").select("mission_id,prerequisite_id").eq("mission_id",id),
    db.from("xp_ledger").select("mission_id").eq("learner_id",user.id),
    db.from("submissions").select("id,status,score,feedback,url,created_at").eq("learner_id",user.id).eq("mission_id",id).order("created_at",{ascending:false}).limit(20),
    db.from("workshop_steps").select("step_number").eq("learner_id",user.id).eq("mission_id",id),
    db.from("missions").select("id,title").eq("published",true)
  ]);
  if(missionError || guideError || depsError || xpError || subError || stepError){
    return <main className="page"><p className="alert danger">L'atelier ne peut pas être chargé pour le moment. Réessaie depuis ton parcours.</p><Link href="/espace/apprenant">Retour aux missions</Link></main>;
  }
  if(!rawMission) notFound();
  const mission=rawMission as Mission;
  const hasGuide=Boolean(rawGuide);
  // A trainer may publish a custom mission before supplying a guided workshop.
  // Keep the brief, rubric-free grading and project submission usable in that case.
  const guide:Guide=rawGuide ? rawGuide as Guide : {
    brief:mission.description,steps:[],rubric:[],
    hint:"Relis les objectifs et vérifie ton livrable avant l'envoi.",
    resource_url:""
  };
  const deps=(rawDeps||[]) as Requirement[];
  const acquired=new Set((xp||[]).map(x=>x.mission_id));
  const missing=deps.filter(d=>!acquired.has(d.prerequisite_id));
  const blocked=missing.length>0;
  const validated=acquired.has(id);
  const history=(rawSubs||[]) as Submission[];
  const recent=history[0];
  // Keep the previous review visible after a student submits a corrected version.
  const lastReviewed=history.find(x=>x.status!=="pending" && x.feedback);
  const {data:assessment,error:assessmentError}=lastReviewed
    ? await db.from("submission_assessments")
        .select("criterion_scores,total_score").eq("submission_id",lastReviewed.id).maybeSingle()
    : {data:null,error:null};
  if(assessmentError) return <main className="page"><p className="alert danger">Impossible de charger la correction détaillée.</p></main>;
  const earnedCriteria=assessment && Array.isArray(assessment.criterion_scores)
    ? assessment.criterion_scores as number[] : [];
  const checked=new Set((rawChecked||[]).map(x=>x.step_number));
  const steps=Array.isArray(guide.steps)?guide.steps:[];
  const rubric=Array.isArray(guide.rubric)?guide.rubric:[];
  const finished=steps.filter((_,index)=>checked.has(index+1)).length;
  const percentage=steps.length?Math.round(100*finished/steps.length):0;
  const canSubmit=!blocked && !validated && (!recent || recent.status==="changes_requested");
  const titleById=new Map((allMissions||[]).map(m=>[m.id,m.title]));
  return <main className="page workshop-page">
    <Link className="workshop-back" href="/espace/apprenant"><ArrowLeft size={15}/> Mon parcours</Link>
    <header className="workshop-intro">
      <span className="eyebrow"><BookOpen size={14}/> {hasGuide?"ATELIER PRATIQUE":"MISSION PERSONNALISÉE"} · SEMAINE {mission.week}</span>
      <h1>{mission.title}</h1>
      <p>{guide.brief}</p>
      <div className="workshop-info">
        <span><Clock3 size={15}/> {mission.duration}</span>
        <span><Flag size={15}/> +{mission.xp} XP après validation</span>
        <span><Code2 size={15}/> {displayDomain(mission.domain)}</span>
      </div>
      <div className="workshop-tech">{technologiesForMission(mission).map(tech=><TechnologyBadge name={tech} key={tech}/>)}</div>
    </header>

    {blocked && <section className="workshop-alert locked" aria-label="Atelier verrouillé">
      <LockKeyhole size={20}/>
      <div><strong>Atelier en attente de prérequis</strong><p>Tu peux consulter les consignes, mais tu ne peux ni cocher les étapes ni remettre le projet tant que les missions suivantes ne sont pas validées :</p>
        <div className="workshop-prereqs">{missing.map(r=><Link key={r.prerequisite_id} href={"/espace/atelier/"+r.prerequisite_id}>{titleById.get(r.prerequisite_id)||"Mission préalable"} <ArrowUpRight size={13}/></Link>)}</div>
      </div>
    </section>}
    {validated && <section className="workshop-alert approved"><BadgeCheck size={20}/><div><strong>Atelier validé par le formateur</strong><p>Les XP ont été attribués pour cette mission. Tu peux revoir tes apprentissages à tout moment.</p></div></section>}
    {recent?.status==="pending" && <section className="workshop-alert pending"><Clock3 size={20}/><div><strong>Projet soumis, en attente de correction</strong><p>Le formateur examinera ton travail. Aucune nouvelle soumission n'est nécessaire.</p></div></section>}
    {recent?.status==="changes_requested" && <section className="workshop-alert revision"><Lightbulb size={20}/><div><strong>Améliorations demandées par le formateur</strong><p>Consulte les remarques, corrige ton projet puis renvoie une nouvelle version.</p></div></section>}
    {query.success==="step" && <p className="alert success" role="status">Étape enregistrée dans ton parcours. Continue à ton rythme.</p>}
    {query.success==="sent" && <p className="alert success" role="status">Livrable enregistré. Le formateur peut maintenant l'évaluer.</p>}
    {query.error && <p className="alert danger" role="alert">L'opération n'a pas pu aboutir. Vérifie les prérequis et les informations saisies puis réessaie.</p>}

    <div className="workshop-layout">
      <div className="workshop-main">
        <section className="workshop-panel">
          <div className="workshop-panel-head"><div><span className="journey-overline">CONSTRUIRE PAR LA PRATIQUE</span><h2>{hasGuide?"Ton plan de réalisation":"Consignes du formateur"}</h2></div>{hasGuide&&<span className="workshop-step-count">{finished} / {steps.length} étapes</span>}</div>
          {hasGuide && <div className="workshop-progress" role="progressbar" aria-label="Étapes de réalisation terminées" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><span style={{width:percentage+"%"}}/></div>}
          {hasGuide && <p className="workshop-support-text">Ces étapes guident ton travail. Elles sont distinctes de la validation du formateur et ne rapportent pas d'XP à elles seules.</p>}
          {!hasGuide && <div className="workshop-notice">Cette mission a été créée par ton formateur sans étapes détaillées. Consulte la description, les compétences attendues et le livrable, puis soumets ton projet ci-dessous.</div>}
          <div className="workshop-steps">{steps.map((step,index)=>{
            const done=checked.has(index+1);
            return <article className={"workshop-step"+(done?" is-complete":"")} key={index}>
              <div className="workshop-step-index">{done?<Check size={19}/>:String(index+1).padStart(2,"0")}</div>
              <div className="workshop-step-body"><h3>{step.title}</h3><p>{step.instruction}</p>
                <div className="workshop-expected"><ShieldCheck size={14}/> <span>Résultat attendu : {step.deliverable}</span></div>
                {!done && !blocked && !validated && <form action={completeWorkshopStep} className="workshop-step-action">
                  <input type="hidden" name="missionId" value={id}/><input type="hidden" name="step" value={index+1}/>
                  <button type="submit"><Circle size={15}/> Marquer cette étape comme réalisée</button>
                </form>}
                {done && <div className="workshop-done"><CheckCircle2 size={14}/> Étape réalisée</div>}
              </div>
            </article>;
          })}</div>
        </section>
        <section className="workshop-panel">
          <div className="workshop-panel-head"><div><span className="journey-overline">VALIDATION PÉDAGOGIQUE</span><h2>Ce que le formateur va évaluer</h2></div></div>
          {hasGuide?<ul className="workshop-rubric">{rubric.map((criterion,index)=><li key={index}><BadgeCheck size={18}/><span>{criterion}</span></li>)}</ul>
            : <p className="workshop-support-text">Pour cette mission personnalisée, le formateur attribuera une note globale sur 100, accompagnée d'un commentaire pédagogique.</p>}
          <p className="workshop-support-text">Le seuil de réussite est fixé à 80/100. La décision et les commentaires sont enregistrés par ton formateur.</p>
        </section>
        <section className="workshop-panel" id="livrable">
          <div className="workshop-panel-head"><div><span className="journey-overline">LIVRABLE FINAL</span><h2>Remettre mon projet</h2></div></div>
          <p className="workshop-deliverable">{mission.deliverable}</p>
          {lastReviewed?.feedback && <div className="workshop-feedback">
            <strong>Dernier retour du formateur {lastReviewed.score!==null?"· "+lastReviewed.score+"/100":""}</strong>
            <p>{lastReviewed.feedback}</p>
            {earnedCriteria.length===4 && <div className="workshop-assessment-breakdown">
              <h3>Détail de la notation</h3>
              {rubric.map((criterion,index)=><div key={index}>
                <span>{criterion}</span><strong>{earnedCriteria[index]}/25</strong>
              </div>)}
              <div className="assessment-total"><span>Total certifié</span><strong>{assessment?.total_score}/100</strong></div>
            </div>}
          </div>}
          {canSubmit ? <form action={submitMission} className="form workshop-submit-form">
            <input type="hidden" name="missionId" value={id}/><input type="hidden" name="source" value="atelier"/>
            <label>Lien public de ton projet<input type="url" name="url" required maxLength={800} placeholder="https://github.com/... ou https://..." /></label>
            <label>Ce que tu as réalisé et ce que tu as testé<textarea name="note" rows={4} maxLength={1200} placeholder="Décris tes fonctionnalités, les tests effectués et les éventuelles difficultés."/></label>
            <button type="submit" className="primary-btn"><Send size={15}/> Envoyer à la correction</button>
          </form> : <p className="workshop-support-text">{blocked?"Termine d'abord les missions préalables.":validated?"Ce projet a déjà été validé.":recent?.status==="pending"?"Le projet est déjà entre les mains de ton formateur.":"La soumission n'est pas disponible actuellement."}</p>}
        </section>
      </div>
      <aside className="workshop-aside" aria-label="Ressources de l'atelier">
        <div className="workshop-aside-card"><span className="journey-overline"><Lightbulb size={14}/> CONSEIL DU COACH</span><p>{guide.hint}</p></div>
        <div className="workshop-aside-card">
          <span className="journey-overline">COMPÉTENCES VISÉES</span>
          <ul>{(mission.objectives||[]).map(objective=><li key={objective}><Check size={14}/>{objective}</li>)}</ul>
        </div>
        <div className="workshop-aside-card">
          <span className="journey-overline">RESSOURCE DE RÉFÉRENCE</span>
          <p>Consulte la documentation pendant ton projet. L'objectif est de comprendre et refaire, pas de recopier sans réfléchir.</p>
          {hasGuide && <a href={guide.resource_url} target="_blank" rel="noopener noreferrer">Ouvrir la documentation <ExternalLink size={14}/></a>}
        </div>
        <Link className="workshop-return" href="/espace/apprenant"><ArrowLeft size={14}/> Retour au programme</Link>
      </aside>
    </div>
  </main>;
}
