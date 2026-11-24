import "./suivi.css";
import Link from "next/link";
import {ArrowLeft,ArrowRight,Users,ClipboardCheck} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
export const dynamic="force-dynamic";
type Workshop={slug:string;title:string;week:number;status:string;score:number|null;feedback:string|null;last_submission_at:string|null;xp:number};
type Learner={learner_id:string;status:string;enrolled_at:string;preferred_name:string|null;workshops:Workshop[]};
type Report={page:number;page_size:number;has_next:boolean;learners:Learner[];source:string};
const statusLabels:Record<string,string>={verified:"Vérifié",pending:"À corriger",changes_requested:"À reprendre",approved:"À rapprocher des XP",not_started:"Aucun dépôt"};
const enrollmentLabels:Record<string,string>={active:"Actif",completed:"Terminé",paused:"Suspendu",revoked:"Révoqué"};
const pretty=(value:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeZone:"Africa/Douala"}).format(new Date(value));
export default async function TrainerPilotProgress({searchParams}:{searchParams:Promise<{page?:string}>}){
 await requireRole("trainer");
 const params=await searchParams;
 const parsed=Number(params.page);
 const page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/trainer-progress?page="+page).catch(()=>null);
 const result=res?.ok?await res.json().catch(()=>null) as Report|null:null;
 const data=result?.source==="official_workshop_submissions_and_xp"?result:null;
 const learners=data?.learners??[];
 const totals=learners.reduce((acc,l)=>{
  acc.verified+=l.workshops.filter(w=>w.status==="verified").length;
  acc.pending+=l.workshops.filter(w=>w.status==="pending").length;
  acc.rework+=l.workshops.filter(w=>w.status==="changes_requested").length;
  return acc;
 },{verified:0,pending:0,rework:0});
 return <main className="page trainer-pilot">
  <Link href="/espace/formateur" className="trainer-pilot-link"><ArrowLeft size={16}/> Espace formateur</Link>
  <header className="trainer-pilot-hero"><span><Users size={18}/> PILOTAGE HUMAIN · INGÉNIERIE PRODUIT ET IA</span><h1>Suivi des apprenants<span>.</span></h1><p>Prépare tes séances et interventions à partir des travaux effectivement déposés et corrigés. Les signaux ne sont pas des diagnostics automatiques de difficulté ou de maîtrise.</p></header>
  {!data?<section className="trainer-pilot-panel" role="status"><h2>Suivi V2 momentanément indisponible</h2><p>Aucun chiffre n'est estimé. Tu peux continuer les corrections depuis ton espace.</p><Link href="/espace/formateur?onglet=evaluations">Ouvrir les évaluations</Link></section>:<>
   <section className="trainer-pilot-metrics" aria-label="Indicateurs de la page">{[{label:"Inscrits sur cette page",value:learners.length},{label:"Ateliers vérifiés",value:totals.verified},{label:"Dépôts à corriger",value:totals.pending},{label:"Travaux à reprendre",value:totals.rework}].map(m=><div key={m.label}><small>{m.label}</small><strong>{m.value}</strong></div>)}</section>
   <div className="trainer-pilot-panel"><div className="trainer-pilot-head"><div><h2>Interventions pédagogiques</h2><p>Page {page} · maximum {data.page_size} inscrits. Les chiffres ci-dessus concernent cette page uniquement.</p></div><Link className="trainer-pilot-link" href="/espace/formateur?onglet=evaluations"><ClipboardCheck size={16}/> Corriger les livrables <ArrowRight size={16}/></Link></div>
   {!learners.length&&<p role="status">Aucun inscrit affiché sur cette page.</p>}
   {learners.map((l,i)=>{
    const verified=l.workshops.filter(w=>w.status==="verified");
    const pending=l.workshops.filter(w=>w.status==="pending");
    const rework=l.workshops.filter(w=>w.status==="changes_requested");
    const total=l.workshops.length;
    return <details className="trainer-pilot-person" key={l.learner_id}>
     <summary><div><strong>{l.preferred_name||"Apprenant "+l.learner_id.slice(0,8)}</strong><small>{enrollmentLabels[l.status]||l.status} · Inscrit le {pretty(l.enrolled_at)}</small></div><div><b>{verified.length}/{total} vérifiés</b><small>{pending.length} à corriger · {rework.length} à reprendre</small></div></summary>
     <div className="trainer-pilot-detail">
      <progress value={verified.length} max={Math.max(total,1)} aria-label="Ateliers vérifiés"/>
      <p>{verified.reduce((n,w)=>n+w.xp,0)} XP issus des preuves vérifiées · {total} ateliers publiés. Les ateliers non déposés ne prouvent pas une absence de travail.</p>
      {rework.length>0&&<p><strong>À aborder en séance :</strong> {rework.map(w=>w.title).join(" ; ")}</p>}
      <div className="trainer-pilot-workshops">{l.workshops.map(w=><article key={w.slug}>
       <div><small>Semaine {w.week} · {statusLabels[w.status]||"Statut à vérifier"}</small><h3>{w.title}</h3>{w.feedback&&<p>{w.feedback}</p>}{w.last_submission_at&&<small>Dernier dépôt : {pretty(w.last_submission_at)}</small>}</div>
       <div className="trainer-pilot-score"><strong>{w.score===null?"—":w.score+"/100"}</strong>{w.status==="verified"&&<small>{w.xp} XP officiels</small>}</div>
      </article>)}</div>
     </div>
    </details>;
   })}
   <nav className="trainer-pilot-pagination" aria-label="Pages des apprenants">{page>1&&<Link href={"/espace/formateur/suivi?page="+(page-1)}>← Précédente</Link>}<span>Page {page}</span>{data.has_next&&page<1000&&<Link href={"/espace/formateur/suivi?page="+(page+1)}>Suivante →</Link>}</nav>
   <p>Les dossiers et backlogs privés ne sont pas consultés dans ce rapport. Les corrections restent humaines et s'effectuent dans Évaluations.</p>
   </div>
  </>}
 </main>;
}
