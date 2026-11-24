import Link from "next/link";
import {ArrowLeft,LockKeyhole} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import type {ReleasePreflight} from "@/lib/curriculum-releases";
import {CurriculumReleasePanel} from "@/components/curriculum-release-panel";
import "../../release.css";
export const dynamic="force-dynamic";
export default async function PublicationPage({params}:{params:Promise<{slug:string}>}){
 await requireRole("trainer");
 const {slug}=await params;
 const response=await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/releases").catch(()=>null);
 const data=response?.ok?await response.json().catch(()=>null) as ReleasePreflight|null:null;
 return <main className="page cr-page"><Link className="cr-back" href={"/espace/formateur/formations?parcours="+encodeURIComponent(slug)}><ArrowLeft size={16}/> Retour au programme</Link>{data?<CurriculumReleasePanel key={JSON.stringify([data.latest?.version,data.lessons.map(l=>[l.lesson_id,l.revision,l.state])])} data={data}/>:<section className="cr-card"><LockKeyhole size={28}/><h1>Préparation indisponible</h1><p>Ce studio est réservé aux parcours en brouillon sans ouverture aux apprenants. Le pilote n’est pas modifiable ici. Si le parcours est éligible, vérifie la disponibilité du backend.</p></section>}</main>;
}
