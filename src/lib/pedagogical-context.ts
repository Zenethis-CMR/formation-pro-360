import "server-only";
import {backendRequest} from "@/lib/auth/backend";
import {loadTrainerCockpit,selectTrainerTrack} from "@/lib/trainer-cockpit";
import {loadLearningContext} from "@/lib/active-learning-context";
import {selectEnrolledTrack} from "@/lib/universal-learning";
import {validPedagogicalSlug,type PedagogicalWorkshop,type PedagogicalTrack} from "@/lib/pedagogical-types";
export async function pedagogicalContext(role:"learner"|"trainer",requested:unknown){
 let tracks:PedagogicalTrack[],selected:PedagogicalTrack|undefined|null;
 if(role==="trainer"){
  const catalog=await loadTrainerCockpit();
  tracks=(catalog??[]).filter(t=>t.status==="published");selected=selectTrainerTrack(catalog,requested);
 }else{
  const context=await loadLearningContext();
  tracks=context.tracks.filter(t=>t.enrollment==="active"||t.enrollment==="completed");
  selected=selectEnrolledTrack(context.tracks,requested??context.active?.slug);
 }
 if(!selected||!validPedagogicalSlug(selected.slug))return {tracks,selected:null,api:null,lessons:[] as PedagogicalWorkshop[]};
 const api="/v1/training/catalog/"+encodeURIComponent(selected.slug);
 const res=await backendRequest(api).catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null):null;
 const permitted=data?.track?.slug===selected.slug&&data.track.status==="published"&&(role==="trainer"||data.lesson_access==="granted"&&(data.enrollment==="active"||data.enrollment==="completed"));
 const lessons:PedagogicalWorkshop[]=[];
 if(permitted&&Array.isArray(data.modules)&&Array.isArray(data.lessons)){
  const latest=new Map<string,{id:string;slug:string;title:string;week:number;version:number;module:string}>();
  for(const l of data.lessons){
   const m=data.modules.find((m:{id:string})=>m.id===l?.module_id);
   if(!m||l.status!=="published"||!validPedagogicalSlug(l.slug)||typeof l.id!=="string"||typeof l.title!=="string"||!Number.isInteger(l.version)||!Number.isInteger(m.week))continue;
   const key=l.module_id+":"+l.slug;
   if((latest.get(key)?.version??0)<l.version)latest.set(key,{id:l.id,slug:l.slug,title:l.title,week:m.week,version:l.version,module:l.module_id});
  }
  const values=[...latest.values()];
  for(const l of values)if(values.filter(x=>x.slug===l.slug).length===1)lessons.push({slug:l.slug,title:l.title,week:l.week,href:role==="trainer"?"/espace/formateur/formations/"+encodeURIComponent(selected.slug)+"/atelier/"+encodeURIComponent(l.id):selected.slug==="ingenierie-produit-ia"?"/espace/parcours/ingenierie-produit-ia/atelier/"+encodeURIComponent(l.slug):"/espace/apprenant/formations/"+encodeURIComponent(selected.slug)+"/studio?atelier="+encodeURIComponent(l.id)});
 }
 return {tracks,selected,api:permitted?api:null,lessons};
}
