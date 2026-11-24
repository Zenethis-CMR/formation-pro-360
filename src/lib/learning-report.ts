import {projectMilestones} from "./learner-product-project";
export type Workshop={module_id?:string;slug:string;title:string;objective:string;week:number;module_title:string;skills:string[];status:string;score:number|null;feedback:string|null;reviewed_at:string|null;last_submission_at:string|null;xp:number;evidence_id:string|null;evidence_url:string|null;attempt_count:number};
export type Supplementary={briefs:{total:number;accepted:number;submitted:number;revision_requested:number;assigned:number};support:{total:number;resolved:number;waiting_trainer:number;waiting_learner:number};reviews:{versions:number;recommendations:number;responded:number}|null};
export type LearningReport={source:"official_workshop_submissions_and_xp";generated_at:string;learner:{id:string;name:string|null;status:string;enrolled_at:string};course_slug?:string;course_title:string;workshops:Workshop[];supplementary:Supplementary|null};
export const statusLabel:Record<string,string>={verified:"Preuve vérifiée",pending:"En correction",changes_requested:"À reprendre",approved:"XP à rapprocher",not_started:"Aucun dépôt"};
export const enrollmentLabel:Record<string,string>={active:"Actif",completed:"Terminé",paused:"Suspendu",revoked:"Révoqué"};
export function isVerified(w:Workshop){return w.status==="verified"&&w.score!==null&&w.score>=80&&w.xp===100&&!!w.evidence_id;}
export function reportMetrics(workshops:Workshop[]){
 const verified=workshops.filter(isVerified);
 return {total:workshops.length,verified:verified.length,xp:verified.reduce((n,w)=>n+w.xp,0),
 average:verified.length?verified.reduce((n,w)=>n+(w.score??0),0)/verified.length:null,
 pending:workshops.filter(w=>w.status==="pending").length,rework:workshops.filter(w=>w.status==="changes_requested").length,
 attempts:workshops.reduce((n,w)=>n+w.attempt_count,0)};
}
export function reportWeeks(workshops:Workshop[]){
 const map=new Map<number,Workshop[]>();
 for(const w of workshops)map.set(w.week,[...(map.get(w.week)??[]),w]);
 return [...map.entries()].sort(([a],[b])=>a-b).map(([week,items])=>({week,title:items[0].module_title,skills:[...new Set(items.flatMap(w=>w.skills??[]))],items,...reportMetrics(items)}));
}
export function reportMilestones(workshops:Workshop[]){
 const published=new Set(workshops.map(w=>w.slug)),verified=new Set(workshops.filter(isVerified).map(w=>w.slug));
 return projectMilestones.map(m=>({...m,available:m.lessons.every(l=>published.has(l)),count:m.lessons.filter(l=>verified.has(l)).length}));
}
export function csvCell(value:unknown){
 let s=value===null||value===undefined?"":String(value);
 if(/^[\s\u0000-\u001f]*[=+\-@]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
export function reportCsv(report:LearningReport){
 const rows:unknown[][]=[["Bilan pédagogique privé",report.course_title],["Apprenant",report.learner.name||report.learner.id],["Généré le",report.generated_at],["Source",report.source],[],
 ["Semaine","Atelier","État","Note officielle /100","XP vérifiés","Tentatives","Dernière correction"]];
 for(const w of report.workshops)rows.push([w.week,w.title,statusLabel[w.status]??w.status,w.score,isVerified(w)?w.xp:0,w.attempt_count,w.reviewed_at]);
 rows.push([],["Les thèmes de compétences sont des objectifs de cursus, non des certifications individuelles."],["L'absence de dépôt ne prouve pas l'absence de travail."]);
 if(report.supplementary){const s=report.supplementary;rows.push([],["Activité complémentaire (hors XP)","Nombre"],["Défis attribués hors brouillons et annulations",s.briefs.total],["Défis acceptés",s.briefs.accepted],["Difficultés signalées",s.support.total],["Résolutions confirmées",s.support.resolved],["Versions de projet partagées",s.reviews?.versions??"Indisponible"],["Recommandations avec réponse",s.reviews?.responded??"Indisponible"]);}
 return "\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n");
}
export function reportDate(value:string){return new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(value));}
