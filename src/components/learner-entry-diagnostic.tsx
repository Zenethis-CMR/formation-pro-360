"use client";
import {useState} from "react";
import Link from "next/link";
import {assessEntryDiagnostic,diagnosticScenarios,type DiagnosticAnswers} from "@/lib/learner-entry-diagnostic";
const course="/espace/parcours/ingenierie-produit-ia";
export function LearnerEntryDiagnostic(){
 const [answers,setAnswers]=useState<DiagnosticAnswers>({});
 const [step,setStep]=useState(0);
 const [finished,setFinished]=useState(false);
 const scenario=diagnosticScenarios[step];
 const result=finished?assessEntryDiagnostic(answers):null;
 const go=(next:number)=>{setStep(next);requestAnimationFrame(()=>document.getElementById("diagnostic-question")?.focus());};
 if(result)return <section className="entry-diagnostic">
  <h2 tabIndex={-1} id="diagnostic-result">Ton point de départ</h2>
  <p role="status">{result.correctCount} réponses pertinentes sur {diagnosticScenarios.length}. Ce résultat indicatif ne prouve pas une maîtrise pratique.</p>
  <div className="diagnostic-results">{result.results.map(item=><article key={item.id}>
   <span className={item.understood?"diagnostic-ok":"diagnostic-review"}>{item.understood?"Repère compris":"À approfondir"}</span>
   <h3>{item.skill}</h3><p>{item.reason}</p><p><strong>À mettre en pratique :</strong> {item.practice}</p>
   <Link href={course+"/atelier/"+item.workshop}>Consulter l'atelier associé</Link>
  </article>)}</div>
  <div className="diagnostic-actions"><Link href="/espace/apprenant">Revenir à mon parcours</Link><button type="button" onClick={()=>{setAnswers({});setStep(0);setFinished(false);}}>Recommencer</button></div>
  <p>Résultat non sauvegardé : tu peux refaire ce diagnostic. Il ne donne aucun XP, badge, accès supplémentaire ni validation officielle.</p>
 </section>;
 return <section className="entry-diagnostic" aria-label="Diagnostic de départ">
  <p>Situation {step+1} / {diagnosticScenarios.length} · {Object.keys(answers).length} réponses</p>
  <progress max={diagnosticScenarios.length} value={Object.keys(answers).length} aria-label="Situations renseignées"/>
  <form onSubmit={e=>{e.preventDefault();if(!Object.hasOwn(answers,scenario.id))return;if(step<diagnosticScenarios.length-1)go(step+1);else if(assessEntryDiagnostic(answers)){setFinished(true);requestAnimationFrame(()=>document.getElementById("diagnostic-result")?.focus());}}}>
   <fieldset key={scenario.id} className="diagnostic-fieldset"><legend id="diagnostic-question" tabIndex={-1}>{scenario.skill} — {scenario.question}</legend>
   {scenario.choices.map((choice,i)=><label className="diagnostic-option" key={i}>
    <input type="radio" name={scenario.id} required checked={answers[scenario.id]===i} onChange={()=>setAnswers(old=>({...old,[scenario.id]:i}))}/><span>{choice}</span>
   </label>)}</fieldset>
   <div className="diagnostic-actions"><button type="button" disabled={step===0} onClick={()=>go(step-1)}>Précédent</button>
    <button type="submit" disabled={!Object.hasOwn(answers,scenario.id)}>{step===diagnosticScenarios.length-1?"Voir mes recommandations":"Situation suivante"}</button></div>
  </form>
  <Link href="/espace/apprenant">Passer le diagnostic et continuer mes ateliers</Link>
 </section>;
}
