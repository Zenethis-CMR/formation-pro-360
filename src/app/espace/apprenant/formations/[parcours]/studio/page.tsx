import Link from "next/link";
import {redirect} from "next/navigation";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ClipboardCheck,LockKeyhole,ShieldCheck,Sparkles,Target} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {parseStudioTrack,selectStudioLesson,validStudioTrackSlug,studioSteps,studioCanSubmit,type WorkshopState} from "@/lib/universal-learning";
import {WorkshopNotebook} from "@/components/workshop-notebook";
import {WorkshopCoach} from "@/components/workshop-coach";
import {WorkshopTrainerFeedback} from "@/components/workshop-trainer-feedback";
import type {WorkshopReview} from "@/lib/workshop-feedback";
import {submitV2Lesson} from "@/app/espace/actions";
import {V2WorkshopCopyTools} from "@/components/v2-workshop-tools";
import "../../formations.css";
import "./studio.css";

export const dynamic="force-dynamic";
const directory="/espace/apprenant/formations";
const labels:Record<WorkshopState,string>={not_started:"À réaliser",pending:"En correction",approved:"Validé",changes_requested:"À améliorer",unknown:"Statut indisponible"};
export default async function UniversalStudio({params,searchParams}:{params:Promise<{parcours:string}>;searchParams:Promise<{atelier?:string|string[];carnet?:string;livrable?:string}>}){
 await requireRole("learner");
 const {parcours}=await params;
 const {atelier,carnet,livrable}=await searchParams;
 const valid=validStudioTrackSlug(parcours);
 const response=valid?await backendRequest("/v1/training/catalog/"+encodeURIComponent(parcours)).catch(()=>null):null;
 const track=response?.ok?parseStudioTrack(await response.json().catch(()=>null),parcours):null;
 const base=directory+"/"+encodeURIComponent(parcours)+"/studio";
 if(!track)return <main className="page ul-page"><Link className="ul-back" href={directory}><ArrowLeft size={16}/> Mes formations</Link><section className="ul-card" role="status"><LockKeyhole size={24}/><h1>Studio indisponible</h1><p>Une inscription active ou terminée et un parcours publié sont nécessaires. Aucun atelier privé n’est affiché.</p><Link className="ul-link" href={directory}>Vérifier mes inscriptions <ArrowRight size={16}/></Link></section></main>;
 const lesson=selectStudioLesson(track.lessons,atelier);
 // Existing pilot checkboxes are tied to its editorial guide. Keep its canonical studio
 // so a second interface cannot reinterpret the same saved checklist.
 if(parcours==="ingenierie-produit-ia"&&lesson)redirect("/espace/parcours/ingenierie-produit-ia/atelier/"+encodeURIComponent(lesson.slug));
 const saved=lesson&&track.notebookAvailable?await backendRequest("/v1/training/catalog/"+encodeURIComponent(parcours)+"/lessons/"+lesson.id+"/notebook").catch(()=>null):null;
 const workbook=saved?.ok?(await saved.json().catch(()=>null) as {notebook?:{notes:string;next_action:string;reference_url:string|null;completed_steps:number[];updated_at:string|null}}|null)?.notebook:null;
 const history=lesson?track.submissions.filter(s=>s.module_id===lesson.module_id&&s.lesson_slug===lesson.slug):[];
 const reviewed=history.find(s=>s.status!=="pending"&&s.reviewed_at!==null);
 const review:WorkshopReview|null=reviewed?{status:reviewed.status==="approved"?"approved":"changes_requested",score:reviewed.score,feedback:reviewed.feedback,reviewed_at:reviewed.reviewed_at}:null;
 const canSubmit=lesson?studioCanSubmit(track,lesson):false;
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
 {carnet==="ok"&&<p className="alert success" role="status">Carnet enregistré.</p>}{carnet&&carnet!=="ok"&&<p className="alert danger" role="alert">Le carnet n’a pas été enregistré. Vérifie ton accès et les champs.</p>}
 {livrable==="envoye"&&<p className="alert success" role="status">Livrable transmis au formateur.</p>}{livrable&&livrable!=="envoye"&&<p className="alert danger" role="alert">La remise a échoué. Vérifie ton accès, ton lien et le statut du livrable.</p>}
 <div className="us-layout">
 <nav className="ul-card us-nav" aria-label="Ateliers de la formation"><h2>Mon programme</h2>{track.modules.map(m=><section key={m.id}><h3>{m.title}</h3>{track.lessons.filter(l=>l.module_id===m.id).map(l=><Link key={l.id} href={href(l.id)} className={"ul-track"+(lesson?.id===l.id?" selected":"")} aria-current={lesson?.id===l.id?"page":undefined}><BookOpen size={17}/><span><strong>{l.title}</strong><small>{labels[l.state]}</small></span><ArrowRight size={15}/></Link>)}{!track.lessons.some(l=>l.module_id===m.id)&&<p>Aucun atelier publié.</p>}</section>)}</nav>
 {!lesson?<section className="ul-card" role="status"><h2>{track.lessons.length?"Choisis un atelier publié":"Aucun atelier publié"}</h2><p>{track.lessons.length?"L’atelier demandé ne correspond pas à une version publiée accessible. Sélectionne un atelier dans le programme.":"Le contenu sera disponible après sa publication officielle."}</p>{track.lessons.length>0&&<Link className="ul-link" href={base}>Reprendre mon parcours <ArrowRight size={16}/></Link>}</section>:<div className="us-main">
 <section className="ul-card us-workshop"><span className="ul-overline">{module?.title} · ATELIER {position+1}/{track.lessons.length}</span><h2>{lesson.title}</h2><p>{lesson.objective||"Objectif non renseigné."}</p><span className="us-status"><CheckCircle2 size={16}/> {labels[lesson.state]} · version {lesson.version}</span><nav className="us-anchors" aria-label="Sections de l’atelier"><a href="#mission">Mission</a><a href="#pratique">Pratique</a><a href="#qualite">Qualité</a><a href="#outils">Outils IA</a><a href="#carnet">Carnet</a><a href="#coach">Coach</a><a href="#preuve">Livrable</a></nav></section>
 <section id="mission" className="ul-card us-workshop"><span className="ul-overline"><Target size={16}/> 01 · COMPRENDRE</span><h2>Objectif de la mission</h2><p>{lesson.objective||"Objectif non renseigné."}</p>{module?.outcome&&<p><strong>Résultat attendu du module :</strong> {module.outcome}</p>}{module?.skills.length?<div className="us-skills">{module.skills.map((s,i)=><span key={i}>{s}</span>)}</div>:null}</section>
 <section id="pratique" className="ul-card us-workshop"><span className="ul-overline"><BookOpen size={16}/> 02 · PRODUIRE</span><h2>Passer à la pratique</h2><h3>Exercice guidé</h3><p className="us-content">{lesson.guided_work||"Consigne non renseignée."}</p><h3>Travail autonome</h3><p className="us-content">{lesson.independent_work||"Consigne non renseignée."}</p></section>
 <section className="ul-card us-workshop" aria-label="Carnet personnel">{workbook&&track.enrollment==="active"?<WorkshopNotebook key={lesson.id} slug={lesson.slug} trackSlug={parcours} lessonId={lesson.id} steps={studioSteps(lesson)} initial={workbook} review={review} criteria={lesson.rubric.map(c=>c.label)}/>:<div id="carnet"><h2>Carnet de travail</h2>{review&&<WorkshopTrainerFeedback review={review} criteria={lesson.rubric.map(c=>c.label)}/>}<p>{track.enrollment==="completed"?"Carnet en lecture seule.":"La sauvegarde du carnet est momentanément indisponible."}</p>{workbook&&<><p className="us-content">{workbook.notes}</p><p><strong>Prochaine action :</strong> {workbook.next_action}</p></>}</div>}</section>
 <section id="qualite" className="ul-card us-workshop"><span className="ul-overline"><ShieldCheck size={16}/> 03 · VÉRIFIER</span><h2>Critères officiels de qualité</h2>{lesson.rubric.length?<ol className="us-rubric">{lesson.rubric.map((c,i)=><li key={i}><strong>{c.label}</strong>{c.descriptor&&<p>{c.descriptor}</p>}</li>)}</ol>:<p>Aucun critère renseigné dans cette version.</p>}<p>Seule la validation du formateur constitue une évaluation officielle.</p></section>
 <section id="outils" className="ul-card us-workshop"><span className="ul-overline"><Sparkles size={16}/> 04 · UTILISER L’IA</span><h2>Préparer ma production avec l’IA</h2><p>Ces supports sont construits à partir des consignes publiées, sans ajouter de critères officiels. Ils sont à utiliser dans ton outil IA et à adapter à tes résultats réels.</p><V2WorkshopCopyTools key={lesson.id} prompt={prompt} template={template}/></section>
 <section className="ul-card us-workshop">{track.coachAvailable?<WorkshopCoach key={lesson.id} lessonId={lesson.id} trackSlug={parcours} trainerFeedback={review?.status==="changes_requested"?review.feedback:null}/>:<div id="coach"><h2>Coach IA momentanément indisponible</h2><p>Utilise le prompt de l’atelier ou contacte ton formateur. Aucun conseil n’est simulé.</p></div>}</section>
 <section id="preuve" className="ul-card us-workshop"><span className="ul-overline"><ClipboardCheck size={16}/> 05 · PROUVER</span><h2>Livrable attendu</h2><p className="us-content">{lesson.evidence_required||"Preuve non renseignée."}</p>{canSubmit?<form action={submitV2Lesson} className="studio-submission-form"><input type="hidden" name="trackSlug" value={parcours}/><input type="hidden" name="lessonId" value={lesson.id}/><input type="hidden" name="workshopSlug" value={lesson.slug}/><label htmlFor="us-proof-url">Lien HTTP(S) du livrable</label><input id="us-proof-url" name="url" type="url" required maxLength={800}/><label htmlFor="us-proof-note">Réalisation et vérifications</label><textarea id="us-proof-note" name="note" rows={5} maxLength={1200}/><button type="submit">Soumettre au formateur <ArrowRight size={16}/></button><small>Seule une correction officielle peut valider l’atelier et attribuer 100 XP.</small></form>:<p className="ul-note">{lesson.state==="approved"?"Atelier validé.":lesson.state==="pending"?"Livrable en attente de correction.":!track.evaluationOpen?"Les remises ne sont pas ouvertes pour cette inscription.":"Statut de remise indisponible. Actualise avant de soumettre."}</p>}{history.length>0&&<div className="studio-review-history"><h3>Dernières tentatives disponibles</h3>{history.map(s=><article key={s.id}><strong>{labels[s.status]}{s.score!==null?" · "+s.score+"/100":""}</strong>{s.feedback&&<p className="us-content">{s.feedback}</p>}{s.url&&<a href={s.url} target="_blank" rel="noopener noreferrer">Voir ma preuve</a>}</article>)}</div>}{parcours==="ingenierie-produit-ia"&&<Link className="ul-link" href={"/espace/parcours/ingenierie-produit-ia/atelier/"+encodeURIComponent(lesson.slug)}>Ouvrir l’atelier complet <ArrowRight size={16}/></Link>}</section>
 <nav className="us-next" aria-label="Navigation entre ateliers">{previous?<Link className="ul-link" href={href(previous.id)}><ArrowLeft size={16}/> Atelier précédent</Link>:<span/>}{next?<Link className="ul-link" href={href(next.id)}>Atelier suivant <ArrowRight size={16}/></Link>:<Link className="ul-link" href={directory+"?parcours="+encodeURIComponent(parcours)}>Revoir ma formation <ArrowRight size={16}/></Link>}</nav>
 </div>}
 </div></main>;
}
