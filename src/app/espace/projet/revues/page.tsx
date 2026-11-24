import "@/app/espace/revues/reviews.css";
import Link from "next/link";
import {ArrowLeft,FolderOpen} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {CollaborativeReviewWorkspace} from "@/components/collaborative-review-workspace";
import type {ReviewList,ShareSources,ReviewProof} from "@/lib/collaborative-review";
import type {ProductProject} from "@/lib/learner-product-project";
import type {ProductBacklog} from "@/lib/product-backlog";
export const dynamic="force-dynamic";
const api="/v1/training/catalog/ingenierie-produit-ia";
async function read<T>(suffix:string):Promise<T|null>{const r=await backendRequest(api+suffix).catch(()=>null);return r?.ok?await r.json().catch(()=>null) as T|null:null;}
export default async function ReviewsPage({searchParams}:{searchParams:Promise<{page?:string;id?:string}>}){
 await requireRole("learner");
 const p=await searchParams,n=Number(p.page),page=Number.isInteger(n)&&n>=1&&n<=1000?n:1;
 const id=typeof p.id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)?p.id:null;
 const data=await read<ReviewList>("/project-reviews?page="+page+(id?"&id="+encodeURIComponent(id):""));
 const [project,backlog,portfolio]=data?.can_share?await Promise.all([read<{project:ProductProject|null}>("/project"),read<{backlog:ProductBacklog|null}>("/backlog"),read<{projects:ReviewProof[];source:string}>("/portfolio")]):[null,null,null];
 const sources:ShareSources={project:project?.project??null,backlog:backlog?.backlog??null,proofs:portfolio?.source==="trainer_approved_with_xp_ledger"?portfolio.projects.filter(p=>p.xp===100&&p.score>=80):null};
 return <main className="page cr-page"><Link className="cr-back" href="/espace/projet"><ArrowLeft size={16}/> Mon projet</Link><header className="cr-header"><span><FolderOpen size={17}/> FORMATION PRO 360 / PRODUCT WORKSPACE</span><h1>Mes revues<i>.</i></h1><p>Présente ton travail et conserve les recommandations de ton formateur.</p></header>
 {data?<CollaborativeReviewWorkspace data={data} trainer={false} sources={sources} base="/espace/projet/revues"/>:<section className="cr-empty" role="status"><h2>Revue momentanément indisponible</h2><p>Impossible de charger les versions accessibles. Aucun dossier fictif n'est affiché.</p><Link href="/espace/projet">Revenir à mon espace</Link></section>}
 </main>;
}
