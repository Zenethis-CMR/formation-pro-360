import { BadgeCheck, Code2, Flame, Medal, Rocket, Trophy, LockKeyhole, CalendarCheck2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { completeDailyPractice } from "@/app/espace/actions";

export type Badge = {slug:string;title:string;description:string;icon:string;required_missions:number};
export type EarnedBadge = {badge_slug:string;awarded_at:string};
export type PracticeCheckin = {practice_date:string};

const symbols = {
  "badge-check": BadgeCheck, rocket: Rocket, "code-2": Code2,
  medal: Medal, flame: Flame, trophy: Trophy
};
const challenges = [
  {title:"Explique ton apprentissage",task:"Présente à voix haute ce que tu as construit cette semaine, puis note une amélioration à apporter."},
  {title:"Planifie ton progrès",task:"Divise ta mission actuelle en trois petites actions et termine la première."},
  {title:"Construis une fonctionnalité",task:"Consacre au moins 25 minutes à une partie fonctionnelle de ton livrable."},
  {title:"Teste ton travail",task:"Reproduis un cas d'utilisation, identifie un défaut et corrige-le."},
  {title:"Améliore la qualité",task:"Rends une partie de ton interface, de ton code ou de ta documentation plus claire."},
  {title:"Documente tes choix",task:"Ajoute au dépôt un court texte expliquant ce qui fonctionne et ce qu'il reste à améliorer."},
  {title:"Prépare une démonstration",task:"Teste les fonctions essentielles et prépare une courte démonstration du résultat."}
];

export function doualaToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
  const get = (type:string) => parts.find(p=>p.type===type)?.value || "";
  return get("year")+"-"+get("month")+"-"+get("day");
}
function previousDay(date: string) {
  const d=new Date(date+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()-1);
  return d.toISOString().slice(0,10);
}
export function practiceStreak(dates: string[], today: string) {
  const days=new Set(dates);
  let cursor=days.has(today)?today:previousDay(today);
  let streak=0;
  while(streak<365 && days.has(cursor)) {streak++; cursor=previousDay(cursor);}
  return streak;
}

type Props = {
  catalog: Badge[];
  earned: EarnedBadge[];
  practice: PracticeCheckin[];
  validatedCount: number;
  currentMission?: {id:string;title:string}|null;
};
export function LearningAchievements({catalog,earned,practice,validatedCount,currentMission}:Props) {
  const date=doualaToday();
  const practicedToday=practice.some(p=>p.practice_date===date);
  const streak=practiceStreak(practice.map(p=>p.practice_date),date);
  const weekday=new Date(date+"T12:00:00Z").getUTCDay();
  const challenge=challenges[weekday];
  const earnedSet=new Set(earned.map(e=>e.badge_slug));
  const obtained=catalog.filter(b=>earnedSet.has(b.slug)).length;
  const nextBadge=catalog.find(b=>!earnedSet.has(b.slug));
  return <section className="gamification" aria-label="Récompenses et pratique quotidienne">
    <div className="gamification-top">
      <div>
        <span className="journey-overline"><Sparkles size={14}/> APPRENDRE EN PRATIQUANT</span>
        <h2>Chaque progrès compte.</h2>
        <p>Les badges récompensent les missions réellement validées. Le défi quotidien t'aide à garder le rythme.</p>
      </div>
      <div className="gamification-figures">
        <div><strong>{obtained}<small> / {catalog.length}</small></strong><span>Badges</span></div>
        <div><strong>{streak}</strong><span>Jours de suite</span></div>
      </div>
    </div>
    <div className="gamification-grid">
      <div className="daily-challenge">
        <div className="challenge-top"><span><CalendarCheck2 size={17}/> DÉFI DU JOUR</span><span>{practicedToday?"Séance enregistrée":"25 minutes de pratique"}</span></div>
        <h3>{challenge.title}</h3><p>{challenge.task}</p>
        {currentMission && <Link href={"#mission-"+currentMission.id} className="challenge-mission"><span>Mission en cours : {currentMission.title}</span><ArrowRight size={14}/></Link>}
        {practicedToday
          ? <div className="challenge-done"><BadgeCheck size={17}/> Pratique du jour enregistrée. Reviens demain pour poursuivre.</div>
          : <form action={completeDailyPractice}><button type="submit" className="challenge-button">J'ai terminé ma séance <ArrowRight size={15}/></button></form>}
        <p className="challenge-disclaimer">La séance est déclarée par toi-même. Elle n'attribue pas d'XP et ne remplace pas la correction d'une mission.</p>
      </div>
      <div className="badge-section">
        <div className="badge-heading"><h3>Mes badges</h3><span>{obtained} obtenu(s)</span></div>
        <div className="badge-grid">{catalog.map(b=>{
          const Icon=symbols[b.icon as keyof typeof symbols]||BadgeCheck;
          const unlocked=earnedSet.has(b.slug);
          return <div className={"badge-tile"+(unlocked?" badge-unlocked":" badge-locked")} key={b.slug} title={b.description}>
            <span className="badge-symbol">{unlocked?<Icon size={21} strokeWidth={1.9}/>:<LockKeyhole size={18} strokeWidth={1.9}/>}</span>
            <strong>{b.title}</strong><small>{unlocked?"Obtenu":b.required_missions+" missions"}</small>
          </div>;
        })}</div>
        {nextBadge && <p className="next-badge"><Flame size={14}/> Encore {Math.max(0,nextBadge.required_missions-validatedCount)} mission(s) validée(s) pour « {nextBadge.title} ».</p>}
        {!nextBadge && catalog.length>0 && <p className="next-badge"><Trophy size={14}/> Bravo, tous les badges ont été débloqués !</p>}
      </div>
    </div>
  </section>;
}
