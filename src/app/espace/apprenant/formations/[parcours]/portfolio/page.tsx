import Link from "next/link";
import {ArrowLeft,ArrowRight,LockKeyhole} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {loadLearningDetail} from "@/lib/active-learning-context";
import {validStudioTrackSlug} from "@/lib/universal-learning";
import {LearnerVerifiedPortfolio,type VerifiedPortfolio} from "@/components/learner-verified-portfolio";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import {PortfolioPublishing} from "@/components/portfolio-publishing";
import {projectWorkspaceBase} from "@/lib/universal-project";
export const dynamic="force-dynamic";
export default async function UniversalPortfolioPage({params}:{params:Promise<{parcours:string}>}){
 await requireRole("learner");
 const {parcours}=await params;
 const valid=validStudioTrackSlug(parcours);
 const detail=valid?await loadLearningDetail(parcours):null;
 const response=detail?await backendRequest("/v1/training/catalog/"+encodeURIComponent(parcours)+"/portfolio").catch(()=>null):null;
 const candidate=response?.ok?await response.json().catch(()=>null) as VerifiedPortfolio|null:null;
 const data=candidate?.source==="trainer_approved_with_xp_ledger"&&candidate.course?.slug===parcours&&typeof candidate.course.title==="string"&&Array.isArray(candidate.projects)&&candidate.verified_count===candidate.projects.length&&candidate.verified_xp===candidate.projects.reduce((n,p)=>n+p.xp,0)&&candidate.projects.every(p=>p.xp===100&&Number.isInteger(p.score)&&p.score>=80&&p.score<=100&&typeof p.id==="string"&&typeof p.lesson_title==="string"&&typeof p.lesson_slug==="string"&&typeof p.module_id==="string"&&Array.isArray(p.skills)&&typeof p.url==="string"&&/^https?:\/\//i.test(p.url))?candidate:null;
 const base=projectWorkspaceBase(parcours);
 const links:Record<string,string>={};
 if(detail&&data)for(const proof of data.projects){
  const lesson=detail.studio.lessons.find(l=>l.module_id===proof.module_id&&l.slug===proof.lesson_slug);
  if(lesson)links[proof.id]=base+"/studio?atelier="+encodeURIComponent(lesson.id);
 }
 return <main className="page portfolio-page"><div className="portfolio-navigation"><Link href="/espace/apprenant/formations"><ArrowLeft size={16}/> Mes formations</Link>{detail&&<Link href={base+"/projet"}>Mon dossier projet <ArrowRight size={16}/></Link>}</div>
 {data&&<ProductWorkspaceNav active="portfolio" trackSlug={parcours}/>}
 {data?<LearnerVerifiedPortfolio key={parcours} portfolio={data} trackSlug={parcours} lessonCount={detail?.studio.lessons.length??null} moduleLinks={links}/>:<><section className="portfolio-unavailable" role="status"><LockKeyhole size={24}/><h1>Portfolio indisponible</h1><p>Aucune réalisation non confirmée n’est affichée. Vérifie ton inscription et la disponibilité du service.</p></section>{valid&&<PortfolioPublishing key={parcours} projects={[]} trackSlug={parcours} courseTitle={detail?.studio.title??"Mes projets"}/>}</>}
 </main>;
}
