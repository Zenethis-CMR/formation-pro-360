import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, ExternalLink } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { saveDraftGuide } from "@/app/espace/actions";

type GuideStep={title:string;instruction:string;deliverable:string};
type Guide={brief:string;steps:GuideStep[];rubric:string[];hint:string;resource_url:string};
type Props={
  params:Promise<{id:string}>;
  searchParams:Promise<{saved?:string;error?:string}>;
};
const uuid=/^[a-f0-9-]{36}$/i;
export default async function EditWorkshopGuide({params,searchParams}:Props) {
  const {supabase}=await requireRole("trainer");
  const {id}=await params;
  const notice=await searchParams;
  if(!uuid.test(id)) redirect("/espace/formateur?error=invalid");
  const [{data:mission,error:missionError},{data:guide,error:guideError}]=await Promise.all([
    supabase.from("missions").select("id,title,description,week,published").eq("id",id).maybeSingle(),
    supabase.from("mission_guides").select("brief,steps,rubric,hint,resource_url").eq("mission_id",id).maybeSingle()
  ]);
  if(missionError||guideError||!mission) {
    return <main className="page"><p className="alert danger">Cette mission n'est pas accessible.</p>
      <Link href="/espace/formateur">Revenir au tableau de bord</Link></main>;
  }
  if(mission.published) {
    return <main className="page"><p className="alert danger">Cet atelier est déjà publié. Les critères d'évaluation ne peuvent plus être modifiés une fois publiés.</p>
      <Link href="/espace/formateur">Retour au tableau de bord</Link></main>;
  }
  const g=guide as Guide|null;
  const steps=Array.isArray(g?.steps)?g.steps:[];
  const criteria=Array.isArray(g?.rubric)?g.rubric:[];
  return <main className="page authoring-page">
    <Link href="/espace/formateur" className="workshop-back"><ArrowLeft size={15}/> Tableau de bord formateur</Link>
    <header className="page-hero"><div><span className="eyebrow"><BookOpen size={15}/> RÉDACTION PÉDAGOGIQUE · SEMAINE {mission.week}</span>
      <h1>Créer un atelier <span>praticable.</span></h1>
      <p>Associe quatre étapes concrètes et quatre critères d'évaluation à « {mission.title} ». Tant que la mission est en brouillon, tu peux ajuster ce contenu.</p>
    </div></header>
    {notice.saved&&<p className="alert success" role="status"><CheckCircle2 size={15}/> Le guide a été enregistré. Tu peux maintenant publier la mission depuis le tableau de bord.</p>}
    {notice.error&&<p className="alert danger" role="alert">Impossible d'enregistrer le guide. Vérifie les champs, les longueurs et l'URL HTTPS.</p>}
    <form action={saveDraftGuide} className="authoring-form">
      <input type="hidden" name="missionId" value={mission.id}/>
      <section className="workshop-panel">
        <span className="journey-overline"><ClipboardCheck size={14}/> OBJECTIF DU TRAVAIL</span>
        <h2>Présenter l'atelier</h2>
        <label>Consigne générale (minimum 40 caractères)
          <textarea name="brief" rows={4} minLength={40} maxLength={1200} required defaultValue={g?.brief||mission.description}/>
        </label>
      </section>
      <section className="workshop-panel">
        <span className="journey-overline">APPRENDRE PAR LA PRATIQUE</span><h2>Quatre étapes de réalisation</h2>
        <p className="muted">Chaque étape doit expliquer ce que l'apprenant construit et le résultat vérifiable attendu.</p>
        {Array.from({length:4},(_,i)=> {
          const step=steps[i];
          return <fieldset className="authoring-step" key={i}>
            <legend>Étape {i+1}</legend>
            <label>Titre<input required minLength={3} maxLength={100} name={"stepTitle"+i} defaultValue={step?.title||""} placeholder="Ex. Mettre en place la structure"/></label>
            <label>Consigne pratique<textarea required minLength={15} maxLength={500} rows={3} name={"stepInstruction"+i} defaultValue={step?.instruction||""} placeholder="Décris l'action à réaliser concrètement."/></label>
            <label>Résultat attendu<input required minLength={5} maxLength={250} name={"stepDeliverable"+i} defaultValue={step?.deliverable||""} placeholder="Ex. Dépôt contenant un composant fonctionnel"/></label>
          </fieldset>;
        })}
      </section>
      <section className="workshop-panel">
        <span className="journey-overline">CORRECTION JUSTE ET TRANSPARENTE</span><h2>Quatre critères notés sur 25</h2>
        <p className="muted">Le total fera 100 points. Une note d'au moins 80 valide la mission.</p>
        {Array.from({length:4},(_,i)=><label key={i}>
          Critère {i+1}
          <input required minLength={10} maxLength={220} name={"rubric"+i} defaultValue={criteria[i]||""} placeholder="Ex. Fonctionnalité complète et testable"/>
        </label>)}
      </section>
      <section className="workshop-panel">
        <span className="journey-overline">RESSOURCES ET ACCOMPAGNEMENT</span><h2>Conseil et documentation</h2>
        <label>Conseil du coach<input required minLength={10} maxLength={400} name="hint" defaultValue={g?.hint||""} placeholder="Ex. Vérifie chaque fonctionnalité avant de passer à la suivante."/></label>
        <label>Documentation publique HTTPS<input required type="url" maxLength={600} name="resourceUrl" defaultValue={g?.resource_url||"https://developer.mozilla.org/fr/"} placeholder="https://..."/></label>
        <button type="submit" className="primary-btn authoring-save"><ClipboardCheck size={16}/> Enregistrer l'atelier</button>
        <p className="muted">L'enregistrement ne publie pas la mission et ne modifie aucune progression d'apprenant.</p>
      </section>
    </form>
  </main>;
}
