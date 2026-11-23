"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {PortfolioPublishing} from "@/components/portfolio-publishing";
import {ArrowRight,Award,BadgeCheck,BookOpen,BriefcaseBusiness,CalendarCheck2,
  CheckCircle2,ExternalLink,FileDown,Filter,LockKeyhole,Search,ShieldCheck} from "lucide-react";

export type VerifiedProject={
  id:string;lesson_slug:string;lesson_title:string;lesson_objective:string;
  evidence_required:string;week:number;module_title:string;skills:string[];
  url:string;note:string;score:number;reviewed_at:string;xp:number;awarded_at:string;
};
export type VerifiedPortfolio={
  source:"trainer_approved_with_xp_ledger";
  course:{title:string;summary:string};
  projects:VerifiedProject[];verified_count:number;verified_xp:number;
};

const safeUrl=(raw:string)=>{
  try{
    const parsed=new URL(raw);
    if(parsed.protocol!=="https:"&&parsed.protocol!=="http:")return null;
    return parsed.href;
  }catch{return null;}
};
function dateLabel(raw:string){
  const d=new Date(raw);
  return Number.isFinite(d.getTime())?new Intl.DateTimeFormat("fr-FR",{
    dateStyle:"medium",timeZone:"Africa/Douala"
  }).format(d):"Date non disponible";
}
/**
 * Print only after an explicit learner gesture. Notes and URLs are excluded
 * from the printable copy unless the learner checks the corresponding option.
 */
