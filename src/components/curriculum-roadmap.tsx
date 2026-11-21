import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Flag, LockKeyhole, Sparkles } from "lucide-react";
import { curriculumWeeks } from "@/lib/curriculum";

type MissionRef = { id: string; week: number; title: string };
type Props = {
  missions: MissionRef[];
  prerequisites?: {mission_id:string;prerequisite_id:string}[];
  approved?: Set<string>;
  variant?: "learner" | "trainer";
};

export function CurriculumRoadmap({ missions, approved = new Set<string>(), prerequisites = [], variant = "learner" }: Props) {
  const trainer = variant === "trainer";
  const total = missions.length;
  const validated = missions.filter(m => approved.has(m.id)).length;
  const activeWeek = curriculumWeeks.find(w => {
    const group = missions.filter(m => m.week === w.week);
    return group.length > 0 && group.some(m => !approved.has(m.id));
  })?.week ?? 8;
  const current = curriculumWeeks.find(w => w.week === activeWeek) ?? curriculumWeeks[0];

  return <section className="journey-panel" aria-labelledby="journey-title">
    <div className="journey-heading">
      <div>
        <span className="journey-overline"><Sparkles size={14} aria-hidden="true"/> PARCOURS PRATIQUE · 8 SEMAINES</span>
        <h2 id="journey-title">{trainer ? "Le programme pédagogique" : "Ta feuille de route"}</h2>
        <p>{trainer ? "Un parcours progressif, de la première page au projet professionnel." : "Un objectif concret chaque semaine. Tes validations restent synchronisées avec ton formateur."}</p>
      </div>
      <div className="journey-overview">
        <strong>{trainer ? total : validated}<span> / {total}</span></strong>
        <small>{trainer ? "missions au programme" : "missions validées"}</small>
      </div>
    </div>
    <div className="journey-week-grid">
      {curriculumWeeks.map(w => {
        const group = missions.filter(m => m.week === w.week).sort((a,b)=>{
          if(prerequisites.some(d=>d.mission_id===b.id&&d.prerequisite_id===a.id))return -1;
          if(prerequisites.some(d=>d.mission_id===a.id&&d.prerequisite_id===b.id))return 1;
          return a.title.localeCompare(b.title,"fr");
        });
        const done = group.filter(m => approved.has(m.id)).length;
        const isDone = !trainer && group.length > 0 && done === group.length;
        const isCurrent = !trainer && w.week === activeWeek;
        const state = trainer ? "catalog" : isDone ? "completed" : isCurrent ? "current" : "upcoming";
        const progress = group.length ? Math.round(done / group.length * 100) : 0;
        const destination = group[0] ? "/espace/atelier/" + group[0].id : "/espace/apprenant";
        return <div key={w.week} className={"journey-week " + state}>
          <div className="journey-week-top">
            <span className="journey-week-index">S{String(w.week).padStart(2,"0")}</span>
            <span className="journey-week-state">
              {trainer ? group.length + " missions" : isDone ? <><CheckCircle2 size={12}/> Acquise</> : isCurrent ? <><Flag size={12}/> En cours</> : <><LockKeyhole size={11}/> À venir</>}
            </span>
          </div>
          <strong>{w.title}</strong>
          <p>{w.outcome}</p>
          <div className="journey-skills">{w.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
          {!trainer && <div className="journey-week-progress" role="progressbar" aria-label={"Progression de la semaine " + w.week} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{width:progress+"%"}}/></div>}
          {trainer ? <span className="journey-week-count">{group.length} livrables à évaluer</span> : <Link className="journey-week-link" href={destination}>{isDone ? "Revoir les missions" : isCurrent ? "Voir mes missions" : "Explorer la semaine"} <ArrowUpRight size={13}/></Link>}
        </div>;
      })}
    </div>
    {!trainer && <div className="journey-coach">
      <div className="journey-coach-symbol"><Sparkles size={19}/></div>
      <div><span>LE CONSEIL DU COACH · SEMAINE {activeWeek}</span><strong>{current.coachTip}</strong></div>
    </div>}
  </section>;
}
