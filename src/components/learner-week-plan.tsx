import Link from "next/link";
import {ArrowRight,CalendarDays,Clock3} from "lucide-react";
import type {LearnerPreferences} from "@/lib/learner-preferences";
import type {V2DashboardPilot} from "@/lib/v2-dashboard-pilot";
import {aiTrainingPlans} from "@/lib/ai-training-plans";
import {TrainingEstimateList} from "@/components/training-duration";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {buildLearnerWeekPlan,doualaCalendarDate} from "@/lib/learner-week-plan";

const base="/espace/parcours/ingenierie-produit-ia";
const duration=(minutes:number)=>Math.floor(minutes/60)+" h"+(minutes%60?" "+String(minutes%60).padStart(2,"0"):"");
const dayLabel=(date:string)=>new Intl.DateTimeFormat("fr-FR",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"));
export function LearnerWeekPlan({preferences,pilot}:{preferences:LearnerPreferences|null;pilot:V2DashboardPilot|null}){
  const today=doualaCalendarDate();
  const plan=buildLearnerWeekPlan(preferences,today);
  const active=pilot?.enrollment==="active"&&pilot.published;
  const lesson=active&&pilot?.resumeSlug?pilotCourse.modules.flatMap(m=>m.lessons.map(l=>({...l,week:m.week}))).find(l=>l.slug===pilot.resumeSlug):null;
  return <section id="planning-personnel" className="personal-week" aria-labelledby="personal-week-title">
    <header className="personal-week-head"><div>
      <span className="journey-overline"><CalendarDays size={15}/> TON RYTHME DE PRATIQUE</span>
      <h2 id="personal-week-title">Mes 7 prochains jours</h2>
      <p>Un planning indicatif selon tes disponibilités, pas un suivi de présence.</p>
    </div><Link href="/espace/bienvenue">{plan?"Modifier mon rythme":"Définir mon rythme"} <ArrowRight size={16}/></Link></header>
    {plan?<><div className="personal-week-totals">
      <span><Clock3 size={16}/> <strong>{duration(plan.plannedMinutes)}</strong> prévues · {plan.regularCount} jours fixes</span>
      <span>{plan.optionalCount?duration(plan.optionalMinutes)+" en renfort facultatif":"Aucun jour de renfort déclaré"}</span>
    </div>
    <ol className="personal-week-days">{plan.days.map(day=><li key={day.date} className={"personal-week-day "+day.kind} aria-current={day.date===today?"date":undefined}>
      <time dateTime={day.date}>{day.date===today?"Aujourd'hui · ":""}{dayLabel(day.date)}</time>
      <strong>{day.kind==="regular"?"Séance fixe":day.kind==="optional"?"Facultatif":"Jour libre"}</strong>
      {day.kind!=="off"?<><span>{duration(day.minutes)}</span><small>{duration(day.learningMinutes)} comprendre · {duration(day.practiceMinutes)} construire</small></>:<small>Aucune séance prévue</small>}
    </li>)}</ol>
    {lesson?<div className="personal-week-next"><div><strong>Objectif de travail proposé · semaine {lesson.week}</strong><p>{lesson.title}</p></div><Link href={base+"/atelier/"+lesson.slug}>Ouvrir mon atelier <ArrowRight size={16}/></Link></div>:
      <p className="personal-week-note">Consulte ton parcours pour vérifier ton inscription, tes corrections ou les prochaines réalisations.</p>}
    <details className="ai-duration-card"><summary>Durée estimée des sept formations</summary><TrainingEstimateList rhythm={preferences} plans={aiTrainingPlans}/><p>Depuis le début de chaque formation, jours fixes uniquement.</p></details>
    <p className="personal-week-note">Répartition indicative : 30 % compréhension, 70 % réalisation. Prévois des pauses. Aucun retard ni XP n'est calculé à partir de ce planning.</p>
    </>:<p className="personal-week-note">Renseigne tes jours fixes, facultatifs et la durée de séance pour afficher ton planning. Tu peux continuer tes ateliers sans cette étape.</p>}
  </section>;
}
