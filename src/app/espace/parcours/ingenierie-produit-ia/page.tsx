import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { backendRequest } from "@/lib/auth/backend";
import {getAiTrainingPlan,trainingHours} from "@/lib/ai-training-plans";
import {TrainingDuration} from "@/components/training-duration";
import {getCatalogStudyRhythm} from "@/lib/catalog-study-rhythm";
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
  evaluation_open?:boolean;
  xp_total?:number;
  submissions?:{
    id:string;lesson_id:string;module_id?:string;lesson_slug?:string;status:"pending"|"changes_requested"|"approved";
    score:number|null;feedback:string|null;url:string;note:string;created_at:string
  }[];
};

export default async function V2LearnerTrack({searchParams}:{
  searchParams:Promise<{inscription?:string;livrable?:string}>;
}) {
  await requireRole("learner");
  const params=await searchParams;
  const plan=getAiTrainingPlan(pilotCourse.slug)!;
  const {rhythm}=await getCatalogStudyRhythm();
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
      <span className="journey-overline"><Sparkles size={15}/> FORMATION · PROJET FIL ROUGE</span>
      <h1>Ingénierie produit et IA<span>.</span></h1>
      <p>Construis ton produit numérique : premier flux en ligne, MVP testé, puis essais de commercialisation. Les huit modules sont des étapes pédagogiques, pas une échéance imposée.</p>
      <div className="v2-track-facts"><span><BookOpen size={15}/> 8 modules</span><span><BadgeCheck size={15}/> 16 ateliers</span><span><Clock3 size={15}/> {trainingHours(plan)} h de travail</span></div>
    </header>
    <TrainingDuration plan={plan} rhythm={rhythm}/>
    {params.livrable==="envoye"&&<p className="alert success" role="status">Ton livrable a été transmis. Le formateur peut maintenant le corriger.</p>}
    {params.livrable==="erreur"&&<p className="alert danger" role="alert">L'envoi n'a pas abouti. Vérifie ton inscription, le lien et l'état de l'atelier.</p>}
    {params.inscription==="confirmee"&&enrolled&&<p className="alert success" role="status">Ton inscription gratuite au parcours pilote est confirmée.</p>}
    {params.inscription==="indisponible"&&<p className="alert danger" role="alert">L'inscription n'est pas disponible actuellement. Vérifie que le parcours a été ouvert par l'administration.</p>}
    {!ready&&<section className="v2-track-status">
      <LockKeyhole size={20}/>
      <div><h2>Le programme est consultable ; les ateliers sont temporairement indisponibles.</h2>
        <p>Le contenu détaillé n'est pas accessible avec cette session. Tu peux découvrir les objectifs et les livrables, tout en continuant tes missions existantes sans perdre tes acquis.</p>
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
    {enrolled&&<p className="v2-track-eligibility" role="status"><CheckCircle2 size={17}/> Inscription {status==="completed"?"terminée":"active"} · {canRead?"Ateliers publiés accessibles":"Les leçons ne sont pas encore publiées."}
      {canRead&&<strong> · {data?.xp_total??0} XP acquis</strong>}
    </p>}
    <section className="v2-track-weeks" aria-label="Modules du parcours">
      {modList.map(mod=>{
        // Multiple published revisions must never duplicate a logical workshop.
        const bySlug=new Map<string,TrainingLesson>();
        for(const item of lessons.filter(l=>l.module_id===mod.id&&l.status==="published")){
          if(!bySlug.has(item.slug)||(bySlug.get(item.slug)?.version??0)<item.version)
            bySlug.set(item.slug,item);
        }
        const live=[...bySlug.values()];
        const preview=pilotCourse.modules.find(m=>m.slug===mod.slug);
        return <article key={mod.id} className="v2-track-module">
          <div className="v2-track-module-heading"><span>S{String(mod.week).padStart(2,"0")}</span><div><h2>{mod.title}</h2><p>{mod.outcome}</p></div></div>
          <div className="v2-track-module-chips">{mod.skills.map(skill=><span key={skill}>{skill}</span>)}</div>
          {canRead?<div className="v2-track-lessons">
            {live.length?live.map(lesson=>{
              const latest=data?.submissions?.find(s=>
                (s.module_id===lesson.module_id&&s.lesson_slug===lesson.slug)||
                s.lesson_id===lesson.id);
              const canSubmit=Boolean(data?.evaluation_open)&&status==="active" &&
                (!latest||latest.status==="changes_requested");
              return <details key={lesson.id} className="v2-track-lesson">
                <summary><BookOpen size={17}/><span>{lesson.title}</span>
                  <small>{latest?.status==="approved"?"Validé":latest?.status==="pending"?"En correction":
                    latest?.status==="changes_requested"?"À améliorer":"À réaliser"}</small>
                </summary>
                <div className="v2-track-lesson-body">
                  <p><strong>Objectif :</strong> {lesson.objective}</p>
                  <h3>Exercice guidé</h3><p>{lesson.guided_work}</p>
                  <h3>Travail autonome</h3><p>{lesson.independent_work}</p>
                  <h3>Livrable demandé</h3><p>{lesson.evidence_required}</p>
                  <Link href={"/espace/parcours/ingenierie-produit-ia/atelier/"+lesson.slug} className="v2-lesson-studio-entry">
                    <BookOpen size={16}/>
                    {latest?.status==="pending"?"Suivre ma correction dans le studio":
                      latest?.status==="approved"?"Revoir mon atelier validé":
                      latest?.status==="changes_requested"?"Améliorer mon projet dans le studio":
                      "Commencer dans le studio pédagogique"}
                    <ArrowRight size={16}/>
                  </Link>
                  <p className="v2-track-notice">Dans le studio : cinq étapes pratiques, auto-contrôle, pièges à éviter, modèle de livrable et préparation à la correction.</p>
                  {latest?.feedback&&<div className="v2-track-feedback">
                    <strong>Dernier retour du formateur : {latest.score}/100</strong>
                    <p>{latest.feedback}</p>
                  </div>}
                  {latest?.status==="pending"&&<p className="v2-track-notice">Ton travail est en attente de correction. Tu ne peux pas le soumettre une seconde fois.</p>}
                  {latest?.status==="approved"&&<p className="v2-track-approved"><CheckCircle2 size={16}/> Atelier validé par le formateur · 100 XP attribués</p>}
                  {canSubmit&&<p className="v2-track-notice">
                    Pour remettre ton projet, entre dans le studio : réalise les étapes,
                    garde tes notes et vérifie le livrable. Le formulaire de remise
                    se trouve à la fin de cet atelier. Une note d'au moins 80/100 attribue 100 XP.
                  </p>}
                  {!data?.evaluation_open&&<p className="v2-track-notice">Les remises de projet et les corrections ne sont pas encore ouvertes sur cet environnement.</p>}
                </div>
              </details>;
            }):<p className="v2-track-notice">Les ateliers de cette semaine ne sont pas encore publiés.</p>}
          </div>:<div className="v2-track-lessons">{preview?.lessons.map(lesson=><div key={lesson.slug} className="v2-track-locked-lesson">
            <LockKeyhole size={15}/><div><strong>{lesson.title}</strong><p>{lesson.objective}</p></div>
          </div>)}</div>}
        </article>;
      })}
    </section>
    <footer className="v2-track-footer"><Link href="/espace/apprenant">Retour à mon tableau de bord <ArrowRight size={15}/></Link></footer>
  </main>;
}
