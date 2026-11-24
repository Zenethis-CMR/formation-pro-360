"use client";
import {useState} from "react";
import {CalendarDays, Clock3, Flame, Info} from "lucide-react";
import {learnerDurations,weekdays} from "@/lib/learner-preferences";
type Availability="regular"|"optional"|"off";
export function IntensiveScheduleSelector({regularDays,optionalDays,initialMinutes,guided=false}:{
 regularDays:number[]|null;optionalDays:number[];initialMinutes:number;guided?:boolean
}){
 const [choices,setChoices]=useState<Availability[]>(()=>weekdays.map(d=>
   regularDays?.includes(d.id)?"regular":optionalDays.includes(d.id)?"optional":"off"));
 const [duration,setDuration]=useState(learnerDurations.some(n=>n===initialMinutes)?initialMinutes:300);
 const regularCount=choices.filter(x=>x==="regular").length;
 const optionalCount=choices.filter(x=>x==="optional").length;
 const weeklyHours=regularCount*duration/60;
 return <>
   <fieldset className="learner-welcome-card schedule-card">
     <legend className="learner-welcome-step-label"><span>{guided?"A":"04"}</span> Tes journées de formation</legend>
     <h2>Quels jours travailleras-tu régulièrement ?</h2>
     <p>Sélectionne au moins <strong>3 jours fixes par semaine</strong> et, si besoin, des jours supplémentaires en renfort. Exemple : mardi, jeudi, samedi, avec dimanche facultatif.</p>
     <div className="schedule-day-header"><span>JOUR</span><span>FIXE</span><span>EN RENFORT</span><span>INDISPONIBLE</span></div>
     <div className="schedule-days">
       {weekdays.map((d,i)=><div className="schedule-day-row" key={d.id}>
         <strong>{d.label}</strong>
         {(["regular","optional","off"] as const).map(value=><label key={value} className={"schedule-day-option"+(choices[i]===value?" is-selected":"")}>
           <input type="radio" name={"day"+d.id} value={value} checked={choices[i]===value}
             onChange={()=>setChoices(old=>old.map((choice,j)=>j===i?value:choice))}
             aria-label={d.label+" : "+(value==="regular"?"jour fixe":value==="optional"?"jour en renfort":"indisponible")}/>
           <span aria-hidden="true">{value==="regular"?"✓":value==="optional"?"+":"−"}</span>
         </label>)}
       </div>)}
     </div>
     <div className={"schedule-summary"+(regularCount<3?" is-warning":"")} aria-live="polite">
       <CalendarDays size={18}/>
       <div><strong>{regularCount} jour{regularCount>1?"s":""} fixe{regularCount>1?"s":""} · {optionalCount} en renfort</strong>
         <small>{regularCount<3?"Choisis encore "+(3-regularCount)+" jour(s) fixe(s) pour valider ton rythme.":regularCount<=4?"Rythme intensif recommandé : 3 à 4 jours par semaine.":"Rythme intensif de "+regularCount+" jours par semaine."}</small></div>
     </div>
   </fieldset>
   <fieldset className="learner-welcome-card schedule-card">
     <legend className="learner-welcome-step-label"><span>{guided?"B":"05"}</span> Durée de tes séances</legend>
     <h2>Combien d'heures travailleras-tu chaque jour choisi ?</h2>
     <p>Le programme démarre à <strong>5 heures de travail actif par jour</strong>. Les séances peuvent être plus longues selon ton engagement et ton emploi du temps.</p>
     <div className="learner-duration-grid schedule-duration-grid">
       {learnerDurations.map(minutes=><label className="learner-duration" key={minutes}>
         <input type="radio" name="minutesPerDay" value={minutes} required checked={duration===minutes}
           onChange={()=>setDuration(minutes)}/>
         <span><Clock3 size={16}/>{minutes/60} h / jour</span>
       </label>)}
     </div>
     <div className="schedule-hours-total">
       <Flame size={20}/>
       <div><span>ENGAGEMENT HEBDOMADAIRE FIXE</span>
         <strong>{weeklyHours} heures de formation par semaine</strong>
         <small>Hors jours facultatifs. Cadence de référence : 30 % d'apports et de réflexion, 70 % de projets pratiques.</small></div>
     </div>
     <p><Info size={13}/> Ce planning est une cible de travail. Le formateur évalue surtout les livrables et les compétences réellement acquises, pas le simple nombre d'heures déclarées.</p>
   </fieldset>
 </>;
}
