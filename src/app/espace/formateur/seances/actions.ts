"use server";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {SessionFields,SessionIntent,PracticalSession} from "@/lib/practical-sessions";
export type SessionSaveResult={ok:true;session:PracticalSession}|{ok:false;error:string};
export async function savePracticalSession(id:string|null,revision:number,intent:SessionIntent,session:SessionFields,trackSlug="ingenierie-produit-ia"):Promise<SessionSaveResult>{
 await requireRole("trainer");
 if(!validPedagogicalSlug(trackSlug))return {ok:false,error:"invalid_track"};
 const res=await backendRequest("/v1/training/catalog/"+encodeURIComponent(trackSlug)+"/sessions",{method:"POST",body:JSON.stringify({id,revision,intent,session})}).catch(()=>null);
 const body=await res?.json().catch(()=>null) as {session?:PracticalSession;error?:string}|null|undefined;
 if(!res?.ok||!body?.session)return {ok:false,error:body?.error??"unavailable"};
 return {ok:true,session:body.session};
}
