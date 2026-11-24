import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowRight,BookOpen,Clock3,GraduationCap,Target,CheckCircle2,Palette,PenTool,BarChart3,Workflow,ShieldCheck,BriefcaseBusiness} from "lucide-react";
import {specializations} from "@/lib/v2-public-catalog";
import {getSpecializationProgram} from "@/lib/specialization-programs";
import "../curriculum-360.css";
const icons={palette:Palette,pen:PenTool,chart:BarChart3,workflow:Workflow,shield:ShieldCheck,briefcase:BriefcaseBusiness};
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return specializations.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const track=specializations.find(t=>t.slug===slug);
 return track?{title:track.name+" — Programme | Formation Pro 360",description:track.summary}:{title:"Programme introuvable"};
}
export default async function SpecializationPage({params}:Props){
 const {slug}=await params;const track=specializations.find(t=>t.slug===slug),program=getSpecializationProgram(slug);
 if(!track||!program)notFound();
 const Icon=icons[track.icon];
 return <main className="v2catalog cf360">
  <header className="v2catalog-nav"><Link href="/catalogue" className="v2catalog-brand"><span><GraduationCap size={22}/></span>Formation <b>Pro 360</b></Link><nav aria-label="Accès aux espaces"><Link href="/catalogue">Catalogue</Link><Link href="/espace" className="v2catalog-nav-primary">Mon espace <ArrowRight size={15}/></Link></nav></header>
  <div className="v2catalog-body">
   <Link href="/catalogue" className="v2catalog-back"><ArrowLeft size={16}/> Toutes les formations</Link>
   <section className="cf360-hero" data-tone={track.icon}><div><span className="cf360-status">PROGRAMME DÉTAILLÉ · INSCRIPTIONS FERMÉES</span><h1>{track.name}</h1><p>{track.summary}</p><div className="cf360-pills"><span><Clock3 size={16}/> 8 semaines prévues</span><span><BookOpen size={16}/> 16 ateliers proposés</span><span><Target size={16}/> Projet fil rouge</span></div><a href="#programme" className="cf360-primary">Explorer les ateliers <ArrowRight size={17}/></a></div><div className="cf360-hero-art" aria-hidden="true"><Icon size={112} strokeWidth={1.15}/><span>360</span></div></section>
   <div className="cf360-detail-layout">
    <section id="programme" aria-labelledby="programme-title"><div className="cf360-heading"><span>30 % COMPRÉHENSION · 70 % PRATIQUE</span><h2 id="programme-title">Ton programme, semaine par semaine</h2><p>Proposition pédagogique à valider avec le formateur. Chaque atelier prévoit une réalisation et quatre critères de correction, à 25 points chacun.</p></div>
     <div className="cf360-weeks">{program.modules.map(mod=><details className="cf360-week" key={mod.week} open={mod.week===1}><summary><span className="cf360-week-num">S{String(mod.week).padStart(2,"0")}</span><span className="cf360-week-copy"><strong>{mod.title}</strong><small>{mod.outcome}</small></span><span className="cf360-week-count">2 ateliers</span></summary><div className="cf360-lessons">{mod.lessons.map((lesson,i)=><article key={lesson.slug}><span className="cf360-lesson-label">ATELIER {String((mod.week-1)*2+i+1).padStart(2,"0")}</span><h3>{lesson.title}</h3><p>{lesson.objective}</p><div className="cf360-evidence"><CheckCircle2 size={18}/><div><strong>Livrable pratique</strong><p>{lesson.evidence}</p></div></div><h4>Critères proposés · 100 points</h4><ul>{lesson.criteria.map(c=><li key={c}>{c}<span>25 pts</span></li>)}</ul></article>)}</div></details>)}</div>
    </section>
    <aside className="cf360-context" aria-label="Informations pédagogiques"><section><span>PROJET FINAL</span><h2>{track.deliverable}</h2><p>{program.milestones}</p></section><section><span>ENVIRONNEMENT DE TRAVAIL</span><h3>Outils suggérés</h3><p>{program.tools}</p></section><section><span>ACCOMPAGNEMENT HUMAIN</span><h3>Apprendre en réalisant</h3><p>Le formateur anime les démonstrations, accompagne les exercices et évalue les preuves. Le seuil proposé est de 80/100. L'IA reste un outil complémentaire.</p></section><section className="cf360-notice"><strong>Inscriptions non ouvertes</strong><p>Ce programme est consultable avant validation pédagogique et activation technique. Aucun atelier ni XP n'est attribué depuis cette page.</p><Link href="/catalogue">Retour au catalogue <ArrowRight size={15}/></Link></section></aside>
   </div>
   <footer className="v2catalog-footer"><span>© Formation Pro 360 · Programme en validation</span><Link href="/catalogue">Toutes les formations</Link></footer>
  </div>
 </main>;
}
