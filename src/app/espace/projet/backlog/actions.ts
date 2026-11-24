"use server";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {maxTasks,type ProductTask,type ProductBacklog} from "@/lib/product-backlog";
export type BacklogSaveResult={ok:true;backlog:ProductBacklog}|{ok:false;error:"invalid"|"conflict"|"access"|"unavailable"};
export async function saveProductBacklog(revision:number,tasks:ProductTask[],trackSlug="ingenierie-produit-ia"):Promise<BacklogSaveResult>{
 await requireRole("learner");
 if(!validPedagogicalSlug(trackSlug))return {ok:false,error:"invalid"};
 if(!Number.isInteger(revision)||revision<0||!Array.isArray(tasks)||tasks.length>maxTasks)return {ok:false,error:"invalid"};
 const res=await backendRequest("/v1/training/catalog/"+encodeURIComponent(trackSlug)+"/backlog",{method:"PUT",body:JSON.stringify({revision,tasks})}).catch(()=>null);
 if(!res?.ok)return {ok:false,error:res?.status===409?"conflict":res?.status===400?"invalid":res?.status===401||res?.status===403?"access":"unavailable"};
 const result=await res.json().catch(()=>null) as {backlog?:ProductBacklog}|null;
 return result?.backlog?{ok:true,backlog:result.backlog}:{ok:false,error:"unavailable"};
}
