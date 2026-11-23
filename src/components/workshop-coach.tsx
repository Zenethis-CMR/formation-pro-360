"use client";
import {useActionState} from "react";
import {useFormStatus} from "react-dom";
import {MessageCircle,Send,Sparkles} from "lucide-react";
import {askWorkshopCoach} from "@/app/espace/actions";

function AskButton(){
  const {pending}=useFormStatus();
  return <button className="studio-coach-submit" type="submit" disabled={pending}>
    <Send size={16}/>{pending?"Recherche d'une piste…":"Demander un conseil"}
  </button>;
}
/**
 * No fake chatbot. This sends one explicit question through an authenticated
 * Next.js server action to a model-enabled CT420 service.
 */
export function WorkshopCoach({lessonId}:{lessonId:string}){
  const [state,run]=useActionState(askWorkshopCoach,{status:"idle",answer:""});
  return <section id="coach" className="studio-section studio-live-coach">
    <span className="studio-eyebrow"><Sparkles size={15}/> COACH PÉDAGOGIQUE INTERACTIF</span>
    <h2>Pose une question sur cet atelier.</h2>
    <p>Le coach t'aide à comprendre une étape, identifier un blocage et préparer un test. Il ne produit pas les preuves à ta place et ne remplace jamais la correction du formateur.</p>
    <form action={run} className="studio-coach-form">
      <input type="hidden" name="lessonId" value={lessonId}/>
      <label htmlFor="studio-coach-question">Quelle question veux-tu résoudre ?</label>
      <textarea id="studio-coach-question" name="question" minLength={8} maxLength={1200}
        rows={4} required placeholder="Par exemple : comment tester les cas d'erreur de mon flux sans inventer des résultats ?"/>
      <p>En envoyant cette question, tu autorises son traitement par le service IA configuré. Ne partage ni données personnelles, ni mots de passe, ni clés API.</p>
      <AskButton/>
    </form>
    {state.status!=="idle"&&<div className={"studio-coach-answer "+(state.status==="ok"?"is-success":"is-unavailable")}
      role="status" aria-live="polite">
      <div><MessageCircle size={19}/><strong>{state.status==="ok"?"Conseil du coach":"Coach indisponible"}</strong></div>
      <p>{state.answer}</p>
    </div>}
    <small>Les échanges ne sont pas enregistrés dans ton carnet. Le formateur reste seul responsable de l'évaluation et des XP.</small>
  </section>;
}
