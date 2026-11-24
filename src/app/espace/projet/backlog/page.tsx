import "./backlog.css";
import Link from "next/link";
import {ArrowLeft,Kanban} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {ProductBacklogBoard} from "@/components/product-backlog-board";
import type {ProductBacklog} from "@/lib/product-backlog";
export const dynamic="force-dynamic";
export default async function BacklogPage(){
 await requireRole("learner");
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/backlog").catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null) as {editable:boolean;backlog:ProductBacklog|null}|null:null;
 return <main className="page backlog-page">
  <Link href="/espace/projet" className="backlog-back"><ArrowLeft size={16}/> Mon projet</Link>
  <header className="backlog-hero"><span><Kanban size={17}/> PRODUCT WORKSPACE · ORGANISATION</span><h1>Mon backlog<span>.</span></h1><p>Découpe ton produit en tâches concrètes, définis les critères de vérification et organise ton travail au fil des ateliers.</p></header>
  {data?<ProductBacklogBoard initial={data.backlog} editable={data.editable}/>:<section className="backlog-edit" role="status"><h2>{res?.status===403?"Inscription autorisée requise":"Backlog momentanément indisponible"}</h2><p>Reviens à ton dossier produit. Aucune donnée fictive n'est chargée en cas d'erreur.</p><Link href="/espace/projet">Retour à mon projet</Link></section>}
 </main>;
}
