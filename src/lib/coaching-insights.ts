/**
 * Deterministic coaching recommendations derived from verified Supabase records.
 * No fictitious deadlines, fabricated XP or automatically sent messages.
 */
export type CoachMission = {id:string;title:string;week:number};
export type CoachDependency = {mission_id:string;prerequisite_id:string};
export type CoachSubmission = {learner_id:string;mission_id:string;status:string;created_at:string};
export type CoachAward = {learner_id:string;mission_id:string};
export type CoachPractice = {learner_id:string;practice_date:string};
export type CoachStep = {learner_id:string;mission_id:string;completed_at:string};
export type CoachMessage = {id:string;trainer_id:string;learner_id:string;body:string;created_at:string};

export function cameroonDay(date:Date=new Date()):string {
  const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const get=(type:string)=>parts.find(p=>p.type===type)?.value||"";
  return [get("year"),get("month"),get("day")].join("-");
}
export function daysBetween(a:string,b:string):number {
  const x=Date.parse(a+"T12:00:00Z"),y=Date.parse(b+"T12:00:00Z");
  return Number.isFinite(x)&&Number.isFinite(y)?Math.floor((y-x)/86400000):0;
}
export function shiftDate(date:string,days:number):string {
  const x=new Date(date+"T12:00:00Z");
  x.setUTCDate(x.getUTCDate()+days);
  return x.toISOString().slice(0,10);
}

export type LearnerInsight = {
  learnerId:string;
  approvedCount:number;
  pendingCount:number;
  revisionCount:number;
  backlogWeeks:number[];
  daysWithoutActivity:number|null;
  lastActivity:string|null;
  nextMission:CoachMission|null;
  focusMission:CoachMission|null;
  focusKind:"correction"|"evaluation"|"atelier"|"termine";
  focusTitle:string;
  focusDescription:string;
  plannedWeek:number|null;
  badge:"correction"|"evaluation"|"retard"|"inactif"|"normal";
};

export function learnerInsight(args:{
  learnerId:string;
  missions:CoachMission[];
  deps:CoachDependency[];
  awards:CoachAward[];
  submissions:CoachSubmission[];
  practices:CoachPractice[];
  steps:CoachStep[];
  startDate:string|null;
  today?:string;
}):LearnerInsight {
  const {learnerId,deps,startDate}=args;
  const today=args.today??cameroonDay();
  const missions=[...args.missions].sort((a,b)=>a.week-b.week||a.title.localeCompare(b.title,"fr"));
  const acquired=new Set(args.awards.filter(a=>a.learner_id===learnerId).map(a=>a.mission_id));
  const subs=args.submissions.filter(s=>s.learner_id===learnerId)
    .sort((a,b)=>b.created_at.localeCompare(a.created_at));
  const latest=new Map<string,CoachSubmission>();
  for(const s of subs) if(!latest.has(s.mission_id))latest.set(s.mission_id,s);
  const pending=missions.filter(m=>!acquired.has(m.id)&&latest.get(m.id)?.status==="pending");
  const revisions=missions.filter(m=>!acquired.has(m.id)&&latest.get(m.id)?.status==="changes_requested");
  const available=missions.filter(m=>!acquired.has(m.id)
    && !deps.some(d=>d.mission_id===m.id&&!acquired.has(d.prerequisite_id))
    && latest.get(m.id)?.status!=="pending");
  const nextMission=available[0]??null;
  let focusMission:CoachMission|null=null;
  let focusKind:LearnerInsight["focusKind"]="termine";
  let focusTitle="Parcours accompli";
  let focusDescription="Toutes les missions sont validées. Prépare ta présentation finale.";
  if(revisions.length) {
    focusMission=revisions[0];focusKind="correction";
    focusTitle="Améliorer un projet corrigé";
    focusDescription="Le formateur a demandé des modifications. Consulte son retour, puis renvoie une version améliorée.";
  } else if(nextMission) {
    focusMission=nextMission;focusKind="atelier";
    focusTitle="Avancer sur le prochain atelier";
    focusDescription="Lis les étapes, construis ton livrable et teste ton travail avant de le soumettre.";
  } else if(pending.length) {
    focusMission=pending[0];focusKind="evaluation";
    focusTitle="Projet en attente de correction";
    focusDescription="Ton livrable a été envoyé. Tu peux réviser les compétences de cette semaine pendant la correction.";
  } else if(acquired.size<missions.length) {
    focusTitle="Préparer la prochaine étape";
    focusDescription="Les prochaines missions dépendent de validations en cours.";
  }

  const backlogWeeks:number[]=[];
  const started=!!startDate&&today>=startDate;
  const plannedWeek=started ? Math.min(8,Math.max(1,Math.floor(daysBetween(startDate!,today)/7)+1)) : null;
  if(started) for(let w=1;w<=8;w++) {
    const group=missions.filter(m=>m.week===w);
    if(group.length&&today>shiftDate(startDate!,w*7-1)&&group.some(m=>!acquired.has(m.id))) {
      backlogWeeks.push(w);
    }
  }
  const days=args.practices.filter(x=>x.learner_id===learnerId).map(x=>x.practice_date)
    .concat(args.steps.filter(x=>x.learner_id===learnerId).map(x=>cameroonDay(new Date(x.completed_at))))
    .concat(subs.map(x=>cameroonDay(new Date(x.created_at)))).filter(Boolean).sort();
  const lastActivity=days.length?days[days.length-1]:null;
  const daysWithoutActivity=started
    ? Math.max(0,daysBetween(lastActivity && lastActivity>=startDate! ? lastActivity : startDate!,today))
    : null;
  const badge:LearnerInsight["badge"]=revisions.length?"correction"
    :pending.length?"evaluation"
    :backlogWeeks.length?"retard"
    :daysWithoutActivity!==null&&daysWithoutActivity>=3?"inactif":"normal";
  return {
    learnerId,approvedCount:missions.filter(m=>acquired.has(m.id)).length,
    pendingCount:pending.length,revisionCount:revisions.length,backlogWeeks,
    daysWithoutActivity,lastActivity,nextMission,focusMission,
    focusKind,focusTitle,focusDescription,plannedWeek,badge
  };
}
