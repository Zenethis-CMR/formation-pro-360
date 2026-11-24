import Link from "next/link";
import {Clock3,CalendarDays,ArrowRight} from "lucide-react";
import {estimateTraining,estimateLabel,trainingHours,type AiTrainingPlan,type StudyRhythm} from "@/lib/ai-training-plans";
export function TrainingDuration({plan,rhythm,compact=false}:{plan:AiTrainingPlan;rhythm:StudyRhythm|null;compact?:boolean}){
 const hours=trainingHours(plan),estimate=estimateTraining(hours,rhythm);
 if(compact)return <span className="ai-duration-inline"><Clock3 size={15}/> {hours} h de travail{estimate&&<> · {estimateLabel(hours,rhythm)} à ton rythme</>}</span>;
 return <section className="ai-duration-card" aria-label="Estimation de durée"><div className="ai-duration-title"><CalendarDays size={21}/><div><strong>À ton rythme</strong><small>Charge totale indicative, depuis le début</small></div></div><div className="ai-duration-values"><div><span>Charge de formation</span><strong>{hours} h</strong></div><div><span>Durée estimée</span><strong>{estimate?estimateLabel(hours,rhythm):"À calculer"}</strong></div></div>{estimate?<p>{estimate.weeklyHours} h/semaine · {estimate.sessions} séances prévues, jours fixes uniquement. Les corrections, reprises et retours externes peuvent prolonger le parcours.</p>:<p>Renseigne ton rythme dans ton espace personnel pour calculer la durée de cette formation.</p>}<Link href="/espace/bienvenue">Définir ou modifier mon rythme <ArrowRight size={15}/></Link></section>;
}
export function TrainingEstimateList({rhythm,plans}:{rhythm:StudyRhythm|null;plans:AiTrainingPlan[]}){
 return <div className="ai-estimate-list">{plans.map(plan=><div key={plan.slug}><span>{plan.title}<small>{trainingHours(plan)} h de travail</small></span><strong>{estimateLabel(trainingHours(plan),rhythm)||"—"}</strong></div>)}</div>;
}
