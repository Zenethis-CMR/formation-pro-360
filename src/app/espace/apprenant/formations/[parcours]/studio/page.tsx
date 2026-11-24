import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ClipboardCheck,LockKeyhole,ShieldCheck,Sparkles,Target} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {parseStudioTrack,selectStudioLesson,validStudioTrackSlug,type WorkshopState} from "@/lib/universal-learning";
import {V2WorkshopCopyTools} from "@/components/v2-workshop-tools";
import "../../formations.css";
import "./studio.css";

export const dynamic="force-dynamic";
const directory="/espace/apprenant/formations";
const labels:Record<WorkshopState,string>={not_started:"À réaliser",pending:"En correction",approved:"Validé",changes_requested:"À améliorer",unknown:"Statut indisponible"};
export default async function UniversalStudio({params,searchParams}:{params:Promise<{parcours:string}>;searchParams:Promise<{atelier?:string|string[]}>}){
 await requireRole("learner");
 const {parcours}=await params;
 const {atelier}=await searchParams;
 const valid=validStudioTrackSlug(parcours);
 const response=valid?await backendRequest("/v1/training/catalog/"+encodeURIComponent(parcours)).catch(()=>null):null;
 const track=response?.ok?parseStudioTrack(await response.json().catch(()=>null),parcours):null;
 const base=directory+"/"+encodeURIComponent(parcours)+"/studio";
 if(!track)return <main className="page ul-page"><Link className="ul-back" href={directory}><ArrowLeft size={16}/> Mes formations</Link><section className="ul-card" role="status"><LockKeyhole size={24}/><h1>Studio indisponible</h1><p>Une inscription active ou terminée et un parcours publié sont nécessaires. Aucun atelier privé n’est affiché.</p><Link className="ul-link" href={directory}>Vérifier mes inscriptions <ArrowRight size={16}/></Link></section></main>;
 const lesson=selectStudioLesson(track.lessons,atelier);
 const module=track.modules.find(m=>m.id===lesson?.module_id);
 const position=lesson?track.lessons.findIndex(l=>l.id===lesson.id):-1;
 const href=(id:string)=>base+"?atelier="+encodeURIComponent(id);
 const previous=position>0?track.lessons[position-1]:null;
 const next=position>=0?track.lessons[position+1]:null;
 const prompt=lesson?["Agis comme un coach de pratique. Aide-moi à comprendre et à exécuter la mission sans inventer de preuve ni remplacer la correction humaine.","Formation : "+track.title,"Atelier : "+lesson.title,"Objectif : "+lesson.objective,"Travail guidé : "+lesson.guided_work,"Travail autonome : "+lesson.independent_work,"Preuve exigée : "+lesson.evidence_required,"Critères : "+lesson.rubric.map(c=>c.label+(c.descriptor?" — "+c.descriptor:"")).join(" ; "),"Demande mon contexte, propose des étapes, indique les vérifications nécessaires et distingue hypothèses et résultats observés."].join("\n\n"):"";
 const template=lesson?["# "+lesson.title,"## Objectif et contexte","## Réalisation concrète","## Démarche et usage de l’IA","## Tests et preuves observées","## Livrable demandé\n"+lesson.evidence_required,"## Vérification des critères\n"+lesson.rubric.map(c=>"- [ ] "+c.label).join("\n"),"## Limites et améliorations"].join("\n\n"):"";
 return <main className="page ul-page us-page">
 <Link className="ul-back" href={directory+"?parcours="+encodeURIComponent(parcours)}><ArrowLeft size={16}/> Mes formations</Link>
 <header className="ul-hero"><span>LEARNING STUDIO 360</span><h1>{track.title}</h1><p>{track.summary}</p><div className="us-facts"><span>{track.modules.length} modules</span><span>{track.lessons.length} ateliers publiés</span><span>{track.enrollment==="completed"?"Formation terminée":"Inscription active"}</span></div>{parcours==="ingenierie-produit-ia"&&<Link className="ul-link" href="/espace/parcours/ingenierie-produit-ia">Accéder au studio complet du pilote <ArrowRight size={16}/></Link>}</header>
 <div className="us-layout">
 <nav className="ul-card us-nav" aria-label="Ateliers de la formation"><h2>Mon programme</h2>{track.modules.map(m=><section key={m.id}><h3>{m.title}</h3>{track.lessons.filter(l=>l.module_id===m.id).map(l=><Link key={l.id} href={href(l.id)} className={"ul-track"+(lesson?.id===l.id?" selected":"")} aria-current={lesson?.id===l.id?"page":undefined}><BookOpen size={17}/><span><strong>{l.title}</strong><small>{labels[l.state]}</small></span><ArrowRight size={15}/></Link>)}{!track.lessons.some(l=>l.module_id===m.id)&&<p>Aucun atelier publié.</p>}</section>)}</nav>
 {!lesson?<section className="ul-card" role="status"><h2>{track.lessons.length?"Choisis un atelier publié":"Aucun atelier publié"}</h2><p>{track.lessons.length?"L’atelier demandé ne correspond pas à une version publiée accessible. Sélectionne un atelier dans le programme.":"Le contenu sera disponible après sa publication officielle."}</p>{track.lessons.length>0&&<Link className="ul-link" href={base}>Reprendre mon parcours <ArrowRight size={16}/></Link>}</section>:<div className="us-main">
 <section className="ul-card us-workshop"><span className="ul-overline">{module?.title} · ATELIER {position+1}/{track.lessons.length}</span><h2>{lesson.title}</h2><p>{lesson.objective||"Objectif non renseigné."}</p><span className="us-status"><CheckCircle2 size={16}/> {labels[lesson.state]} · version {lesson.version}</span><nav className="us-anchors" aria-label="Sections de l’atelier"><a href="#mission">Mission</a><a href="#pratique">Pratique</a><a href="#qualite">Qualité</a><a href="#outils">Outils IA</a><a href="#preuve">Livrable</a></nav></section>
 <section id="mission" className="ul-card us-workshop"><span className="ul-overline"><Target size={16}/> 01 · COMPRENDRE</span><h2>Objectif de la mission</h2><p>{lesson.objective||"Objectif non renseigné."}</p>{module?.outcome&&<p><strong>Résultat attendu du module :</strong> {module.outcome}</p>}{module?.skills.length?<div className="us-skills">{module.skills.map((s,i)=><span key={i}>{s}</span>)}</div>:null}</section>
 <section id="pratique" className="ul-card us-workshop"><span className="ul-overline"><BookOpen size={16}/> 02 · PRODUIRE</span><h2>Passer à la pratique</h2><h3>Exercice guidé</h3><p className="us-content">{lesson.guided_work||"Consigne non renseignée."}</p><h3>Travail autonome</h3><p className="us-content">{lesson.independent_work||"Consigne non renseignée."}</p></section>
 <section id="qualite" className="ul-card us-workshop"><span className="ul-overline"><ShieldCheck size={16}/> 03 · VÉRIFIER</span><h2>Critères officiels de qualité</h2>{lesson.rubric.length?<ol className="us-rubric">{lesson.rubric.map((c,i)=><li key={i}><strong>{c.label}</strong>{c.descriptor&&<p>{c.descriptor}</p>}</li>)}</ol>:<p>Aucun critère renseigné dans cette version.</p>}<p>Seule la validation du formateur constitue une évaluation officielle.</p></section>
 <section id="outils" className="ul-card us-workshop"><span className="ul-overline"><Sparkles size={16}/> 04 · UTILISER L’IA</span><h2>Préparer ma production avec l’IA</h2><p>Ces supports sont construits à partir des consignes publiées, sans ajouter de critères officiels. Ils sont à utiliser dans ton outil IA et à adapter à tes résultats réels.</p><V2WorkshopCopyTools key={lesson.id} prompt={prompt} template={template}/></section>
 <section id="preuve" className="ul-card us-workshop"><span className="ul-overline"><ClipboardCheck size={16}/> 05 · PROUVER</span><h2>Livrable attendu</h2><p className="us-content">{lesson.evidence_required||"Preuve non renseignée."}</p><p className="ul-note">{parcours==="ingenierie-produit-ia"?"Utilise le studio complet du pilote pour le carnet, le coach et la remise de preuves.":"La remise, le carnet synchronisé et le coach interactif ne sont pas encore activés pour ce parcours. Aucune preuve ni validation n’est enregistrée depuis cet écran."}</p>{parcours==="ingenierie-produit-ia"&&<Link className="ul-link" href={"/espace/parcours/ingenierie-produit-ia/atelier/"+encodeURIComponent(lesson.slug)}>Ouvrir l’atelier complet <ArrowRight size={16}/></Link>}</section>
 <nav className="us-next" aria-label="Navigation entre ateliers">{previous?<Link className="ul-link" href={href(previous.id)}><ArrowLeft size={16}/> Atelier précédent</Link>:<span/>}{next?<Link className="ul-link" href={href(next.id)}>Atelier suivant <ArrowRight size={16}/></Link>:<Link className="ul-link" href={directory+"?parcours="+encodeURIComponent(parcours)}>Revoir ma formation <ArrowRight size={16}/></Link>}</nav>
 </div>}
 </div></main>;
}
