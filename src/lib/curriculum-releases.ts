export type ReleaseVersion={id:string;version:number;lesson_count:number;total_minutes:number;created_at:string};
export type ReleaseLesson={lesson_id:string;module_slug:string;module_title:string;lesson_slug:string;title:string;revision:number|null;state:"draft"|"ready"|null;ready:boolean;minutes:number|null;sealed_revision:number|null};
export type ReleasePreflight={track:{id:string;slug:string;title:string;status:"draft"};latest:ReleaseVersion|null;history:ReleaseVersion[];module_count:number;enrolled:boolean;can_seal:boolean;unchanged:boolean;lessons:ReleaseLesson[]};
export function sealPayload(data:ReleasePreflight){
 if(!data.can_seal||data.enrolled||data.unchanged||!data.lessons.length||data.lessons.length>100||data.lessons.some(l=>!l.ready||l.revision===null||l.minutes===null)||new Set(data.lessons.map(l=>l.lesson_id)).size!==data.lessons.length)return null;
 return {expected_version:data.latest?.version??0,confirm:true as const,revisions:data.lessons.map(l=>({lesson_id:l.lesson_id,revision:l.revision!}))};
}
