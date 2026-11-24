import "@/app/espace/revues/reviews.css";
import Link from "next/link";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import {FolderOpen} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {projectContext,projectRead} from "@/lib/project-context";
import {PedagogicalTrackSelector} from "@/components/pedagogical-track-selector";
import {CollaborativeReviewWorkspace} from "@/components/collaborative-review-workspace";
import type {ReviewList,ShareSources,ReviewProof} from "@/lib/collaborative-review";
import type {ProductProject} from "@/lib/learner-product-project";
import type {ProductBacklog} from "@/lib/product-backlog";
export const dynamic="force-dynamic";
export default async function ReviewsPage({searchParams}:{searchParams:Promise<{page?:string;id?:string;parcours?:string|string[]}>}){
 await requireRole("learner");
 const p=await searchParams,n=Number(p.page),page=Number.isInteger(n)&&n>=1&&n<=1000?n:1;
 const id=typeof p.id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)?p.id:null;
 const context=await projectContext("learner",p.parcours,true);
 const slug=context.selected?.slug??"";
 const read=<T,>(suffix:string)=>projectRead<T>(context.api,suffix);
 const result=await read<ReviewList&{course_slug:string}>("/project-reviews?page="+page+(id?"&id="+encodeURIComponent(id):""));
 const data=result?.course_slug===slug?result:null;
 const [project,backlog,portfolio]=data?.can_share?await Promise.all([read<{project:ProductProject|null}>("/project"),read<{backlog:ProductBacklog|null}>("/backlog"),read<{projects:ReviewProof[];source:string}>("/portfolio")]):[null,null,null];
 const sources:ShareSources={project:project?.project??null,backlog:backlog?.backlog??null,proofs:portfolio?.source==="trainer_approved_with_xp_ledger"?portfolio.projects.filter(p=>p.xp===100&&p.score>=80):null};
 return <main className="page cr-page"><header className="cr-header"><span><FolderOpen size={17}/> FORMATION PRO 360 / {context.selected?.title??"PROJET"}</span><h1>Mes revues<i>.</i></h1><p>Présente ton travail et conserve les recommandations de ton formateur.</p></header>
 <PedagogicalTrackSelector tracks={context.tracks} selected={context.selected?.slug}/>
  {context.selected&&<ProductWorkspaceNav active="revues" trackSlug={slug}/> }
 {data?<CollaborativeReviewWorkspace key={slug} trackSlug={slug} data={data} trainer={false} sources={sources} base="/espace/projet/revues"/>:<section className="cr-empty" role="status"><h2>Revue momentanément indisponible</h2><p>Impossible de charger les versions accessibles. Aucun dossier fictif n'est affiché.</p><Link href="/espace/projet">Revenir à mon espace</Link></section>}
 </main>;
}
