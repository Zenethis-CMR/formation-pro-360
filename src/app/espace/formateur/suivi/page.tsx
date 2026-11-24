import "./suivi.css";
import Link from "next/link";
import {ArrowLeft,ArrowRight,Users,ClipboardCheck} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {loadTrainerCockpit,selectTrainerTrack} from "@/lib/trainer-cockpit";
import "@/components/trainer-cockpit.css";
import {backendRequest} from "@/lib/auth/backend";
export const dynamic="force-dynamic";
type Workshop={module_id?:string;slug:string;title:string;week:number;status:string;score:number|null;feedback:string|null;last_submission_at:string|null;xp:number};
type Learner={learner_id:string;status:string;enrolled_at:string;preferred_name:string|null;workshops:Workshop[]};
type Report={course_slug:string;page:number;page_size:number;has_next:boolean;learners:Learner[];source:string};
const statusLabels:Record<string,string>={verified:"Vérifié",pending:"À corriger",changes_requested:"À reprendre",approved:"À rapprocher des XP",not_started:"Aucun dépôt"};
const enrollmentLabels:Record<string,string>={active:"Actif",completed:"Terminé",paused:"Suspendu",revoked:"Révoqué"};
const pretty=(value:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeZone:"Africa/Douala"}).format(new Date(value));
export default async function TrainerPilotProgress({searchParams}:{searchParams:Promise<{page?:string;parcours?:string|string[]}>}){
 await requireRole("trainer");
 const params=await searchParams;
 const parsed=Number(params.page);
 const page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const tracks=await loadTrainerCockpit();
 const selected=selectTrainerTrack(tracks,params.parcours);
 const slug=selected?.slug??"";
 const query="?parcours="+encodeURIComponent(slug);
 const res=selected?await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/trainer-progress?page="+page).catch(()=>null):null;
 const result=res?.ok?await res.json().catch(()=>null) as Report|null:null;
 const data=result?.source==="official_workshop_submissions_and_xp"&&result.course_slug===slug?result:null;
 const learners=data?.learners??[];
 const weeks=[...new Set(learners.flatMap(l=>l.workshops.map(w=>w.week)))].sort((a,b)=>a-b);
 const totals=learners.reduce((acc,l)=>{
  acc.verified+=l.workshops.filter(w=>w.status==="verified").length;
  acc.pending+=l.workshops.filter(w=>w.status==="pending").length;
  acc.rework+=l.workshops.filter(w=>w.status==="changes_requested").length;
  return acc;
 },{verified:0,pending:0,rework:0});
 return <main className="page trainer-pilot">
  <Link href="/espace/formateur" className="trainer-pilot-link"><ArrowLeft size={16}/> Espace formateur</Link>
  <header className="trainer-pilot-hero"><span><Users size={18}/> PILOTAGE HUMAIN · {selected?.title??"FORMATIONS"}</span><h1>Suivi des apprenants<span>.</span></h1><p>Prépare tes séances et interventions à partir des travaux effectivement déposés et corrigés. Les signaux ne sont pas des diagnostics automatiques de difficulté ou de maîtrise.</p></header>
  <nav className="utc-selector" aria-label="Formation à suivre">{tracks?.filter(t=>t.status==="published").map(t=><Link key={t.slug} aria-current={slug===t.slug?"page":undefined} href={"/espace/formateur/suivi?parcours="+encodeURIComponent(t.slug)}>{t.title}</Link>)}</nav>
  {!data?<section className="trainer-pilot-panel" role="status"><h2>Suivi momentanément indisponible</h2><p>Aucun chiffre n'est estimé. Tu peux continuer les corrections depuis ton espace.</p><Link href={"/espace/formateur/corrections"+query}>Ouvrir les évaluations</Link></section>:<>
   <section className="trainer-pilot-metrics" aria-label="Indicateurs de la page">{[{label:"Inscrits sur cette page",value:learners.length},{label:"Ateliers vérifiés",value:totals.verified},{label:"Dépôts à corriger",value:totals.pending},{label:"Travaux à reprendre",value:totals.rework}].map(m=><div key={m.label}><small>{m.label}</small><strong>{m.value}</strong></div>)}</section>
   <section className="trainer-pilot-panel"><div className="trainer-pilot-head"><div><h2>Matrice des réalisations</h2><p>Couverture des ateliers publiés par semaine. Les cellules indiquent le nombre de preuves vérifiées, jamais un classement des apprenants.</p></div></div>
   {learners.length>0?<div className="trainer-report-matrix" tabIndex={0} role="region" aria-label="Tableau de couverture par apprenant et semaine"><table><thead><tr><th scope="col">Apprenant</th>{weeks.map((week,i)=><th key={i} scope="col">S{week}</th>)}<th scope="col">Bilan</th></tr></thead><tbody>{learners.map(l=><tr key={l.learner_id}><th scope="row">{l.preferred_name||"Apprenant "+l.learner_id.slice(0,8)}</th>{weeks.map((week,i)=>{const w=l.workshops.filter(w=>w.week===week);const n=w.filter(w=>w.status==="verified").length;return <td key={i}><span className={"trainer-matrix-cell "+(!w.length?"unavailable":n===w.length?"full":n>0?"partial":"empty")} aria-label={!w.length?"Aucun atelier publié":n+" sur "+w.length+" vérifiés"}>{w.length?n+"/"+w.length:"—"}</span></td>;})}<td><Link href={"/espace/formateur/bilan"+query+"&learner_id="+encodeURIComponent(l.learner_id)}>Ouvrir <ArrowRight size={13}/></Link></td></tr>)}</tbody></table></div>:<p>Aucun inscrit affiché sur cette page.</p>}
   <p className="trainer-matrix-note">— = aucun atelier publié pour cette semaine. 0/n = aucune preuve vérifiée, pas absence de compétence. Les données concernent la page affichée.</p></section>
   <div className="trainer-pilot-panel"><div className="trainer-pilot-head"><div><h2>Interventions pédagogiques</h2><p>Page {page} · maximum {data.page_size} inscrits. Les chiffres ci-dessus concernent cette page uniquement.</p></div><Link className="trainer-pilot-link" href={"/espace/formateur/corrections"+query}><ClipboardCheck size={16}/> Corriger les livrables <ArrowRight size={16}/></Link></div>
   {!learners.length&&<p role="status">Aucun inscrit affiché sur cette page.</p>}
   {learners.map((l,i)=>{
    const verified=l.workshops.filter(w=>w.status==="verified");
    const pending=l.workshops.filter(w=>w.status==="pending");
    const rework=l.workshops.filter(w=>w.status==="changes_requested");
    const total=l.workshops.length;
    return <details className="trainer-pilot-person" key={l.learner_id}>
     <summary><div><strong>{l.preferred_name||"Apprenant "+l.learner_id.slice(0,8)}</strong><small>{enrollmentLabels[l.status]||l.status} · Inscrit le {pretty(l.enrolled_at)}</small></div><div><b>{verified.length}/{total} vérifiés</b><small>{pending.length} à corriger · {rework.length} à reprendre</small></div></summary>
     <div className="trainer-pilot-detail">
      <Link className="trainer-pilot-link" href={"/espace/formateur/bilan"+query+"&learner_id="+encodeURIComponent(l.learner_id)}>Consulter le bilan complet <ArrowRight size={15}/></Link>
      <progress value={verified.length} max={Math.max(total,1)} aria-label="Ateliers vérifiés"/>
      <p>{verified.reduce((n,w)=>n+w.xp,0)} XP issus des preuves vérifiées · {total} ateliers publiés. Les ateliers non déposés ne prouvent pas une absence de travail.</p>
      {rework.length>0&&<p><strong>À aborder en séance :</strong> {rework.map(w=>w.title).join(" ; ")}</p>}
      <div className="trainer-pilot-workshops">{l.workshops.map(w=><article key={(w.module_id??"")+":"+w.slug}>
       <div><small>Semaine {w.week} · {statusLabels[w.status]||"Statut à vérifier"}</small><h3>{w.title}</h3>{w.feedback&&<p>{w.feedback}</p>}{w.last_submission_at&&<small>Dernier dépôt : {pretty(w.last_submission_at)}</small>}</div>
       <div className="trainer-pilot-score"><strong>{w.score===null?"—":w.score+"/100"}</strong>{w.status==="verified"&&<small>{w.xp} XP officiels</small>}</div>
      </article>)}</div>
     </div>
    </details>;
   })}
   <nav className="trainer-pilot-pagination" aria-label="Pages des apprenants">{page>1&&<Link href={"/espace/formateur/suivi"+query+"&page="+(page-1)}>← Précédente</Link>}<span>Page {page}</span>{data.has_next&&page<1000&&<Link href={"/espace/formateur/suivi"+query+"&page="+(page+1)}>Suivante →</Link>}</nav>
   <p>Les dossiers et backlogs privés ne sont pas consultés dans ce rapport. Les corrections restent humaines et s'effectuent dans Évaluations.</p>
   </div>
  </>}
 </main>;
}
