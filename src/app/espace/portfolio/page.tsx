import Link from "next/link";
import {ProductWorkspaceNav} from "@/components/product-workspace-nav";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { backendRequest } from "@/lib/auth/backend";
import { LearnerVerifiedPortfolio, type VerifiedPortfolio } from "@/components/learner-verified-portfolio";

export const dynamic="force-dynamic";

/**
 * Private portfolio. No public share URLs or static snapshots: every visit
 * requires a current learner session and CT420 enrollment authorization.
 */
export default async function LearnerPortfolioPage(){
  await requireRole("learner");
  const response=await backendRequest(
    "/v1/training/catalog/ingenierie-produit-ia/portfolio"
  ).catch(()=>null);
  let data:VerifiedPortfolio|null=null;
  if(response?.ok){
    const candidate=await response.json().catch(()=>null) as VerifiedPortfolio|null;
    if(candidate?.source==="trainer_approved_with_xp_ledger"&&
       Array.isArray(candidate.projects)&&
       typeof candidate.course?.title==="string"&&
       Number.isInteger(candidate.verified_count)&&
       Number.isInteger(candidate.verified_xp)&&
       candidate.verified_count===candidate.projects.length&&
       candidate.verified_xp===candidate.projects.reduce((sum,p)=>sum+Number(p.xp),0)&&
       candidate.projects.every(project=>project.score>=80&&project.score<=100&&
         project.xp===100&&
         typeof project.lesson_title==="string"&&
         typeof project.lesson_slug==="string"&&
         Array.isArray(project.skills)&&
         typeof project.url==="string"&&
         /^https?:\/\//i.test(project.url)))
      data=candidate;
  }
  return <main className="page portfolio-page">
    <div className="portfolio-navigation">
      <Link href="/espace/apprenant?onglet=progression"><ArrowLeft size={16}/> Ma progression</Link>
      <Link href="/espace/parcours/ingenierie-produit-ia">Les 16 ateliers <ArrowRight size={15}/></Link>
    </div>
    <ProductWorkspaceNav active="portfolio"/>
    {!data?
      <section className="portfolio-unavailable" role="status">
        {response?.status===403?<LockKeyhole size={29}/>:<TriangleAlert size={29}/>}
        <h1>{response?.status===403?"Portfolio réservé aux apprenants inscrits":
          "Portfolio momentanément indisponible"}</h1>
        <p>{response?.status===403?
          "Seuls les apprenants disposant d'une inscription active ou terminée peuvent consulter leurs réalisations personnelles.":
          "Impossible de vérifier tes réalisations auprès du serveur. Nous n'affichons pas de projets ou de récompenses non confirmés."}</p>
        <Link href="/espace/parcours/ingenierie-produit-ia">Retourner au parcours <ArrowRight size={16}/></Link>
      </section>:
      <LearnerVerifiedPortfolio portfolio={data}/>}
    <footer className="portfolio-private-footer">
      <ShieldCheck size={15}/> Espace personnel protégé · Les projets sont issus de véritables corrections enregistrées.
    </footer>
  </main>;
}
