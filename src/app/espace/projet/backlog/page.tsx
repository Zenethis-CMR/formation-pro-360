import "./backlog.css";
import Link from "next/link";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import {Kanban} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {projectContext,projectRead} from "@/lib/project-context";
import {ProductBacklogBoard} from "@/components/product-backlog-board";
import type {ProductBacklog} from "@/lib/product-backlog";
export const dynamic="force-dynamic";
export default async function BacklogPage({searchParams}:{searchParams:Promise<{parcours?:string|string[]}>}){
 await requireRole("learner");
 const context=await projectContext("learner",(await searchParams).parcours);
 const slug=context.selected?.slug??"";
 const result=await projectRead<{course_slug:string;editable:boolean;backlog:ProductBacklog|null}>(context.api,"/backlog");
 const data=result?.course_slug===slug?result:null;
 return <main className="page backlog-page">
  <header className="backlog-hero"><span><Kanban size={17}/> {context.selected?.title??"FORMATION"} · ORGANISATION</span><h1>Mon backlog<span>.</span></h1><p>Découpe ton produit en tâches concrètes, définis les critères de vérification et organise ton travail au fil des ateliers.</p></header>
  {context.selected&&<ProductWorkspaceNav active="backlog" trackSlug={slug}/> }
  {data?<ProductBacklogBoard key={slug} trackSlug={slug} lessons={context.lessons} initial={data.backlog} editable={data.editable}/>:<section className="backlog-edit" role="status"><h2>Backlog momentanément indisponible</h2><p>Reviens à ton dossier produit. Aucune donnée fictive n'est chargée en cas d'erreur.</p><Link href="/espace/apprenant/formations">Retour à mes formations</Link></section>}
 </main>;
}
