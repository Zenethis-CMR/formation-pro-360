"use server";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {projectSections,type ProductDossier,type ProductProject,safeProjectLink} from "@/lib/learner-product-project";

export type ProjectSaveResult={ok:true;project:ProductProject}|{ok:false;error:"invalid"|"conflict"|"access"|"unavailable"};
export async function saveProductProject(revision:number,dossier:ProductDossier):Promise<ProjectSaveResult>{
 await requireRole("learner");
 if(!Number.isInteger(revision)||revision<0||!dossier||typeof dossier!=="object")return {ok:false,error:"invalid"};
 const fields=projectSections.flatMap(section=>[...section.fields]);
 if(Object.keys(dossier).length!==fields.length||fields.some(field=>{
  const value=dossier[field.key];
  return typeof value!=="string"||value.length>field.max||("link" in field&&value.trim()!==""&&!safeProjectLink(value.trim()));
 }))return {ok:false,error:"invalid"};
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/project",{
  method:"PUT",body:JSON.stringify({revision,dossier})
 }).catch(()=>null);
 if(!res?.ok)return {ok:false,error:res?.status===409?"conflict":res?.status===400?"invalid":res?.status===401||res?.status===403?"access":"unavailable"};
 const result=await res.json().catch(()=>null) as {project?:ProductProject}|null;
 return result?.project?{ok:true,project:result.project}:{ok:false,error:"unavailable"};
}
