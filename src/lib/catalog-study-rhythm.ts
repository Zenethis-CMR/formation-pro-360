import "server-only";
import {cookies} from "next/headers";
import {currentUser,authCookieName} from "@/lib/auth/backend";
import {createDatabaseClient} from "@/lib/database/server";
import type {StudyRhythm} from "@/lib/ai-training-plans";
export async function getCatalogStudyRhythm():Promise<{rhythm:StudyRhythm|null;learner:boolean}>{
 if(!(await cookies()).get(authCookieName)?.value)return {rhythm:null,learner:false};
 try{
  const user=await currentUser();
  if(user?.role!=="learner")return {rhythm:null,learner:false};
  const db=await createDatabaseClient();
  const {data,error}=await db.from("learner_preferences").select("regular_days,minutes_per_day").eq("learner_id",user.id).maybeSingle();
  return {rhythm:error?null:data as StudyRhythm|null,learner:true};
 }catch{return {rhythm:null,learner:false};}
}
