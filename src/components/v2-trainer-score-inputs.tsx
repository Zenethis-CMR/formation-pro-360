"use client";
import {useState} from "react";
import {Award,CheckCircle2,ClipboardCheck} from "lucide-react";

/**
 * Four *formative* indicators, each scored 0–25. The server action validates
 * and recomputes the total. No direct mutation or award occurs client-side.
 */
export function V2TrainerScoreInputs({criteria}:{criteria:string[]}){
  const labels=criteria.slice(0,4);
  const [scores,setScores]=useState(["","","",""]);
  const valid=scores.every(v=>/^\d{1,2}$/.test(v)&&Number(v)<=25);
  const total=valid?scores.reduce((n,v)=>n+Number(v),0):null;
  return <fieldset className="v2-review-rubric">
    <legend><ClipboardCheck size={17}/> Grille formative · 4 × 25 points</legend>
    <p>Évalue les preuves réelles, pas les coches de préparation. Chaque champ est obligatoire ; la validation et les XP restent exclusivement côté serveur.</p>
    {labels.map((criterion,i)=><label key={i}>
      <span><b>Critère {i+1}</b>{criterion}</span>
      <span className="v2-review-criterion-score"><input type="number" name={"criterion"+i} min={0} max={25} step={1}
        required inputMode="numeric" aria-label={"Critère "+(i+1)+" sur 25"}
        value={scores[i]} onChange={event=>setScores(current=>current.map((v,j)=>j===i?event.target.value:v))}/>
        /25</span>
    </label>)}
    <div className="v2-review-total" role="status" aria-live="polite">
      <span><Award size={17}/> Total évalué par le formateur</span>
      <strong>{total===null?"—":total}<small> /100</small></strong>
      <em>{total===null?"Remplis les 4 critères":total>=80?
        <><CheckCircle2 size={14}/> Seuil de validation atteint</>:"Améliorations nécessaires"}</em>
    </div>
  </fieldset>;
}
