import { Activity, BookCheck, CalendarDays, Trophy } from "lucide-react";

type Learner = {id:string};
type Mission = {id:string;week:number};
type Award = {learner_id:string;mission_id:string;xp:number};
type Submission = {learner_id:string;status:string;created_at:string};
type Practice = {learner_id:string;practice_date:string};
type Props = {
  learners:Learner[];
  awards:Award[];
  submissions:Submission[];
  practice:Practice[];
  missionCount:number;
  missions:Mission[];
};

export function CohortProgress({learners,awards,submissions,practice,missions,missionCount}:Props) {
  const records=learners.map((learner,index)=>{
    const approved=awards.filter(a=>a.learner_id===learner.id);
    const learnerSubs=submissions.filter(s=>s.learner_id===learner.id);
    const checkins=practice.filter(p=>p.learner_id===learner.id);
    const latestSubmission=learnerSubs.map(s=>s.created_at).sort().slice(-1)[0]||null;
    const latestPractice=checkins.map(c=>c.practice_date).sort().at(-1)||null;
    const latest=latestSubmission && latestPractice
      ? (latestSubmission.slice(0,10)>latestPractice?latestSubmission.slice(0,10):latestPractice)
      : (latestSubmission?.slice(0,10)||latestPractice);
    return {
      id:learner.id,
      label:"Apprenant "+String(index+1).padStart(2,"0"),
      approved:approved.length,
      xp:approved.reduce((sum,a)=>sum+Number(a.xp),0),
      pending:learnerSubs.filter(s=>s.status==="pending").length,
      practiceDays:new Set(checkins.map(p=>p.practice_date)).size,
      lastActivity:latest,
      progress:missionCount?Math.round(approved.length/missionCount*100):0,
      weekly:Array.from({length:8},(_,i)=>{
        const group=missions.filter(m=>m.week===i+1);
        const achieved=group.filter(m=>approved.some(a=>a.mission_id===m.id)).length;
        return {week:i+1,total:group.length,achieved};
      })
    };
  }).sort((a,b)=>b.approved-a.approved||b.xp-a.xp);
  return <section className="panel cohort-panel" aria-labelledby="cohort-title">
    <div className="section-head">
      <div><span className="journey-overline"><Activity size={14}/> SUIVI PÉDAGOGIQUE</span><h2 id="cohort-title">Progression des apprenants</h2></div>
      <span className="counter">{learners.length} inscrit(s)</span>
    </div>
    {records.length===0 ? <div className="empty-state"><h3>Pas encore d'apprenant</h3><p>Les progrès apparaîtront ici dès l'inscription d'un premier apprenant.</p></div>
    :<div className="cohort-table-wrap"><table className="cohort-table">
      <thead><tr><th scope="col">Apprenant</th><th scope="col">Progression</th><th scope="col">Blocs de compétences</th><th scope="col"><Trophy size={13}/> XP</th><th scope="col"><BookCheck size={13}/> En attente</th><th scope="col"><CalendarDays size={13}/> Jours pratiqués</th><th scope="col">Dernière activité</th></tr></thead>
      <tbody>{records.map(r=><tr key={r.id}>
        <td><strong>{r.label}</strong><small>Compte {r.id.slice(0,8)}…</small></td>
        <td><div className="cohort-progress"><div><strong>{r.approved}/{missionCount} missions</strong><span>{r.progress}%</span></div><div className="cohort-track"><span style={{width:r.progress+"%"}}/></div></div></td>
        <td><div className="cohort-skills" aria-label={"Progression des huit semaines de "+r.label}>{r.weekly.map(w=><span className={w.total>0&&w.achieved===w.total?"complete":w.achieved>0?"partial":""} key={w.week} title={"Semaine "+w.week+" : "+w.achieved+"/"+w.total+" missions validées"}>S{w.week}</span>)}</div></td>
        <td className="cohort-numeric">{r.xp}</td><td className="cohort-numeric">{r.pending}</td><td className="cohort-numeric">{r.practiceDays}</td>
        <td>{r.lastActivity||"Aucune encore"}</td>
      </tr>)}</tbody>
    </table></div>}
    <p className="cohort-note">Les validations et XP proviennent des corrections en base. Les journées de pratique sont déclarées par les apprenants et ne rapportent pas d'XP.</p>
  </section>;
}
