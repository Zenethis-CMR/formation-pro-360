"use server";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {CurriculumContent,AuthoringRevision} from "@/lib/curriculum-authoring";
export async function saveCurriculumRevision(slug:string,lessonId:string,revision:number,intent:"save"|"ready",content:CurriculumContent):Promise<{ok:true;current:AuthoringRevision}|{ok:false;error:string}>{
 await requireRole("trainer");
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||! /^[0-9a-f-]{36}$/i.test(lessonId))return {ok:false,error:"invalid_content"};
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/authoring/"+encodeURIComponent(lessonId),{method:"POST",body:JSON.stringify({revision,intent,content})}).catch(()=>null);
 const result=await response?.json().catch(()=>null) as {current?:AuthoringRevision;error?:string}|null|undefined;
 return response?.ok&&result?.current?{ok:true,current:result.current}:{ok:false,error:result?.error??"unavailable"};
}
