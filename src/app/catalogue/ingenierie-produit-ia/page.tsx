import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, Clock3, GraduationCap, Lightbulb, Rocket, Sparkles } from "lucide-react";
import { pilotCourse } from "@/lib/v2-public-catalog";
export const metadata:Metadata={
  title:"Ingénierie produit et IA — Programme | Formation Pro 360",
  description:"Huit semaines et seize ateliers : analyse utilisateur, prototype, développement, MVP, acquisition et vente."
};
export default function ProductEngineeringCatalog(){
  return <main className="v2catalog">
    <header className="v2catalog-nav"><Link href="/catalogue" className="v2catalog-brand"><span><GraduationCap size={22}/></span>Formation <b>Pro 360</b></Link><nav aria-label="Accès aux espaces"><Link href="/catalogue">Catalogue</Link><Link href="/espace" className="v2catalog-nav-primary">Mon espace <ArrowRight size={15}/></Link></nav></header>
    <div className="v2catalog-body v2catalog-detail">
      <Link href="/catalogue" className="v2catalog-back"><ArrowLeft size={16}/> Toutes les formations</Link>
      <section className="v2catalog-detail-hero"><span className="v2catalog-overline"><Sparkles size={14}/> FORMATION DISPONIBLE · PROGRAMME PRATIQUE</span><h1>{pilotCourse.name}<span>.</span></h1><p>{pilotCourse.summary}</p>
        <div className="v2catalog-detail-stats"><span><Clock3 size={17}/> 8 semaines</span><span><BookOpen size={17}/> 16 ateliers</span><span><Rocket size={17}/> Projet fil rouge</span></div>
        <div className="v2catalog-milestones">
          <div><b>JOUR 14</b><strong>Premier flux déployé</strong><small>Un scénario fonctionnel de bout en bout.</small></div>
          <div><b>MOIS 1</b><strong>MVP complet en ligne</strong><small>Un produit utilisable, testé et documenté.</small></div>
          <div><b>MOIS 2</b><strong>Premiers essais commerciaux</strong><small>Une offre et une acquisition mesurables, sans revenus garantis.</small></div>
        </div>
      </section>
      <div className="v2catalog-heading v2catalog-modules-head"><div><span>70 % DE PRATIQUE · 30 % DE CONCEPTION</span><h2>Les 8 semaines, atelier par atelier</h2></div><p>Chaque atelier définit une compétence à acquérir et une preuve concrète de réalisation.</p></div>
      <div className="v2catalog-module-list">{pilotCourse.modules.map((mod)=><section id={"semaine-"+mod.week} className="v2catalog-week" key={mod.slug}>
        <div className="v2catalog-week-head"><span className="v2catalog-week-num">S{String(mod.week).padStart(2,"0")}</span><div><span>SEMAINE {mod.week}</span><h3>{mod.title}</h3><p>{mod.outcome}</p></div><span className="v2catalog-week-count">2 ateliers</span></div>
        <div className="v2catalog-week-skills">{mod.skills.map(skill=><span key={skill}>{skill}</span>)}</div>
        <div className="v2catalog-lesson-list">{mod.lessons.map((lesson,i)=><article key={lesson.slug} className="v2catalog-lesson">
          <div className="v2catalog-lesson-index">{i+1}</div>
          <div><h4>{lesson.title}</h4><p>{lesson.objective}</p><div className="v2catalog-evidence"><BadgeCheck size={15}/><span><b>Livrable attendu :</b> {lesson.evidence}</span></div></div>
        </article>)}</div>
      </section>)}</div>
      <aside className="v2catalog-cta"><Lightbulb size={24}/><div><strong>La formation est accessible depuis ton espace personnel.</strong><p>Connecte-toi pour consulter ton statut d'inscription, rejoindre gratuitement le pilote si ton compte y est autorisé, puis soumettre tes réalisations à ton formateur.</p></div><Link href="/espace/parcours/ingenierie-produit-ia">Rejoindre ou continuer le pilote <ArrowRight size={16}/></Link></aside>
      <footer className="v2catalog-footer"><span>© Formation Pro 360 · Programme de formation</span><Link href="/catalogue">Toutes les formations</Link></footer>
    </div>
  </main>;
}
