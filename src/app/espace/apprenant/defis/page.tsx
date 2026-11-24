import "@/app/espace/defis/briefs.css";
import Link from "next/link";
import {ArrowLeft,Target} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {pedagogicalContext} from "@/lib/pedagogical-context";
import {PedagogicalTrackSelector} from "@/components/pedagogical-track-selector";
import {backendRequest} from "@/lib/auth/backend";
import {PersonalPracticeBoard} from "@/components/personal-practice-board";
import type {BriefList} from "@/lib/personal-practice";
export const dynamic="force-dynamic";
export default async function BriefPage({searchParams}:{searchParams:Promise<{page?:string;parcours?:string|string[]}>}){
 await requireRole("learner");
 const params=await searchParams,parsed=Number(params.page),page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
  const context=await pedagogicalContext("learner",params.parcours);
 const api=context.api,slug=context.selected?.slug??"";
 const res=(await (api?backendRequest(api+"/practice-briefs?page="+page).catch(()=>null):Promise.resolve(null)));
 const data=res?.ok?await res.json().catch(()=>null) as (BriefList&{course_slug?:string})|null:null;
 
 return <main className="page pb-page"><Link className="pb-back" href="/espace/apprenant"><ArrowLeft size={16}/> Mon espace</Link><header className="pb-header"><span><Target size={16}/> FORMATION PRO 360 / PRATIQUE PERSONNALISÉE</span><h1>Mes défis<i>.</i></h1><p>Réalise les exercices de ton formateur, présente tes preuves et progresse grâce à ses retours.</p></header>
 <PedagogicalTrackSelector tracks={context.tracks} selected={context.selected?.slug}/>
 {data&&data.course_slug===slug?<PersonalPracticeBoard key={slug} trackSlug={slug} lessons={context.lessons} data={data} trainer={false} participants={[]} truncated={false}/>:<section className="pb-empty" role="status"><h2>{res?.status===403?"Inscription requise":"Espace momentanément indisponible"}</h2><p>Impossible de charger les consignes. Aucun résultat fictif n'est affiché.</p><Link href="/espace/apprenant">Revenir à mon espace</Link></section>}
 </main>;
}
