import Link from "next/link";
import { CalendarDays, Clock3, Flag, GraduationCap, ShieldCheck, Sparkles, Target } from "lucide-react";
import { curriculumWeeks } from "@/lib/curriculum";
import { saveTrainingStartDate } from "@/app/espace/actions";
import { doualaToday } from "@/components/learning-achievements";

type Mission = {id:string;title:string;week:number};
type Props = {
  startDate:string|null;
  missions:Mission[];
  approved?:Set<string>;
  variant?:"trainer"|"learner";
};
const phases=[
  {label:"Comprendre",detail:"Lire les objectifs et identifier les notions clés"},
  {label:"Construire",detail:"Démarrer le premier atelier et produire une première version"},
  {label:"Approfondir",detail:"Terminer les fonctionnalités de la première mission"},
  {label:"Intégrer",detail:"Avancer sur le deuxième atelier de la semaine"},
  {label:"Tester",detail:"Vérifier les cas usuels, mobiles et les cas d'erreur"},
  {label:"Améliorer",detail:"Corriger, documenter et rendre le code plus clair"},
  {label:"Présenter",detail:"Démontrer les résultats et préparer la remise des livrables"}
];
function dateShift(date:string, days:number) {
  const d=new Date(date+"T12:00:00Z");
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function shortDate(date:string) {
  return new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"));
}
export function TrainingSchedule({startDate,missions,approved=new Set(),variant="learner"}:Props) {
  const trainer=variant==="trainer";
  const today=doualaToday();
  const plannedWeek=startDate && today>=startDate ? Math.floor((Date.parse(today+"T12:00:00Z")-Date.parse(startDate+"T12:00:00Z"))/604800000)+1 : 0;
  const activeWeek=plannedWeek>=1 && plannedWeek<=8
    ? plannedWeek
    : (curriculumWeeks.find(w=>missions.some(m=>m.week===w.week&&!approved.has(m.id)))?.week||1);
  return <section className="study-calendar" aria-labelledby="training-calendar-title">
    <header className="study-calendar-header">
      <div><span className="journey-overline"><CalendarDays size={14}/> PLANIFICATION PÉDAGOGIQUE</span>
        <h2 id="training-calendar-title">56 jours pour construire un produit.</h2>
        <p>Un rythme de pratique sur les sept jours de chaque semaine, avec un objectif concret à atteindre.</p>
      </div>
      <div className="study-calendar-state">
        <CalendarDays size={17}/>
        <strong>{startDate?shortDate(startDate):"À planifier"}</strong>
        <small>{startDate?"Début de formation":"Date de début non définie"}</small>
      </div>
    </header>
    {trainer && <form action={saveTrainingStartDate} className="study-calendar-form">
      <label htmlFor="courseStart">Date de début du parcours</label>
      <input id="courseStart" name="startDate" type="date" required defaultValue={startDate||""} min="2024-01-01" max="2100-12-31"/>
      <button type="submit">Enregistrer le calendrier</button>
      <span>Cette date sera visible par tous les apprenants. Les validations restent liées aux missions, pas au calendrier.</span>
    </form>}
    {!startDate && !trainer && <p className="study-calendar-notice"><Clock3 size={17}/> Le formateur n'a pas encore fixé la date de départ. Tu peux consulter les activités dès maintenant.</p>}
    <div className="study-calendar-weeks">{curriculumWeeks.map(w=>{
      const group=missions.filter(m=>m.week===w.week);
      const complete=group.filter(m=>approved.has(m.id)).length;
      const isDone=!trainer && group.length>0 && complete===group.length;
      const beginning=startDate?dateShift(startDate,(w.week-1)*7):null;
      const ending=startDate?dateShift(startDate,(w.week-1)*7+6):null;
      return <details key={w.week} className={"study-calendar-week"+(w.week===activeWeek?" highlighted":"")} open={w.week===activeWeek}>
        <summary><span className="study-week-number">S{w.week}</span><span className="study-week-info"><strong>{w.title}</strong><small>{w.outcome}</small></span>
          <span className="study-week-dates">{beginning&&ending?shortDate(beginning)+" – "+shortDate(ending):"7 journées"}</span>
          {!trainer&&<span className={"study-week-count"+(isDone?" done":"")}>{complete}/{group.length} mission(s)</span>}
        </summary>
        <div className="study-calendar-days">{phases.map((day,i)=>{
          const date=beginning?dateShift(beginning,i):null;
          const mission=group[i<=2?0:1]||group[0];
          return <div key={i} className={"study-calendar-day"+(date===today?" today":"")}>
            <div className="study-day-marker">{String(i+1).padStart(2,"0")}</div>
            <div className="study-day-copy"><strong>{day.label}</strong><p>{day.detail}</p>
              {mission && (i===1||i===3) && (trainer?<span className="study-day-mission">{mission.title}</span>:<Link href={"/espace/atelier/"+mission.id}>{mission.title}</Link>)}
            </div>
            <small>{date?shortDate(date):"Jour "+(i+1)}</small>
          </div>;
        })}</div>
        <div className="study-week-footer"><Target size={16}/><span>Objectif : {w.outcome}</span></div>
      </details>;
    })}</div>
    <p className="study-calendar-caption"><ShieldCheck size={15}/> Les dates servent de repères de travail. Ni un jour passé ni une séance déclarée n'attribue des XP. Le formateur valide les compétences sur les livrables.</p>
  </section>;
}
