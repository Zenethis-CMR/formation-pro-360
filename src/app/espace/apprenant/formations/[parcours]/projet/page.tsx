import Link from "next/link";
import {ArrowLeft,ArrowRight,FolderKanban,LockKeyhole} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {loadLearningDetail} from "@/lib/active-learning-context";
import {validStudioTrackSlug} from "@/lib/universal-learning";
import {LearnerProductEditor} from "@/components/learner-product-editor";
import {getProjectPresentation,projectWorkspaceBase} from "@/lib/universal-project";
import type {ProductProject} from "@/lib/learner-product-project";
import "../../../../projet/project.css";
export const dynamic="force-dynamic";
export default async function UniversalProjectPage({params}:{params:Promise<{parcours:string}>}){
 await requireRole("learner");
 const {parcours}=await params;
 const detail=validStudioTrackSlug(parcours)?await loadLearningDetail(parcours):null;
 const base=projectWorkspaceBase(parcours);
 const response=detail?await backendRequest("/v1/training/catalog/"+encodeURIComponent(parcours)+"/project").catch(()=>null):null;
 const data=response?.ok?await response.json().catch(()=>null) as {editable:boolean;project:ProductProject|null}|null:null;
 if(parcours==="ingenierie-produit-ia"&&detail)return <main className="page product-workspace"><Link href="/espace/projet">Ouvrir le dossier produit complet <ArrowRight size={16}/></Link></main>;
 return <main className="page product-workspace">
 <Link href="/espace/apprenant/formations"><ArrowLeft size={16}/> Mes formations</Link>
 <header className="product-hero"><div><span className="journey-overline"><FolderKanban size={16}/> DOSSIER PROJET · {detail?.studio.title??"FORMATION"}</span><h1>Mon projet<span>.</span></h1><p>{detail?getProjectPresentation(parcours).brief:"Inscription autorisée requise."}</p></div>{detail&&<Link href={base+"/studio"}>Ouvrir mon studio <ArrowRight size={16}/></Link>}</header>
 {detail&&data?<><LearnerProductEditor key={parcours} initial={data.project} editable={data.editable===true&&detail.studio.enrollment==="active"} trackSlug={parcours}/>
 <section className="product-panel"><h2>Preuves et compétences</h2><p>Les validations officielles sont indépendantes de ce dossier. Retrouve les livrables réellement évalués dans ton portfolio.</p><Link href={base+"/portfolio"}>Mon portfolio vérifié <ArrowRight size={16}/></Link></section></>:<section className="product-panel" role="status"><LockKeyhole size={24}/><h2>Dossier indisponible</h2><p>Vérifie ton inscription ou réessaie lorsque le service de sauvegarde répond.</p></section>}
 </main>;
}
