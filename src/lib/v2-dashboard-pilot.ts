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
      submissions?:{lesson_id?:string;module_id?:string;lesson_slug?:string;status?:string}[];
      lessons?:{module_id:string;slug:string;version:number;status:string}[];
    };
    if(data.track?.slug!=="ingenierie-produit-ia"||data.track?.status!=="published")
      return unavailable;
    const enrollment=["active","completed","paused","revoked"].includes(data.enrollment||"")
      ?data.enrollment as V2DashboardPilot["enrollment"]:null;
    const submissions=Array.isArray(data.submissions)?data.submissions:[];
    const conceptualKey=(moduleId:string,slug:string)=>moduleId+":"+slug;
    const newest=new Map<string,{module_id:string;slug:string;version:number}>();
    for(const l of data.lessons||[]){
      if(l.status!=="published")continue;
      const key=conceptualKey(l.module_id,l.slug);
      if(!newest.has(key)||(newest.get(key)?.version??0)<l.version)newest.set(key,l);
    }
    const keyed=(status:string)=>new Set(submissions.filter(s=>s.status===status)
      .map(s=>s.module_id&&s.lesson_slug?conceptualKey(s.module_id,s.lesson_slug):s.lesson_id)
      .filter((key):key is string=>typeof key==="string"));
    const approved=keyed("approved"),pending=keyed("pending");
    const next=[...newest.values()].find(l=>
      !approved.has(conceptualKey(l.module_id,l.slug))&&
      !pending.has(conceptualKey(l.module_id,l.slug)));
    return {
      published:true,enrollment,enrollmentOpen:data.enrollment_open===true,
      xp:Number.isFinite(data.xp_total)&&Number(data.xp_total)>=0?Number(data.xp_total):0,
      approved:approved.size,pending:pending.size,
      resumeSlug:(enrollment==="active"||enrollment==="completed")?next?.slug??null:null
    };
  }catch{return unavailable;}
}
