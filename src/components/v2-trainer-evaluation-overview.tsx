import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ClipboardCheck, GraduationCap, RotateCcw, Sparkles } from "lucide-react";
import { backendRequest } from "@/lib/auth/backend";

type Overview={
  enrollments:{total:number;active:number;completed:number;paused:number};
  assessments:{submissions:number;pending:number;approved:number;changes_requested:number};
  xp_awarded:number;
  recent:{
    id:string;lesson_title:string;module_week:number;
    score:number;status:"approved"|"changes_requested";feedback:string|null;reviewed_at:string;
  }[];
};

function prettyDate(stamp:string){
  const d=new Date(stamp);
  return Number.isFinite(d.getTime())?
    new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",dateStyle:"medium"}).format(d):
    "Date indisponible";
}

/** A read-only, trainer-scoped view. Never query or mix with V1 submissions. */
export async function V2TrainerEvaluationOverview({dashboard=false}:{dashboard?:boolean}={}){
  let summary:Overview|null=null;
  try{
    const response=await backendRequest(
      "/v1/training/catalog/ingenierie-produit-ia/evaluation-overview"
    );
    if(response.ok)summary=await response.json() as Overview;
  }catch{/* fail closed: preserve historical V1 correction workflows */}
  return <section className={"v2-trainer-summary"+(dashboard?" trainer-cockpit-v5":"")} aria-labelledby="v2-trainer-summary-heading">
    <div className="v2-trainer-summary-head"><div>
      <span className="journey-overline"><Sparkles size={14}/> PARCOURS ACTIF · SUIVI PÉDAGOGIQUE</span>
      <h2 id="v2-trainer-summary-heading">Ingénierie produit et IA</h2>
      <p>Inscriptions, évaluations et récompenses de la formation Ingénierie produit et IA.</p>
      {dashboard&&summary&&<div className="v5-trainer-queue"><ClipboardCheck size={16}/><span>{summary.assessments.pending===0?"Aucun livrable en attente":summary.assessments.pending+" livrable(s) à corriger"} · {summary.enrollments.active} apprenant(s) actif(s)</span></div>}
    </div>
      <Link href="/espace/formateur/corrections" className="v2-trainer-summary-link">Corriger les ateliers <ArrowRight size={16}/></Link>
    </div>
    {!summary?<div className="v2-progress-empty"><ClipboardCheck size={19}/><div><strong>Indicateurs du parcours indisponibles</strong>
      <p>L'accès à l'API de suivi doit être vérifié. Les autres corrections restent accessibles.</p></div></div>:
      <>
        <div className="v2-trainer-summary-stats">
          <div data-tone="blue"><span><GraduationCap size={16}/> Apprenants inscrits</span><strong>{summary.enrollments.total}</strong><small>{summary.enrollments.active} actif(s) · {summary.enrollments.completed} terminé(s)</small></div>
          <div data-tone="amber"><span><ClipboardCheck size={16}/> Livrables en attente</span><strong>{summary.assessments.pending}</strong><small>{summary.assessments.submissions} tentative(s) enregistrée(s)</small></div>
          <div data-tone="teal"><span><CheckCircle2 size={16}/> Ateliers validés</span><strong>{summary.assessments.approved}</strong><small>{summary.assessments.changes_requested} retour(s) à améliorer</small></div>
          <div data-tone="violet"><span><Award size={16}/> XP attribués</span><strong>{summary.xp_awarded}</strong><small>Récompenses de ce parcours</small></div>
        </div>
        <div className="v2-trainer-recent">
          <div><h3><RotateCcw size={17}/> Dernières corrections</h3><Link href="/espace/formateur/corrections">Gérer les soumissions <ArrowRight size={14}/></Link></div>
          {!summary.recent.length?<p>Aucune correction enregistrée pour le moment. Les nouvelles validations apparaîtront ici.</p>:
          <div className="v2-trainer-recent-list">{summary.recent.map(item=><article key={item.id} data-review-state={item.status}>
            <div><span>SEMAINE {item.module_week} · {item.status==="approved"?"VALIDÉ":"À AMÉLIORER"}</span><time dateTime={item.reviewed_at}>{prettyDate(item.reviewed_at)}</time></div>
            <div className="v5-review-main"><strong>{item.lesson_title}</strong><b className="v5-review-score" aria-label={"Note : "+item.score+" sur 100"}>{item.score}<small>/100</small></b></div>
            {item.feedback&&<p>{item.feedback}</p>}
          </article>)}</div>}
        </div>
      </>}
  </section>;
}
