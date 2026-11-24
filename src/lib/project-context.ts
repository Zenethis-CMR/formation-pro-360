import "server-only";
import {loadLearningContext} from "@/lib/active-learning-context";
import {pedagogicalContext} from "@/lib/pedagogical-context";
import {validPedagogicalSlug} from "@/lib/pedagogical-types";
import {backendRequest} from "@/lib/auth/backend";
export async function projectContext(role:"learner"|"trainer",requested:unknown,allowRevocation=false){
 const context=await pedagogicalContext(role,role==="learner"&&requested===undefined?"ingenierie-produit-ia":requested);
 if(role!=="learner"||!allowRevocation||context.api||!validPedagogicalSlug(requested))return context;
 const {tracks}=await loadLearningContext();
 const closed=tracks.find(t=>t.slug===requested&&(t.enrollment==="paused"||t.enrollment==="revoked"));
 return closed?{...context,tracks:[...context.tracks,closed],selected:closed,api:"/v1/training/catalog/"+encodeURIComponent(closed.slug)}:context;
}
export async function projectRead<T>(api:string|null,suffix:string):Promise<T|null>{
 if(!api)return null;
 const response=await backendRequest(api+suffix).catch(()=>null);
 return response?.ok?await response.json().catch(()=>null) as T|null:null;
}
