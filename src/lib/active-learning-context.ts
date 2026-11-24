import "server-only";
import {cache} from "react";
import {cookies} from "next/headers";
import {backendRequest,currentUser} from "@/lib/auth/backend";
import {enrolledTracks,selectEnrolledTrack,parseStudioTrack,parseTrackProgress} from "@/lib/universal-learning";
export const activeTrackCookie="fp360_active_track";
export const loadLearningContext=cache(async()=>{
 const user=await currentUser();
 if(user?.role!=="learner")return {available:false,tracks:[],active:null};
 const response=await backendRequest("/v1/training/catalog").catch(()=>null);
 const catalog=response?.ok?await response.json().catch(()=>null):null;
 const tracks=enrolledTracks(catalog);
 const saved=(await cookies()).get(activeTrackCookie)?.value;
 const prefix=user.id+":";
 const requested=saved?.startsWith(prefix)?saved.slice(prefix.length):undefined;
 const active=selectEnrolledTrack(tracks,requested)??selectEnrolledTrack(tracks,undefined);
 return {available:Array.isArray(catalog?.tracks),tracks,active};
});
export const loadLearningDetail=cache(async(slug:string)=>{
 const {tracks}=await loadLearningContext();
 if(!selectEnrolledTrack(tracks,slug))return null;
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)).catch(()=>null);
 const raw=response?.ok?await response.json().catch(()=>null):null;
 const studio=parseStudioTrack(raw,slug),progress=parseTrackProgress(raw,slug);
 return studio&&progress?{studio,progress}:null;
});
