"use client";
import {useActionState,useEffect,useState} from "react";
import {useFormStatus} from "react-dom";
import {CircleHelp,Clock3,MessageCircle,Send,Sparkles,Timer,CheckCircle2} from "lucide-react";
import {askWorkshopCoach} from "@/app/espace/actions";

const exampleQuestions=[
  "Par quoi dois-je commencer pour réussir cet atelier ?",
  "Comment vérifier que mon livrable fonctionne vraiment ?",
  "Quel test concret permettrait de détecter un défaut ?"
];

function BusyIndicator(){
  const {pending}=useFormStatus();
  const [seconds,setSeconds]=useState(0);
  useEffect(()=>{
    if(!pending)return;
    const started=Date.now();
    setSeconds(0);
    const timer=setInterval(()=>setSeconds(Math.floor((Date.now()-started)/1000)),1000);
    return ()=>clearInterval(timer);
  },[pending]);
  if(!pending)return null;
  return <div className="studio-coach-pending" role="status" aria-live="polite">
    <span className="studio-coach-spinner" aria-hidden="true"/>
    <div><strong>Qwen3 réfléchit à ta question…</strong>
      <p>Modèle local : la réponse peut prendre plusieurs dizaines de secondes. Cette durée est réelle, sans progression simulée.</p>
      <span className="studio-coach-time"><Timer size={14}/> {seconds} seconde{seconds===1?"":"s"} écoulée{seconds===1?"":"s"}</span>
    </div>
  </div>;
}
function SubmitButton(){
  const {pending}=useFormStatus();
  return <button className="studio-coach-submit" type="submit" disabled={pending}>
    <Send size={16}/>{pending?"Réponse en cours…":"Demander un conseil"}
  </button>;
}
/**
 * Only one previous exchange is submitted, voluntarily, as ephemeral context.
 * No faux chat, automatic background requests or persistent conversation.
 */
export function WorkshopCoach({lessonId}:{lessonId:string}){
  const [state,run]=useActionState(askWorkshopCoach,{
    status:"idle",answer:"",question:""
  });
  const [draft,setDraft]=useState("");
  const followUp=state.status==="ok"&&state.question&&state.answer;
  return <section id="coach" className="studio-section studio-live-coach">
    <span className="studio-eyebrow"><Sparkles size={15}/> COACH PÉDAGOGIQUE INTERACTIF · QWEN3 LOCAL</span>
    <h2>Débloque ton atelier, une question à la fois.</h2>
    <p>Le coach propose des pistes et des tests à réaliser par toi-même. Il ne produit pas des résultats de terrain, n'attribue pas de points et ne remplace pas la correction du formateur.</p>
    <div className="studio-coach-suggestions" aria-label="Questions suggérées">
      {exampleQuestions.map((question,i)=>
        <button type="button" key={i} onClick={()=>setDraft(question)}
          aria-controls="studio-coach-question"><CircleHelp size={14}/>{question}</button>)}
    </div>
    <form action={run} className="studio-coach-form">
      <input type="hidden" name="lessonId" value={lessonId}/>
      <input type="hidden" name="previousQuestion" value={followUp?state.question.slice(0,400):""}/>
      <input type="hidden" name="previousAnswer" value={followUp?state.answer.slice(0,800):""}/>
      <label htmlFor="studio-coach-question">Quelle difficulté veux-tu résoudre ?</label>
      <textarea id="studio-coach-question" name="question" minLength={8} maxLength={1200}
        rows={4} required value={draft} onChange={e=>setDraft(e.target.value)}
        placeholder="Décris ton blocage, ce que tu as déjà essayé et ce que tu voudrais vérifier."/>
      <p>Ta question est transmise à Qwen3 sur le réseau privé. Ne partage ni données personnelles, ni mots de passe ni clés API. Les échanges ne sont pas enregistrés.</p>
      {followUp&&<p className="studio-coach-context"><CheckCircle2 size={14}/> Ta prochaine question peut reprendre le contexte du dernier conseil uniquement.</p>}
      <SubmitButton/>
      <BusyIndicator/>
    </form>
    {state.status!=="idle"&&<div className={"studio-coach-answer "+(state.status==="ok"?"is-success":"is-unavailable")}
      role={state.status==="ok"?"status":"alert"} aria-live="polite">
      <div><MessageCircle size={19}/><strong>{state.status==="ok"?"Conseil personnalisé":
        state.status==="busy"?"Qwen3 est déjà occupé":
        state.status==="limit"?"Trop de demandes rapprochées":
        state.status==="invalid"?"Question à reformuler":"Coach momentanément indisponible"}</strong></div>
      {state.status==="ok"&&<p className="studio-coach-original"><b>Ta question :</b> {state.question}</p>}
      <p>{state.answer}</p>
      {state.status==="ok"&&<button className="studio-coach-followup" type="button"
        onClick={()=>{setDraft("Peux-tu détailler la première étape et me donner un test concret ?");document.getElementById("studio-coach-question")?.focus();}}>
        <MessageCircle size={14}/> Poser une question de suivi
      </button>}
    </div>}
    <small><Clock3 size={13}/> Qwen3 4B fonctionne localement et répond à son rythme. Les conseils ne sont ni des notes officielles ni une preuve de travail réalisé.</small>
  </section>;
}
