export const taskStatuses=[{id:"todo",label:"À faire"},{id:"doing",label:"En cours"},{id:"testing",label:"À tester"},{id:"done",label:"Terminé"}] as const;
export const taskPriorities=[{id:"critical",label:"Critique"},{id:"high",label:"Haute"},{id:"normal",label:"Normale"},{id:"low",label:"Basse"}] as const;
export type TaskStatus=(typeof taskStatuses)[number]["id"];
export type TaskPriority=(typeof taskPriorities)[number]["id"];
export type ProductTask={id:string;title:string;description:string;acceptance:string;status:TaskStatus;priority:TaskPriority;workshop:string|null;due_date:string|null;estimate_minutes:number};
export type ProductBacklog={tasks:ProductTask[];revision:number;updated_at:string};
export const maxTasks=80;
export function summarizeBacklog(tasks:ProductTask[],today:string){
 const open=tasks.filter(t=>t.status!=="done");
 return {total:tasks.length,done:tasks.length-open.length,active:tasks.filter(t=>t.status==="doing").length,testing:tasks.filter(t=>t.status==="testing").length,overdue:open.filter(t=>t.due_date!==null&&t.due_date<today).length,remainingMinutes:open.reduce((n,t)=>n+t.estimate_minutes,0)};
}
export function sortTasks(tasks:ProductTask[]){
 return [...tasks].sort((a,b)=>taskPriorities.findIndex(p=>p.id===a.priority)-taskPriorities.findIndex(p=>p.id===b.priority)||(a.due_date||"9999-12-31").localeCompare(b.due_date||"9999-12-31"));
}
export function canCompleteTask(task:ProductTask){return task.acceptance.trim().length>0;}
export function localCalendarDate(now:Date=new Date()){
 const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
 return ["year","month","day"].map(key=>p.find(part=>part.type===key)?.value).join("-");
}
