import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,GraduationCap,LockKeyhole,Layers3,ClipboardCheck} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {getProductionGuide} from "@/lib/technical-production-guides";
import {getAiTrainingPlan,trainingHours,formatWorkload} from "@/lib/ai-training-plans";
import {ActivityWorkload} from "@/components/activity-workload";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {specializations} from "@/lib/v2-public-catalog";
import "./formations.css";
export const dynamic="force-dynamic";
type Track={id:string;slug:string;title:string;summary:string;status:"draft"|"published"|"archived";module_count:number;lesson_count?:number};
type Module={id:string;slug:string;week:number;title:string;outcome:string};
type Lesson={id:string;slug:string;module_id:string;title:string;objective:string;guided_work:string;independent_work:string;evidence_required:string;rubric:unknown[];version:number;status:"draft"|"published"};
const tones=["blue","violet","coral","green","blue","slate","amber"];
const known=["ingenierie-produit-ia",...specializations.map(t=>t.slug)];
const label={draft:"Brouillon",published:"Publié",archived:"Archivé"};

async function read<T>(suffix:string):Promise<T|null>{const res=await backendRequest("/v1/training/catalog"+suffix).catch(()=>null);return res?.ok?await res.json().catch(()=>null) as T|null:null;}
export default async function TrainerFormations({searchParams}:{searchParams:Promise<{parcours?:string}>}){
 await requireRole("trainer");
 const params=await searchParams;
 const catalog=await read<{tracks:Track[]}>("");
 const tracks=Array.isArray(catalog?.tracks)?catalog.tracks:null;
 const ordered=tracks?[...tracks].sort((a,b)=>{const rank=(s:string)=>known.includes(s)?known.indexOf(s):known.length;return rank(a.slug)-rank(b.slug);}):[];
 const chosen=ordered.find(t=>t.slug===params.parcours)||ordered[0];
 const plan=chosen?getAiTrainingPlan(chosen.slug):undefined;
 const [detail,authoring]=chosen?await Promise.all([read<{track:Track;modules:Module[];lessons:Lesson[]}>("/"+encodeURIComponent(chosen.slug)),read<{lessons:{lesson_id:string;revision:number|null;state:"draft"|"ready"|null}[]}>("/"+encodeURIComponent(chosen.slug)+"/authoring")]):[null,null];
 const authorRows=Array.isArray(authoring?.lessons)?authoring.lessons:null;
 const authorStates=new Map(authorRows?.map(row=>[row.lesson_id,row]));
 return <main className="page mf-page">
  <Link className="mf-back" href="/espace/formateur?onglet=programme"><ArrowLeft size={16}/> Programme pédagogique</Link>
  <header className="mf-hero"><div><span><GraduationCap size={16}/> CURRICULUM FACTORY 360</span><h1>Mes formations.</h1><p>Prépare les activités, les méthodes IA, les démonstrations et les grilles de correction avant leur ouverture.</p></div><div className="mf-hero-count"><strong>{tracks?tracks.length:"—"}</strong><small>parcours enregistrés</small></div></header>
  {tracks===null?<section className="mf-notice" role="status">Le catalogue backend est indisponible. Aucun état de publication n’est estimé.</section>:<>
   <div className="mf-metrics"><article><BookOpen size={20}/><strong>{tracks.filter(t=>t.status==="published").length}</strong><span>Parcours publiés</span></article><article><Layers3 size={20}/><strong>{tracks.filter(t=>t.status==="draft").length}</strong><span>Brouillons à préparer</span></article><article><ClipboardCheck size={20}/><strong>{tracks.every(t=>typeof t.lesson_count==="number")?tracks.reduce((n,t)=>n+(t.lesson_count??0),0):"—"}</strong><span>Ateliers enregistrés</span></article></div>
   <div className="mf-layout"><nav className="mf-list" aria-label="Choisir une formation"><h2>Les parcours</h2>{ordered.map(t=><Link key={t.id} data-tone={tones[known.indexOf(t.slug)]||"blue"} className={"mf-track"+(chosen?.slug===t.slug?" selected":"")} aria-current={chosen?.slug===t.slug?"page":undefined} href={"/espace/formateur/formations?parcours="+encodeURIComponent(t.slug)}><span className="mf-track-icon"><BookOpen size={19}/></span><span><strong>{t.title}</strong><small>{label[t.status]} · {t.module_count} modules</small></span><ArrowRight size={15}/></Link>)}</nav>
    <section className="mf-detail" aria-label="Programme sélectionné">{!chosen?<p>Aucun parcours enregistré.</p>:<><header><span className="mf-eyebrow">{label[chosen.status].toUpperCase()}</span><h2>{chosen.title}</h2><p>{chosen.summary}</p>{detail&&detail.modules.length>0&&<p className="mf-duration"><strong>{plan?formatWorkload(trainingHours(plan)*60)+" de travail indicatif":"Charge à définir"}</strong> · {detail.modules.length} modules · {detail.lessons.length} activités enregistrées · durée individuelle selon le rythme</p>}{known.includes(chosen.slug)&&<Link href={"/catalogue/"+chosen.slug}>Voir la présentation publique <ArrowRight size={15}/></Link>}</header>
    {chosen.status!=="published"&&<div className="mf-notice"><LockKeyhole size={19}/><div><strong>Inscriptions fermées</strong><p>Le contenu est en préparation. Cette vue ne publie aucun atelier et ne donne aucun accès à un apprenant.</p></div></div>}
    {authorRows&&<div className="mf-authoring-summary"><strong>Préparation éditoriale</strong><span>{authorRows.filter(row=>row.state==="ready").length} prêtes pour revue · {authorRows.filter(row=>row.state==="draft").length} en rédaction · {authorRows.filter(row=>row.state===null).length} sans copie</span><small>Les copies ne sont pas publiées.</small></div>}{!authorRows&&<p role="status">État de rédaction indisponible.</p>}
    {!detail?<p role="status">Détail du programme indisponible.</p>:<div className="mf-weeks">{detail.modules.map((m,index)=><details key={m.id} open={index===0}><summary><span>M{index+1}</span><div><strong>{m.title}</strong><small>{m.outcome}</small></div></summary>{detail.lessons.filter(l=>l.module_id===m.id).map(l=><article key={l.id}><div className="mf-lesson-title"><h3>{l.title}</h3><small>{label[l.status]} · v{l.version}</small></div><Link className="mf-authoring-link" href={"/espace/formateur/formations/"+encodeURIComponent(chosen.slug)+"/atelier/"+l.id}>{authorStates.get(l.id)?.state==="ready"?"Revoir la copie prête":authorStates.get(l.id)?.state==="draft"?"Reprendre la rédaction":"Ouvrir le studio de rédaction"} <ArrowRight size={15}/></Link>{!authorStates.get(l.id)?.revision&&l.version===1&&getProductionGuide(chosen.slug,l.slug)?.title===l.title&&<p className="mf-guide-label">Fiche de production proposée · à adapter</p>}<p>{l.objective}</p>{(()=>{const mi=chosen.slug===pilotCourse.slug?pilotCourse.modules.findIndex(mod=>mod.slug===m.slug):Number(/^semaine-(\d+)$/.exec(m.slug)?.[1])-1;const li=chosen.slug===pilotCourse.slug?pilotCourse.modules[mi]?.lessons.findIndex(lesson=>lesson.slug===l.slug):Number(/^s\d+-a(\d+)$/.exec(l.slug)?.[1])-1;const activity=li!==undefined?plan?.modules[mi]?.activities[li]:undefined;return activity?<div className="ai-method"><ActivityWorkload activity={activity}/><strong>Méthode IA proposée</strong>{activity.procedure}</div>:null;})()}<dl><dt>Travail guidé</dt><dd>{l.guided_work}</dd><dt>Travail autonome</dt><dd>{l.independent_work}</dd><dt>Preuve attendue</dt><dd>{l.evidence_required}</dd></dl>{Array.isArray(l.rubric)&&l.rubric.length>0&&<ul>{l.rubric.flatMap(x=>typeof x==="string"?[x]:x&&typeof x==="object"&&"label" in x&&typeof x.label==="string"?[x.label]:[]).map((c,i)=><li key={i}>{c}</li>)}</ul>}</article>)}</details>)}</div>}
    </>}</section></div>
  </>}
 </main>;
}
