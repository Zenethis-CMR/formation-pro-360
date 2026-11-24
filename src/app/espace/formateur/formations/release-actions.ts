"use server";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {ReleaseVersion} from "@/lib/curriculum-releases";
export async function sealCurriculum(slug:string,payload:{expected_version:number;confirm:true;revisions:{lesson_id:string;revision:number}[]}):Promise<{ok:true;release:ReleaseVersion}|{ok:false;error:string}>{
 await requireRole("trainer");
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return {ok:false,error:"invalid_request"};
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/releases",{method:"POST",body:JSON.stringify(payload)}).catch(()=>null);
 const data=await response?.json().catch(()=>null) as {release?:ReleaseVersion;error?:string}|null|undefined;
 return response?.ok&&data?.release?{ok:true,release:data.release}:{ok:false,error:data?.error??"unavailable"};
}
