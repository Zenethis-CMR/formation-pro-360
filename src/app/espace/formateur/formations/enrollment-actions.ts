"use server";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {validEnrollmentSlug} from "@/lib/universal-enrollment";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
export async function controlEnrollment(formData:FormData){
 await requireRole("trainer");
 const slug=formData.get("slug"),raw=formData.get("revision"),intent=formData.get("intent");
 const base="/espace/formateur/formations";
 if(!validEnrollmentSlug(slug)||slug==="ingenierie-produit-ia"||typeof raw!=="string"||!/^\d{1,7}$/.test(raw)||!["open","close"].includes(String(intent))||formData.get("confirm")!=="on")redirect(base+"?inscription=refusee");
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/enrollment-control",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({open:intent==="open",expected_revision:Number(raw),confirm:true})}).catch(()=>null);
 const data=response?.ok?await response.json().catch(()=>null):null;
 revalidatePath("/espace","layout");
 redirect(base+"?parcours="+encodeURIComponent(slug)+"&inscription="+(data?.enrollment_open===(intent==="open")?"ok":"refusee"));
}
