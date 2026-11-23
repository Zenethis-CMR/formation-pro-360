import { backendRequest } from "@/lib/auth/backend";

export type V2DashboardPilot={
  published:boolean;
  enrollment:"active"|"completed"|"paused"|"revoked"|null;
  enrollmentOpen:boolean;
  xp:number;approved:number;pending:number;
};

/** The real enrollment and learner progress come from the authenticated API only. */
export async function getV2DashboardPilot():Promise<V2DashboardPilot>{
  const unavailable:V2DashboardPilot={
    published:false,enrollment:null,enrollmentOpen:false,
    xp:0,approved:0,pending:0
  };
  try{
    const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia");
    if(!res.ok)return unavailable;
    const data=await res.json() as {
      track?:{slug?:string;status?:string};
      enrollment?:string|null;
      enrollment_open?:boolean;xp_total?:number;
      submissions?:{lesson_id?:string;status?:string}[];
    };
    if(data.track?.slug!=="ingenierie-produit-ia"||data.track?.status!=="published")
      return unavailable;
    const enrollment=["active","completed","paused","revoked"].includes(data.enrollment||"")
      ?data.enrollment as V2DashboardPilot["enrollment"]:null;
    const submissions=Array.isArray(data.submissions)?data.submissions:[];
    const ids=(status:string)=>new Set(submissions.filter(s=>s.status===status)
      .map(s=>s.lesson_id).filter((id):id is string=>typeof id==="string")).size;
    return {
      published:true,enrollment,enrollmentOpen:data.enrollment_open===true,
      xp:Number.isFinite(data.xp_total)&&Number(data.xp_total)>=0?Number(data.xp_total):0,
      approved:ids("approved"),pending:ids("pending")
    };
  }catch{return unavailable;}
}
