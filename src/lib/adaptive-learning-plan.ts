import {getAiTrainingPlan} from "@/lib/ai-training-plans";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {getSpecializationProgram} from "@/lib/specialization-programs";
import type {StudioTrack,StudioLesson} from "@/lib/universal-learning";

export type Availability={regular_days:number[]|null;minutes_per_day:number;optional_days?:number[]};
export type WorkItem={id:string;title:string;state:StudioLesson["state"];minutes:number|null};
type Slot={date:string;minutes:number;tasks:{id:string;title:string;minutes:number}[]};
/** Only match existing editorial estimates to the exact original published lesson identity.
 * New revisions must carry approved workload metadata in a future publication contract.
 * No private draft/sealed content is ever read. */
export function publishedWorkItems(slug:string,track:StudioTrack):{items:WorkItem[];completeCoverage:boolean}{
 const plan=getAiTrainingPlan(slug);
 const editorial=slug===pilotCourse.slug?pilotCourse.modules:getSpecializationProgram(slug)?.modules;
 const budgets=new Map<string,{minutes:number;title:string;objective:string;evidence:string}>();
 if(plan&&editorial&&plan.modules.length===editorial.length)editorial.forEach((m,i)=>{
  if(plan.modules[i]?.activities.length!==m.lessons.length)return;
  const moduleSlug="slug" in m?m.slug:"semaine-"+(i+1);
  m.lessons.forEach((l,j)=>{
   const minutes=plan.modules[i].activities[j].minutes;
   if(Number.isSafeInteger(minutes)&&minutes>0)budgets.set(moduleSlug+":"+l.slug,{minutes,title:l.title,objective:l.objective,evidence:l.evidence});
  });
 });
 const matched=new Set<string>();
 const items=track.lessons.map(l=>{
  const module=track.modules.find(m=>m.id===l.module_id);
  const key=module?.slug+":"+l.slug;
  const budget=budgets.get(key);
  const matches=!!budget&&l.version===1&&l.title===budget.title&&l.objective===budget.objective&&l.evidence_required===budget.evidence;
  if(matches)matched.add(key);
  return {id:l.id,title:l.title,state:l.state,minutes:matches?budget!.minutes:null};
 });
 return {items,completeCoverage:budgets.size>0&&matched.size===budgets.size&&items.length===budgets.size};
}
function dateFrom(value:string){
 const date=new Date(value+"T12:00:00Z");
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?date:null;
}
/** Forecast starts tomorrow: today's actual remaining availability is not recorded.
 * Pending reviews aren't work sessions; revisions use the full original budget as
 * a conservative planning proxy, never a measured duration. */
export function forecastWork(items:WorkItem[],availability:Availability|null,today:string,completeCoverage:boolean){
 const pending=items.filter(x=>x.state==="pending").length;
 const revisions=items.filter(x=>x.state==="changes_requested").length;
 const unknown=items.filter(x=>x.state==="unknown"||((x.state==="not_started"||x.state==="changes_requested")&&(!Number.isSafeInteger(x.minutes)||Number(x.minutes)<=0))).length;
 const work=[...items.filter(x=>x.state==="changes_requested"),...items.filter(x=>x.state==="not_started")];
 const remainingMinutes=unknown?null:work.reduce((n,x)=>n+(x.minutes??0),0);
 const days=availability?.regular_days;
 const capacity=availability?.minutes_per_day;
 const start=dateFrom(today);
 const rhythmValid=!!start&&Array.isArray(days)&&days.length>=3&&days.length<=7&&new Set(days).size===days.length&&days.every(d=>Number.isInteger(d)&&d>=1&&d<=7)&&typeof capacity==="number"&&[300,360,480,600].includes(capacity);
 const optionalDays=rhythmValid?new Set((availability?.optional_days??[]).filter(d=>Number.isInteger(d)&&d>=1&&d<=7&&!days!.includes(d))).size:0;
 const weeklyMinutes=rhythmValid?days!.length*capacity!:null;
 const slots:Slot[]=[];
 let lastWorkDate:string|null=null;
 if(rhythmValid&&remainingMinutes!==null&&remainingMinutes>0){
  let i=0,left=work[0]?.minutes??0;
  for(let offset=1;offset<=3660&&i<work.length;offset++){
   const date=new Date(start!);date.setUTCDate(date.getUTCDate()+offset);
   if(!days!.includes(date.getUTCDay()||7))continue;
   let free=capacity!;
   const tasks:Slot["tasks"]=[];
   while(free>0&&i<work.length){
    const minutes=Math.min(free,left);tasks.push({id:work[i].id,title:work[i].title,minutes});
    left-=minutes;free-=minutes;
    if(left===0){i++;left=work[i]?.minutes??0;}
   }
   const day=date.toISOString().slice(0,10);
   if(offset<=7)slots.push({date:day,minutes:capacity!-free,tasks});
   if(i===work.length)lastWorkDate=day;
  }
 }
 return {remainingMinutes,pending,revisions,unknown,weeklyMinutes,optionalDays,slots,lastWorkDate,courseWorkDate:completeCoverage?lastWorkDate:null,completeCoverage};
}
