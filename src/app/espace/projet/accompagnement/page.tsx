import "./practice.css";
import Link from "next/link";
import {ArrowLeft,GraduationCap} from "lucide-react";
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
  <Link className="practice-back" href="/espace/projet"><ArrowLeft size={16}/> Mon projet</Link>
  <header className="practice-hero"><span><GraduationCap size={18}/> ACCOMPAGNEMENT HUMAIN · TRAVAIL PRATIQUE</span><h1>Mon accompagnement<span>.</span></h1><p>Apprends en réalisant, prépare tes questions et avance avec ton formateur.</p></header>
  <div className="panel"><h2>Un blocage à transmettre au formateur ?</h2><p>Utilise le centre d’aide pour conserver la demande et les réponses.</p><Link href="/espace/apprenant/aide">Ouvrir le centre d’aide</Link></div>
  <ProductPracticeAssistance aiAvailable={allowed&&data?.coach_available===true}/>
 </main>;
}
