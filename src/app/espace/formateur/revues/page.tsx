import "@/app/espace/revues/reviews.css";
import Link from "next/link";
import {ArrowLeft,FolderOpen} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {CollaborativeReviewWorkspace} from "@/components/collaborative-review-workspace";
import type {ReviewList,ShareSources,ReviewProof} from "@/lib/collaborative-review";

export const dynamic="force-dynamic";
const api="/v1/training/catalog/ingenierie-produit-ia";
async function read<T>(suffix:string):Promise<T|null>{const r=await backendRequest(api+suffix).catch(()=>null);return r?.ok?await r.json().catch(()=>null) as T|null:null;}
export default async function ReviewsPage({searchParams}:{searchParams:Promise<{page?:string;id?:string}>}){
 await requireRole("trainer");
 const p=await searchParams,n=Number(p.page),page=Number.isInteger(n)&&n>=1&&n<=1000?n:1;
 const id=typeof p.id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)?p.id:null;
 const data=await read<ReviewList>("/project-reviews?page="+page+(id?"&id="+encodeURIComponent(id):""));
 const sources:ShareSources|null=null;
 return <main className="page cr-page"><Link className="cr-back" href="/espace/formateur"><ArrowLeft size={16}/> Espace formateur</Link><header className="cr-header"><span><FolderOpen size={17}/> FORMATION PRO 360 / PRODUCT WORKSPACE</span><h1>Revues de projets<i>.</i></h1><p>Accompagne les décisions produit à partir de versions volontairement partagées.</p></header>
 {data?<CollaborativeReviewWorkspace data={data} trainer={true} sources={sources} base="/espace/formateur/revues"/>:<section className="cr-empty" role="status"><h2>Revue momentanément indisponible</h2><p>Impossible de charger les versions accessibles. Aucun dossier fictif n'est affiché.</p><Link href="/espace/formateur">Revenir à mon espace</Link></section>}
 </main>;
}
