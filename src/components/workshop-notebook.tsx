"use client";
import {useState} from "react";
import {useFormStatus} from "react-dom";
import {CheckCircle2,Clipboard,Save,ShieldCheck} from "lucide-react";
import {saveWorkshopNotebook} from "@/app/espace/actions";

type Step={title:string;action:string;proof:string;verify:string};
type Notebook={
  notes:string;next_action:string;reference_url:string|null;
  completed_steps:number[];updated_at:string|null
};
function SaveButton(){
  const {pending}=useFormStatus();
  return <button type="submit" disabled={pending} className="workbook-submit">
    <Save size={17}/>{pending?"Sauvegarde en cours…":"Enregistrer mon carnet"}
  </button>;
}
/** All edits stay local until an explicit authenticated server action. */
export function WorkshopNotebook({slug,lessonId,steps,initial}:{
  slug:string;lessonId:string;steps:Step[];initial:Notebook
}){
  const [checked,setChecked]=useState<number[]>(initial.completed_steps);
  return <form className="workbook-form" action={saveWorkshopNotebook} id="carnet">
    <input type="hidden" name="lessonId" value={lessonId}/>
    <input type="hidden" name="workshopSlug" value={slug}/>
    <section className="studio-checklist" aria-labelledby="studio-checklist-title">
      <div className="studio-checklist-top"><div>
        <span className="studio-eyebrow"><CheckCircle2 size={15}/> PRATIQUE · ÉTAPES SAUVEGARDABLES</span>
        <h2 id="studio-checklist-title">Construis, vérifie et prouve.</h2>
        <p>Chaque étape contient une réalisation, une preuve et un contrôle. Les coches sont conservées après enregistrement.</p>
      </div><span className="studio-checklist-count" aria-live="polite">{checked.length} / {steps.length} étapes préparées</span></div>
      <div className="studio-step-progress" role="progressbar" aria-valuenow={checked.length}
        aria-valuemin={0} aria-valuemax={steps.length} aria-label="Étapes de préparation cochées">
        <span style={{width:(steps.length?Math.round(checked.length/steps.length*100):0)+"%"}}/>
      </div>
      <ol className="studio-step-list">{steps.map((step,i)=>{
        const done=checked.includes(i+1);
        return <li key={i} className={done?"is-done":""}>
          <div className="studio-step-index">{String(i+1).padStart(2,"0")}</div>
          <div className="studio-step-content">
            <div className="studio-step-title"><h3>{step.title}</h3><span>ÉTAPE {i+1}</span></div>
            <p>{step.action}</p>
            <div className="studio-step-output"><Clipboard size={16}/><span><b>À produire :</b> {step.proof}</span></div>
            <div className="studio-step-verify"><ShieldCheck size={16}/><span><b>Comment vérifier :</b> {step.verify}</span></div>
            <label className="studio-step-check">
              <input type="checkbox" name="completedStep" value={i+1} checked={done}
                onChange={e=>setChecked(previous=>e.target.checked?
                  [...previous.filter(n=>n!==i+1),i+1]:previous.filter(n=>n!==i+1))}/>
              <span>Preuve préparée et vérifiée</span>
            </label>
          </div>
        </li>;
      })}</ol>
      <p className="studio-ephemeral">Ces coches sont des repères de travail, pas des validations du formateur. Clique sur « Enregistrer mon carnet » pour les retrouver sur tes appareils.</p>
    </section>
    <section className="studio-section workbook-section">
      <span className="studio-eyebrow"><Save size={15}/> MON CARNET PERSONNEL</span>
      <h2>Retrouve ton travail à chaque connexion.</h2>
      <p>Note ce que tu as construit, ce qui reste difficile et la prochaine action concrète. Ton carnet est privé et distinct du dépôt évalué.</p>
      <label htmlFor="workbook-notes">Journal de réalisation <small>6 000 caractères</small></label>
      <textarea name="notes" id="workbook-notes" maxLength={6000} rows={7}
        defaultValue={initial.notes} placeholder="Ce que j'ai réalisé, les tests effectués, mes difficultés…"/>
      <label htmlFor="workbook-next">Prochaine action <small>1 000 caractères</small></label>
      <textarea name="nextAction" id="workbook-next" maxLength={1000} rows={3}
        defaultValue={initial.next_action} placeholder="Ma prochaine étape vérifiable…"/>
      <label htmlFor="workbook-reference">Lien de travail <small>facultatif, HTTP(S)</small></label>
      <input name="referenceUrl" id="workbook-reference" type="url" maxLength={800}
        defaultValue={initial.reference_url||""} placeholder="https://github.com/…"/>
      <div className="workbook-footer"><SaveButton/>
        <span>{initial.updated_at?"Carnet déjà enregistré":"Première sauvegarde à effectuer"}</span>
      </div>
      <p className="workbook-disclaimer">Les notes et coches ne déclenchent ni correction, ni XP. Tu dois toujours soumettre ton livrable dans la partie « Remise ».</p>
    </section>
  </form>;
}
