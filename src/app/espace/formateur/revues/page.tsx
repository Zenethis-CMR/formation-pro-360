import "@/app/espace/revues/reviews.css";
import Link from "next/link";
import {ArrowLeft,FolderOpen} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {projectContext,projectRead} from "@/lib/project-context";
import {PedagogicalTrackSelector} from "@/components/pedagogical-track-selector";
import {CollaborativeReviewWorkspace} from "@/components/collaborative-review-workspace";
import type {ReviewList,ShareSources,ReviewProof} from "@/lib/collaborative-review";

export const dynamic="force-dynamic";
export default async function ReviewsPage({searchParams}:{searchParams:Promise<{page?:string;id?:string;parcours?:string|string[]}>}){
 await requireRole("trainer");
 const p=await searchParams,n=Number(p.page),page=Number.isInteger(n)&&n>=1&&n<=1000?n:1;
 const id=typeof p.id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)?p.id:null;
 const context=await projectContext("trainer",p.parcours,false);
 const slug=context.selected?.slug??"";
 const read=<T,>(suffix:string)=>projectRead<T>(context.api,suffix);
 const result=await read<ReviewList&{course_slug:string}>("/project-reviews?page="+page+(id?"&id="+encodeURIComponent(id):""));
 const data=result?.course_slug===slug?result:null;
 const sources:ShareSources|null=null;
 return <main className="page cr-page"><Link className="cr-back" href="/espace/formateur"><ArrowLeft size={16}/> Espace formateur</Link><header className="cr-header"><span><FolderOpen size={17}/> FORMATION PRO 360 / {context.selected?.title??"PROJET"}</span><h1>Revues de projets<i>.</i></h1><p>Accompagne les décisions produit à partir de versions volontairement partagées.</p></header>
 <PedagogicalTrackSelector tracks={context.tracks} selected={context.selected?.slug}/>
 {data?<CollaborativeReviewWorkspace key={slug} trackSlug={slug} data={data} trainer={true} sources={sources} base="/espace/formateur/revues"/>:<section className="cr-empty" role="status"><h2>Revue momentanément indisponible</h2><p>Impossible de charger les versions accessibles. Aucun dossier fictif n'est affiché.</p><Link href="/espace/formateur">Revenir à mon espace</Link></section>}
 </main>;
}
