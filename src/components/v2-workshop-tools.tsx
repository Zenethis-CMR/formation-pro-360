"use client";
import {useState} from "react";
import { Check, CheckCircle2, Clipboard, Copy, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";

type Step={title:string;action:string;proof:string;verify:string};
export function V2WorkshopChecklist({steps}:{steps:Step[]}){
  const [checked,setChecked]=useState<boolean[]>(()=>steps.map(()=>false));
  const count=checked.filter(Boolean).length;
  const progress=steps.length?Math.round(count/steps.length*100):0;
  return <section className="studio-checklist" aria-labelledby="studio-checklist-title">
    <div className="studio-checklist-top">
      <div><span className="studio-eyebrow"><CheckCircle2 size={14}/> MODE PRATIQUE · 70 % DU PARCOURS</span>
        <h2 id="studio-checklist-title">Construis, vérifie et prouve.</h2>
        <p>Avance à ton rythme. Chaque étape a une action, une preuve et un test de qualité.</p></div>
      <span className="studio-checklist-count" aria-live="polite">{count} / {steps.length} étapes préparées</span>
    </div>
    <div className="studio-step-progress" role="progressbar" aria-label="Étapes cochées sur cet écran" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={count}><span style={{width:progress+"%"}}/></div>
    <ol className="studio-step-list">{steps.map((step,i)=><li key={i} className={checked[i]?"is-done":""}>
      <div className="studio-step-index">{String(i+1).padStart(2,"0")}</div>
      <div className="studio-step-content">
        <div className="studio-step-title"><h3>{step.title}</h3><span>ÉTAPE {i+1}</span></div>
        <p>{step.action}</p>
        <div className="studio-step-output"><Clipboard size={16}/><span><b>À produire :</b> {step.proof}</span></div>
        <div className="studio-step-verify"><ShieldCheck size={16}/><span><b>Comment vérifier :</b> {step.verify}</span></div>
        <label className="studio-step-check">
          <input type="checkbox" checked={checked[i]} onChange={e=>
            setChecked(items=>items.map((done,j)=>j===i?e.target.checked:done))}/>
          <span><Check size={15}/> J'ai réalisé cette étape et vérifié la preuve</span>
        </label>
      </div>
    </li>)}</ol>
    <p className="studio-ephemeral">Ces coches servent uniquement à te repérer pendant cette consultation. Elles ne sont pas sauvegardées et ne constituent ni une soumission ni une validation du formateur.</p>
  </section>;
}

export function V2WorkshopCopyTools({prompt,template}:{prompt:string;template:string}){
  const [copied,setCopied]=useState<"prompt"|"template"|null>(null);
  const [error,setError]=useState(false);
  async function copy(value:string,kind:"prompt"|"template"){
    try{
      await navigator.clipboard.writeText(value);
      setCopied(kind);setError(false);
    }catch{setError(true);setCopied(null);}
  }
  return <div className="studio-toolkit">
    <section className="studio-copy-card">
      <div className="studio-toolkit-heading"><span><Sparkles size={18}/> Prompt de coaching IA</span>
        <button type="button" onClick={()=>copy(prompt,"prompt")}><Copy size={15}/>{copied==="prompt"?"Copié":"Copier"}</button></div>
      <p>Un point de départ à utiliser dans l'outil d'IA de ton choix. Le coach IA ne remplace pas les utilisateurs réels ni la correction du formateur.</p>
      <pre>{prompt}</pre>
    </section>
    <section className="studio-copy-card">
      <div className="studio-toolkit-heading"><span><Lightbulb size={18}/> Modèle de livrable</span>
        <button type="button" onClick={()=>copy(template,"template")}><Copy size={15}/>{copied==="template"?"Copié":"Copier"}</button></div>
      <p>Copie cette structure dans ton dépôt, ton document ou ton espace de travail, puis remplis-la avec des preuves réelles.</p>
      <pre>{template}</pre>
    </section>
    <p role="status" className="studio-copy-status" aria-live="polite">{error?"Copie automatique indisponible : sélectionne le texte du bloc et copie-le manuellement.":copied?"Contenu copié, prêt à être utilisé.":""}</p>
  </div>;
}
