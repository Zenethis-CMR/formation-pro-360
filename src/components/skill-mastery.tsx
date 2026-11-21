import { BookCheck, CheckCircle2, CircleDashed, GraduationCap, Target } from "lucide-react";
import { curriculumWeeks } from "@/lib/curriculum";
type Mission={id:string;week:number};
type Props={missions:Mission[];approved:Set<string>};
export function SkillMastery({missions,approved}:Props){
  const complete=curriculumWeeks.filter(w=> {
    const group=missions.filter(m=>m.week===w.week);
    return group.length>0&&group.every(m=>approved.has(m.id));
  }).length;
  return <section className="skills-overview" aria-labelledby="skills-overview-title">
    <div className="skills-head"><div><span className="journey-overline"><GraduationCap size={14}/> COMPÉTENCES</span>
      <h2 id="skills-overview-title">Mes acquis, mission après mission.</h2>
      <p>Une compétence n'est considérée comme maîtrisée que lorsque toutes les missions correspondantes ont été validées.</p></div>
      <div className="skills-total"><strong>{complete}<span> / 8</span></strong><small>blocs maîtrisés</small></div>
    </div>
    <div className="skills-grid">{curriculumWeeks.map(w=>{
      const group=missions.filter(m=>m.week===w.week);
      const scored=group.filter(m=>approved.has(m.id)).length;
      const percentage=group.length?Math.round(scored/group.length*100):0;
      const mastery=group.length>0&&scored===group.length;
      return <div className={"skills-item"+(mastery?" mastered":"")} key={w.week}>
        <div className="skills-title"><span className="skills-week">S{w.week}</span><strong>{w.title}</strong>{mastery?<CheckCircle2 size={16}/>:<CircleDashed size={16}/>}</div>
        <div className="skills-track" role="progressbar" aria-label={"Missions validées, semaine "+w.week} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><span style={{width:percentage+"%"}}/></div>
        <div className="skills-bottom"><span>{w.skills.join(" · ")}</span><b>{scored}/{group.length}</b></div>
      </div>;
    })}</div>
  </section>;
}
