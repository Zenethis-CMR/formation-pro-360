import { backendRequest } from "@/lib/auth/backend";

export type V2Lesson={
  id:string;module_id:string;slug:string;title:string;status:string;
};
export type V2Module={
  id:string;slug:string;week:number;title:string;outcome:string;
};
export type V2Submission={
  id:string;lesson_id:string;module_id:string;lesson_slug:string;
  status:"pending"|"changes_requested"|"approved";
  score:number|null;feedback:string|null;created_at:string;reviewed_at:string|null;
};
export type V2LearnerProgress={
  available:boolean;
  enrollment:"active"|"completed"|"paused"|"revoked"|null;
  enrollmentOpen:boolean;
  lessonAccess:boolean;
  xpTotal:number;
  modules:V2Module[];
  lessons:V2Lesson[];
  submissions:V2Submission[];
};

const empty:V2LearnerProgress={
  available:false,enrollment:null,enrollmentOpen:false,lessonAccess:false,
  xpTotal:0,modules:[],lessons:[],submissions:[]
};

/** Private, user-scoped data; no static cache and no V1 database reads. */
export async function loadV2LearnerProgress():Promise<V2LearnerProgress>{
  try{
    const response=await backendRequest("/v1/training/catalog/ingenierie-produit-ia");
    if(!response.ok)return empty;
    const data=await response.json() as {
      track?:{slug?:string;status?:string};
      enrollment?:string|null;enrollment_open?:boolean;lesson_access?:string;
      xp_total?:number;modules?:V2Module[];
      lessons?:V2Lesson[];submissions?:V2Submission[];
    };
    if(data.track?.slug!=="ingenierie-produit-ia"||data.track.status!=="published")return empty;
    const enrollment=["active","completed","paused","revoked"].includes(data.enrollment||"")
      ?data.enrollment as V2LearnerProgress["enrollment"]:null;
    const lessonAccess=data.lesson_access==="granted";
    return {
      available:true,enrollment,enrollmentOpen:data.enrollment_open===true,
      lessonAccess,
      xpTotal:lessonAccess&&Number.isFinite(data.xp_total)&&Number(data.xp_total)>=0
        ?Number(data.xp_total):0,
      modules:Array.isArray(data.modules)?data.modules:[],
      lessons:lessonAccess&&Array.isArray(data.lessons)?data.lessons:[],
      submissions:lessonAccess&&Array.isArray(data.submissions)?data.submissions:[]
    };
  }catch{return empty;}
}
