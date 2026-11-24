import "./practice.css";
import Link from "next/link";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import {GraduationCap} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {projectContext,projectRead} from "@/lib/project-context";
import {ProductPracticeAssistance} from "@/components/product-practice-assistance";
export const dynamic="force-dynamic";
export default async function PracticePage({searchParams}:{searchParams:Promise<{parcours?:string|string[]}>}){
 await requireRole("learner");
 const context=await projectContext("learner",(await searchParams).parcours);
 const slug=context.selected?.slug??"";
 const data=await projectRead<{track:{slug:string};enrollment?:string;lesson_access?:string;coach_available?:boolean}>(context.api,"");
 const allowed=data?.track?.slug===slug&&data?.enrollment==="active"&&data.lesson_access==="granted";
 return <main className="page practice-page">
  <header className="practice-hero"><span><GraduationCap size={18}/> {context.selected?.title??"FORMATION"} · ACCOMPAGNEMENT HUMAIN</span><h1>Mon accompagnement<span>.</span></h1><p>Apprends en réalisant, prépare tes questions et avance avec ton formateur.</p></header>
  {context.selected&&<ProductWorkspaceNav active="accompagnement" trackSlug={slug}/> }
  <div className="pw-support"><div><strong>Un blocage à transmettre au formateur ?</strong><p>Retrouve tes demandes et ses réponses dans le centre d’aide.</p></div><Link href={slug?"/espace/apprenant/aide?parcours="+encodeURIComponent(slug):"/espace/apprenant/formations"}>Demander de l’aide</Link></div>
  {context.api?<ProductPracticeAssistance key={slug} trackSlug={slug} aiAvailable={allowed&&data?.coach_available===true}/>:<p role="status">Inscription autorisée requise. <Link href="/espace/apprenant/formations">Mes formations</Link></p>}
 </main>;
}
