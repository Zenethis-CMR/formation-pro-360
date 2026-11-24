export const briefStatuses={draft:"Brouillon",assigned:"À réaliser",submitted:"En correction",revision_requested:"À reprendre",accepted:"Travail accepté",cancelled:"Annulé"} as const;
export type BriefStatus=keyof typeof briefStatuses;
export type BriefFields={learner_id:string;title:string;objective:string;instructions:string;criteria:string;resources:string;workshop_slug:string|null;due_date:string|null};
export type Attempt={id:string;evidence_url:string;note:string;created_at:string;outcome:"revision_requested"|"accepted"|null;feedback:string|null;reviewed_at:string|null};
export type PracticeBrief=Omit<BriefFields,"learner_id">&{id:string;learner_id?:string;learner_name?:string|null;editable?:boolean;status:BriefStatus;revision:number;updated_at:string;attempts:Attempt[]};
export type BriefList={briefs:PracticeBrief[];page:number;has_next:boolean};
export type BriefAction=
 |{intent:"draft";id:string|null;revision:number;brief:BriefFields}
 |{intent:"publish"|"cancel";id:string;revision:number}
 |{intent:"submit";id:string;revision:number;evidence_url:string;note:string}
 |{intent:"review";id:string;revision:number;attempt_id:string;outcome:"accepted"|"revision_requested";feedback:string};
export const emptyBrief=():BriefFields=>({learner_id:"",title:"",objective:"",instructions:"",criteria:"",resources:"",workshop_slug:null,due_date:null});
export function briefFields(b:PracticeBrief):BriefFields{return {learner_id:b.learner_id??"",title:b.title,objective:b.objective,instructions:b.instructions,criteria:b.criteria,resources:b.resources,workshop_slug:b.workshop_slug,due_date:b.due_date};}
export function briefIssues(b:BriefFields){return [!b.learner_id?"Apprenant":null,b.title.trim().length<3?"Titre":null,!b.objective.trim()?"Objectif":null,!b.instructions.trim()?"Consignes":null,!b.criteria.trim()?"Critères de réussite":null].filter(Boolean);}
export function safeEvidence(v:string){try{const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function briefPriority(status:BriefStatus,trainer:boolean){const order:BriefStatus[]=trainer?["submitted","draft","revision_requested","assigned","accepted","cancelled"]:["revision_requested","assigned","submitted","accepted","cancelled","draft"];return order.indexOf(status);}
export function localDay(now:Date=new Date()){const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);return ["year","month","day"].map(k=>p.find(x=>x.type===k)?.value??"").join("-");}
export function isOverdue(b:PracticeBrief,today:string){return !!b.due_date&&b.due_date<today&&["assigned","revision_requested"].includes(b.status);}
