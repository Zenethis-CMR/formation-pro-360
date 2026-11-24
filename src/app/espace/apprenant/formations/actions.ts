"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
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
