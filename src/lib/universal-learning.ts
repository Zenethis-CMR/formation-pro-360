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
