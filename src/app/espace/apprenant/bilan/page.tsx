import "@/app/espace/bilan/report.css";
import Link from "next/link";
import {ArrowLeft,BarChart3} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {LearningReportView} from "@/components/learning-report-view";
import type {LearningReport} from "@/lib/learning-report";
export const dynamic="force-dynamic";
export default async function ReportPage({searchParams}:{searchParams:Promise<{learner_id?:string}>}){
 await requireRole("learner");
 const res=await backendRequest("/v1/training/catalog/ingenierie-produit-ia/learning-report").catch(()=>null);
 const data=res?.ok?await res.json().catch(()=>null) as LearningReport|null:null;
 const report=data?.source==="official_workshop_submissions_and_xp"?data:null;
 return <main className="page lr-page"><Link className="lr-back lr-no-print" href="/espace/apprenant"><ArrowLeft size={16}/> Mon espace</Link><header className="lr-header"><span><BarChart3 size={17}/> FORMATION PRO 360 / BILAN PÉDAGOGIQUE</span><h1>Mon bilan<i>.</i></h1><p>Retrouve tes preuves, tes résultats et les compétences abordées pendant ton parcours.</p></header>
 {report?<LearningReportView report={report} trainer={false}/>:<section className="lr-panel" role="status"><h2>Bilan momentanément indisponible</h2><p>Aucune donnée estimée n'est affichée. Vérifie l'inscription ou reviens à ton espace.</p><Link href="/espace/apprenant">Revenir</Link></section>}</main>;
}
