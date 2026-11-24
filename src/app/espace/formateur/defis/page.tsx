import "@/app/espace/defis/briefs.css";
import Link from "next/link";
import {ArrowLeft,Target} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {PersonalPracticeBoard} from "@/components/personal-practice-board";
import type {BriefList} from "@/lib/personal-practice";
export const dynamic="force-dynamic";
export default async function BriefPage({searchParams}:{searchParams:Promise<{page?:string}>}){
 await requireRole("trainer");
 const params=await searchParams,parsed=Number(params.page),page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const api="/v1/training/catalog/ingenierie-produit-ia";
 const res=await backendRequest(api+"/practice-briefs?page="+page).catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null) as BriefList|null:null;
 const r=await backendRequest(api+"/session-participants").catch(()=>null);
 const roster=r?.ok?await r.json().catch(()=>null) as {participants:{learner_id:string;preferred_name:string|null}[];truncated:boolean}|null:null;
 return <main className="page pb-page"><Link className="pb-back" href="/espace/formateur"><ArrowLeft size={16}/> Espace formateur</Link><header className="pb-header"><span><Target size={16}/> FORMATION PRO 360 / PRATIQUE PERSONNALISÉE</span><h1>Consignes et défis<i>.</i></h1><p>Attribue des exercices concrets et accompagne chaque apprenant par tes retours.</p></header>
 {data&&roster?<PersonalPracticeBoard data={data} trainer={true} participants={roster.participants} truncated={roster.truncated}/>:<section className="pb-empty" role="status"><h2>{res?.status===403?"Inscription requise":"Espace momentanément indisponible"}</h2><p>Impossible de charger les consignes. Aucun résultat fictif n'est affiché.</p><Link href="/espace/formateur">Revenir à mon espace</Link></section>}
 </main>;
}
