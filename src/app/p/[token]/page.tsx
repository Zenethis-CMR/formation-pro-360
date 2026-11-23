import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRight,BadgeCheck,BookOpen,CheckCircle2,ExternalLink,
  GraduationCap,LockKeyhole,ShieldCheck} from "lucide-react";
import {backendRequest} from "@/lib/auth/backend";

export const dynamic="force-dynamic";
export const revalidate=0;
// No search index and no social preview containing learner projects.
export const metadata:Metadata={
  title:"Portfolio partagé | Formation Pro 360",
  description:"Dossier de réalisations sélectionnées et vérifiées pédagogiquement.",
  robots:{index:false,follow:false,nocache:true}
};
type Project={
  title:string;objective:string;module:string;week:number;skills:string[];
  reviewed_at:string;score?:number;url?:string;
};
type Publication={
  title:string;course_title:string;verification:"trainer_approved_with_xp_ledger";
  projects:Project[];
};
const safeExternal=(value:string)=>{
  try{const url=new URL(value);
    return url.protocol==="https:"||url.protocol==="http:"?url.href:null;
  }catch{return null;}
};
function dateFr(value:string){
  const d=new Date(value);
  return Number.isFinite(d.getTime())?new Intl.DateTimeFormat("fr-FR",{
    dateStyle:"medium",timeZone:"Africa/Douala"}).format(d):"Date de validation indisponible";
}
export default async function PublicPortfolioPage({params}:{
  params:Promise<{token:string}>
}){
  const {token}=await params;
  let data:Publication|null=null;
  if(/^[A-Za-z0-9_-]{43}$/.test(token)){
    const result=await backendRequest("/v1/training/public-portfolio/"+token).catch(()=>null);
    if(result?.ok){
      const candidate=await result.json().catch(()=>null) as Publication|null;
      if(candidate?.verification==="trainer_approved_with_xp_ledger"&&
         typeof candidate.title==="string"&&
         typeof candidate.course_title==="string"&&
         Array.isArray(candidate.projects)&&candidate.projects.length>0&&
         candidate.projects.length<=16&&candidate.projects.every(p=>
           typeof p.title==="string"&&typeof p.objective==="string"&&
           Array.isArray(p.skills)&&
           (p.score===undefined||(Number.isInteger(p.score)&&p.score>=80&&p.score<=100))&&
           (p.url===undefined||Boolean(safeExternal(p.url)))))
        data=candidate;
    }
  }
  if(!data)return <main className="public-portfolio-page">
    <header className="public-portfolio-header">
      <Link href="/"><GraduationCap size={20}/> Formation Pro 360</Link>
    </header>
    <section className="public-portfolio-not-found">
      <LockKeyhole size={38}/>
      <h1>Ce portfolio n'est plus accessible.</h1>
      <p>Le lien a peut-être été remplacé, désactivé ou la publication ne remplit plus les conditions de validation.</p>
      <Link href="/catalogue">Découvrir les formations <ArrowRight size={16}/></Link>
    </section>
  </main>;
  const skills=[...new Set(data.projects.flatMap(p=>
    p.skills.filter(s=>typeof s==="string")))].slice(0,20);
  return <main className="public-portfolio-page">
    <header className="public-portfolio-header">
      <Link href="/"><GraduationCap size={20}/> Formation <strong>Pro 360</strong></Link>
      <span><ShieldCheck size={15}/> Partage volontaire · Preuves pédagogiques</span>
    </header>
    <section className="public-portfolio-hero">
      <span><BadgeCheck size={17}/> PORTFOLIO PARTAGÉ · VALIDATIONS HUMAINES</span>
      <h1>{data.title}</h1>
      <p>{data.course_title} · Une sélection de projets réalisés et validés par un formateur.</p>
      <div><strong>{data.projects.length}</strong> projet{data.projects.length>1?"s":""} vérifié{data.projects.length>1?"s":""}</div>
    </section>
    {skills.length>0&&<section className="public-portfolio-skills">
      <h2>Domaines travaillés dans ces réalisations</h2>
      <p>Ces étiquettes décrivent le contenu pédagogique ; elles ne constituent pas des certificats indépendants.</p>
      <div>{skills.map(s=><span key={s}>{s}</span>)}</div>
    </section>}
    <section className="public-portfolio-projects">
      <h2>Réalisations sélectionnées</h2>
      <div className="public-portfolio-grid">
        {data.projects.map((p,i)=><article key={i}>
          <span><CheckCircle2 size={15}/> PROJET VALIDÉ · SEMAINE {p.week}</span>
          <h3>{p.title}</h3>
          <small>{p.module}</small>
          <p>{p.objective}</p>
          <div className="public-portfolio-project-meta">
            <span>Validation du formateur : {dateFr(p.reviewed_at)}</span>
            {p.score!==undefined&&<b>Note rendue publique : {p.score}/100</b>}
          </div>
          {p.url&&safeExternal(p.url)&&
            <a href={safeExternal(p.url)||"#"} target="_blank" rel="noopener noreferrer">
              Consulter le projet sélectionné <ExternalLink size={15}/>
            </a>}
          <div className="public-portfolio-tags">
            {p.skills.slice(0,5).map(s=><span key={s}>{s}</span>)}
          </div>
        </article>)}
      </div>
    </section>
    <footer className="public-portfolio-footer">
      <BookOpen size={17}/> Les évaluations ont été enregistrées par Formation Pro 360.
      Un lien externe éventuel peut évoluer après sa correction. Ce portfolio n'est ni un diplôme ni une identité vérifiée.
    </footer>
  </main>;
}
