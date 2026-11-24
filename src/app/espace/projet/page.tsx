import "./project.css";
import Link from "next/link";
import {ArrowRight,CheckCircle2,Flag,FolderKanban,LockKeyhole,ExternalLink} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {LearnerProductEditor} from "@/components/learner-product-editor";
import {milestoneProgress,safeProjectLink,type ProductProject,type VerifiedEvidence,type ProjectReview} from "@/lib/learner-product-project";
export const dynamic="force-dynamic";
const course="/espace/parcours/ingenierie-produit-ia";
const api="/v1/training/catalog/ingenierie-produit-ia";
async function read<T>(suffix:string):Promise<{data:T|null;status:number}>{
 const res=await backendRequest(api+suffix).catch(()=>null);
 return {data:res?.ok?await res.json().catch(()=>null) as T|null:null,status:res?.status??503};
}
export default async function ProductProjectPage(){
 await requireRole("learner");
 const [project,portfolio,catalog]=await Promise.all([
  read<{editable:boolean;project:ProductProject|null}>("/project"),
  read<{projects:VerifiedEvidence[];source:string}>("/portfolio"),
  read<{submissions:ProjectReview[]}>("")
 ]);
 const evidence=portfolio.data?.source==="trainer_approved_with_xp_ledger"&&Array.isArray(portfolio.data.projects)?portfolio.data.projects:null;
 const verified=new Map((evidence||[]).filter(item=>item.xp===100&&item.score>=80).map(item=>[item.lesson_slug,item]));
 const reviews=new Map<string,ProjectReview>();
 for(const item of catalog.data?.submissions||[]){
  if(item.lesson_slug&&!reviews.has(item.lesson_slug))reviews.set(item.lesson_slug,item);
 }
 return <main className="page product-workspace">
  <header className="product-hero"><div><span className="journey-overline"><FolderKanban size={16}/> PRODUCT WORKSPACE · INGÉNIERIE PRODUIT ET IA</span>
   <h1>Mon projet<span>.</span></h1><p>Un produit, seize ateliers, des preuves concrètes. Pilote ton idée jusqu'à une solution utile et commercialisable.</p></div>
   <Link href={course}>Voir mon parcours <ArrowRight size={16}/></Link>
  </header>
  {!project.data?<section className="product-panel" role="status"><LockKeyhole size={24}/><h2>{project.status===403?"Inscription autorisée requise":"Dossier projet momentanément indisponible"}</h2>
   <p>{project.status===403?"Vérifie ton inscription pour ouvrir ton dossier privé.":"Tu peux continuer tes ateliers. Le service de sauvegarde doit être disponible avant de modifier le dossier."}</p>
   <Link href={course}>Vérifier mon parcours <ArrowRight size={16}/></Link></section>:<>
   <section className="product-panel" aria-labelledby="milestone-title">
    <div className="product-workspace-heading"><div><span className="journey-overline"><Flag size={15}/> OBJECTIFS PÉDAGOGIQUES</span>
     <h2 id="milestone-title">Les 3 jalons de mon produit</h2><p>Repères indicatifs du cursus, pas des échéances automatiques ni une garantie de résultats commerciaux.</p></div>
     <div className="product-editor-metric"><strong>{evidence===null?"—":verified.size+"/16"}</strong><span>ateliers avec preuve vérifiée</span></div></div>
    <div className="product-milestones">{milestoneProgress(evidence).map(m=><article key={m.day} className={m.complete?"product-milestone complete":"product-milestone"}>
     <div className="product-milestone-top"><span>JOUR {m.day}</span>{m.complete&&<CheckCircle2 size={18}/>}</div>
     <h3>{m.title}</h3><p>{m.description}</p>
     {m.available?<><progress value={m.count} max={m.lessons.length} aria-label={"Ateliers vérifiés du jour "+m.day}/><strong>{m.count}/{m.lessons.length} ateliers vérifiés</strong></>:<strong>Preuves temporairement indisponibles</strong>}
    </article>)}</div>
    <p className="product-note">Un atelier est compté uniquement s'il a été approuvé par le formateur avec une note d'au moins 80 et ses 100 XP enregistrés. Le dossier renseigné ne constitue pas une preuve de fonctionnement ou de vente.</p>
   </section>
   <section className="product-panel"><div className="product-workspace-heading"><div><span className="journey-overline">ORGANISATION · BACKLOG</span><h2>Planifie les tâches de ton produit</h2><p>Priorise tes fonctionnalités, définis tes critères de vérification et suis ton travail dans le tableau Kanban.</p></div><Link href="/espace/projet/backlog">Ouvrir mon backlog <ArrowRight size={16}/></Link></div></section>
   <section className="product-panel"><div className="product-workspace-heading"><div><span className="journey-overline">ACCOMPAGNEMENT HUMAIN</span><h2>Prépare ta séance pratique avec ton formateur</h2><p>Fais le point sur ton travail, tes tests et les questions à aborder ensemble. Une aide IA ponctuelle reste facultative.</p></div><Link href="/espace/projet/accompagnement">Préparer ma séance <ArrowRight size={16}/></Link></div></section>
   <LearnerProductEditor initial={project.data.project} editable={project.data.editable}/>
   <section className="product-panel" aria-labelledby="project-evidence-title">
    <div className="product-workspace-heading"><div><span className="journey-overline">PREUVES ET RETOURS OFFICIELS</span><h2 id="project-evidence-title">Les 16 ateliers de mon produit</h2><p>Consulte les preuves déjà validées et les retours associés, sans les recopier dans ton dossier.</p></div><Link href="/espace/portfolio">Mon portfolio <ArrowRight size={16}/></Link></div>
    {evidence===null&&<p className="product-note" role="status">Le registre des preuves est momentanément indisponible : aucun résultat n'est estimé.</p>}
    <div className="product-evidence-list">{pilotCourse.modules.map(m=><details key={m.slug} open={m.week===1}>
     <summary><strong>S{m.week} · {m.title}</strong><span>{evidence===null?"—":m.lessons.filter(l=>verified.has(l.slug)).length+"/2"}</span></summary>
     {m.lessons.map(l=>{const proof=verified.get(l.slug);const review=reviews.get(l.slug);const href=proof?safeProjectLink(proof.url):null;
      const status=proof?"Preuve vérifiée":review?.status==="changes_requested"?"À améliorer":review?.status==="pending"?"En correction":review?.status==="approved"?"Validation à rapprocher du registre":evidence===null||!catalog.data?"Statut indisponible":"À réaliser";
      return <article className="product-evidence-row" key={l.slug}><div><span className={proof?"product-proof verified":"product-proof"}>{status}</span><h3>{l.title}</h3>
        {proof&&<p>{proof.score}/100 · {proof.xp} XP officiels</p>}
        {review?.feedback&&<p className="product-review">{review.feedback}</p>}
        <p>{l.evidence}</p></div>
        <div className="product-evidence-actions"><Link href={course+"/atelier/"+l.slug}>Ouvrir l'atelier <ArrowRight size={14}/></Link>
         {href&&<a href={href} target="_blank" rel="noopener noreferrer">Voir la preuve <ExternalLink size={14}/></a>}</div></article>;
     })}
    </details>)}</div>
   </section>
  </>}
 </main>;
}
