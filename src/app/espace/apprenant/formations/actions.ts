"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {backendRequest} from "@/lib/auth/backend";
import {validEnrollmentSlug} from "@/lib/universal-enrollment";
import {requireRole} from "@/lib/auth/require-role";
import {activeTrackCookie,loadLearningContext} from "@/lib/active-learning-context";
import {selectEnrolledTrack} from "@/lib/universal-learning";
export async function setActiveLearningTrack(formData:FormData){
 const {user}=await requireRole("learner");
 const requested=formData.get("trackSlug");
 const {tracks}=await loadLearningContext();
 const selected=selectEnrolledTrack(tracks,requested);
 if(!selected)redirect("/espace/apprenant/formations?selection=refusee");
 (await cookies()).set(activeTrackCookie,user.id+":"+selected.slug,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/espace",maxAge:60*60*24*180});
 revalidatePath("/espace","layout");
 redirect("/espace/apprenant/formations?parcours="+encodeURIComponent(selected.slug)+"&selection=ok");
}

export async function enrollInFormation(formData:FormData){
 const {user}=await requireRole("learner");
 const slug=formData.get("trackSlug");
 const base="/espace/apprenant/formations";
 if(!validEnrollmentSlug(slug)||slug==="ingenierie-produit-ia"||formData.get("confirm")!=="on")redirect(base+"?inscription=refusee");
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/enroll-free",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({acceptFreeEnrollment:true})}).catch(()=>null);
 const data=response?.ok?await response.json().catch(()=>null):null;
 if(data?.course_slug!==slug||!["active","completed"].includes(data?.enrollment?.status))redirect(base+"?inscription=refusee");
 (await cookies()).set(activeTrackCookie,user.id+":"+slug,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/espace",maxAge:60*60*24*180});
 revalidatePath("/espace","layout");
 redirect("/espace/bienvenue");
}
