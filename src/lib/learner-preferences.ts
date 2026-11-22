export const learnerGoals = [
  { value:"first_site", title:"Créer mon premier site", detail:"Maîtriser les fondations et publier une première page." },
  { value:"web_app", title:"Construire une application web", detail:"Développer des interfaces interactives et une application complète." },
  { value:"professional", title:"Devenir développeur professionnel", detail:"Apprendre à concevoir, tester et livrer des projets solides." }
] as const;
export const learnerLevels = [
  {value:"beginner",title:"Je débute",detail:"Je découvre le développement web."},
  {value:"some",title:"J'ai quelques bases",detail:"J'ai déjà écrit du HTML, CSS ou JavaScript."},
  {value:"practiced",title:"Je pratique déjà",detail:"Je souhaite structurer et approfondir mes compétences."}
] as const;
export const learnerDurations=[30,60,90,120] as const;
export type LearnerGoal = (typeof learnerGoals)[number]["value"];
export type LearnerLevel = (typeof learnerLevels)[number]["value"];
export type LearnerPreferences = {
  learner_id:string;
  preferred_name:string;
  goal:LearnerGoal;
  experience:LearnerLevel;
  minutes_per_day:number;
};
export function parseLearnerPreferences(raw:{name:string;goal:string;experience:string;minutes:string}):
  {valid:true;value:{preferred_name:string;goal:LearnerGoal;experience:LearnerLevel;minutes_per_day:number}}
  | {valid:false} {
  const name=raw.name.trim().replace(/\s+/g," ");
  const duration=Number(raw.minutes);
  if(name.length<2||name.length>60||
    !learnerGoals.some(x=>x.value===raw.goal)||
    !learnerLevels.some(x=>x.value===raw.experience)||
    !learnerDurations.some(n=>n===duration)) return {valid:false};
  return {valid:true,value:{
    preferred_name:name,
    goal:raw.goal as LearnerGoal,
    experience:raw.experience as LearnerLevel,
    minutes_per_day:duration
  }};
}
export function goalLabel(goal:string):string {
  return learnerGoals.find(x=>x.value===goal)?.title||"Avancer dans mes compétences";
}
export function levelLabel(level:string):string {
  return learnerLevels.find(x=>x.value===level)?.title||"Niveau à préciser";
}
