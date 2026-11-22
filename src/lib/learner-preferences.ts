export const learnerGoals = [
  {value:"first_site",title:"Lancer mon premier produit numérique",detail:"Partir d'un problème utilisateur, créer un premier produit et le mettre en ligne."},
  {value:"web_app",title:"Concevoir une application complète",detail:"Penser le produit, son UX, ses données, ses intégrations et son déploiement."},
  {value:"professional",title:"Créer et commercialiser des produits",detail:"Construire des produits solides, trouver des clients et tester une offre."}
] as const;
export const learnerLevels = [
  {value:"beginner",title:"Je débute",detail:"Je découvre le développement et la conception produit."},
  {value:"some",title:"J'ai quelques bases",detail:"J'ai déjà créé des pages ou automatisé des tâches."},
  {value:"practiced",title:"Je pratique déjà",detail:"Je veux apprendre à livrer des produits complets et fiables."}
] as const;
export const learnerDurations=[300,360,480,600] as const;
export const weekdays=[
  {id:1,label:"Lundi",short:"Lun."},
  {id:2,label:"Mardi",short:"Mar."},
  {id:3,label:"Mercredi",short:"Mer."},
  {id:4,label:"Jeudi",short:"Jeu."},
  {id:5,label:"Vendredi",short:"Ven."},
  {id:6,label:"Samedi",short:"Sam."},
  {id:7,label:"Dimanche",short:"Dim."}
] as const;
export type LearnerGoal=(typeof learnerGoals)[number]["value"];
export type LearnerLevel=(typeof learnerLevels)[number]["value"];
export type LearnerPreferences={
  learner_id:string;
  preferred_name:string;
  goal:LearnerGoal;
  experience:LearnerLevel;
  minutes_per_day:number;
  regular_days:number[]|null;
  optional_days:number[];
};
export type LearnerScheduleInput={
  name:string;goal:string;experience:string;minutes:string;
  dayChoices:string[];
};
export function parseLearnerPreferences(raw:LearnerScheduleInput):
  {valid:true;value:{
    preferred_name:string;goal:LearnerGoal;experience:LearnerLevel;
    minutes_per_day:number;regular_days:number[];optional_days:number[];
  }}|{valid:false}{
  const name=raw.name.trim().replace(/\s+/g," ");
  const duration=Number(raw.minutes);
  if(name.length<2||name.length>60||
    !learnerGoals.some(x=>x.value===raw.goal)||
    !learnerLevels.some(x=>x.value===raw.experience)||
    !learnerDurations.some(x=>x===duration)||
    raw.dayChoices.length!==7||
    raw.dayChoices.some(x=>!["regular","optional","off"].includes(x)))return {valid:false};
  const regular=raw.dayChoices.flatMap((v,i)=>v==="regular"?[i+1]:[]);
  const optional=raw.dayChoices.flatMap((v,i)=>v==="optional"?[i+1]:[]);
  if(regular.length<3||regular.length>7)return {valid:false};
  return {valid:true,value:{
    preferred_name:name,
    goal:raw.goal as LearnerGoal,
    experience:raw.experience as LearnerLevel,
    minutes_per_day:duration,
    regular_days:regular,
    optional_days:optional
  }};
}
export function goalLabel(goal:string):string{
  return learnerGoals.find(x=>x.value===goal)?.title||"Construire un produit";
}
export function levelLabel(level:string):string{
  return learnerLevels.find(x=>x.value===level)?.title||"Niveau à préciser";
}
export function formatWeekdays(days:number[]|null|undefined):string{
  return (days||[]).map(n=>weekdays.find(d=>d.id===n)?.short||"").filter(Boolean).join(", ");
}
export function plannedWeeklyHours(preferences:Pick<LearnerPreferences,"regular_days"|"minutes_per_day">):number|null{
  return preferences.regular_days?.length&&preferences.minutes_per_day>=300
    ?preferences.regular_days.length*preferences.minutes_per_day/60:null;
}
