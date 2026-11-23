import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { backendRequest } from "@/lib/auth/backend";
import { pilotCourse } from "@/lib/v2-public-catalog";
import { enrollInV2Pilot } from "@/app/espace/actions";

type TrainingModule={
  id:string;week:number;slug:string;title:string;outcome:string;skills:string[];
};
type TrainingLesson={
  id:string;module_id:string;slug:string;version:number;status:"draft"|"published";
  title:string;objective:string;guided_work:string;independent_work:string;
  evidence_required:string;rubric:unknown[];
};
type EnrollmentStatus="active"|"paused"|"completed"|"revoked"|null;
type CatalogDetail={
  track:{slug:string;title:string;summary:string;status:"draft"|"published"|"archived"};
  modules:TrainingModule[];
  lessons:TrainingLesson[];
  enrollment:EnrollmentStatus;
  enrollment_open:boolean;
  lesson_access:"granted"|"locked";
};

export default async function V2LearnerTrack({searchParams}:{
  searchParams:Promise<{inscription?:string}>;
}) {
  await requireRole("learner");
  const params=await searchParams;
  const response=await backendRequest("/v1/training/catalog/ingenierie-produit-ia").catch(()=>null);
  // For an installation where the V2 schema is still off, fail closed and
  // keep a useful, accurate public preview of the educational program.
  const data:CatalogDetail|null=response?.ok
    ? await response.json() as CatalogDetail : null;
  const ready=Boolean(data?.track.status==="published");
  const canRead=data?.lesson_access==="granted";
  const status=data?.enrollment;
  const enrolled=status==="active"||status==="completed";
  const lessons=data?.lessons||[];
  const modList=data?.modules||pilotCourse.modules.map((m,i)=>({
    id:m.slug,week:i+1,slug:m.slug,title:m.title,outcome:m.outcome,
    skills:[...m.skills]
  }));

  return <main className="page v2-learner-track">
    <Link className="v2-track-back" href="/catalogue/ingenierie-produit-ia"><ArrowLeft size={15}/> Présentation de la formation</Link>
    <header className="v2-track-head">
      <span className="journey-overline"><Sparkles size={15}/> PARCOURS V2 · PROJET FIL ROUGE</span>
      <h1>Ingénierie produit et IA<span>.</span></h1>
      <p>Construis ton produit numérique en huit semaines. Premier flux en ligne au jour 14, MVP au premier mois, puis premiers essais de commercialisation.</p>
      <div className="v2-track-facts"><span><BookOpen size={15}/> 8 modules</span><span><BadgeCheck size={15}/> 16 ateliers</span><span><Clock3 size={15}/> 8 semaines</span></div>
    </header>
    {params.inscription==="confirmee"&&enrolled&&<p className="alert success" role="status">Ton inscription gratuite au parcours pilote est confirmée.</p>}
    {params.inscription==="indisponible"&&<p className="alert danger" role="alert">L'inscription n'est pas disponible actuellement. Vérifie que le parcours a été ouvert par l'administration.</p>}
    {!ready&&<section className="v2-track-status">
      <LockKeyhole size={20}/>
      <div><h2>Le programme V2 est consultable ; les ateliers ouvrent prochainement.</h2>
        <p>Le moteur pédagogique n'est pas encore activé pour ce compte. Tu peux découvrir les objectifs et les livrables, tout en continuant tes missions existantes sans perdre tes acquis.</p>
        <Link href="/catalogue/ingenierie-produit-ia">Consulter les 16 ateliers <ArrowRight size={15}/></Link>
      </div>
    </section>}
    {ready&&!enrolled&&<section className="v2-track-status">
      <BookOpen size={20}/><div>
        <h2>{data?.enrollment_open&&!status?"Inscription gratuite au parcours pilote":"Accès aux ateliers non ouvert"}</h2>
        <p>{status==="paused"?"Ton inscription est suspendue : demande sa réactivation au formateur."
          :status==="revoked"?"Ton inscription a été révoquée. Adresse-toi à l'administration."
          :data?.enrollment_open?"Rejoins le pilote gratuitement pour accéder aux ateliers publiés. Aucun paiement n'est demandé."
          :"Le programme est publié, mais les inscriptions ne sont pas encore ouvertes."}</p>
        {data?.enrollment_open&&!status&&<form action={enrollInV2Pilot}>
          <button type="submit" className="primary-btn">M'inscrire gratuitement <ArrowRight size={16}/></button>
        </form>}
      </div>
    </section>}
    {enrolled&&<p className="v2-track-eligibility" role="status"><CheckCircle2 size={17}/> Inscription {status==="completed"?"terminée":"active"} · {canRead?"Ateliers publiés accessibles":"Les leçons ne sont pas encore publiées."}</p>}
    <section className="v2-track-weeks" aria-label="Modules du cursus V2">
      {modList.map(mod=>{
        const live=lessons.filter(l=>l.module_id===mod.id);
        const preview=pilotCourse.modules.find(m=>m.slug===mod.slug);
        return <article key={mod.id} className="v2-track-module">
          <div className="v2-track-module-heading"><span>S{String(mod.week).padStart(2,"0")}</span><div><h2>{mod.title}</h2><p>{mod.outcome}</p></div></div>
          <div className="v2-track-module-chips">{mod.skills.map(skill=><span key={skill}>{skill}</span>)}</div>
          {canRead?<div className="v2-track-lessons">
            {live.length?live.map(lesson=><details key={lesson.id} className="v2-track-lesson">
              <summary><BookOpen size={17}/><span>{lesson.title}</span><small>Atelier publié</small></summary>
              <div className="v2-track-lesson-body">
                <p><strong>Objectif :</strong> {lesson.objective}</p>
                <h3>Exercice guidé</h3><p>{lesson.guided_work}</p>
                <h3>Travail autonome</h3><p>{lesson.independent_work}</p>
                <h3>Livrable demandé</h3><p>{lesson.evidence_required}</p>
                <p className="v2-track-notice">La remise des livrables et les XP du nouveau cursus seront activés après la validation du système d'évaluation. Ils restent indépendants des XP déjà obtenus.</p>
              </div>
            </details>):<p className="v2-track-notice">Les ateliers de cette semaine ne sont pas encore publiés.</p>}
          </div>:<div className="v2-track-lessons">{preview?.lessons.map(lesson=><div key={lesson.slug} className="v2-track-locked-lesson">
            <LockKeyhole size={15}/><div><strong>{lesson.title}</strong><p>{lesson.objective}</p></div>
          </div>)}</div>}
        </article>;
      })}
    </section>
    <footer className="v2-track-footer"><Link href="/espace/apprenant">Retour à mes missions actuelles <ArrowRight size={15}/></Link></footer>
  </main>;
}