export function LearnerVerifiedPortfolio({portfolio}:{portfolio:VerifiedPortfolio}){
  const [search,setSearch]=useState("");
  const [week,setWeek]=useState("all");
  const [includeNotes,setIncludeNotes]=useState(false);
  const [includeUrls,setIncludeUrls]=useState(false);
  const safeProjects=portfolio.projects.filter(project=>
    project.score>=80&&project.xp===100&&safeUrl(project.url)!==null
  );
  const skillTags=useMemo(()=>[...new Set(safeProjects.flatMap(
    p=>Array.isArray(p.skills)?p.skills.filter(x=>typeof x==="string"):[]
  ))].slice(0,18),[safeProjects]);
  const availableWeeks=[...new Set(safeProjects.map(p=>p.week))].sort((a,b)=>a-b);
  const shown=safeProjects.filter(p=>
    (week==="all"||String(p.week)===week)&&
    [p.lesson_title,p.module_title,...p.skills].join(" ")
      .toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr").trim())
  );
  return <>
    <header className="portfolio-hero">
      <div className="portfolio-hero-copy">
        <span><BriefcaseBusiness size={17}/> DOSSIER DE RÉALISATIONS · FORMATION PRO 360</span>
        <h1>Mon portfolio<span>.</span></h1>
        <p>Des produits construits, des preuves consultables et des ateliers
          réellement validés par le formateur.</p>
        <small>{portfolio.course.title} · 8 semaines de pratique</small>
      </div>
      <div className="portfolio-hero-emblem"><BadgeCheck size={56}/><span>VALIDATION HUMAINE</span></div>
    </header>

    <section className="portfolio-kpis" aria-label="Acquis vérifiés">
      <div><span><CheckCircle2 size={16}/> Projets validés</span>
        <strong>{portfolio.verified_count}<small> / 16</small></strong>
        <p>Corrections réelles enregistrées</p></div>
      <div><span><Award size={16}/> XP du parcours vérifiés</span>
        <strong>{portfolio.verified_xp}</strong>
        <p>Uniquement les récompenses inscrites en base</p></div>
      <div><span><CalendarCheck2 size={16}/> Semaines représentées</span>
        <strong>{availableWeeks.length}<small> / 8</small></strong>
        <p>Par des réalisations approuvées</p></div>
    </section>

    <section className="portfolio-control-panel">
      <div>
        <span><ShieldCheck size={16}/> TON EXPORT, TON CHOIX</span>
        <h2>Présente tes réalisations à ton rythme.</h2>
        <p>Le portfolio est privé. Rien n'est publié sur Internet : l'impression ou
          l'enregistrement au format PDF est déclenché uniquement par toi.</p>
        <div className="portfolio-export-options">
          <label><input type="checkbox" checked={includeUrls}
            onChange={e=>setIncludeUrls(e.target.checked)}/>
            Inclure les adresses des projets dans l'export</label>
          <label><input type="checkbox" checked={includeNotes}
            onChange={e=>setIncludeNotes(e.target.checked)}/>
            Inclure mes descriptions déposées</label>
        </div>
      </div>
      <button type="button" className="portfolio-print-button"
        onClick={()=>window.print()}>
        <FileDown size={18}/> Imprimer / exporter en PDF
      </button>
    </section>

    <PortfolioPublishing projects={safeProjects}/>
    {safeProjects.length>0&&<section className="portfolio-skill-section">
      <div className="portfolio-section-heading">
        <span>COMPÉTENCES DU PARCOURS</span>
        <h2>Les domaines abordés dans mes projets</h2>
        <p>Étiquettes pédagogiques issues des modules validés, non des certifications indépendantes.</p>
      </div>
      <div className="portfolio-skill-list">
        {skillTags.map(skill=><span key={skill}>{skill}</span>)}
      </div>
    </section>}

    <section className="portfolio-projects" aria-labelledby="portfolio-projects-heading">
      <div className="portfolio-section-heading">
        <span>PREUVES & PROJETS</span>
        <h2 id="portfolio-projects-heading">Mes réalisations évaluées</h2>
        <p>Chaque carte est liée à une soumission réellement approuvée et à ses 100 XP officiels.</p>
      </div>
      {safeProjects.length>0&&<div className="portfolio-filters">
        <label><Search size={16}/>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher un projet ou une compétence…"
            aria-label="Rechercher dans les réalisations vérifiées"/>
        </label>
        <label><Filter size={16}/>
          <select value={week} onChange={e=>setWeek(e.target.value)}
            aria-label="Filtrer par semaine">
            <option value="all">Toutes les semaines</option>
            {availableWeeks.map(n=><option key={n} value={String(n)}>Semaine {n}</option>)}
          </select>
        </label>
        <small>{shown.length} réalisation{shown.length>1?"s":""} affichée{shown.length>1?"s":""}</small>
      </div>}
      {safeProjects.length===0?
        <div className="portfolio-empty">
          <BookOpen size={30}/>
          <h3>Ton premier projet vérifié apparaîtra ici.</h3>
          <p>Une remise en attente ou une demande de correction ne suffit pas.
            Après validation humaine et attribution des XP, ton livrable rejoindra ce dossier.</p>
          <Link href="/espace/parcours/ingenierie-produit-ia">Reprendre mes ateliers <ArrowRight size={16}/></Link>
        </div>:
        shown.length===0?<p className="portfolio-no-result">Aucun projet ne correspond à ces filtres.</p>:
        <div className="portfolio-project-grid">
          {shown.map((project,i)=><article key={project.id} className="portfolio-project-card">
            <div className="portfolio-project-top">
              <span>RÉALISATION {String(i+1).padStart(2,"0")} · SEMAINE {project.week}</span>
              <b><CheckCircle2 size={13}/> VALIDÉE</b>
            </div>
            <h3>{project.lesson_title}</h3>
            <p className="portfolio-project-module">{project.module_title}</p>
            <p className="portfolio-project-objective">{project.lesson_objective}</p>
            <div className="portfolio-project-grade">
              <div><strong>{project.score}<small>/100</small></strong>
                <span>Note du formateur</span></div>
              <div><strong>+{project.xp}</strong><span>XP attribués</span></div>
              <div><strong><CalendarCheck2 size={17}/></strong>
                <span>{dateLabel(project.reviewed_at||project.awarded_at)}</span></div>
            </div>
            <div className="portfolio-proof">
              <span><ShieldCheck size={15}/> PREUVE ATTENDUE</span>
              <p>{project.evidence_required}</p>
            </div>
            {project.skills?.length>0&&<div className="portfolio-project-skills">
              {project.skills.slice(0,6).map(tag=><span key={tag}>{tag}</span>)}
            </div>}
            {includeNotes&&project.note?.trim()&&
              <blockquote className="portfolio-project-note">
                <strong>Description déposée par l'apprenant</strong>
                <p>{project.note}</p>
              </blockquote>}
            {includeUrls&&<p className="portfolio-export-url">
              Adresse du livrable : {project.url}
            </p>}
            <div className="portfolio-card-actions">
              <a href={safeUrl(project.url)||"#"} target="_blank" rel="noopener noreferrer">
                Consulter mon livrable <ExternalLink size={15}/>
              </a>
              <Link href={"/espace/parcours/ingenierie-produit-ia/atelier/"+project.lesson_slug}>
                Voir l'atelier <ArrowRight size={15}/>
              </Link>
            </div>
          </article>)}
        </div>}
    </section>
    <section className="portfolio-disclaimer">
      <LockKeyhole size={17}/>
      <p><strong>Portfolio personnel, non diplôme.</strong> Les validations et XP sont issus du
        registre pédagogique de Formation Pro 360. Les liens et descriptions restent
        ceux fournis par l'apprenant ; leur contenu externe peut évoluer. Aucun document
        d'identité, carnet privé ou échange avec le coach IA n'est inclus.</p>
    </section>
  </>;
}
