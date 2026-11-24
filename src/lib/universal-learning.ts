export type EnrolledTrack={slug:string;title:string;enrollment:"active"|"completed"|"paused"|"revoked"};
export type ProgressSummary={total:number;approved:number;pending:number;changes_requested:number};
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const record=(value:unknown):Record<string,unknown>|null=>typeof value==="object"&&value!==null&&!Array.isArray(value)?value as Record<string,unknown>:null;
export function enrolledTracks(value:unknown):EnrolledTrack[]{
 const data=record(value);
 if(!Array.isArray(data?.tracks))return [];
 const seen=new Set<string>(),result:EnrolledTrack[]=[];
 for(const item of data.tracks){
  const t=record(item);
  if(!t||t.status!=="published"||typeof t.slug!=="string"||t.slug.length>100||!slugPattern.test(t.slug)||typeof t.title!=="string"||!t.title.trim()||seen.has(t.slug))continue;
  if(t.enrollment!=="active"&&t.enrollment!=="completed"&&t.enrollment!=="paused"&&t.enrollment!=="revoked")continue;
  seen.add(t.slug);result.push({slug:t.slug,title:t.title,enrollment:t.enrollment});
 }
 return result;
}
export function canReadTrack(t:EnrolledTrack){return t.enrollment==="active"||t.enrollment==="completed";}
export function selectEnrolledTrack(tracks:EnrolledTrack[],requested:unknown):EnrolledTrack|null{
 const allowed=tracks.filter(canReadTrack);
 if(requested!==undefined)return typeof requested==="string"?allowed.find(t=>t.slug===requested)??null:null;
 return allowed.find(t=>t.enrollment==="active")??allowed[0]??null;
}
export function parseTrackProgress(value:unknown,slug:string):{summary:ProgressSummary|null;xp:number}|null{
 const data=record(value),track=record(data?.track);
 if(!data||!track||track.slug!==slug||track.status!=="published"||data.lesson_access!=="granted"||(data.enrollment!=="active"&&data.enrollment!=="completed"))return null;
 const xp=data.xp_total;
 if(typeof xp!=="number"||!Number.isSafeInteger(xp)||xp<0)return null;
 const p=record(data.progress_summary);
 const total=p?.total,approved=p?.approved,pending=p?.pending,changes=p?.changes_requested;
 const summary=typeof total==="number"&&typeof approved==="number"&&typeof pending==="number"&&typeof changes==="number"&&[total,approved,pending,changes].every(n=>Number.isSafeInteger(n)&&n>=0)&&approved+pending+changes<=total?{total,approved,pending,changes_requested:changes}:null;
 return {summary,xp};
}

export type WorkshopState="not_started"|"pending"|"approved"|"changes_requested"|"unknown";
export type StudioModule={id:string;slug:string;title:string;outcome:string;week:number;skills:string[]};
export type StudioCriterion={label:string;descriptor:string};
export type StudioLesson={id:string;module_id:string;slug:string;version:number;title:string;objective:string;guided_work:string;independent_work:string;evidence_required:string;rubric:StudioCriterion[];state:WorkshopState};
export type StudioTrack={title:string;summary:string;enrollment:"active"|"completed";modules:StudioModule[];lessons:StudioLesson[]};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str=(v:unknown):string=>typeof v==="string"?v:"";
const validSlug=(v:unknown):v is string=>typeof v==="string"&&v.length<=100&&slugPattern.test(v);
export function validStudioTrackSlug(v:unknown){return validSlug(v);}
export function parseStudioTrack(value:unknown,slug:string):StudioTrack|null{
 const data=record(value),track=record(data?.track);
 if(!data||!track||!validSlug(slug)||track.slug!==slug||track.status!=="published"||data.lesson_access!=="granted"||(data.enrollment!=="active"&&data.enrollment!=="completed")||!str(track.title).trim()||!Array.isArray(data.modules)||!Array.isArray(data.lessons))return null;
 const modules:StudioModule[]=[],moduleIds=new Set<string>();
 for(const raw of data.modules){
  const m=record(raw);
  if(!m||typeof m.id!=="string"||!uuid.test(m.id)||moduleIds.has(m.id)||!validSlug(m.slug)||!str(m.title).trim()||typeof m.week!=="number"||!Number.isSafeInteger(m.week)||m.week<1)continue;
  moduleIds.add(m.id);modules.push({id:m.id,slug:m.slug,title:str(m.title),outcome:str(m.outcome),week:m.week,skills:Array.isArray(m.skills)?m.skills.filter((x):x is string=>typeof x==="string"):[]});
 }
 const key=(m:string,l:string)=>m+":"+l;
 const states=new Map<string,WorkshopState>();
 if(Array.isArray(data.workshop_states))for(const raw of data.workshop_states){
  const s=record(raw);
  if(s&&typeof s.module_id==="string"&&moduleIds.has(s.module_id)&&validSlug(s.lesson_slug)&&(s.status==="not_started"||s.status==="pending"||s.status==="approved"||s.status==="changes_requested"))states.set(key(s.module_id,s.lesson_slug),s.status);
 }
 const latest=new Map<string,StudioLesson>();
 for(const raw of data.lessons){
  const l=record(raw);
  if(!l||l.status!=="published"||typeof l.id!=="string"||!uuid.test(l.id)||typeof l.module_id!=="string"||!moduleIds.has(l.module_id)||!validSlug(l.slug)||typeof l.version!=="number"||!Number.isSafeInteger(l.version)||l.version<1||!str(l.title).trim())continue;
  const k=key(l.module_id,l.slug);
  if((latest.get(k)?.version??0)>=l.version)continue;
  const rubric:StudioCriterion[]=Array.isArray(l.rubric)?l.rubric.flatMap((raw:unknown)=>{
    if(typeof raw==="string"&&raw.trim())return [{label:raw,descriptor:""}];
    const c=record(raw);return c&&str(c.label).trim()?[{label:str(c.label),descriptor:str(c.descriptor)}]:[];
  }):[];
  latest.set(k,{id:l.id,module_id:l.module_id,slug:l.slug,version:l.version,title:str(l.title),objective:str(l.objective),guided_work:str(l.guided_work),independent_work:str(l.independent_work),evidence_required:str(l.evidence_required),rubric,state:states.get(k)??"unknown"});
 }
 // Preserve backend module order and lesson order within each module, without assuming two lessons or eight modules.
 const lessons=modules.flatMap(m=>[...latest.values()].filter(l=>l.module_id===m.id));
 return {title:str(track.title),summary:str(track.summary),enrollment:data.enrollment,modules,lessons};
}
export function selectStudioLesson(lessons:StudioLesson[],requested:unknown):StudioLesson|null{
 if(requested!==undefined)return typeof requested==="string"&&uuid.test(requested)?lessons.find(l=>l.id===requested)??null:null;
 return lessons.find(l=>l.state==="changes_requested")??lessons.find(l=>l.state==="not_started")??lessons.find(l=>l.state==="pending")??lessons[0]??null;
}
