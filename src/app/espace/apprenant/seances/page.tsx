import "@/app/espace/formateur/seances/sessions.css";
import Link from "next/link";
import {ArrowLeft,CalendarDays} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {PracticalSessionAgenda} from "@/components/practical-session-agenda";
import type {SessionAgenda} from "@/lib/practical-sessions";
export const dynamic="force-dynamic";
export default async function LearnerSessionsPage({searchParams}:{searchParams:Promise<{page?:string}>}){
 await requireRole("learner");
 const params=await searchParams;const parsed=Number(params.page);
 const page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/sessions?page="+page).catch(()=>null);
 const agenda=res?.ok?await res.json().catch(()=>null) as SessionAgenda|null:null;
 return <main className="page ps-page">
  <Link href="/espace/apprenant" className="ps-back"><ArrowLeft size={16}/> Mon espace</Link>
  <header className="ps-header"><span><CalendarDays size={16}/> FORMATION PRO 360 / AVEC TON FORMATEUR</span><h1>Mes séances<span>.</span></h1><p>Retrouve tes rendez-vous de formation, prépare ton travail et conserve les consignes de ton formateur.</p></header>
  {!agenda?<section className="ps-empty" role="status"><h2>{res?.status===403?"Inscription requise":"Agenda momentanément indisponible"}</h2><p>Les séances sont accessibles selon ton inscription. Tu peux continuer ton parcours.</p><Link href="/espace/parcours/ingenierie-produit-ia">Consulter mon parcours</Link></section>:<PracticalSessionAgenda agenda={agenda} trainer={false} participants={[]} participantsTruncated={false}/>}
 </main>;
}
