import Link from "next/link";
import {ArrowRight,BookOpen,BookOpenCheck,CheckCircle2,ClipboardList,
  FileText,LockKeyhole,PackageOpen,ShieldCheck,Sparkles} from "lucide-react";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {v2WorkshopGuides} from "@/lib/v2-workshop-guides";

type Lesson={id:string;module_id:string;slug:string;status:string;title:string};
type Module={id:string;slug:string;week:number;title:string};
export type LearnerCourseResources={
  track?:{status:string;slug:string};
  enrollment?:string|null;lesson_access?:string;
  modules?:Module[];lessons?:Lesson[];
};
const base="/espace/parcours/ingenierie-produit-ia";
/**
 * Public editorial module metadata is safe for everyone; practice worksheets,
 * trainer prompts and evidence templates are server-rendered only for an
 * authenticated learner with lesson access confirmed by CT420.
 */
export function V2LearnerResourcesPanel({data}:{data:LearnerCourseResources|null}){
  const enrolled=data?.enrollment==="active"||data?.enrollment==="completed";
  const entitled=data?.track?.status==="published"&&
    data.track.slug==="ingenierie-produit-ia"&&enrolled&&
    data.lesson_access==="granted";
  const moduleIds=new Map((data?.modules||[]).map(m=>[m.slug,m.id]));
  const published=new Set(entitled?(data?.lessons||[])
    .filter(l=>l.status==="published")
    .map(l=>l.module_id+":"+l.slug):[]);
  const enabled=(moduleSlug:string,slug:string)=>{
    const id=moduleIds.get(moduleSlug);
    return !!id&&published.has(id+":"+slug);
  };
  const available=pilotCourse.modules.flatMap(m=>m.lessons.filter(l=>enabled(m.slug,l.slug))).length;
  return <section className="learner-resources-hub" aria-labelledby="learner-resources-title">
    <header className="learner-resources-hero">
      <div><span><Sparkles size={15}/> BIBLIOTHÈQUE DE PRATIQUE · PARCOURS PRINCIPAL</span>
        <h2 id="learner-resources-title">Mes outils pour construire, tester et livrer.</h2>
        <p>Retrouve les 8 modules, les 16 ateliers et leurs supports de réalisation.
          Les modèles pratiques sont accessibles uniquement avec une inscription autorisée.</p></div>
      <Link href={base}>Ouvrir le parcours <ArrowRight size={16}/></Link>
    </header>
    <div className="learner-resources-status" role="status">
      {entitled?<><CheckCircle2 size={17}/> {available}/16 ateliers publiés accessibles avec tes consignes et modèles.</>:
        <><LockKeyhole size={17}/> Programme consultable. Accède aux supports complets depuis une inscription active.</>}
    </div>
    <div className="learner-resources-modules">
      {pilotCourse.modules.map(m=><details key={m.slug} className="learner-resources-module" open={m.week===1}>
        <summary>
          <span>S{String(m.week).padStart(2,"0")}</span>
          <div><strong>{m.title}</strong><small>{m.outcome}</small></div>
          <b>{m.lessons.length} ateliers</b>
        </summary>
        <div className="learner-resources-lessons">
          {m.lessons.map(l=>{
            const accessible=enabled(m.slug,l.slug);
            const guide=accessible?v2WorkshopGuides[l.slug]:null;
            return <article key={l.slug}>
              <div className="learner-resources-lesson-heading">
                <BookOpen size={16}/>
                <div><h3>{l.title}</h3><p>{l.objective}</p></div>
              </div>
              <div className="learner-resources-lesson-evidence">
                <ClipboardList size={15}/> <span><strong>Livrable attendu :</strong> {l.evidence}</span>
              </div>
              {guide&&<div className="learner-resources-lesson-tools">
                <span><BookOpenCheck size={14}/> {guide.steps.length} étapes guidées</span>
                <span><ShieldCheck size={14}/> {guide.checks.length} critères de qualité</span>
                <span><FileText size={14}/> Modèle et prompt réutilisables</span>
              </div>}
              {accessible?
                <div className="learner-resources-lesson-links">
                  <Link href={base+"/atelier/"+l.slug+"#studio-checklist-title"}>
                    Étapes de réalisation <ArrowRight size={14}/></Link>
                  <Link href={base+"/atelier/"+l.slug+"#boite-outils"}>
                    Modèles et ressources <ArrowRight size={14}/></Link>
                  <Link href={base+"/atelier/"+l.slug+"#livrable"}>
                    Préparer ma remise <ArrowRight size={14}/></Link>
                </div>:
                <p className="learner-resources-locked"><LockKeyhole size={14}/> Supports accessibles après inscription.</p>}
            </article>;
          })}
        </div>
      </details>)}
    </div>
    <div className="learner-resources-end">
      <PackageOpen size={18}/>
      <p>Chaque modèle est un point de départ. Les preuves réelles, les corrections et les XP
        sont déterminés par ton travail et la validation du formateur, jamais par les coches d'une checklist.</p>
    </div>
  </section>;
}
