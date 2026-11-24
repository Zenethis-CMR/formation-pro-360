import {parseTrackProgress} from "@/lib/universal-learning";
import { backendRequest } from "@/lib/auth/backend";

export type V2DashboardPilot={
  published:boolean;
  enrollment:"active"|"completed"|"paused"|"revoked"|null;
  enrollmentOpen:boolean;
  xp:number;approved:number;pending:number;resumeSlug:string|null;
};

/** The real enrollment and learner progress come from the authenticated API only. */
export async function getV2DashboardPilot():Promise<V2DashboardPilot>{
  const unavailable:V2DashboardPilot={
    published:false,enrollment:null,enrollmentOpen:false,
    xp:0,approved:0,pending:0,resumeSlug:null
  };
  try{
    const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia");
    if(!res.ok)return unavailable;
    const data=await res.json() as {
      track?:{slug?:string;status?:string};
      enrollment?:string|null;
      enrollment_open?:boolean;xp_total?:number;
      lesson_access?:string;progress_summary?:unknown;
      workshop_states?:{module_id:string;lesson_slug:string;status:string}[];
      lessons?:{module_id:string;slug:string;version:number;status:string}[];
    };
    if(data.track?.slug!=="ingenierie-produit-ia"||data.track?.status!=="published")
      return unavailable;
    const enrollment=["active","completed","paused","revoked"].includes(data.enrollment||"")
      ?data.enrollment as V2DashboardPilot["enrollment"]:null;
    const entitled=enrollment==="active"||enrollment==="completed";
    const progress=entitled?parseTrackProgress(data,"ingenierie-produit-ia"):null;
    if(entitled&&!progress?.summary)return unavailable;
    const conceptualKey=(moduleId:string,slug:string)=>moduleId+":"+slug;
    const newest=new Map<string,{module_id:string;slug:string;version:number}>();
    for(const l of data.lessons||[]){
      if(l.status!=="published")continue;
      const key=conceptualKey(l.module_id,l.slug);
      if(!newest.has(key)||(newest.get(key)?.version??0)<l.version)newest.set(key,l);
    }
    const states=new Map((data.workshop_states??[]).map(s=>[conceptualKey(s.module_id,s.lesson_slug),s.status]));
    const next=[...newest.values()].find(l=>states.get(conceptualKey(l.module_id,l.slug))==="changes_requested")
      ??[...newest.values()].find(l=>states.get(conceptualKey(l.module_id,l.slug))==="not_started");
    return {
      published:true,enrollment,enrollmentOpen:data.enrollment_open===true,
      xp:progress?.xp??0,
      approved:progress?.summary?.approved??0,pending:progress?.summary?.pending??0,
      resumeSlug:(enrollment==="active"||enrollment==="completed")?next?.slug??null:null
    };
  }catch{return unavailable;}
}
