import Link from "next/link";
import { ArrowLeft, BadgeCheck, CheckCircle2, ClipboardCheck, ExternalLink } from "lucide-react";
import { backendRequest } from "@/lib/auth/backend";
import { requireRole } from "@/lib/auth/require-role";
import { reviewV2Lesson } from "@/app/espace/actions";
import { v2WorkshopGuides } from "@/lib/v2-workshop-guides";
import { V2TrainerScoreInputs } from "@/components/v2-trainer-score-inputs";

type Pending={
  id:string;learner_id:string;lesson_id:string;lesson_title:string;
  lesson_slug:string;objective?:string;evidence_required?:string;
  rubric?:unknown[];module_week:number;module_title:string;
  url:string;note:string;created_at:string;
};
export default async function V2TrainerCorrections({searchParams}:{
  searchParams:Promise<{correction?:string}>;
}){
  await requireRole("trainer");
  const params=await searchParams;
  const response=await backendRequest(
    "/v1/training/catalog/ingenierie-produit-ia/pending-submissions"
  ).catch(()=>null);
  const data=response?.ok ? await response.json() as {pending:Pending[]} : null;
  return <main className="page v2-trainer-reviews">
    <Link className="v2-track-back" href="/espace/formateur?onglet=evaluations">
      <ArrowLeft size={15}/> Toutes mes évaluations
    </Link>
    <header className="v2-trainer-reviews-head">
      <span className="journey-overline"><BadgeCheck size={15}/> ÉVALUATIONS · INGÉNIERIE PRODUIT ET IA</span>
      <h1>Corriger les ateliers<span>.</span></h1>
      <p>Chaque livrable est évalué sur 100. Une note d'au moins 80/100 valide l'atelier et attribue une seule fois 100 XP.</p>
    </header>
    {params.correction==="validee"&&<p className="alert success" role="status"><CheckCircle2 size={16}/> Correction enregistrée.</p>}
    {params.correction==="erreur"&&<p className="alert danger" role="alert">La correction n'a pas pu être enregistrée. Vérifie le score, les droits et l'état de la soumission.</p>}
    {!data&&<section className="v2-track-status"><ClipboardCheck size={21}/><div>
      <h2>Le module de correction n'est pas accessible actuellement.</h2>
      <p>L'espace reste prêt pour le lancement. Les autres évaluations restent consultables depuis ton espace.</p>
    </div></section>}
    {data&&<>
      <div className="v2-review-total"><ClipboardCheck size={19}/><strong>{data.pending.length}</strong> livrable(s) à corriger</div>
      {!data.pending.length&&<p className="v2-track-notice">Aucun livrable en attente pour le moment.</p>}
      <section className="v2-review-list" aria-label="Projets en attente de correction">
        {data.pending.map(item=><article key={item.id} className="v2-review-card">
          <header><span>SEMAINE {item.module_week}</span><small>Apprenant · {item.learner_id.slice(0,8)}</small></header>
          <h2>{item.lesson_title}</h2>
          <p className="v2-review-module">{item.module_title}</p>
          {item.note&&<p className="v2-review-note">{item.note}</p>}
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="v2-review-url">
            Ouvrir le livrable <ExternalLink size={15}/>
          </a>
          <div className="v2-review-guidance">
            <span>CONSIGNE OFFICIELLE DE L'ATELIER</span>
            <p>{item.objective||"Consulte le résultat concret attendu avant de noter."}</p>
            <strong>Preuve attendue</strong><p>{item.evidence_required||"Le livrable décrit dans le parcours V2."}</p>
          </div>
          <form action={reviewV2Lesson} className="v2-review-form">
            <input type="hidden" name="submissionId" value={item.id}/>
            <V2TrainerScoreInputs criteria={(()=>{
              const official=Array.isArray(item.rubric)?item.rubric.flatMap(x=>
                typeof x==="string"?[x]:x&&typeof x==="object"&&"label" in x&&typeof x.label==="string"?[x.label]:[]
              ):[];
              const editorial=v2WorkshopGuides[item.lesson_slug]?.checks;
              return official.length===4?official:editorial||[
                "Adéquation au problème et à l'objectif",
                "Qualité de la réalisation",
                "Preuves et tests vérifiables",
                "Clarté du livrable et explications"
              ];
            })()}/>
            <label>Retour pédagogique
              <textarea name="feedback" minLength={3} maxLength={1300} required rows={4}
                placeholder="Ce qui fonctionne, les écarts constatés, et la prochaine amélioration concrète."/>
            </label>
            <button type="submit" className="primary-btn">Enregistrer la correction <BadgeCheck size={15}/></button>
            <small>Les quatre repères sur 25 sont additionnés côté serveur. Le total et leur détail sont consignés dans le commentaire. À partir de 80/100, l'atelier est validé (+100 XP).</small>
          </form>
        </article>)}
      </section>
    </>}
  </main>;
}
