import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarClock, CheckCircle2, Clock3, Lightbulb, MailOpen, MessagesSquare, Sparkles } from "lucide-react";
import type { CoachMessage, LearnerInsight } from "@/lib/coaching-insights";
type Props={insight:LearnerInsight;messages:CoachMessage[];startDate:string|null};
const pretty=(stamp:string)=>new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",dateStyle:"medium"}).format(new Date(stamp));
export function LearnerCoachingPanel({insight,messages,startDate}:Props){
  const focus=insight.focusMission;
  return <section className="coach-learner-panel" aria-labelledby="my-coaching-title">
    <div className="coach-panel-head"><div>
      <span className="journey-overline"><Sparkles size={14}/> ACCOMPAGNEMENT PERSONNALISÉ</span>
      <h2 id="my-coaching-title">Ton prochain pas, clairement défini.</h2>
      <p>Des recommandations tirées de tes projets et des retours de ton formateur.</p>
    </div><div className="coach-verified"><CheckCircle2 size={16}/> Données réelles</div></div>
    <div className="coach-learner-grid">
      <div className="coach-focus">
        <span className="coach-focus-eyebrow"><Lightbulb size={15}/> À FAIRE MAINTENANT</span>
        <h3>{insight.focusTitle}</h3><p>{insight.focusDescription}</p>
        {focus?<Link href={"/espace/atelier/"+focus.id} className="coach-primary-link"><BookOpenCheck size={16}/>{focus.title}<ArrowRight size={16}/></Link>
          :<Link href="/espace/apprenant?onglet=missions" className="coach-primary-link">Consulter mon programme <ArrowRight size={16}/></Link>}
        <div className="coach-status-row">
          {insight.revisionCount>0&&<span className="coach-notice amber">{insight.revisionCount} projet(s) à améliorer</span>}
          {insight.pendingCount>0&&<span className="coach-notice blue">{insight.pendingCount} correction(s) en attente</span>}
          {startDate && insight.backlogWeeks.length>0&&<span className="coach-notice amber">{insight.backlogWeeks.length} semaine(s) à rattraper</span>}
          {!startDate&&<span className="coach-notice neutral"><CalendarClock size={13}/> Date de début à définir par le formateur</span>}
        </div>
        {insight.daysWithoutActivity!==null&&insight.daysWithoutActivity>=3&&<p className="coach-activity-info">Aucune activité enregistrée depuis {insight.daysWithoutActivity} jour(s). Reprends par une petite étape accessible.</p>}
      </div>
      <div className="coach-messages">
        <div className="coach-messages-title"><span><MessagesSquare size={18}/> Messages du formateur</span><small>{messages.length} récent(s)</small></div>
        {messages.length? <div className="coach-message-list">{messages.map(m=><article className="coach-message" key={m.id}>
          <div><span><MailOpen size={13}/> Conseil du formateur</span><time dateTime={m.created_at}>{pretty(m.created_at)}</time></div>
          <p>{m.body}</p>
        </article>)}</div>
        : <div className="coach-message-empty"><MessagesSquare size={26}/><strong>Aucun message pour le moment</strong><p>Les conseils directs de ton formateur apparaîtront ici sans nécessiter d'e-mail supplémentaire.</p></div>}
      </div>
    </div>
  </section>;
}
