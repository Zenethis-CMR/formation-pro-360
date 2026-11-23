import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, Settings2, Sparkles, Target, Timer, CalendarDays } from "lucide-react";
import type { V2DashboardPilot } from "@/lib/v2-dashboard-pilot";
import { pilotCourse } from "@/lib/v2-public-catalog";
import { goalLabel, plannedWeeklyHours, formatWeekdays, type LearnerPreferences } from "@/lib/learner-preferences";

type NextMission={id:string;title:string;week:number}|null;
export function LearnerWelcomeBanner({preferences,mission,pilot}:{
  preferences:LearnerPreferences|null;
  mission:NextMission;pilot?:V2DashboardPilot|null;
}) {
  const enrolled=pilot?.enrollment==="active"||pilot?.enrollment==="completed";
  const nextLesson=enrolled&&pilot?.resumeSlug?pilotCourse.modules.flatMap(
    m=>m.lessons.map(l=>({...l,week:m.week}))
  ).find(l=>l.slug===pilot.resumeSlug):null;
  const mainCourse="/espace/parcours/ingenierie-produit-ia";

  return <section className="learner-personal-card" aria-labelledby="my-next-step-title">
    <div className="learner-personal-main">
      <span className="journey-overline"><Sparkles size={15}/> TON PARCOURS, À TON RYTHME</span>
      <h2 id="my-next-step-title">{preferences
        ? "Bonjour "+preferences.preferred_name+", prêt pour la suite ?"
        : "Prêt à construire ton premier projet ?"}</h2>
      <p>{preferences
        ? "Ton objectif : "+goalLabel(preferences.goal)+". Priorité à la conception produit et à la réalisation de livrables vérifiés."
        : "Quelques informations facultatives nous aideront à te guider. Tu peux aussi commencer directement ton premier atelier."}</p>
      <div className="learner-personal-actions">
        {nextLesson?<Link href={mainCourse+"/atelier/"+nextLesson.slug} className="learner-primary-start">
          <BookOpenCheck size={16}/><span>Atelier principal : {nextLesson.title}</span><ArrowRight size={17}/>
        </Link>:enrolled?<Link href={mainCourse} className="learner-primary-start">
          <BookOpenCheck size={16}/><span>Revoir mes 16 ateliers</span><ArrowRight size={17}/>
        </Link>:pilot?.published?<Link href={mainCourse} className="learner-primary-start">
          <BookOpenCheck size={16}/><span>Rejoindre mon parcours</span><ArrowRight size={17}/>
        </Link>:mission&&<Link href={"/espace/atelier/"+mission.id} className="learner-primary-start">
          <BookOpenCheck size={16}/><span>Autre réalisation : {mission.title}</span><ArrowRight size={17}/>
        </Link>}
        <Link className="learner-personal-settings" href="/espace/bienvenue">
          {preferences?<Settings2 size={16}/>:<GraduationCap size={16}/>}
          {preferences?"Modifier mes préférences":"Personnaliser mon parcours"}
        </Link>
      </div>
    </div>
    <aside className="learner-personal-side">
      <div><Target size={19}/><span>OBJECTIF</span><strong>{preferences?goalLabel(preferences.goal):"À définir"}</strong></div>
      <div><Timer size={19}/><span>RYTHME INTENSIF</span>
        <strong>{preferences&&plannedWeeklyHours(preferences)!==null
          ?preferences.minutes_per_day/60+" h/jour · "+plannedWeeklyHours(preferences)+" h/semaine"
          :"Planning à compléter"}</strong></div>
      {preferences?.regular_days&&<div><CalendarDays size={19}/><span>JOURS FIXES</span>
        <strong>{formatWeekdays(preferences.regular_days)}</strong></div>}
      <small>Les préférences ne changent ni les prérequis, ni l'attribution des XP.</small>
    </aside>
  </section>;
}
