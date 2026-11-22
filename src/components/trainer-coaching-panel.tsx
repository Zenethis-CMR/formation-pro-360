import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardCheck, Clock3, MessageSquareText, Send, Sparkles, UserRoundCheck } from "lucide-react";
import type { LearnerInsight, CoachMessage } from "@/lib/coaching-insights";
import { postCoachMessage } from "@/app/espace/actions";
import { goalLabel, formatWeekdays } from "@/lib/learner-preferences";
type Learner = {id:string;preferred_name?:string|null;goal?:string|null;minutes_per_day?:number|null;regular_days?:number[]|null;optional_days?:number[]};
type Props={learners:Learner[];insights:LearnerInsight[];messages:CoachMessage[];startDate:string|null};
function alertText(x:LearnerInsight){
  if(x.revisionCount) return x.revisionCount+" projet(s) à reprendre";
  if(x.pendingCount) return x.pendingCount+" livrable(s) à corriger";
  if(x.backlogWeeks.length) return x.backlogWeeks.length+" semaine(s) à rattraper";
  if(x.daysWithoutActivity!==null&&x.daysWithoutActivity>=3) return "Activité à relancer";
  return "Parcours suivi";
}
export function TrainerCoachingPanel({learners,insights,messages,startDate}:Props) {
  const issues=insights.filter(i=>i.revisionCount>0||i.pendingCount>0||i.backlogWeeks.length>0||(i.daysWithoutActivity!==null&&i.daysWithoutActivity>=3));
  const pending=insights.reduce((a,b)=>a+b.pendingCount,0);
  return <section className="trainer-coaching-panel" aria-labelledby="trainer-coaching-title">
    <div className="coach-panel-head"><div><span className="journey-overline"><ClipboardCheck size={14}/> ACCOMPAGNEMENT DE LA COHORTE</span>
      <h2 id="trainer-coaching-title">Les apprenants à accompagner.</h2><p>Suivi des corrections, des échéances et de la pratique, calculé depuis les données réelles.</p>
    </div><div className="coach-verified"><UserRoundCheck size={16}/>{learners.length} inscrit(s)</div></div>
    <div className="trainer-coach-metrics">
      <div><span><ClipboardCheck size={17}/> Projets en attente</span><strong>{pending}</strong></div>
      <div><span><AlertTriangle size={17}/> Suivis à examiner</span><strong>{issues.length}</strong></div>
      <div><span><CalendarClock size={17}/> Calendrier</span><strong className="trainer-coach-small">{startDate?"Démarré ou programmé":"Non planifié"}</strong></div>
    </div>
    {learners.length===0?<div className="coach-message-empty"><p>Les premiers comptes apprenants apparaîtront ici après leur inscription.</p></div>
    :<div className="trainer-coach-grid">{learners.map((l,index)=>{
      const i=insights.find(v=>v.learnerId===l.id);
      if(!i)return null;
      const sent=messages.filter(m=>m.learner_id===l.id);
      return <article className="trainer-coach-person" key={l.id}>
        <div className="trainer-coach-person-head"><div><span className="coach-avatar"><UserRoundCheck size={19}/></span><div><h3>{l.preferred_name||"Apprenant "+String(index+1).padStart(2,"0")}</h3><small>Compte {l.id.slice(0,8)}…</small></div></div>
          <span className={"coach-severity "+(i.badge==="normal"?"success":i.badge==="evaluation"?"info":"warning")}>{alertText(i)}</span></div>
        <div className="trainer-coach-details">
          <span><CheckCircle2 size={14}/>{i.approvedCount} mission(s) validée(s)</span>
          {l.goal&&<span><Sparkles size={14}/>{goalLabel(l.goal)}</span>}
          {l.regular_days?.length&&l.minutes_per_day&&l.minutes_per_day>=300&&<span><Clock3 size={14}/>{l.minutes_per_day/60} h/jour · {l.regular_days.length*l.minutes_per_day/60} h/semaine</span>}
          {l.regular_days?.length&&<span><CalendarClock size={14}/>Jours fixes : {formatWeekdays(l.regular_days)}{l.optional_days?.length?" · Renfort : "+formatWeekdays(l.optional_days):""}</span>}
          {l.minutes_per_day&&l.minutes_per_day<300&&<span><CalendarClock size={14}/>Ancien planning à actualiser</span>}
          <span><Clock3 size={14}/>{i.daysWithoutActivity===null?"Rythme non planifié":i.daysWithoutActivity+" jour(s) depuis l'activité"}</span>
          {i.backlogWeeks.length>0&&<span><AlertTriangle size={14}/>{i.backlogWeeks.length} semaine(s) à rattraper</span>}
        </div>
        <p className="trainer-coach-recommendation"><Sparkles size={14}/>{i.focusTitle} : {i.focusDescription}</p>
        <form action={postCoachMessage} className="trainer-coach-form">
          <input type="hidden" name="learnerId" value={l.id}/>
          <label htmlFor={"coach-message-"+l.id}>Envoyer une consigne personnalisée</label>
          <textarea id={"coach-message-"+l.id} name="body" required minLength={10} maxLength={1200} rows={3} placeholder="Ex. Reprends l'étape 2 de ton atelier et partage une version corrigée…"/>
          <button type="submit"><Send size={14}/> Envoyer dans son espace</button>
        </form>
        {sent.length>0&&<div className="trainer-coach-sent"><MessageSquareText size={13}/> Dernier message : {sent[0].body}</div>}
      </article>;
    })}</div>}
    <p className="coach-footnote">Les messages sont visibles uniquement dans l'espace connecté du destinataire et des formateurs. Aucun e-mail ni SMS n'est envoyé. Les retards ne sont calculés qu'après fixation de la date de début.</p>
  </section>;
}
