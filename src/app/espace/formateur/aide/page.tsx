import "@/app/espace/aide/support.css";
import Link from "next/link";
import {ArrowLeft,LifeBuoy} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {LearnerSupportCenter} from "@/components/learner-support-center";
import type {SupportList} from "@/lib/learner-support";
export const dynamic="force-dynamic";
export default async function SupportPage({searchParams}:{searchParams:Promise<{page?:string}>}){
 await requireRole("trainer");
 const params=await searchParams,parsed=Number(params.page),page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/support?page="+page).catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null) as (SupportList&{can_create:boolean})|null:null;
 return <main className="page sc-page"><Link className="sc-back" href="/espace/formateur"><ArrowLeft size={16}/> Espace formateur</Link><header className="sc-header"><span><LifeBuoy size={17}/> FORMATION PRO 360 / ACCOMPAGNEMENT</span><h1>Suivi des blocages<i>.</i></h1><p>Centralise les difficultés signalées et prépare tes interventions individuelles.</p></header>
 {data?<LearnerSupportCenter data={data} trainer={true} canCreate={false}/>:<section className="sc-empty" role="status"><h2>{res?.status===403?"Accès selon ton inscription":"Centre d'aide momentanément indisponible"}</h2><p>Impossible de charger les demandes. Aucun résultat fictif n'est affiché.</p><Link href="/espace/formateur">Revenir à mon espace</Link></section>}
 </main>;
}
