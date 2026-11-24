import "./practice.css";
import Link from "next/link";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import {GraduationCap} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {ProductPracticeAssistance} from "@/components/product-practice-assistance";
export const dynamic="force-dynamic";
export default async function PracticePage(){
 await requireRole("learner");
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia").catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null) as {enrollment?:string;lesson_access?:string;coach_available?:boolean}|null:null;
 const allowed=data?.enrollment==="active"&&data.lesson_access==="granted";
 return <main className="page practice-page">
  <header className="practice-hero"><span><GraduationCap size={18}/> ACCOMPAGNEMENT HUMAIN · TRAVAIL PRATIQUE</span><h1>Mon accompagnement<span>.</span></h1><p>Apprends en réalisant, prépare tes questions et avance avec ton formateur.</p></header>
  <ProductWorkspaceNav active="accompagnement"/>
  <div className="pw-support"><div><strong>Un blocage à transmettre au formateur ?</strong><p>Retrouve tes demandes et ses réponses dans le centre d’aide.</p></div><Link href="/espace/apprenant/aide">Demander de l’aide</Link></div>
  <ProductPracticeAssistance aiAvailable={allowed&&data?.coach_available===true}/>
 </main>;
}
