import "server-only";
import {cache} from "react";
import {backendRequest} from "@/lib/auth/backend";
export type Metrics={enrollments:number;active:number;completed:number;workshops:number;pending:number;rework:number;verified:number;xp:number};
export type CockpitTrack={slug:string;title:string;status:string;metrics:Metrics|null};
const keys=["enrollments","active","completed","workshops","pending","rework","verified","xp"] as const;
export const loadTrainerCockpit=cache(async():Promise<CockpitTrack[]|null>=>{
 const res=await backendRequest("/v1/training/trainer-cockpit").catch(()=>null);
 const body=res?.ok?await res.json().catch(()=>null):null;
 if(body?.source!=="official_training_cockpit"||!Array.isArray(body.tracks))return null;
 const tracks=body.tracks as CockpitTrack[];
 if(!tracks.every(t=>t&&typeof t.slug==="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug)&&t.slug.length<=100&&typeof t.title==="string"&&typeof t.status==="string"&&(t.status==="published"?t.metrics&&keys.every(k=>Number.isSafeInteger(t.metrics![k])&&t.metrics![k]>=0):t.metrics===null)))return null;
 if(new Set(tracks.map(t=>t.slug)).size!==tracks.length)return null;
 return tracks;
});
export function selectTrainerTrack(tracks:CockpitTrack[]|null,requested:unknown){
 const published=(tracks??[]).filter(t=>t.status==="published");
 return requested===undefined?published.find(t=>t.slug==="ingenierie-produit-ia")??published[0]:typeof requested==="string"?published.find(t=>t.slug===requested):undefined;
}
