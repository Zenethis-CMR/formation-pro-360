"use server";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {ReviewAction} from "@/lib/collaborative-review";
export async function actOnReview(action:ReviewAction,trackSlug="ingenierie-produit-ia"):Promise<{ok:true;review:{id:string;revision:number}}|{ok:false;error:string}>{
 await requireRole(action?.intent==="comment"?"trainer":"learner");
 if(!validPedagogicalSlug(trackSlug))return {ok:false,error:"invalid"};
 const res=await backendRequest("/v1/training/catalog/"+encodeURIComponent(trackSlug)+"/project-reviews",{method:"POST",body:JSON.stringify(action)}).catch(()=>null);
 const data=await res?.json().catch(()=>null) as {review?:{id:string;revision:number};error?:string}|null|undefined;
 return res?.ok&&data?.review?{ok:true,review:data.review}:{ok:false,error:data?.error??"unavailable"};
}
