import "@/app/espace/bilan/report.css";
import Link from "next/link";
import {ArrowLeft,BarChart3} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {loadTrainerCockpit,selectTrainerTrack} from "@/lib/trainer-cockpit";
import {backendRequest} from "@/lib/auth/backend";
import {LearningReportView} from "@/components/learning-report-view";
import type {LearningReport} from "@/lib/learning-report";
export const dynamic="force-dynamic";
export default async function ReportPage({searchParams}:{searchParams:Promise<{learner_id?:string;parcours?:string|string[]}>}){
 await requireRole("trainer");
 const p=await searchParams;
 const id=typeof p.learner_id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.learner_id)?p.learner_id:null;
 const selected=selectTrainerTrack(await loadTrainerCockpit(),p.parcours);
 const slug=selected?.slug??"";
 const back="/espace/formateur/suivi?parcours="+encodeURIComponent(slug);
 const res=id&&selected?await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/learning-report?learner_id="+encodeURIComponent(id)).catch(()=>null):null;
 const data=res?.ok?await res.json().catch(()=>null) as LearningReport|null:null;
 const report=data?.source==="official_workshop_submissions_and_xp"&&data.course_slug===slug&&data.learner.id===id?data:null;
 return <main className="page lr-page"><Link className="lr-back lr-no-print" href={back}><ArrowLeft size={16}/> Suivi des apprenants</Link><header className="lr-header"><span><BarChart3 size={17}/> FORMATION PRO 360 / BILAN PÉDAGOGIQUE</span><h1>Bilan individuel<i>.</i></h1><p>Examine les réalisations et prépare tes prochains retours pédagogiques.</p></header>
 {report?<LearningReportView report={report} trainer={true}/>:<section className="lr-panel" role="status"><h2>Bilan non disponible pour cet apprenant</h2><p>Aucune donnée estimée n'est affichée. Vérifie l'inscription ou reviens à ton espace.</p><Link href={back}>Revenir</Link></section>}</main>;
}
