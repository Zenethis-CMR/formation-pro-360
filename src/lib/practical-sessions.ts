export type SessionStatus="draft"|"published"|"completed"|"cancelled";
export type SessionFormat="online"|"onsite"|"hybrid";
export type SessionIntent="draft"|"publish"|"complete"|"cancel";
export type SessionFields={learner_id:string|null;title:string;starts_at:string;duration_minutes:number;format:SessionFormat;location:string;meeting_url:string;objectives:string;demonstration:string;preparation:string;exercise:string;resources:string;expected_result:string;recap:string};
export type PracticalSession=Omit<SessionFields,"learner_id">&{id:string;learner_id?:string|null;learner_name?:string|null;individual?:boolean;status:SessionStatus;revision:number;updated_at:string};
export type Participant={learner_id:string;preferred_name:string|null};
export type SessionAgenda={sessions:PracticalSession[];page:number;has_next:boolean};
export const statuses:Record<SessionStatus,string>={draft:"Brouillon",published:"Publiée",completed:"Clôturée",cancelled:"Annulée"};
export const formats:Record<SessionFormat,string>={online:"À distance",onsite:"Présentiel",hybrid:"Hybride"};
export function localDateTime(value:string|Date){
 const d=new Date(value);if(!Number.isFinite(d.getTime()))return "";
 const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(d);
 const get=(type:string)=>p.find(part=>part.type===type)?.value??"";
 return get("year")+"-"+get("month")+"-"+get("day")+"T"+get("hour")+":"+get("minute");
}
export function toDoualaTimestamp(value:string){
 if(!/^20\d\d-\d\d-\d\dT\d\d:\d\d$/.test(value))return null;
 const date=new Date(value+":00+01:00");
 return Number.isFinite(date.getTime())&&localDateTime(date)===value?value+":00+01:00":null;
}
export function newSession(now=new Date()):SessionFields{
 const next=new Date(now.getTime()+86400000);const day=localDateTime(next).slice(0,10);
 return {learner_id:null,title:"",starts_at:day+"T09:00:00+01:00",duration_minutes:120,format:"online",location:"",meeting_url:"",objectives:"",demonstration:"",preparation:"",exercise:"",resources:"",expected_result:"",recap:""};
}
export function sessionFields(s:PracticalSession):SessionFields{
 return {learner_id:s.learner_id??null,title:s.title,starts_at:localDateTime(s.starts_at)+":00+01:00",duration_minutes:s.duration_minutes,format:s.format,location:s.location,meeting_url:s.meeting_url,objectives:s.objectives,demonstration:s.demonstration,preparation:s.preparation,exercise:s.exercise,resources:s.resources,expected_result:s.expected_result,recap:s.recap};
}
export function publicationIssues(s:SessionFields){
 const errors:string[]=[];
 if(s.title.trim().length<3)errors.push("Un titre de trois caractères minimum");
 if(!toDoualaTimestamp(localDateTime(s.starts_at)))errors.push("Une date et heure valides");
 if(!Number.isInteger(s.duration_minutes)||s.duration_minutes<15||s.duration_minutes>600)errors.push("Une durée de 15 à 600 minutes");
 if(!s.objectives.trim())errors.push("Les objectifs pédagogiques");
 if(!s.exercise.trim())errors.push("Le travail pratique");
 if(!s.expected_result.trim())errors.push("Le résultat attendu");
 if(s.format!=="onsite"&&!safeMeetingLink(s.meeting_url))errors.push("Un lien de réunion HTTPS");
 if(s.format!=="online"&&!s.location.trim())errors.push("Le lieu de la séance");
 return errors;
}
export function safeMeetingLink(value:string){
 try{const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
export function upcomingSession(sessions:PracticalSession[],now=Date.now()){
 return [...sessions].filter(s=>s.status==="published"&&new Date(s.starts_at).getTime()+s.duration_minutes*60000>now).sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at))[0]??null;
}
export function sessionTime(s:PracticalSession){
 const format=new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",hour:"2-digit",minute:"2-digit"});
 return format.format(new Date(s.starts_at))+" – "+format.format(new Date(Date.parse(s.starts_at)+s.duration_minutes*60000));
}
export function sessionDate(s:PracticalSession){return new Intl.DateTimeFormat("fr-FR",{timeZone:"Africa/Douala",weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(s.starts_at));}
