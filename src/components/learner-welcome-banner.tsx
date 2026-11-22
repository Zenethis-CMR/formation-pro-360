import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, Settings2, Sparkles, Target, Timer } from "lucide-react";
import { goalLabel, type LearnerPreferences } from "@/lib/learner-preferences";

type NextMission={id:string;title:string;week:number}|null;
export function LearnerWelcomeBanner({preferences,mission}:{
  preferences:LearnerPreferences|null;
  mission:NextMission;
}) {
  return <section className="learner-personal-card" aria-labelledby="my-next-step-title">
    <div className="learner-personal-main">
      <span className="journey-overline"><Sparkles size={15}/> TON PARCOURS, À TON RYTHME</span>
      <h2 id="my-next-step-title">{preferences
        ? "Bonjour "+preferences.preferred_name+", prêt pour la suite ?"
        : "Prêt à construire ton premier projet ?"}</h2>
      <p>{preferences
        ? "Ton objectif : "+goalLabel(preferences.goal)+". Avance à ton rythme, avec des compétences vérifiées par ton formateur."
        : "Quelques informations facultatives nous aideront à te guider. Tu peux aussi commencer directement ton premier atelier."}</p>
      <div className="learner-personal-actions">
        {mission&&<Link href={"/espace/atelier/"+mission.id} className="learner-primary-start">
          <BookOpenCheck size={16}/><span>{mission.title}</span><ArrowRight size={17}/>
        </Link>}
        <Link className="learner-personal-settings" href="/espace/bienvenue">
          {preferences?<Settings2 size={16}/>:<GraduationCap size={16}/>}
          {preferences?"Modifier mes préférences":"Personnaliser mon parcours"}
        </Link>
      </div>
    </div>
    <aside className="learner-personal-side">
      <div><Target size={19}/><span>OBJECTIF</span><strong>{preferences?goalLabel(preferences.goal):"À définir"}</strong></div>
      <div><Timer size={19}/><span>PRATIQUE SOUHAITÉE</span><strong>{preferences?preferences.minutes_per_day+" min / jour":"À ton rythme"}</strong></div>
      <small>Les préférences ne changent ni les prérequis, ni l'attribution des XP.</small>
    </aside>
  </section>;
}
