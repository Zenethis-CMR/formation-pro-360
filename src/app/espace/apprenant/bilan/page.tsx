import "@/app/espace/bilan/report.css";
import "@/components/trainer-cockpit.css";
import Link from "next/link";
import {ArrowLeft,BarChart3} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {loadLearningContext,loadLearningDetail} from "@/lib/active-learning-context";
import {selectEnrolledTrack,canReadTrack} from "@/lib/universal-learning";
import {backendRequest} from "@/lib/auth/backend";
import {LearningReportView} from "@/components/learning-report-view";
import type {LearningReport} from "@/lib/learning-report";
export const dynamic="force-dynamic";
export default async function ReportPage({searchParams}:{searchParams:Promise<{parcours?:string|string[]}>}){
 const {user}=await requireRole("learner");
 const query=await searchParams;
 const {tracks,active}=await loadLearningContext();
 const selected=selectEnrolledTrack(tracks,query.parcours??active?.slug);
 const slug=selected?.slug??"";
 const res=selected?await backendRequest("/v1/training/catalog/"+encodeURIComponent(slug)+"/learning-report").catch(()=>null):null;
 const data=res?.ok?await res.json().catch(()=>null) as LearningReport|null:null;
 const report=data?.source==="official_workshop_submissions_and_xp"&&data.course_slug===slug&&data.learner?.id===user.id?data:null;
 const detail=report&&selected?await loadLearningDetail(slug):null;
 const workshopLinks:Record<string,string>={};
 if(detail)for(const lesson of detail.studio.lessons)workshopLinks[lesson.module_id+":"+lesson.slug]="/espace/apprenant/formations/"+encodeURIComponent(slug)+"/studio?atelier="+encodeURIComponent(lesson.id);
 return <main className="page lr-page"><Link className="lr-back lr-no-print" href="/espace/apprenant"><ArrowLeft size={16}/> Mon espace</Link><header className="lr-header"><span><BarChart3 size={17}/> FORMATION PRO 360 / BILAN PÉDAGOGIQUE</span><h1>Mon bilan<i>.</i></h1><p>Retrouve tes preuves, tes résultats et les compétences abordées pendant ton parcours.</p></header>
 <nav className="utc-selector lr-no-print" aria-label="Formation du bilan">{tracks.filter(canReadTrack).map(t=><Link key={t.slug} aria-current={t.slug===slug?"page":undefined} href={"/espace/apprenant/bilan?parcours="+encodeURIComponent(t.slug)}>{t.title}</Link>)}</nav>
 {report?<LearningReportView key={slug} report={report} trainer={false} workshopLinks={workshopLinks}/>:<section className="lr-panel" role="status"><h2>Bilan momentanément indisponible</h2><p>Aucune donnée estimée n'est affichée. Vérifie l'inscription ou reviens à ton espace.</p><Link href="/espace/apprenant">Revenir</Link></section>}</main>;
}
