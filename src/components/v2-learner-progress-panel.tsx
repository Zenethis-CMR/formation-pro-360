import Link from "next/link";
import { ArrowRight, Award, BookOpenCheck, CheckCircle2, Clock3, LockKeyhole, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import type { V2LearnerProgress as Progress, V2Submission } from "@/lib/v2-learner-progress";

const pilotHref="/espace/parcours/ingenierie-produit-ia";
function labelFor(status:V2Submission["status"]){
  return status==="approved"?"Validé":status==="pending"?"En correction":"À améliorer";
}
function dateString(stamp:string){
  const date=new Date(stamp);
  if(!Number.isFinite(date.getTime()))return "Date indisponible";
  return new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",dateStyle:"medium"}).format(date);
}
export function V2LearnerProgressPanel({progress,otherXp}:{progress:Progress;otherXp:number}){
  const enrolled=progress.enrollment==="active"||progress.enrollment==="completed";
  const paused=progress.enrollment==="paused"||progress.enrollment==="revoked";
  const lessonVersions=new Map<string,Progress["lessons"][number]>();
  for(const lesson of progress.lessons){
    const key=lesson.module_id+":"+lesson.slug;
    if(!lessonVersions.has(key))lessonVersions.set(key,lesson);
  }
  const latest=new Map<string,V2Submission>();
  for(const submission of progress.submissions){
    const key=submission.module_id+":"+submission.lesson_slug;
    if(!latest.has(key))latest.set(key,submission);
  }
  const successes=[...latest.values()].filter(s=>s.status==="approved").length;
  const pending=[...latest.values()].filter(s=>s.status==="pending").length;
  const revisions=[...latest.values()].filter(s=>s.status==="changes_requested").length;
  const total=lessonVersions.size||16;
  const percent=enrolled&&progress.lessonAccess
    ?Math.min(100,Math.round(successes/total*100)):0;
  const lessonNames=new Map([...lessonVersions].map(([key,lesson])=>[key,lesson.title]));
  const recent=progress.submissions.slice(0,4);
  const toImprove=[...latest.values()].filter(s=>s.status==="changes_requested");
  const toReview=[...latest.values()].filter(s=>s.status==="pending");
  return <section className="v2-progress-hub" aria-labelledby="v2-progress-heading">
    <header className="v2-progress-head">
      <div><span className="journey-overline"><Sparkles size={15}/> MON PARCOURS · INGÉNIERIE PRODUIT ET IA</span>
        <h2 id="v2-progress-heading">Ma progression dans le pilote</h2>
        <p>Résultats vérifiés par ton formateur. Retrouve tes validations et, plus bas, les acquis de tes autres réalisations.</p>
      </div>
      <Link href={pilotHref} className="v2-progress-go">{enrolled?"Continuer mes ateliers":progress.enrollmentOpen&&!paused?"Rejoindre la formation":"Ouvrir le parcours"} <ArrowRight size={16}/></Link>
    </header>
    {!progress.available?<div className="v2-progress-empty"><LockKeyhole size={19}/><div><strong>Statut du parcours momentanément indisponible</strong><p>Consulte le programme sans supposer que ton inscription ou tes évaluations sont activées.</p></div></div>
    :!enrolled?<div className="v2-progress-empty"><BookOpenCheck size={19}/><div>
      <strong>{paused?"Ton inscription au parcours est suspendue":progress.enrollmentOpen?"Prêt à rejoindre le pilote ?":"Le programme est disponible"}</strong>
      <p>{paused?"Les résultats restent privés. Contacte ton formateur pour retrouver l'accès.":
        progress.enrollmentOpen?"Inscris-toi depuis ton parcours pour commencer les 16 ateliers et suivre tes validations ici.":
        "Ton inscription n'est pas encore ouverte pour ce compte. Le programme détaillé reste consultable."}</p>
    </div></div>
    :<>
      <div className="v2-progress-metrics">
        <div className="v2-progress-stat"><span><CheckCircle2 size={15}/> Ateliers validés</span><strong>{successes}<small> / {total}</small></strong><p>{percent}% du parcours évalué avec succès</p></div>
        <div className="v2-progress-stat"><span><Award size={15}/> XP CUMULÉS</span><strong>{progress.xpTotal+otherXp}</strong><p>{progress.xpTotal} XP du parcours · {otherXp} XP des autres réalisations</p></div>
        <div className="v2-progress-stat"><span><Clock3 size={15}/> En correction</span><strong>{pending}</strong><p>{revisions} atelier(s) à améliorer</p></div>
      </div>
      <div className="portfolio-progress-shortcut"><Link href="/espace/portfolio">
        <BookOpenCheck size={17}/> Voir mes réalisations vérifiées <ArrowRight size={15}/>
      </Link></div>
      <div className="v2-progress-bar" role="progressbar" aria-valuenow={successes} aria-valuemin={0} aria-valuemax={total} aria-label="Ateliers validés"><span style={{width:percent+"%"}}/></div>
      {(toImprove.length>0||toReview.length>0)&&
        <section className="v2-progress-priorities" aria-labelledby="v2-progress-priorities-title">
          <header><AlertTriangle size={17}/>
            <div><h3 id="v2-progress-priorities-title">Mes prochaines priorités</h3>
              <p>Ces statuts viennent des vrais dépôts et corrections de ton parcours.</p>
            </div></header>
          <div className="v2-progress-priority-grid">
            {toImprove.map(item=><Link key={item.id}
              href={pilotHref+"/atelier/"+item.lesson_slug+"#retour-formateur"}
              className="v2-progress-priority is-revision">
              <span>À CORRIGER · {item.score!==null?item.score+"/100":"Retour disponible"}</span>
              <strong>{lessonNames.get(item.module_id+":"+item.lesson_slug)||"Atelier"}</strong>
              <small>Relire la correction, définir une action et préparer une nouvelle preuve.</small>
              <b>Voir les remarques <ArrowRight size={14}/></b>
            </Link>)}
            {toReview.map(item=><Link key={item.id}
              href={pilotHref+"/atelier/"+item.lesson_slug+"#livrable"}
              className="v2-progress-priority">
              <span>EN CORRECTION</span>
              <strong>{lessonNames.get(item.module_id+":"+item.lesson_slug)||"Atelier"}</strong>
              <small>Le livrable attend une décision du formateur. Aucun XP anticipé.</small>
              <b>Suivre ma remise <ArrowRight size={14}/></b>
            </Link>)}
          </div>
        </section>}
      <div className="v2-progress-grid">
        <div className="v2-progress-weeks"><div className="v2-progress-subhead"><TrendingUp size={17}/><h3>Mes huit semaines</h3></div>
          {progress.modules.map(module=>{
            const lessons=[...lessonVersions.values()].filter(l=>l.module_id===module.id);
            const validated=lessons.filter(l=>latest.get(l.module_id+":"+l.slug)?.status==="approved").length;
            const weekTotal=lessons.length||2;
            const weekPercent=Math.min(100,Math.round(validated/weekTotal*100));
            const current=lessons.find(l=>latest.get(l.module_id+":"+l.slug)?.status!=="approved");
            const target=current||lessons[0];
            return <Link key={module.id} href={target?pilotHref+"/atelier/"+target.slug:pilotHref} className="v2-progress-week">
              <span className="v2-progress-week-number">S{String(module.week).padStart(2,"0")}</span>
              <span className="v2-progress-week-name"><strong>{module.title}</strong><span className="v2-progress-week-line"><i style={{width:weekPercent+"%"}}/></span></span>
              <b>{validated}/{weekTotal}</b><ArrowRight size={15}/>
            </Link>;
          })}
        </div>
        <div className="v2-progress-latest"><div className="v2-progress-subhead"><BookOpenCheck size={17}/><h3>Retours récents</h3></div>
          {!recent.length?<p className="v2-progress-no-review">Aucun livrable déposé pour le moment. Réalise ton premier atelier pour recevoir une correction.</p>:
          recent.map(item=>{
            const name=lessonNames.get(item.module_id+":"+item.lesson_slug)||"Atelier";
            return <article key={item.id} className="v2-progress-feedback">
              <div><span className={"v2-progress-status state-"+item.status}>{labelFor(item.status)}</span>
                <time dateTime={item.reviewed_at||item.created_at}>{dateString(item.reviewed_at||item.created_at)}</time></div>
              <strong>{name}</strong>
              {item.score!==null&&<small>Note du formateur : {item.score}/100</small>}
              {item.feedback&&<p>{item.feedback}</p>}
            </article>;
          })}
        </div>
      </div>
    </>}
  </section>;
}
