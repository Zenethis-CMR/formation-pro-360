import Link from "next/link";
import { ArrowLeft, BadgeCheck, CheckCircle2, ClipboardCheck, ExternalLink } from "lucide-react";
import { backendRequest } from "@/lib/auth/backend";
import { requireRole } from "@/lib/auth/require-role";
import { reviewV2Lesson } from "@/app/espace/actions";

type Pending={
  id:string;learner_id:string;lesson_id:string;lesson_title:string;
  module_week:number;module_title:string;url:string;note:string;created_at:string;
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
      <ArrowLeft size={15}/> Revenir aux corrections V1
    </Link>
    <header className="v2-trainer-reviews-head">
      <span className="journey-overline"><BadgeCheck size={15}/> ÉVALUATIONS · FORMATION V2</span>
      <h1>Corriger les ateliers V2<span>.</span></h1>
      <p>Chaque livrable est évalué sur 100. Une note d'au moins 80/100 valide l'atelier et attribue une seule fois 100 XP V2.</p>
    </header>
    {params.correction==="validee"&&<p className="alert success" role="status"><CheckCircle2 size={16}/> Correction enregistrée.</p>}
    {params.correction==="erreur"&&<p className="alert danger" role="alert">La correction n'a pas pu être enregistrée. Vérifie le score, les droits et l'état de la soumission.</p>}
    {!data&&<section className="v2-track-status"><ClipboardCheck size={21}/><div>
      <h2>Le module d'évaluation V2 n'est pas encore activé.</h2>
      <p>L'espace reste prêt pour le lancement. Les corrections historiques V1 continuent de fonctionner normalement.</p>
    </div></section>}
    {data&&<>
      <div className="v2-review-total"><ClipboardCheck size={19}/><strong>{data.pending.length}</strong> livrable(s) à corriger</div>
      {!data.pending.length&&<p className="v2-track-notice">Aucun livrable V2 en attente pour le moment.</p>}
      <section className="v2-review-list" aria-label="Projets en attente de correction V2">
        {data.pending.map(item=><article key={item.id} className="v2-review-card">
          <header><span>SEMAINE {item.module_week}</span><small>Apprenant · {item.learner_id.slice(0,8)}</small></header>
          <h2>{item.lesson_title}</h2>
          <p className="v2-review-module">{item.module_title}</p>
          {item.note&&<p className="v2-review-note">{item.note}</p>}
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="v2-review-url">
            Ouvrir le livrable <ExternalLink size={15}/>
          </a>
          <form action={reviewV2Lesson} className="v2-review-form">
            <input type="hidden" name="submissionId" value={item.id}/>
            <label>Note /100
              <input name="score" type="number" min={0} max={100} step={1} required/>
            </label>
            <label>Retour pédagogique
              <textarea name="feedback" minLength={3} maxLength={1500} required rows={3}
                placeholder="Points forts, écarts et pistes concrètes d'amélioration."/>
            </label>
            <button type="submit" className="primary-btn">Enregistrer la correction <BadgeCheck size={15}/></button>
            <small>80/100 minimum pour valider. Chaque validation attribue 100 XP V2.</small>
          </form>
        </article>)}
      </section>
    </>}
  </main>;
}
