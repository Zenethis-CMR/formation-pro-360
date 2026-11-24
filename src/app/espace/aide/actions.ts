"use server";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {SupportAction,SupportStatus} from "@/lib/learner-support";
export async function actOnSupport(action:SupportAction,role:"trainer"|"learner",trackSlug="ingenierie-produit-ia"):Promise<{ok:true;thread:{id:string;revision:number;status:SupportStatus}}|{ok:false;error:string}>{
 if(role!=="trainer"&&role!=="learner")return {ok:false,error:"role_required"};
 await requireRole(role);
 if(!validPedagogicalSlug(trackSlug))return {ok:false,error:"invalid_track"};
 const res=await backendRequest("/v1/training/catalog/"+encodeURIComponent(trackSlug)+"/support",{method:"POST",body:JSON.stringify(action)}).catch(()=>null);
 const data=await res?.json().catch(()=>null) as {thread?:{id:string;revision:number;status:SupportStatus};error?:string}|null|undefined;
 return res?.ok&&data?.thread?{ok:true,thread:data.thread}:{ok:false,error:data?.error??"unavailable"};
}
