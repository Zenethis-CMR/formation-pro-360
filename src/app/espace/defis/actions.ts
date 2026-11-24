"use server";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {BriefAction,BriefStatus} from "@/lib/personal-practice";
export async function actOnBrief(action:BriefAction,trackSlug="ingenierie-produit-ia"):Promise<{ok:true;brief:{id:string;revision:number;status:BriefStatus}}|{ok:false;error:string}>{
 await requireRole(action?.intent==="submit"?"learner":"trainer");
 if(!validPedagogicalSlug(trackSlug))return {ok:false,error:"invalid_track"};
 const res=await backendRequest("/v1/training/catalog/"+encodeURIComponent(trackSlug)+"/practice-briefs",{method:"POST",body:JSON.stringify(action)}).catch(()=>null);
 const data=await res?.json().catch(()=>null) as {brief?:{id:string;revision:number;status:BriefStatus};error?:string}|null|undefined;
 return res?.ok&&data?.brief?{ok:true,brief:data.brief}:{ok:false,error:data?.error??"unavailable"};
}
